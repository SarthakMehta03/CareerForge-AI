import React, { useState } from "react";
import { Plus, X, Sparkles, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useResume } from "../../../context/ResumeContext";
import { suggestSkills } from "../../../services/resumeService";

export function SkillsEditor() {
  const { resume, setResume } = useResume();
  const skills = resume.skills || [];
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendedSkills, setRecommendedSkills] = useState([]);

  const handleAddSkill = (skillName) => {
    const name = skillName || newSkill.trim();
    if (!name) return;

    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Skill already added!");
      return;
    }

    const newSkillObj = {
      id: `skill_${Date.now()}_${Math.random()}`,
      name: name,
      category: "Technical",
      level: "Intermediate",
    };

    setResume((prev) => ({ ...prev, skills: [...(prev.skills || []), newSkillObj] }));
    setRecommendedSkills((prev) => prev.filter((s) => s.toLowerCase() !== name.toLowerCase()));
    setNewSkill("");
  };

  const handleRemoveSkill = (id) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s.id !== id),
    }));
  };

  const handleGetSkillSuggestions = async () => {
    try {
      setLoading(true);
      const res = await suggestSkills(resume);
      if (res.data.success && res.data.suggestions) {
        setRecommendedSkills(res.data.suggestions);
        toast.success("AI skills recommendations ready!");
      }
    } catch (err) {
      toast.error("Failed to fetch skill suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Skills & Competencies</h2>
          <p className="text-xs text-gray-500">Add technical skills, tools, frameworks, and soft skills.</p>
        </div>
        <button
          type="button"
          onClick={handleGetSkillSuggestions}
          disabled={loading}
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
          <span>Get AI Skill Suggestions</span>
        </button>
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
          placeholder="e.g. React, Node.js, Python, Docker..."
          className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
        />
        <button
          type="button"
          onClick={() => handleAddSkill()}
          className="bg-black hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          Add Skill
        </button>
      </div>

      {/* Existing Skills */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Existing Skills ({skills.length})
        </h3>
        {skills.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No skills added yet. Type above or click AI suggestions.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
              >
                <span>{s.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Skills (Separated) */}
      {recommendedSkills.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 border border-amber-200/70 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Recommended Skills for your Role
            </h3>
          </div>
          <p className="text-xs text-amber-700 mb-3">
            Click any skill below to add it to your resume:
          </p>

          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((recSkill) => (
              <button
                key={recSkill}
                type="button"
                onClick={() => handleAddSkill(recSkill)}
                className="flex items-center gap-1 bg-white border border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-xs"
              >
                <Plus size={13} className="text-amber-600" />
                <span>{recSkill}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsEditor;
