import { useState } from 'react';
import bgImage from '../assets/signin-bg.png';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';



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
    <div className="fixed inset-0 flex items-center justify-center bg-[#f2f0ed] overflow-hidden">

      {/* 
        This wrapper forces a perfect 16:9 aspect ratio that exactly matches 
        an object-contain 1920x1080 background image.
        This allows us to position transparent inputs using exact percentages 
        so they align perfectly with the drawn boxes on the image!
      */}
      <div
        className="relative w-full h-full mx-auto"
        style={{ maxWidth: '177.778vh', maxHeight: '56.25vw' }}
      >
        {/* Background Image */}
        {bgImage && (
          <img
            src={bgImage}
            alt="Sign In Background"
            className="absolute inset-0 w-full h-full object-contain object-center z-0 pointer-events-none"
          />
        )}

        {/* 
          TRANSPARENT FORM OVERLAY 
          Adjust the 'top', 'left', 'width', and 'height' percentages below 
          to perfectly align the invisible input fields over the boxes drawn on your image.
        */}
        <style>
          {`
            /* Fix for Chrome autofill background */
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 1000px #FEF4E8 inset !important;
                -webkit-text-fill-color: #111827 !important;
                transition: background-color 5000s ease-in-out 0s !important;
                background-color: transparent !important;
            }
          `}
        </style>
        <form onSubmit={handleSignIn} className="absolute inset-0 z-10">

          {/* Email Invisible Input */}
          <input
            type="email"
            required

            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // 👇 Adjust these percentages to move the invisible box over the image's email field
            style={{
              top: '37.5%',   // Distance from top of image
              left: '27.8%',  // Centered over the drawn input
              width: '32.0%', // Width of the clickable area
              height: '7.0%', // Height of the clickable area
              transform: 'translate(-50%, -50%)' // Centers it exactly at the left/top coordinates
            }}
            className="absolute bg-transparent text-gray-900 px-6 text-lg focus:outline-none rounded-full transition"
          />

          {/* Password Invisible Input */}
          <input
            type="password"
            required

            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // 👇 Adjust these percentages to move the invisible box over the image's password field
            style={{
              top: '48.5%',   // Distance from top of image
              left: '27.8%',  // Centered over the drawn input
              width: '32.0%', // Width of the clickable area
              height: '7.0%', // Height of the clickable area
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute bg-transparent text-gray-900 px-6 text-lg focus:outline-none rounded-full transition"
          />

          {/* Invisible Forgot Password Link Area */}
          <Link
            to="/forgot-password" // Replace with your actual route if different
            // 👇 Adjust these percentages to move the invisible clickable area over "Forgot Password?"
            style={{
              top: '55.5%',   // Estimated distance somewhat below password field
              left: '39.0%',  // Estimated right-aligned to the inputs
              width: '10.0%', // Estimated width of the "Forgot Password?" text
              height: '3.0%', // Estimated height covering the text
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute bg-transparent text-transparent focus:outline-none"
            title="Forgot Password?"
          />

          {/* Invisible Submit Button Area */}
          <button
            type="submit"
            disabled={loading}
            // 👇 Adjust these percentages to move the invisible clickable area over the image's Sign In button
            style={{
              top: '69.0%',   // Distance from top of image
              left: '26.0%',  // Centered over the drawn button
              width: '32.0%', // Width of the clickable area
              height: '7.0%', // Height of the clickable area
              transform: 'translate(-50%, -50%)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            className="absolute bg-transparent outline-none rounded-full flex justify-center items-center text-center text-xl font-semibold text-gray-900"
            title="Sign In"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Error Message Display */}
          {error && (
            <div
              className="absolute z-20 text-red-500 font-bold bg-red-100 bg-opacity-90 px-4 py-2 rounded-lg text-center"
              style={{
                top: '78%',
                left: '26.0%',
                width: '32.0%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {error}
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
