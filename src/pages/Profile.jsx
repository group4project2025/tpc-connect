import { useState, useEffect } from "react";
import { fetchAllStudents, addStudent, uploadStudentExcel, deleteStudent, searchStudents, updateStudent } from "../api";

export default function Profile() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [excelFile, setExcelFile] = useState(null);
    const [refresh, setRefresh] = useState(0);

    const [editingStudent, setEditingStudent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [form, setForm] = useState({
        id: "",
        name: "",
        branch: "",
        batch: "",
        email: "",
        college_email: "",
        phone: "",
        father_name: "",
        mother_name: "",
        address: "",
        tenth_percentage: "",
        twelfth_percentage: "",
        cgpa: "",
        no_of_backlogs: "",
        let_diploma_percentage: "",
        skill: ""
    });

    // Load profiles
    useEffect(() => {
        loadProfiles();
    }, [refresh]);

    const loadProfiles = async () => {
        setLoading(true);
        try {
            const data = searchQuery ? await searchStudents(searchQuery) : await fetchAllStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load profiles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadProfiles();
    };

    // Handle form input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add single profile
    const handleAddProfile = async () => {
        try {
            const sanitizedForm = { ...form };
            const intFields = [
                "phone", "tenth_percentage", "twelfth_percentage",
                "cgpa", "no_of_backlogs", "let_diploma_percentage"
            ];

            intFields.forEach(field => {
                let val = sanitizedForm[field];
                if (typeof val === 'string') {
                    val = val.trim();
                }
                if (val === "" || val === null || val === undefined) {
                    sanitizedForm[field] = null;
                }
            });

            await addStudent(sanitizedForm);
            alert("Profile added successfully!");
            setForm({
                id: "", name: "", branch: "", batch: "", email: "", college_email: "",
                phone: "", father_name: "", mother_name: "", address: "",
                tenth_percentage: "", twelfth_percentage: "", cgpa: "",
                no_of_backlogs: "", let_diploma_percentage: "", skill: ""
            });
            setRefresh(prev => prev + 1);
        } catch (err) {
            alert("Failed to add profile. Check console.");
        }
    };

    // Excel file selection
    const handleFileChange = (e) => {
        setExcelFile(e.target.files[0]);
    };

    // Upload Excel
    const handleUploadExcel = async () => {
        if (!excelFile) {
            alert("Please select an Excel file");
            return;
        }

        const formData = new FormData();
        formData.append("file", excelFile);

        try {
            const res = await uploadStudentExcel(formData);
            if (res.errors && res.errors.length > 0) {
                alert(`Upload complete! Imported: ${res.imported}.\n\nErrors encountered:\n${res.errors.join('\n')}`);
            } else {
                alert(`Upload complete! Successfully imported ${res.imported} students with no errors.`);
            }
            setExcelFile(null);
            setRefresh(prev => prev + 1);
        } catch (err) {
            alert("Excel upload failed. Please check the console or ensure the file is formatted correctly.");
        }
    };

    const handleDelete = async (uid) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteStudent(uid);
                setRefresh(prev => prev + 1);
            } catch (err) {
                alert("Failed to delete student");
            }
        }
    }

    const handleEditClick = (student) => {
        setEditingStudent({ ...student });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        try {
            const sanitizedStudent = { ...editingStudent };
            const intFields = [
                "phone", "tenth_percentage", "twelfth_percentage",
                "cgpa", "no_of_backlogs", "let_diploma_percentage"
            ];

            intFields.forEach(field => {
                let val = sanitizedStudent[field];
                if (typeof val === 'string') {
                    val = val.trim();
                }
                if (val === "" || val === null || val === undefined) {
                    sanitizedStudent[field] = null;
                }
            });

            await updateStudent(sanitizedStudent.uid, sanitizedStudent);
            alert("Profile updated successfully!");
            setIsEditModalOpen(false);
            setEditingStudent(null);
            setRefresh(prev => prev + 1);
        } catch (err) {
            alert("Failed to update profile. Check console.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in font-sans">
            <h1 className="text-3xl font-bold mb-8 border-b border-gray-200 pb-4">Student Profiles (Admin)</h1>

            {/* SEARCH */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name, email, or branch..."
                        className="flex-grow p-3 border border-gray-300 focus:outline-none focus:border-coral-500 rounded-l-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-coral-500 text-white px-6 font-bold uppercase hover:bg-coral-600 rounded-r-lg transition-colors">Search</button>
                </form>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* EXCEL UPLOAD */}
                <div className="border border-gray-200 p-6 bg-gray-50">
                    <h2 className="font-bold text-xl mb-4">Bulk Upload (Excel)</h2>
                    <div className="flex flex-col gap-4">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-coral-500 file:text-white hover:file:bg-coral-600 transition-colors cursor-pointer"
                        />
                        <button
                            onClick={handleUploadExcel}
                            className="bg-coral-500 text-white px-4 py-2 font-bold uppercase text-sm hover:bg-coral-600 self-start rounded shadow-sm transition-colors"
                        >
                            Upload Excel
                        </button>
                    </div>
                </div>

                {/* MANUAL FORM */}
                <div className="border border-gray-200 p-6">
                    <h2 className="font-bold text-xl mb-4">Add Student Manually</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {Object.keys(form).map((key) => (
                            <input
                                key={key}
                                name={key}
                                placeholder={key.replace(/_/g, " ").toUpperCase()}
                                value={form[key]}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 text-sm focus:outline-none focus:border-coral-500 rounded"
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleAddProfile}
                        className="bg-coral-500 text-white px-6 py-2 font-bold uppercase text-sm hover:bg-coral-600 w-full rounded shadow-sm transition-colors"
                    >
                        Add Student
                    </button>
                </div>
            </div>

            {/* LIST */}
            <h2 className="text-xl font-bold mb-4">Student Database ({students.length})</h2>

            {loading ? <p>Loading...</p> : (() => {
                // Normalize branch name to group similar abbreviations
                const normalizeBranch = (branch) => {
                    if (!branch) return 'Unknown Branch';
                    const b = branch.trim().toUpperCase();
                    if (b === 'CS' || b === 'CSE' || b === 'COMPUTER SCIENCE') return 'Computer Science & Engineering (CSE)';
                    if (b === 'EC' || b === 'ECE' || b === 'ELECTRONICS') return 'Electronics & Communication (ECE)';
                    if (b === 'EE' || b === 'EEE' || b === 'ELECTRICAL') return 'Electrical & Electronics (EEE)';
                    if (b === 'ME' || b === 'MECH' || b === 'MECHANICAL') return 'Mechanical Engineering (ME)';
                    if (b === 'CE' || b === 'CIVIL') return 'Civil Engineering (CE)';
                    if (b === 'IT' || b === 'INFORMATION TECHNOLOGY') return 'Information Technology (IT)';
                    return b; // Fallback to raw string
                };

                // Group students by normalized branch
                const groupedStudents = students.reduce((acc, curr) => {
                    const branch = normalizeBranch(curr.branch);
                    if (!acc[branch]) acc[branch] = [];
                    acc[branch].push(curr);
                    return acc;
                }, {});

                return (
                    <div className="space-y-8 pb-12">
                        {students.length === 0 ? (
                            <p className="p-8 text-center text-gray-500 italic border border-gray-200 shadow-sm rounded-lg bg-white">No students found.</p>
                        ) : (
                            Object.keys(groupedStudents).sort().map(branch => (
                                <div key={branch} className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                                    <div className="bg-orange-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wider">{branch}</h3>
                                        <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f3723b' }}>
                                            {groupedStudents[branch].length} {groupedStudents[branch].length === 1 ? 'Student' : 'Students'}
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm bg-white">
                                            <thead className="bg-gray-50 uppercase tracking-wider font-bold text-xs text-gray-600">
                                                <tr>
                                                    <th className="p-3 border-b">ID</th>
                                                    <th className="p-3 border-b">Name</th>
                                                    <th className="p-3 border-b">Batch</th>
                                                    <th className="p-3 border-b">Email</th>
                                                    <th className="p-3 border-b">CGPA</th>
                                                    <th className="p-3 border-b">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {groupedStudents[branch].map((p) => (
                                                    <tr key={p.uid} className="hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0">
                                                        <td className="p-3 font-mono">{p.id}</td>
                                                        <td className="p-3 font-bold">{p.name}</td>
                                                        <td className="p-3">{p.batch}</td>
                                                        <td className="p-3">{p.email}</td>
                                                        <td className="p-3">{p.cgpa}</td>
                                                        <td className="p-3">
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => handleEditClick(p)}
                                                                    className="text-blue-600 hover:text-blue-900 font-bold text-xs uppercase"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(p.uid)}
                                                                    className="text-red-600 hover:text-red-900 font-bold text-xs uppercase"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            })()}

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">Edit Student Profile</h2>
                            <button
                                onClick={() => { setIsEditModalOpen(false); setEditingStudent(null); }}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {Object.keys(form).map((key) => {
                                    if (key === 'id') {
                                        return (
                                            <div key={key}>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{key.replace(/_/g, " ")}</label>
                                                <input
                                                    name={key}
                                                    value={editingStudent[key] || ""}
                                                    onChange={handleEditChange}
                                                    readOnly={true}
                                                    className="w-full border border-gray-300 p-2 text-sm bg-gray-100 rounded cursor-not-allowed text-gray-500"
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={key}>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{key.replace(/_/g, " ")}</label>
                                            <input
                                                name={key}
                                                value={editingStudent[key] || ""}
                                                onChange={handleEditChange}
                                                className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-coral-500 rounded"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => { setIsEditModalOpen(false); setEditingStudent(null); }}
                                    className="px-6 py-2 border border-gray-300 rounded font-bold uppercase text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateProfile}
                                    className="px-6 py-2 bg-coral-500 text-white rounded font-bold uppercase text-sm hover:bg-coral-600 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
