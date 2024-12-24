'use client';

import Link from "next/link";
import { Cry420InputField, Cry420Button } from "@/components/420CryComponents";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white px-10 py-8 text-center shadow-lg">
        <h1 className="mb-4 text-5xl font-extrabold text-green-600">420CRY</h1>
        <p className="mb-8 text-gray-600">Welcome back! Please log in to continue.</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Cry420InputField
            id="email"
            type="email"
            label="Email Address"
            placeholder="youremail@example.com"
            value={email} // Controlled value
            onChange={(e) => { setEmail(e.target.value); }}
          />
          <Cry420InputField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password} // Controlled value
            onChange={(e) => { setPassword(e.target.value); }}
          />
          <Cry420Button
            type="submit"
            onClick={() => {}}
            className="bg-green-600 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Sign In
          </Cry420Button>
        </form>
        <p className="mt-10 text-gray-600">
          Don not have an account?{' '}
          <Link
            href="/login/signup"
            className="font-bold text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}
