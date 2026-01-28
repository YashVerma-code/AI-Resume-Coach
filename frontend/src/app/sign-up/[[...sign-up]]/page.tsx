import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="hero min-h-screen flex flex-wrap justify-center content-center">
            <div className="bg-black/30 backdrop-blur-xl rounded-xl shadow-lg p-2 w-full max-w-md flex justify-center content-evenly flex-wrap">
                <h1 className="text-2xl font-bold text-white text-center w-full p-4">Sign Up</h1>
                <SignUp />
            </div>
        </div>
    )
}