"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, X, CheckCircle2, AlertCircle, Rocket, Sparkles, ArrowRight, FileText, Image, FileArchive, Target, Brain, Lock } from 'lucide-react';
import "../pages/upload.css";
import { Roles } from '@/lib/constants';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function UploadPage() {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const { getToken } = useAuth();

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            setUploadStatus('error');
            return;
        }

        if (file.size > maxSize) {
            setUploadStatus('error');
            return;
        }

        setUploadedFile(file);
        setUploadStatus('idle');
    };

    const removeFile = () => {
        setUploadedFile(null);
        setUploadStatus('idle');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const extractText = async () => {
        if (!uploadedFile) return null;

        const formData = new FormData();
        formData.append("file", uploadedFile);
        const res = await fetch(`${process.env.NEXT_PUBLIC_OCR_URL}/ocr`, {
            method: "POST",
            body: formData
        })
        const jsonres = await res.json();
        if (!jsonres.success) {
            toast.error("Failed to extract data from resume. Try agai Later");
        }
        if (!res.ok) {
            throw new Error("OCR extraction failed");
        }
        return jsonres;
    }
    const uploadresume = async (payload: {
        fileName: string;
        rawText: string;
        role: string;
    }) => {
        if (!uploadedFile || !selectedRole) throw new Error("Missing file or role");
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resume/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        })
        if (!res.ok) {
            throw new Error("Uploading failed");
        }

        const data = await res.json();
        const resumeId = data.file.id;
        const chatId = data.chatId;

        return {
            resumeId,
            chatId,
        };
    };

    const handleSubmit = async () => {
        if (!uploadedFile || !selectedRole) return;
        try {
            setUploadStatus("uploading");
            const extractedText = await extractText();
            const payload = {
                fileName: uploadedFile.name,
                rawText: extractedText.text,
                role: selectedRole,
            };

            const res = await uploadresume(payload);
            toast.success("Resume processed successfully!");

            toast.loading("Redirecting to interview session...", { id: "redirect" });

            setTimeout(() => {
                toast.dismiss("redirect");
                router.push(`/chat/${res.chatId}`);
            }, 800);

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Something went wrong ');
            setUploadStatus("error");
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType?.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
        if (fileType?.includes('image')) return <Image className="w-8 h-8 text-blue-400" />;
        if (fileType?.includes('document')) return <File className="w-8 h-8 text-blue-400" />;
        return <FileArchive className="w-8 h-8 text-purple-400" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen overflow-hidden relative bg-transparent mt-15">
            {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/40 to-black" /> */}

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
                <div className="max-w-2xl w-full">

                    <div className="text-center mb-12">

                        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent animate-gradient">
                            Upload Your Resume
                        </h1>

                        <p className="text-xl text-slate-200 max-w-xl mx-auto">
                            Power your AI interviewer using your own experience.
                        </p>
                    </div>

                    {/* Upload Container */}
                    <div className=" border border-red-200/20 rounded-3xl p-8 backdrop-blur-xl space-y-6 relative overflow-hidden">

                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5" />

                        {/* Role Selection */}
                        <div className="relative space-y-3">
                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Target className="w-4 h-4 text-red-400" />
                                Target Role
                            </label>

                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-3 bg-black/60 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 transition-all duration-300 backdrop-blur-xl"
                            >
                                <option value="" disabled>Select mission role</option>
                                {Roles.map((role) => (
                                    <option key={role} value={role} className="bg-black">
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Upload Area */}
                        <div className="relative space-y-3">
                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-red-400" />
                                Resume / CV
                            </label>

                            {!uploadedFile ? (
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${dragActive
                                        ? 'border-red-500 bg-red-500/10'
                                        : 'border-red-500/30 hover:border-red-500/60 bg-black/40'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,image/*"
                                        onChange={handleChange}
                                    />

                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.6)]">
                                            <Upload className="w-8 h-8" />
                                        </div>

                                        <div>
                                            <p className="text-lg font-semibold text-white mb-1">
                                                Drop resume or click to upload
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                PDF / DOCX / JPG / PNG — Max 10MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-black/60 border border-red-500/30 rounded-xl p-6 backdrop-blur-xl">
                                    <div className="flex items-start gap-4">
                                        <div>{getFileIcon(uploadedFile.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate">
                                                {uploadedFile.name}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {formatFileSize(uploadedFile.size)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center"
                                        >
                                            <X className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!uploadedFile || !selectedRole || uploadStatus === 'uploading'}
                            className={`relative w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${uploadedFile && selectedRole && uploadStatus !== 'uploading'
                                ? 'bg-gradient-to-r from-red-900 to-rose-700 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105'
                                : 'bg-gray-600/50 cursor-not-allowed opacity-50'
                                }`}
                        >
                            {uploadStatus === 'uploading' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Uploading...
                                </>
                            ) : uploadStatus === 'success' ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6" />
                                    Success! Launch
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-6 h-6" />
                                    Launch Interview Prep
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </button>


                    </div>
                </div>
            </div>
        </div>
    );


}