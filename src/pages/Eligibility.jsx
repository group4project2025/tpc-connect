import { useState, useEffect } from "react";
import { fetchEligibleStudents } from "../api";

export default function Eligibility() {
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);

  // Use existing API helper or fallback to direct fetch if needed
  useEffect(() => {
    fetchEligibleStudents()
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching emails:", err);
        setLoading(false);
      });
  }, []);

  const handleSendEmail = async (role, sectionRef) => {
    // Get checked emails from the specific section
    const checkedBoxes = sectionRef.querySelectorAll("input[type=checkbox]:checked");
    const checkedEmails = Array.from(checkedBoxes).map(cb => cb.value);

    if (checkedEmails.length === 0) {
      alert("Please select at least one email.");
      return;
    }

    // Get subject and body
    const subjectInput = sectionRef.querySelector('input[type="text"]');
    const bodyInput = sectionRef.querySelector('textarea');

    if (!subjectInput || !bodyInput) {
      alert("Error reading subject or body.");
      return;
    }

    const subject = subjectInput.value;
    const body = bodyInput.value;

    try {
      // NOTE: Backend endpoint /api/send-emails needs to be implemented on port 8000
      const res = await fetch("http://127.0.0.1:8000/api/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role,
          emails: checkedEmails,
          subject,
          body,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      alert(`Emails sent successfully!`);

    } catch (err) {
      alert("Failed to send emails. Check if backend supports /api/send-emails");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <h2 className="text-xl font-bold">Loading...</h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 animate-fade-in font-sans">
      <h1 className="text-3xl font-bold mb-8">Eligible Students by Role</h1>

      {Object.keys(emails).length === 0 && <p>No data found.</p>}

      {Object.entries(emails).map(([role, roleEmails]) => (
        <div
          key={role}
          // Using a ref-like approach with ID or just passing event target parent
          className="bg-white mb-8 p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">{role}</h2>

          <div className="mb-4 max-h-40 overflow-y-auto border border-gray-100 p-2 rounded">
            {roleEmails && roleEmails.map((email) => (
              <label
                key={email}
                className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-coral-50 p-1 rounded transition-colors"
              >
                <input type="checkbox" value={email} className="accent-coral-500 w-4 h-4" />
                <span className="text-gray-700 font-mono text-sm">{email}</span>
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Email Subject"
              defaultValue={`Placement Drive - ${role}`}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-coral-500 transition-colors font-sans"
            />
            {/* Using textarea for the inputs as per user code */}
            <textarea
              placeholder="Email Body"
              defaultValue={`Dear Student,\n\nYou are eligible for the role: ${role}.`}
              className="w-full p-2 border border-gray-300 rounded h-24 focus:outline-none focus:border-coral-500 transition-colors font-sans"
            />

            <button
              className="bg-coral-500 text-white px-6 py-2 rounded font-medium hover:bg-coral-600 transition-colors shadow-sm"
              onClick={(e) => handleSendEmail(role, e.currentTarget.parentNode.parentNode)}
            >
              Send Email
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
