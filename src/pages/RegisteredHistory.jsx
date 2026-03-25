import React, { useState } from 'react';
import { fetchRegisteredHistory, uploadRegisteredExcel } from '../api';

const RegisteredHistory = () => {
    // Search State
    const [email, setEmail] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Upload State
    const [uploadCompany, setUploadCompany] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const data = await fetchRegisteredHistory(email);
            setHistory(data);
        } catch (error) {
            console.error(error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadCompany || !uploadFile) return;

        setUploading(true);
        setUploadMessage('');
        try {
            const result = await uploadRegisteredExcel(uploadCompany, uploadFile);
            setUploadMessage(result.message || 'Successfully uploaded and processed.');
            setUploadCompany('');
            setUploadFile(null);
        } catch (error) {
            setUploadMessage(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-black">Registered <span className="text-coral-500">History</span></h1>
                <p className="mt-2 text-lg text-gray-500">Check which company placement drives you are successfully registered for.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Forms */}
                <div className="md:col-span-1 space-y-6">
                    {/* Search Form */}
                    <div className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-black">Check Your Status</h2>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !email.trim()}
                                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-coral-500 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search History'}
                            </button>
                        </form>
                    </div>

                    {/* Admin Upload Form */}
                    <div className="border border-gray-100 bg-coral-50/30 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2 text-black flex items-center gap-2">
                            <svg className="w-5 h-5 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Upload
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">Upload an Excel file to create a new company table.</p>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company / Table Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. company_a"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/20"
                                    value={uploadCompany}
                                    onChange={(e) => setUploadCompany(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-coral-50 file:text-coral-700 hover:file:bg-coral-100 transition-all cursor-pointer"
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={uploading || !uploadCompany || !uploadFile}
                                className="w-full py-3 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-600 transition-colors disabled:opacity-50"
                            >
                                {uploading ? 'Processing...' : 'Upload Excel'}
                            </button>

                            {uploadMessage && (
                                <div className={`text-sm p-3 rounded-lg ${uploadMessage.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {uploadMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Results Display */}
                <div className="md:col-span-2">
                    {loading ? (
                        <div className="flex items-center justify-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 min-h-[300px]">
                            <p className="text-gray-500 font-medium animate-pulse">Checking records...</p>
                        </div>
                    ) : (hasSearched && history.length === 0) ? (
                        <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 min-h-[300px]">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">No registration records found for this email.</p>
                        </div>
                    ) : (history.length > 0) ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-black px-2 mb-4">Successful Registrations</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {history.map((recordName, index) => {
                                    // Parse names like "google_2014" -> Company: google, Year: 2014
                                    let company = recordName;
                                    let year = '';

                                    if (recordName.includes('_')) {
                                        const parts = recordName.split('_');
                                        company = parts[0];
                                        year = parts[1];
                                    }

                                    return (
                                        <div key={index} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-coral-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 ease-out"></div>
                                            <div className="relative">
                                                <div className="text-xs uppercase tracking-wider text-coral-500 font-semibold mb-1">
                                                    {year || 'Registration'}
                                                </div>
                                                <h3 className="text-lg font-bold text-black capitalize">
                                                    {company}
                                                </h3>
                                                <div className="mt-4 flex items-center text-sm font-medium text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Confirmed
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 min-h-[300px]">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">Enter an email to check your registration history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisteredHistory;
