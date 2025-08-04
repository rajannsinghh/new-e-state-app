'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30); // 30 seconds timer
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const phone = searchParams.get('phone'); // in case phone is passed via params

  const router = useRouter();

  // ⏱Countdown logic
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage('OTP is required');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Verified successfully! Logging you in...');
        // Optional: delay before redirecting
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        setMessage(data?.message || 'Invalid OTP');
      }
    } catch (err) {
      setMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }), // phone optional
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('📩 OTP resent successfully');
        setResendTimer(30);
      } else {
        setMessage(data?.message || 'Failed to resend OTP');
      }
    } catch {
      setMessage('Server error while resending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Enter OTP</h2>

      {message && (
        <p className="text-sm text-center mb-3 text-red-500">{message}</p>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="text-center mt-4 text-sm">
        {resendTimer > 0 ? (
          <p className="text-gray-500">Resend in {resendTimer}s</p>
        ) : (
          <button
            onClick={handleResend}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
