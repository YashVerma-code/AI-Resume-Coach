"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Trash2, MessageCircle, Star } from "lucide-react";
import "../pages/upload.css";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface RoleStat {
  role: string;
  count: number;
}

interface DateStat {
  date: string;
  count: number;
}

interface Resume {
  id: string;
  fileName: string;
  role: string;
  createdAt: string;
  status: "PROCESSING" | "UPLOADED" | "ERROR",
  chat: { id: string }
}

interface DashboardResponse {
  byRole: RoleStat[];
  byDate: DateStat[];
  resumes: Resume[];
}

const COLORS = ["#ef4444", "#fb7185", "#f43f5e", "#dc2626", "#be123c"];

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchResumes = async () => {
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resume/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchResumes();
  }, []);


  const handleDelete = async (id: string) => {
    const token = await getToken();
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resume/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchResumes();
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const paginated = data.resumes.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(data.resumes.length / limit);

  return (
    <div className="min-h-screen bg-transparent px-6 py-28">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Track your resume performance & interview prep insights
          </p>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie */}
          <div className="border border-red-500/20 bg-black/50 backdrop-blur-xl rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Role Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.byRole}
                  dataKey="count"
                  nameKey="role"
                  innerRadius={70}
                  outerRadius={110}
                >
                  {data.byRole.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="border border-red-500/20 bg-black/50 backdrop-blur-xl rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Upload Timeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byDate}>
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="border border-red-500/20 bg-black/50 backdrop-blur-xl rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Uploaded Resumes
          </h3>

          <table className="w-full">
            <tbody>
              {paginated.map((r) => (
                <tr key={r.id} className="border-b border-red-500/10">
                  <td className="py-4">{r.fileName}</td>
                  <td>{r.role}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-4 items-center">
                    {r.status === "PROCESSING" ? (
                      <span className="text-yellow-400 animate-pulse">
                        Processing...
                      </span>
                    ) : (r.status === "ERROR") ? (
                      <>
                        <span className="text-red-400 ">
                          Error during upload
                        </span>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 bg-red-500/10 rounded-lg"
                        >
                          <Trash2 />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href={`/chat/${r.chat?.id}`} className="p-2 bg-red-500/10 rounded-lg">
                          <MessageCircle />
                        </Link>

                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 bg-red-500/10 rounded-lg"
                        >
                          <Trash2 />
                        </button>
                      </>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
