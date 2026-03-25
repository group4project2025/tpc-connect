import React, { useState, useEffect } from 'react';
import { fetchYears, addYear, fetchCompanies, addCompany, fetchRecords, addTextRecord, uploadFileRecord, viewFileRecord } from '../api';

const PlacementRecords = () => {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [records, setRecords] = useState([]);
    const [newYear, setNewYear] = useState('');
    const [newCompany, setNewCompany] = useState('');
    const [newText, setNewText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadYears();
    }, []);

    const loadYears = async () => {
        try {
            const data = await fetchYears();
            setYears(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddYear = async (e) => {
        e.preventDefault();
        if (!newYear) return;
        try {
            await addYear(newYear);
            setNewYear('');
            loadYears();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleYearChange = async (year) => {
        setSelectedYear(year);
        setSelectedCompany('');
        setRecords([]);
        try {
            const data = await fetchCompanies(year);
            setCompanies(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCompany = async (e) => {
        e.preventDefault();
        if (!newCompany || !selectedYear) return;
        try {
            await addCompany(selectedYear, newCompany);
            setNewCompany('');
            const data = await fetchCompanies(selectedYear);
            setCompanies(data);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleCompanyChange = async (company) => {
        setSelectedCompany(company);
        const tbName = `${company}_${selectedYear}`;
        try {
            const data = await fetchRecords(tbName);
            setRecords(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddText = async (e) => {
        e.preventDefault();
        if (!newText || !selectedCompany) return;
        const tbName = `${selectedCompany}_${selectedYear}`;
        try {
            await addTextRecord(tbName, newText);
            setNewText('');
            const data = await fetchRecords(tbName);
            setRecords(data);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !selectedCompany) return;
        const tbName = `${selectedCompany}_${selectedYear}`;
        setLoading(true);
        try {
            await uploadFileRecord(tbName, selectedFile);
            setSelectedFile(null);
            const data = await fetchRecords(tbName);
            setRecords(data);
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-black">Placement <span className="text-coral-500">Records</span></h1>
                <p className="mt-2 text-lg text-gray-500">Manage placement documents and notes by year and company.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Navigation & Management */}
                <div className="space-y-8">
                    {/* Year Management */}
                    <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-black">Placement Years</h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="number"
                                placeholder="2024"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/20"
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                            />
                            <button
                                onClick={handleAddYear}
                                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-coral-500 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => handleYearChange(year)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedYear === year
                                        ? 'bg-coral-500 text-white shadow-lg shadow-coral-500/30'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Company Management */}
                    {selectedYear && (
                        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4 text-black">Companies ({selectedYear})</h2>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Company name"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/20"
                                    value={newCompany}
                                    onChange={(e) => setNewCompany(e.target.value)}
                                />
                                <button
                                    onClick={handleAddCompany}
                                    className="px-4 py-2 bg-black text-white rounded-xl hover:bg-coral-500 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {companies.map((comp) => (
                                    <button
                                        key={comp}
                                        onClick={() => handleCompanyChange(comp)}
                                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCompany === comp
                                            ? 'bg-black text-white'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {comp}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Records */}
                <div className="lg:col-span-2">
                    {selectedCompany ? (
                        <div className="space-y-6">
                            {/* Add Record Tabs */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold mb-4 text-black">Add New Record to {selectedCompany}</h2>
                                <div className="space-y-6">
                                    <form onSubmit={handleAddText} className="space-y-4">
                                        <textarea
                                            placeholder="Enter text record..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-coral-500/20"
                                            value={newText}
                                            onChange={(e) => setNewText(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-coral-500 transition-colors"
                                        >
                                            Save Text Record
                                        </button>
                                    </form>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or Upload File</span></div>
                                    </div>
                                    <form onSubmit={handleFileUpload} className="space-y-4">
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-coral-50 file:text-coral-700 hover:file:bg-coral-100 transition-all"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || !selectedFile}
                                            className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Uploading...' : 'Upload Document'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Record List */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-black px-2">Records Listing</h2>
                                {records.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400">No records found for this company.</p>
                                    </div>
                                ) : (
                                    records.map((record) => (
                                        <div key={record.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                            {record.text_data ? (
                                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{record.text_data}</div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-coral-50 rounded-lg">
                                                            <svg className="w-6 h-6 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-black">{record.file_name}</p>
                                                            <p className="text-xs text-gray-400 uppercase tracking-wider">{record.file_type}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => viewFileRecord(`${selectedCompany}_${selectedYear}`, record.id)}
                                                        className="px-4 py-2 text-sm font-semibold text-coral-500 hover:bg-coral-50 rounded-xl transition-colors"
                                                    >
                                                        View Document
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 min-h-[400px]">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">Select a company from the sidebar to view placement records.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlacementRecords;
