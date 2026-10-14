import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Edit3,
  Eye,
  Copy,
  Trash2,
  Download,
  MoreVertical,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Sparkles,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/auth/Navbar";
import {
  getResumes,
  createResume,
  deleteResume,
  duplicateResume,
} from "../services/resumeService";

// ──────────────────────────────────────────────
// Mini resume thumbnails (one per template)
// ──────────────────────────────────────────────
function MiniModernPreview({ resume }) {
  const { personalInfo } = resume;
  return (
    <div className="w-full h-full bg-white p-2.5 text-[3.5px] leading-[1.4] font-sans overflow-hidden">
      <div className="border-b border-gray-800 pb-1 mb-1">
        <div className="text-[6px] font-bold text-gray-900 uppercase tracking-wide">
          {personalInfo?.fullName || "Your Name"}
        </div>
        <div className="text-[3.5px] text-gray-600 mt-0.5">
          {personalInfo?.jobTitle || "Professional Title"}
        </div>
        <div className="flex gap-1 mt-0.5 text-[3px] text-gray-500">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
        </div>
      </div>
      {resume.summary && (
        <div className="mb-1">
          <div className="text-[3.5px] font-bold text-gray-800 uppercase mb-0.5">Summary</div>
          <div className="text-gray-600 line-clamp-2">{resume.summary}</div>
        </div>
      )}
      {resume.experience?.length > 0 && (
        <div className="mb-1">
          <div className="text-[3.5px] font-bold text-gray-800 uppercase mb-0.5">Experience</div>
          {resume.experience.slice(0, 2).map((exp, i) => (
            <div key={i} className="mb-0.5">
              <div className="font-semibold text-gray-800">{exp.jobTitle || "Job Title"}</div>
              <div className="text-gray-500">{exp.company || "Company"}</div>
              <div className="h-[1.5px] bg-gray-100 rounded mt-0.5 w-3/4" />
            </div>
          ))}
        </div>
      )}
      {resume.education?.length > 0 && (
        <div className="mb-1">
          <div className="text-[3.5px] font-bold text-gray-800 uppercase mb-0.5">Education</div>
          {resume.education.slice(0, 1).map((edu, i) => (
            <div key={i}>
              <div className="font-semibold text-gray-800">{edu.degree || "Degree"}</div>
              <div className="text-gray-500">{edu.institution || "Institution"}</div>
            </div>
          ))}
        </div>
      )}
      {resume.skills?.length > 0 && (
        <div>
          <div className="text-[3.5px] font-bold text-gray-800 uppercase mb-0.5">Skills</div>
          <div className="flex flex-wrap gap-0.5">
            {resume.skills.slice(0, 5).map((skill, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-0.5 py-[0.5px] rounded text-[3px]">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniClassicPreview({ resume }) {
  const { personalInfo } = resume;
  return (
    <div className="w-full h-full bg-white p-2.5 text-[3.5px] leading-[1.4] font-serif overflow-hidden">
      <div className="text-center pb-1 mb-1 border-b border-gray-300">
        <div className="text-[6px] font-bold text-gray-900">
          {personalInfo?.fullName || "Your Name"}
        </div>
        <div className="text-[3.5px] text-gray-600 mt-0.5">
          {personalInfo?.jobTitle || "Professional Title"}
        </div>
        <div className="flex justify-center gap-1 mt-0.5 text-[3px] text-gray-500">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
        </div>
      </div>
      {resume.experience?.length > 0 && (
        <div className="mb-1">
          <div className="text-[3.5px] font-bold text-gray-800 border-b border-gray-200 pb-0.5 mb-0.5">EXPERIENCE</div>
          {resume.experience.slice(0, 2).map((exp, i) => (
            <div key={i} className="mb-0.5">
              <div className="font-semibold text-gray-800">{exp.jobTitle}</div>
              <div className="text-gray-500">{exp.company}</div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-0.5 mt-1">
        <div className="h-[1.5px] bg-gray-100 rounded w-full" />
        <div className="h-[1.5px] bg-gray-100 rounded w-4/5" />
        <div className="h-[1.5px] bg-gray-100 rounded w-3/5" />
      </div>
    </div>
  );
}

function MiniMinimalPreview({ resume }) {
  const { personalInfo } = resume;
  return (
    <div className="w-full h-full bg-white p-2.5 text-[3.5px] leading-[1.4] font-sans overflow-hidden">
      <div className="pb-1 mb-1">
        <div className="text-[6.5px] font-light text-gray-900 tracking-widest uppercase">
          {personalInfo?.fullName || "Your Name"}
        </div>
        <div className="text-[3.5px] text-gray-500 mt-0.5 tracking-wider">
          {personalInfo?.jobTitle || "Professional Title"}
        </div>
      </div>
      <div className="h-[0.5px] bg-gray-200 mb-1" />
      <div className="space-y-0.5">
        <div className="h-[1.5px] bg-gray-100 rounded w-full" />
        <div className="h-[1.5px] bg-gray-100 rounded w-5/6" />
        <div className="h-[1.5px] bg-gray-100 rounded w-4/6" />
        <div className="h-[1.5px] bg-gray-100 rounded w-full mt-1" />
        <div className="h-[1.5px] bg-gray-100 rounded w-3/4" />
        <div className="h-[1.5px] bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

function MiniProfessionalPreview({ resume }) {
  const { personalInfo } = resume;
  return (
    <div className="w-full h-full bg-white flex overflow-hidden">
      <div className="w-[30%] bg-gray-800 p-1.5 text-white text-[3px] leading-[1.4]">
        <div className="text-[4px] font-bold mb-0.5">{personalInfo?.fullName || "Your Name"}</div>
        <div className="text-[2.5px] text-gray-300 mb-1">{personalInfo?.jobTitle || "Title"}</div>
        <div className="space-y-0.5">
          <div className="h-[1.5px] bg-gray-600 rounded w-full" />
          <div className="h-[1.5px] bg-gray-600 rounded w-4/5" />
          <div className="h-[1.5px] bg-gray-600 rounded w-3/5" />
        </div>
      </div>
      <div className="flex-1 p-1.5 text-[3px] leading-[1.4]">
        <div className="space-y-0.5">
          <div className="h-[1.5px] bg-gray-100 rounded w-full" />
          <div className="h-[1.5px] bg-gray-100 rounded w-5/6" />
          <div className="h-[1.5px] bg-gray-100 rounded w-4/6" />
          <div className="h-[1.5px] bg-gray-100 rounded w-full mt-1" />
          <div className="h-[1.5px] bg-gray-100 rounded w-3/4" />
          <div className="h-[1.5px] bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

function MiniResumePreview({ resume }) {
  switch (resume?.template) {
    case "classic":
      return <MiniClassicPreview resume={resume} />;
    case "minimal":
      return <MiniMinimalPreview resume={resume} />;
    case "professional":
      return <MiniProfessionalPreview resume={resume} />;
    case "modern":
    default:
      return <MiniModernPreview resume={resume} />;
  }
}

// ──────────────────────────────────────────────
// Three-dot vertical menu (FlowCV style)
// ──────────────────────────────────────────────
function CardMenu({ onEdit, onDuplicate, onDownload, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(e); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit3 size={15} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDuplicate(e); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy size={15} />
            <span>Duplicate</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDownload(e); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            <span>Download</span>
          </button>
          <div className="my-1 h-px bg-gray-100 mx-3" />
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(e); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────
export function ResumeManagement() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await getResumes();
      if (res.data.success) setResumes(res.data.resumes || []);
    } catch (err) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const res = await createResume({ title: "My Resume", template: "modern" });
      if (res.data.success && res.data.resume) {
        toast.success("New resume created!");
        navigate(`/resume/${res.data.resume._id}/edit`);
      }
    } catch (err) {
      toast.error("Failed to create resume");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted");
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const handleDuplicate = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await duplicateResume(id);
      if (res.data.success && res.data.resume) {
        setResumes((prev) => [res.data.resume, ...prev]);
        toast.success("Resume duplicated!");
      }
    } catch (err) {
      toast.error("Failed to duplicate resume");
    }
  };

  // Filter & sort
  const filteredResumes = resumes
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.title?.toLowerCase().includes(q) ||
        r.personalInfo?.fullName?.toLowerCase().includes(q) ||
        r.personalInfo?.jobTitle?.toLowerCase().includes(q) ||
        r.template?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "created") return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Resumes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and manage your AI-enhanced professional resumes.
          </p>
        </div>

        {/* Toolbar — search + sort + view toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-gray-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl text-sm text-gray-600 pl-3 pr-8 py-2 focus:outline-none focus:border-black transition-colors cursor-pointer"
              >
                <option value="updated">Last modified</option>
                <option value="created">Date created</option>
                <option value="name">Name</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            : "flex flex-col gap-3"
          }>
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className={`bg-white rounded-xl border border-gray-200 animate-pulse ${viewMode === "grid" ? "aspect-[3/4]" : "h-16"}`} />
                {viewMode === "grid" && <div className="h-10 mt-2" />}
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          /* ── Empty state ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {/* New resume card */}
            <div>
              <button
                onClick={handleCreateNew}
                className="group w-full bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer aspect-[3/4]"
              >
                <Plus size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors mb-1.5" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 font-medium transition-colors">
                  New resume
                </span>
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* ── Grid View ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {/* "New resume" blank card — first item */}
            <div>
              <button
                onClick={handleCreateNew}
                className="group w-full bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer aspect-[3/4]"
              >
                <Plus size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors mb-1.5" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 font-medium transition-colors">
                  New resume
                </span>
              </button>
            </div>

            {/* Resume Cards */}
            {filteredResumes.map((res) => (
              <div key={res._id}>
                {/* Thumbnail card */}
                <div
                  onClick={() => navigate(`/resume/${res._id}/edit`)}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden aspect-[3/4]"
                >
                  <div className="w-full h-full">
                    <MiniResumePreview resume={res} />
                  </div>
                </div>

                {/* Info below the card (FlowCV style) */}
                <div className="flex items-center justify-between mt-2 px-0.5">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {res.title || "Untitled Resume"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      edited {formatDate(res.updatedAt)}
                    </p>
                  </div>

                  {/* Three-dot vertical menu */}
                  <CardMenu
                    onEdit={(e) => { e.stopPropagation(); navigate(`/resume/${res._id}/edit`); }}
                    onDuplicate={(e) => handleDuplicate(res._id, e)}
                    onDownload={(e) => { e.stopPropagation(); navigate(`/resume/${res._id}/preview`); }}
                    onDelete={(e) => handleDelete(res._id, e)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── List View ── */
          <div className="flex flex-col gap-2">
            {/* New resume row */}
            <button
              onClick={handleCreateNew}
              className="group flex items-center gap-4 bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl px-4 py-3 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0">
                <Plus size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                New resume
              </span>
            </button>

            {/* Resume Rows */}
            {filteredResumes.map((res) => (
              <div
                key={res._id}
                onClick={() => navigate(`/resume/${res._id}/edit`)}
                className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md px-4 py-3 transition-all cursor-pointer"
              >
                {/* Small thumbnail */}
                <div className="w-10 h-14 rounded-md overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                  <MiniResumePreview resume={res} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {res.title || "Untitled Resume"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    edited {formatDate(res.updatedAt)}
                  </p>
                </div>

                {/* Template badge */}
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md capitalize">
                  {res.template || "Modern"}
                </span>

                {/* Three-dot menu */}
                <CardMenu
                  onEdit={(e) => { e.stopPropagation(); navigate(`/resume/${res._id}/edit`); }}
                  onDuplicate={(e) => handleDuplicate(res._id, e)}
                  onDownload={(e) => { e.stopPropagation(); navigate(`/resume/${res._id}/preview`); }}
                  onDelete={(e) => handleDelete(res._id, e)}
                />
              </div>
            ))}
          </div>
        )}

        {/* No search results */}
        {!loading && resumes.length > 0 && filteredResumes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Search size={32} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No resumes match "{searchQuery}"</p>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
        © CareerForge-AI. All rights reserved.
      </footer>
    </div>
  );
}

export default ResumeManagement;
