import { useState, useEffect } from 'react';
import { fetchBulletinBoard, createBulletin, deleteBulletin } from '../api';

export default function BulletinBoard() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        url: '',
        dead_line: ''
    });

    useEffect(() => {
        fetchBulletinBoard().then(setNotices).finally(() => setLoading(false));
    }, [refresh]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBulletin(formData);
            setFormData({ subject: '', content: '', url: '', dead_line: '' });
            setShowForm(false);
            setRefresh(prev => prev + 1); // Refresh list
        } catch (error) {
            alert("Failed to add bulletin");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this bulletin?")) {
            try {
                await deleteBulletin(id);
                setRefresh(prev => prev + 1);
            } catch (error) {
                alert("Failed to delete bulletin");
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading Notices...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Bulletin Board</h1>
                    <p className="text-gray-500 mt-2">Latest updates, job postings, and deadlines.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-coral-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-coral-600 transition-colors rounded shadow-sm"
                >
                    {showForm ? 'Cancel' : 'Add Notice'}
                </button>
            </div>

            {showForm && (
                <div className="mb-10 bg-gray-50 p-6 border border-gray-200 animate-fade-in">
                    <h3 className="text-lg font-bold mb-4">Create New Bulletin</h3>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Subject *"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="p-3 border border-gray-300 focus:outline-none focus:border-coral-500 w-full rounded"
                            />
                            <input
                                type="date"
                                placeholder="Deadline"
                                value={formData.dead_line}
                                onChange={e => setFormData({ ...formData, dead_line: e.target.value })}
                                className="p-3 border border-gray-300 focus:outline-none focus:border-coral-500 w-full rounded"
                            />
                        </div>
                        <textarea
                            placeholder="Content / Description"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="p-3 border border-gray-300 focus:outline-none focus:border-coral-500 w-full h-24 rounded"
                        />
                        <input
                            type="url"
                            placeholder="Link URL (e.g., Google Form)"
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            className="p-3 border border-gray-300 focus:outline-none focus:border-coral-500 w-full rounded"
                        />
                        <button type="submit" className="bg-coral-500 text-white px-6 py-2 font-bold uppercase text-sm hover:bg-coral-600 rounded shadow-sm transition-colors">
                            Publish Notice
                        </button>
                    </form>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notices.map((notice, idx) => (
                    <div key={notice.id || idx} className="bg-white p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col group">
                        {/* Delete Button (visible on hover) */}
                        <button
                            onClick={() => handleDelete(notice.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors p-2"
                            title="Delete Bulletin"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <div className="bg-coral-500 text-white text-xs font-bold inline-block px-2 py-1 mb-4 self-start rounded-sm">
                            NOTICE
                        </div>

                        <h3 className="text-xl font-bold mb-3 leading-tight">{notice.subject}</h3>
                        <p className="text-gray-600 mb-6 text-sm flex-grow whitespace-pre-wrap">{notice.content}</p>

                        <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center text-xs">
                            <span className="font-mono text-gray-500">
                                Deadline: {notice.dead_line || 'ASAP'}
                            </span>
                            {notice.url && (
                                <a href={notice.url} target="_blank" rel="noreferrer" className="font-bold underline hover:text-coral-600 transition-colors">
                                    View Link
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
