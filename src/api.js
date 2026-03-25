const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const fetchEligibleStudents = async () => {
    try {
        const response = await fetch(`${API_URL}/api/eligible-students`);
        if (!response.ok) throw new Error('Failed to fetch eligible students');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const fetchAllStudents = async () => {
    try {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const fetchBulletinBoard = async () => {
    try {
        const response = await fetch(`${API_URL}/board`);
        if (!response.ok) throw new Error('Failed to fetch board data');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const fetchGrievances = async () => {
    try {
        const response = await fetch(`${API_URL}/api/grievances`);
        if (!response.ok) throw new Error('Failed to fetch grievances');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        console.error("API Error:", error);
        return [];
    }
};

export const createBulletin = async (bulletinData) => {
    try {
        const response = await fetch(`${API_URL}/board`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bulletinData),
        });
        if (!response.ok) throw new Error('Failed to create bulletin');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const deleteBulletin = async (id) => {
    try {
        const response = await fetch(`${API_URL}/board/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete bulletin');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const addStudent = async (studentData) => {
    try {
        const response = await fetch(`${API_URL}/students/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });
        if (!response.ok) throw new Error('Failed to add student');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const deleteStudent = async (uid) => {
    try {
        const response = await fetch(`${API_URL}/students/${uid}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete student');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const updateStudent = async (uid, studentData) => {
    try {
        const response = await fetch(`${API_URL}/students/${uid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });
        if (!response.ok) throw new Error('Failed to update student');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const uploadStudentExcel = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/students/upload-excel`, {
            method: 'POST',
            body: formData, // Check if headers need to be omitted for FormData to work correctly with boundary
        });
        if (!response.ok) throw new Error('Failed to upload excel');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const searchStudents = async (query) => {
    try {
        const response = await fetch(`${API_URL}/students?search=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search students');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// --- Placement Records ---

// Fetch Years
export const fetchYears = async () => {
    try {
        const response = await fetch(`${API_URL}/load_years`);
        if (!response.ok) throw new Error("Failed to fetch years");
        return await response.json();
    } catch (error) {
        console.error("Error fetching years:", error);
        return [];
    }
};

// Add Year
export const addYear = async (year) => {
    try {
        const response = await fetch(`${API_URL}/add_years/${year}`, {
            method: 'PUT'
        });
        const result = Number(await response.text());
        if (result !== 1) {
            throw new Error("Failed to add year (backend returned 0). Did the trigger crash?");
        }
        return result;
    } catch (error) {
        throw new Error(error.message || "Failed to add year.");
    }
};

// Fetch Companies
export const fetchCompanies = async (year) => {
    try {
        const response = await fetch(`${API_URL}/load_company/${year}`);
        if (!response.ok) throw new Error("Failed to fetch companies");
        return await response.json();
    } catch (error) {
        console.error("Error fetching companies:", error);
        return [];
    }
};

// Add Company
export const addCompany = async (year, companyName) => {
    try {
        const response = await fetch(`${API_URL}/add_company/${year}/${companyName}`, {
            method: 'PUT'
        });
        const result = Number(await response.text());
        if (result !== 1) {
            throw new Error("Failed to add company (backend returned 0)");
        }
        return result;
    } catch (error) {
        throw new Error(error.message || "Failed to add company.");
    }
};

// Fetch Records (dynamic table data)
export const fetchRecords = async (tbName) => {
    try {
        const response = await fetch(`${API_URL}/load_data/${tbName}`);
        if (!response.ok) throw new Error("Failed to fetch records");
        return await response.json();
    } catch (error) {
        console.error("Error fetching dynamic table records:", error);
        return [];
    }
};

// Add New Text Record
export const addTextRecord = async (tbName, text) => {
    try {
        const formData = new FormData();
        formData.append("text_data", text);
        const response = await fetch(`${API_URL}/upload-text/${tbName}`, {
            method: 'POST',
            body: formData,
        });
        const result = Number(await response.text());
        if (result !== 1) {
            throw new Error("Failed to add text record (backend returned 0)");
        }
        return result;
    } catch (error) {
        throw new Error(error.message || "Failed to add text record.");
    }
};

// Upload New File Record
export const uploadFileRecord = async (tbName, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_URL}/upload-file/${tbName}`, {
            method: 'POST',
            body: formData,
        });
        const result = Number(await response.text());
        if (result !== 1) {
            throw new Error("Failed to upload file record (backend returned 0)");
        }
        return result;
    } catch (error) {
        throw new Error(error.message || "Failed to upload file record.");
    }
};

// View File Record
export const viewFileRecord = async (tbName, fileId) => {
    try {
        const response = await fetch(`${API_URL}/view-file/${tbName}/${fileId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        window.open(url, "_blank");
    } catch (error) {
        console.error("Error viewing file record:", error);
    }
};


// --- Registered History ---
export const fetchRegisteredHistory = async (email) => {
    try {
        const response = await fetch(`${API_URL}/registered/${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error("Failed to fetch registered history");
        return await response.json();
    } catch (error) {
        console.error("Error fetching registered history:", error);
        return [];
    }
};

export const uploadRegisteredExcel = async (companyName, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_URL}/upload_registered_excel/${companyName}`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to upload excel file");
        }
        return await response.json();
    } catch (error) {
        console.error("Error uploading excel:", error);
        throw error;
    }
};
