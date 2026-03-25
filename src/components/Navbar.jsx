import { useState } from 'react';

export default function Navbar({ onNavigate, activeTab }) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'students', label: 'All Students' },
        { id: 'bulletin', label: 'Bulletin Board' },
    ];

    return (
        <nav className="border-b border-white/10 bg-black sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold tracking-tight text-white">
                            TPC<span className="text-gray-500">Connect</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`text-sm font-medium transition-colors duration-200 ${activeTab === item.id
                                        ? 'text-white border-b-2 border-white pb-1'
                                        : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 bg-black">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    setIsOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${activeTab === item.id
                                        ? 'text-white bg-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
