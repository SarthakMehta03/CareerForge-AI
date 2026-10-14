import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";

export function InterestsEditor() {
  const { resume, setResume } = useResume();
  const interests = resume.interests || [];
  const [newInterest, setNewInterest] = useState("");

  const handleAdd = () => {
    const val = newInterest.trim();
    if (!val) return;
    if (interests.includes(val)) return;

    setResume((prev) => ({ ...prev, interests: [...(prev.interests || []), val] }));
    setNewInterest("");
  };

  const handleRemove = (val) => {
    setResume((prev) => ({
      ...prev,
      interests: (prev.interests || []).filter((i) => i !== val),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Interests & Hobbies</h2>
        <p className="text-xs text-gray-500">Add personal interests, open-source hobbies, or activity involvement.</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder="e.g. Open Source, Photography, Chess, Marathons..."
          className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-black hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          Add Interest
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {interests.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No interests added yet.</p>
        ) : (
          interests.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="text-gray-400 hover:text-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InterestsEditor;
