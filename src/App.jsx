import { Routes, Route, useLocation, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Eligibility from './pages/Eligibility';
import Profile from './pages/Profile';
import Grievance from './pages/Grievance';
import BulletinBoard from './pages/BulletinBoard';
import PlacementRecords from './pages/PlacementRecords';
import RegisteredHistory from './pages/RegisteredHistory';


// Layout wrapper for authenticated pages
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <nav className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold tracking-tighter">
            TPC<span className="text-coral-500 font-light">Connect</span>
          </Link>

          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-500">
            <Link to="/dashboard" className="hover:text-coral-500 transition-colors">Dashboard</Link>
            <Link to="/bulletin" className="hover:text-coral-500 transition-colors">Bulletin</Link>
            <Link to="/records" className="hover:text-coral-500 transition-colors">Records</Link>
            <Link to="/registered-history" className="hover:text-coral-500 transition-colors">History</Link>
            <Link to="/grievance" className="hover:text-coral-500 transition-colors">Grievances</Link>
            <Link to="/profile" className="hover:text-coral-500 transition-colors">Profile</Link>

            <Link to="/" className="text-coral-500 hover:text-coral-700 font-semibold" onClick={() => localStorage.clear()}>Sign Out</Link>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  const location = useLocation();
  const publicPaths = ['/', '/signin', '/forgot-password'];
  const isPublicPage = publicPaths.includes(location.pathname);

  return (
    <>
      {isPublicPage ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/grievance" element={<Grievance />} />
            <Route path="/bulletin" element={<BulletinBoard />} />
            <Route path="/records" element={<PlacementRecords />} />
            <Route path="/registered-history" element={<RegisteredHistory />} />
          </Routes>

        </Layout>
      )}
    </>
  );
}

export default App;
