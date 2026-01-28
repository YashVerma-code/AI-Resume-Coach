import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (

    <div className=" min-h-screen flex flex-wrap justify-center content-center">
      <div className="bg-black/30 backdrop-blur-xl h-1/2 p-8 rounded-xl shadow-lg w-full max-w-md flex flex-wrap justify-center content-center">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>
        <SignIn />
      </div>
    </div>
  )
}