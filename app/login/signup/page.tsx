'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Cry420InputField, Cry420Button } from "@/components/420CryComponents";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    setErrorMessage("");
    console.log("User registered:", { email, password });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-lg bg-white px-12 py-10 shadow-md">
        <h1 className="mb-6 text-center text-4xl font-semibold text-green-600">Create Account</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Cry420InputField
            id="email"
            type="email"
            label="Email Address"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
          />
          <Cry420InputField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
          />
          <Cry420InputField
            id="confirm-password"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); }}
          />
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
          <Cry420Button
            type="submit"
            onClick={() => {}}
            className="w-full rounded-md bg-green-600 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Sign Up
          </Cry420Button>
        </form>
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-green-600 transition-all duration-150 hover:text-green-500"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}