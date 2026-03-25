import { useState } from 'react';
import bgImage from '../assets/signin-bg.png';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './SignIn.css';



export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Only navigate if Firebase successfully signs them in
      navigate('/dashboard');
    } catch (err) {
      console.error("Sign in error:", err);
      // Provide a clean generic error string or map Firebase codes to messages
      setError(err.message || "Invalid Email or Password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ======== DESKTOP LAYOUT — image overlay ======== */}
      <div className="signin-desktop">
        <div className="signin-desktop-inner">
          {/* Background Image */}
          <img
            src={bgImage}
            alt="Sign In Background"
            className="absolute inset-0 w-full h-full object-contain object-center z-0 pointer-events-none"
          />

          <style>{`
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 1000px #FEF4E8 inset !important;
                -webkit-text-fill-color: #111827 !important;
                transition: background-color 5000s ease-in-out 0s !important;
                background-color: transparent !important;
            }
          `}</style>

          <form onSubmit={handleSignIn} className="absolute inset-0 z-10">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ top: '37.5%', left: '27.8%', width: '32.0%', height: '7.0%', transform: 'translate(-50%, -50%)' }}
              className="absolute bg-transparent text-gray-900 px-6 text-lg focus:outline-none rounded-full transition"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ top: '48.5%', left: '27.8%', width: '32.0%', height: '7.0%', transform: 'translate(-50%, -50%)' }}
              className="absolute bg-transparent text-gray-900 px-6 text-lg focus:outline-none rounded-full transition"
            />
            <Link
              to="/forgot-password"
              style={{ top: '55.5%', left: '39.0%', width: '10.0%', height: '3.0%', transform: 'translate(-50%, -50%)' }}
              className="absolute bg-transparent text-transparent focus:outline-none"
              title="Forgot Password?"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                top: '69.0%', left: '26.0%', width: '32.0%', height: '7.0%',
                transform: 'translate(-50%, -50%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
              className="absolute bg-transparent outline-none rounded-full flex justify-center items-center text-center text-xl font-semibold text-gray-900"
              title="Sign In"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && (
              <div
                className="absolute z-20 text-red-500 font-bold bg-red-100 bg-opacity-90 px-4 py-2 rounded-lg text-center"
                style={{ top: '78%', left: '26.0%', width: '32.0%', transform: 'translate(-50%, -50%)' }}
              >
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ======== MOBILE LAYOUT — clean card form ======== */}
      <div className="signin-mobile">
        <div className="signin-card">
          <h1 className="signin-title">TPC<span className="signin-title-accent">Connect</span></h1>
          <p className="signin-subtitle">Sign in to your account</p>

          <form onSubmit={handleSignIn} className="signin-form">
            <div className="signin-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="signin-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Link to="/forgot-password" className="signin-forgot">Forgot password?</Link>
            {error && <p className="signin-error">{error}</p>}
            <button type="submit" disabled={loading} className="signin-btn">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}


