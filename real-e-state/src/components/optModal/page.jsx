function OtpModal({ phone, formData, onVerified, onClose }) {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'OTP verification failed');
        return;
      }

      // Now create the user
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const final = await signupRes.json();
      if (signupRes.ok) {
        onVerified(final); // User is now verified and signed up
      } else {
        setMessage(final.error || 'Signup failed');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      setMessage(data.message || 'OTP resent!');
    } catch {
      setMessage('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">Enter OTP sent to {phone}</h3>
        {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-blue-600 mt-2"
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>
        <button
          onClick={onClose}
          className="text-gray-500 text-sm mt-3 block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
