import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
            setEmail('');
        } catch (err) {
            console.error("Reset password error:", err);
            // More specific error handling could be done here based on err.code
            if (err.code === 'auth/user-not-found') {
                setError('No user found with this email address.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(err.message || 'Failed to send password reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f2f0ed] px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your email.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-full text-white ${loading ? 'bg-coral-400 cursor-not-allowed' : 'bg-coral-600 hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500 transition-colors shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>

                {message && (
                    <div className="mt-4 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200 text-center text-sm font-medium">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200 text-center text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link to="/signin" className="font-medium text-coral-600 hover:text-coral-500 transition-colors">
                        Return to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
