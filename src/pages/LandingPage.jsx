import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// College logo served from public/assets/
const collegeLogo = '/assets/college-logo.png';

// Fade-in animation variants
const fadeUp = {
    hidden: {
        opacity: 0,
        y: 50,
        transition: { duration: 0.4, ease: 'easeIn' },
    },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' },
    }),
};

const fadeLeft = {
    hidden: {
        opacity: 0,
        x: -80,
        transition: { duration: 0.4, ease: 'easeIn' },
    },
    visible: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' },
    }),
};

const fadeRight = {
    hidden: {
        opacity: 0,
        x: 80,
        transition: { duration: 0.4, ease: 'easeIn' },
    },
    visible: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' },
    }),
};

const stagger = {
    visible: { transition: { staggerChildren: 0.12 } },
};

// TPC Connect Features
const features = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
        title: 'Dashboard',
        desc: 'A centralized hub to view placement stats, upcoming drives, and key announcements at a glance.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        title: 'Eligibility Checker',
        desc: 'Instantly verify your eligibility for placement drives based on academic criteria and requirements.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
        title: 'Placement Records',
        desc: 'Access comprehensive placement data — company-wise, year-wise, and package statistics all in one place.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        title: 'Bulletin Board',
        desc: 'Stay updated with the latest placement notifications, company visits, and important announcements.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        title: 'Student Profiles',
        desc: 'Manage your academic profile, upload documents, and keep your placement portfolio up to date.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
        title: 'Grievance Portal',
        desc: 'Raise and track grievances related to placement processes with a transparent resolution system.',
    },
];

// Stats
const stats = ['150+ Students Placed', '60+ Recruiters', '12 LPA Avg Package', '50+ Companies'];

export default function LandingPage() {
    return (
        <div className="landing-page">
            {/* ====== HEADER / NAV ====== */}
            <motion.header
                className="landing-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="nav-left">
                    <Link to="/" className="nav-brand">
                        TPC<span className="nav-brand-highlight">Connect</span>
                    </Link>
                </div>
                <div className="nav-right">
                    <Link to="/signin" className="pill-btn">Sign In</Link>
                    <a href="#features" className="nav-social">Features</a>
                    <span className="nav-divider">/</span>
                    <a href="#about" className="nav-social">About</a>
                    <span className="nav-divider">/</span>
                    <a href="#contact" className="nav-social">Contact</a>
                </div>
            </motion.header>

            {/* ====== HERO SECTION ====== */}
            <motion.section
                className="hero-section"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.div className="hero-avatar-wrapper" variants={fadeUp} custom={0}>
                    {collegeLogo ? (
                        <img src={collegeLogo} alt="College Logo" className="hero-logo" />
                    ) : (
                        <div className="hero-logo-placeholder">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
                            </svg>
                        </div>
                    )}
                </motion.div>

                <motion.h1 className="hero-heading" variants={fadeUp} custom={1}>
                    Your gateway to<br />
                    career opportunities<br />
                    & placements.
                </motion.h1>

                <motion.p className="hero-subtext" variants={fadeUp} custom={2}>
                    Connecting students with top recruiters through a seamless placement management platform.
                </motion.p>

                <motion.div variants={fadeUp} custom={3}>
                    <Link to="/signin" className="hero-cta">
                        Get Started
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </motion.div>
            </motion.section>

            {/* ====== STATS BAR ====== */}
            <motion.section
                className="brands-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={fadeLeft}
            >
                <div className="brands-row">
                    {stats.map((stat) => (
                        <span key={stat} className="brand-name">{stat}</span>
                    ))}
                </div>
            </motion.section>

            {/* ====== FEATURES SECTION ====== */}
            <motion.section
                id="features"
                className="services-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={stagger}
            >
                <motion.h2 className="services-heading" variants={fadeRight}>
                    Everything you need for<br />
                    <strong>a seamless placement experience.</strong>
                </motion.h2>

                <motion.span className="services-pill" variants={fadeRight}>Features</motion.span>

                <motion.div className="services-grid services-grid-3" variants={stagger}>
                    {features.map((feat, idx) => (
                        <motion.div key={feat.title} className="service-card" variants={idx % 2 === 0 ? fadeLeft : fadeRight} whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.25 } }}>
                            <div className="service-icon">{feat.icon}</div>
                            <h3 className="service-title">{feat.title}</h3>
                            <p className="service-desc">{feat.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* ====== ABOUT / CTA SECTION ====== */}
            <motion.section
                id="about"
                className="cta-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={stagger}
            >
                <motion.div className="cta-icon" variants={fadeLeft}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
                    </svg>
                </motion.div>

                <motion.h2 className="cta-heading" variants={fadeRight}>
                    College of Engineering Chengannur
                </motion.h2>
            </motion.section>

            {/* ====== BIG BRAND NAME ====== */}
            <motion.section
                className="big-brand-section"
                initial={{ opacity: 0, scale: 0.85, x: 100 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <h2 className="big-brand-text">
                    TPC<span className="big-brand-highlight"> Connect</span>
                </h2>
            </motion.section>

            {/* ====== FOOTER ====== */}
            <footer className="landing-footer">
                <span className="footer-copy">© 2025 TPC Connect. All rights reserved.</span>
                <div className="footer-socials">
                    <a href="#features" className="nav-social">Features</a>
                    <span className="nav-divider">/</span>
                    <a href="#about" className="nav-social">About</a>
                    <span className="nav-divider">/</span>
                    <a href="#contact" className="nav-social">Contact</a>
                </div>
            </footer>
        </div>
    );
}
