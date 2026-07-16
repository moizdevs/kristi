"use client";
import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert("You must agree to terms and conditions");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const response = await res.json();
      if (response.status === 200) {
        router.push("/admin/dashboard");
      } else {
        alert(response.message);
      }
    } catch {
      alert("Something went wrong");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000000]">
      {/* Background orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#7c6fff]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#534AB7]/30 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-13 h-13 flex items-center justify-center bg-linear-to-br from-[#7c6fff] to-[#534AB7] rounded-xl mb-3 p-3">
            <ShieldCheck size={26} className="text-white" />
          </div>
          <h1 className="text-black text-xl font-semibold tracking-[0.2em] uppercase">
            Kristi
          </h1>
          <p className="text-black/40 text-xs tracking-widest mt-1">
            Admin Console
          </p>
        </div>

        <hr className="border-black/10 mb-5" />

        {/* Secure badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 bg-black/5 border border-white/10 rounded-full px-3 py-1 text-black/35 text-[11px]">
            <Lock size={10} />
            Secure access only
          </span>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              required
              class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-[#999999] appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            />
            <label
              class="absolute text-sm text-[#999999] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Username
            </label>
          </div>

          {/* Password */}
          <div class="relative z-0 w-full mb-5 group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
              class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-[#999999] appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#5a5a5a] transition"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
            <label class="absolute text-sm text-[#999999] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
              Password
            </label>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 accent-[#7c6fff] rounded cursor-pointer shrink-0"
            />
            <span className="text-[13px] text-black/40 select-none">
              I agree to the{" "}
              <a href="#" className="text-[#3121bb] hover:underline">
                terms and conditions
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-1 bg-linear-to-r from-[#7c6fff] to-[#534AB7] text-white text-sm font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
          >
            {isSubmitting ? "Signing In..." : "Sign in to Dashboard"}
          </button>
        </form>

        <p className="text-center text-[11px] text-white/20 tracking-wider mt-6">
          Unauthorized access is strictly prohibited
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
