import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useResume } from "../../../context/ResumeContext";

// Safely extract the display name from an interest item (handles both strings and objects)
const getName = (item) =>
  typeof item === "object" && item !== null ? item?.name || "" : String(item || "");

// Safely extract a unique key from an interest item
const getKey = (item, idx) =>
  typeof item === "object" && item !== null ? item?.id || `int_${idx}` : `int_${item}_${idx}`;

export function InterestsEditor() {
  const { resume, setResume } = useResume();
  const interests = resume.interests || [];
  const [newInterest, setNewInterest] = useState("");

  const handleAdd = () => {
    const val = newInterest.trim();
    if (!val) return;

    // Check for duplicates (handle both strings and objects)
    const alreadyExists = interests.some(
      (item) => getName(item).toLowerCase() === val.toLowerCase()
    );
    if (alreadyExists) return;

    // Push as object with id for consistency with ResumeBuilder entry system
    const newEntry = { id: `int_${Date.now()}`, name: val };
    setResume((prev) => ({ ...prev, interests: [...(prev.interests || []), newEntry] }));
    setNewInterest("");
  };

  const handleRemove = (targetItem) => {
    setResume((prev) => ({
      ...prev,
      interests: (prev.interests || []).filter((item) => {
        if (typeof targetItem === "object" && targetItem !== null) {
          return typeof item === "object" ? item.id !== targetItem.id : true;
        }
        // string comparison fallback
        return getName(item) !== getName(targetItem);
      }),
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
          interests.map((item, idx) => {
            const displayName = getName(item);
            if (!displayName) return null;
            return (
              <div
                key={getKey(item, idx)}
                className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                <span>{displayName}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default InterestsEditor;
