import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Bulletin Board', path: '/bulletin', desc: 'Post latest notices and deadlines', icon: '📢' },
        { title: 'Eligibility Check', path: '/eligibility', desc: 'Automated job qualification status', icon: '✅' },
        { title: 'Profiles', path: '/profile', desc: 'View and update student details', icon: '👤' },
        { title: 'Grievance', path: '/grievance', desc: 'Check issues or concerns', icon: '📝' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                {/* <p className="text-gray-500 text-lg">Manage your placement activities and profile.</p> */}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex items-start p-8 bg-white border border-gray-200 hover:border-coral-500 hover:shadow-md transition-all duration-300 text-left group rounded-xl"
                    >
                        <span className="text-4xl mr-6 group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0">{item.icon}</span>
                        <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-coral-600 transition-colors">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
