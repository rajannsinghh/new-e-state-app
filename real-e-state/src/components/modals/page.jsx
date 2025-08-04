"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function ModalAuth({ show, onClose, redirectTo }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!show) {
      setForm({ name: "", email: "", password: "", phone: "", otp: "" });
      setMessage("");
      setLoading(false);
      setShowOtpModal(false);
    }
  }, [show]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!isLogin) {
        schema.parse(form);
        if (!form.phone) return setMessage("Phone number is required");

        const otpRes = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: form.phone }),
        });

        const otpData = await otpRes.json();
        if (!otpRes.ok) return setMessage(otpData?.message || "OTP send failed");

        setShowOtpModal(true); // 👈 Show OTP modal
      } else {
        // Login flow
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          onClose();
          router.push(redirectTo || "/profile");
        } else {
          setMessage(data?.message || "Login failed");
        }
      }
    } catch {
      setMessage("Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.otp) return setMessage("OTP is required");

    setLoading(true);
    try {
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, otp: form.otp, ...form }),
      });

      const data = await verifyRes.json();
      if (verifyRes.ok) {
        setShowOtpModal(false);
        onClose();
        router.push(redirectTo || "/profile");
      } else {
        setMessage(data?.message || "OTP verification failed");
      }
    } catch {
      setMessage("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: redirectTo || "/" });
  };

  if (!show) return null;

  return (
    <>
      {/* Main Auth Modal */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-md w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-xl font-bold text-gray-600"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold mb-4 text-center">
            {isLogin ? "Login to your account" : "Create an account"}
          </h2>

          {message && (
            <p className="text-red-500 text-sm mb-2 text-center">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              
                
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={handleGoogleLogin}
              className="w-full border py-2 mt-2 rounded hover:bg-gray-100"
            >
              Continue with Google
            </button>

            <p className="mt-4">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md w-full max-w-sm relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-2 right-3 text-xl font-bold text-gray-600"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2 text-center">
              Enter OTP sent to {form.phone}
            </h3>

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Verify OTP & Register
            </button>
          </div>
        </div>
      )}
    </>
  );
}

