import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Upload,
  FileText,
  FileCode,
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
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/auth/Navbar";
import {
  getResumes,
  createResume,
  deleteResume,
  duplicateResume,
} from "../services/resumeService";
import ImportResumeModal from "../components/resume/modals/ImportResumeModal";
import ExportResumeModal from "../components/resume/modals/ExportResumeModal";
import ShareResumeModal from "../components/resume/modals/ShareResumeModal";
import { exportResumeBackup } from "../utils/resumeParser";
import ModernTemplate from "../components/resume/templates/ModernTemplate";
import ClassicTemplate from "../components/resume/templates/ClassicTemplate";
import MinimalTemplate from "../components/resume/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/resume/templates/ProfessionalTemplate";
import SidebarTemplate from "../components/resume/templates/SidebarTemplate";
import AtlanticTemplate from "../components/resume/templates/AtlanticTemplate";
import CobaltTemplate from "../components/resume/templates/CobaltTemplate";
import MercuryTemplate from "../components/resume/templates/MercuryTemplate";
import SaffronTemplate from "../components/resume/templates/SaffronTemplate";
import EditorialTemplate from "../components/resume/templates/EditorialTemplate";
import ErrorBoundary from "../components/common/ErrorBoundary";

// ──────────────────────────────────────────────
// Live Resume Thumbnail (Renders full live resume scaled down)
// ──────────────────────────────────────────────
function MiniResumePreview({ resume }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.28);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.getBoundingClientRect().width;
      if (w > 0) setScale(w / 794);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateScale = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setScale(w / 794);
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!resume) return null;

  const resumeForRender = {
    ...resume,
    minPageHeight: 1123,
    theme: resume.theme || {},
    personalInfo: resume.personalInfo || {},
  };

  const renderTemplate = () => {
    switch (resume.template) {
      // FlowCV Templates
      case "atlantic-blue":
        return <AtlanticTemplate resume={resumeForRender} variant="atlantic" />;
      case "hunter-green":
        return <AtlanticTemplate resume={resumeForRender} variant="hunter" />;
      case "quicksilver":
        return <AtlanticTemplate resume={resumeForRender} variant="quicksilver" />;
      case "cobalt-edge":
        return <CobaltTemplate resume={resumeForRender} />;
      case "mercury-flow":
        return <MercuryTemplate resume={resumeForRender} variant="mercury" />;
      case "steady-form":
        return <MercuryTemplate resume={resumeForRender} variant="steady" />;
      case "silver-banner":
        return <MercuryTemplate resume={resumeForRender} variant="silver" />;
      case "saffron-line":
        return <SaffronTemplate resume={resumeForRender} />;
      case "classic-clear":
        return <EditorialTemplate resume={resumeForRender} variant="classic-clear" />;
      case "editorial-rule":
        return <EditorialTemplate resume={resumeForRender} variant="editorial-rule" />;
      case "classic-serif":
        return <EditorialTemplate resume={resumeForRender} variant="classic-serif" />;

      // Built-in Templates
      case "sidebar":
        return <SidebarTemplate resume={resumeForRender} />;
      case "classic":
        return <ClassicTemplate resume={resumeForRender} />;
      case "minimal":
      case "precision-line":
      case "condensed-rule":
        return <MinimalTemplate resume={resumeForRender} />;
      case "professional":
      case "refined":
        return <ProfessionalTemplate resume={resumeForRender} />;
      case "modern":
      case "true-blue":
      default:
        if (resume.theme?.columns === "two") {
          return <SidebarTemplate resume={resumeForRender} />;
        }
        return <ModernTemplate resume={resumeForRender} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-white select-none pointer-events-none"
    >
      <div
        style={{
          width: "794px",
          height: "1123px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute top-0 left-0 bg-white origin-top-left overflow-hidden shadow-none"
      >
        <ErrorBoundary fallback={<div className="p-8 text-sm text-gray-400">Preview unavailable</div>}>
          {renderTemplate()}
        </ErrorBoundary>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Three-dot vertical menu (FlowCV style)
// ──────────────────────────────────────────────
function CardMenu({ onEdit, onDuplicate, onShare, onExport, onExportJSON, onDelete }) {
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
        <div className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
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
            onClick={(e) => { e.stopPropagation(); setOpen(false); onShare(e); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={15} className="text-emerald-600" />
            <span>Share & Analytics</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onExport(e); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            <span>Export (.docx, .txt, .pdf)</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onExportJSON(e); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileCode size={15} />
            <span>Export JSON Backup</span>
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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedResumeForExport, setSelectedResumeForExport] = useState(null);
  const [selectedResumeForShare, setSelectedResumeForShare] = useState(null);

  useEffect(() => { fetchResumes(); }, []);

  const handleImportResume = async (importedData) => {
    try {
      const data = {
        title: importedData.title || `${importedData.personalInfo?.fullName || "Imported"} Resume`,
        template: importedData.template || "modern",
        sectionOrder: importedData.sectionOrder || [
          "personalInfo",
          "summary",
          "experience",
          "education",
          "skills",
          "projects",
          "certifications",
          "languages",
          "awards",
          "publications",
          "organizations",
          "interests",
          "references",
          "declaration",
          "custom",
        ],
        ...importedData,
        hiddenSections: [],
      };

      setLoading(true);
      const res = await createResume(data);
      if (res.data.success && res.data.resume) {
        toast.success("Resume imported successfully with full layout and structure!");
        navigate(`/resume/${res.data.resume._id}/edit`);
      } else {
        toast.error("Failed to import resume");
      }
    } catch (err) {
      toast.error("Failed to import resume");
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateNew = () => {
    navigate("/resume/new");
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

            {/* Import Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-black transition cursor-pointer shadow-2xs"
              title="Import resume from PDF or JSON"
            >
              <Upload size={15} />
              <span className="hidden sm:inline">Import</span>
            </button>
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
                <div className={`bg-white rounded-xl border border-gray-200 animate-pulse ${viewMode === "grid" ? "aspect-[210/297]" : "h-16"}`} />
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
                className="group w-full bg-transparent border-2 border-dashed border-gray-300 hover:border-black rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer aspect-[210/297]"
              >
                <Plus size={20} className="text-gray-400 group-hover:text-black transition-colors mb-1.5" />
                <span className="text-sm text-gray-500 group-hover:text-black font-medium transition-colors">
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
                className="group w-full bg-transparent border-2 border-dashed border-gray-300 hover:border-black rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer aspect-[210/297]"
              >
                <Plus size={20} className="text-gray-400 group-hover:text-black transition-colors mb-1.5" />
                <span className="text-sm text-gray-500 group-hover:text-black font-medium transition-colors">
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
                  className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden aspect-[210/297]"
                >
                  <div className="w-full h-full">
                    <MiniResumePreview resume={res} />
                  </div>
                  {/* Hover overlay with edit indicator */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all">
                      <Edit3 size={13} />
                      Edit Resume
                    </span>
                  </div>
                </div>

                {/* Info below the card (FlowCV style) */}
                <div className="flex items-center justify-between mt-2 px-0.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {res.title || "Untitled Resume"}
                      </h3>
                      {res.isPublic && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0" title={`Public link active • ${res.viewsCount || 0} views`}>
                          <Share2 size={9} />
                          {res.viewsCount || 0}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      edited {formatDate(res.updatedAt)}
                    </p>
                  </div>

                  {/* Three-dot vertical menu */}
                  <CardMenu
                    onEdit={(e) => { e.stopPropagation(); navigate(`/resume/${res._id}/edit`); }}
                    onDuplicate={(e) => handleDuplicate(res._id, e)}
                    onShare={(e) => { e.stopPropagation(); setSelectedResumeForShare(res); }}
                    onExport={(e) => { e.stopPropagation(); setSelectedResumeForExport(res); }}
                    onExportJSON={(e) => {
                      e.stopPropagation();
                      exportResumeBackup(res);
                      toast.success("Resume JSON backup exported!");
                    }}
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
              className="group flex items-center gap-4 bg-transparent border-2 border-dashed border-gray-300 hover:border-black rounded-xl px-4 py-3 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0">
                <Plus size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-gray-500 group-hover:text-black transition-colors block">
                  New resume
                </span>
                <span className="text-xs text-gray-400">Start from a blank canvas</span>
              </div>
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {res.title || "Untitled Resume"}
                    </h3>
                    {res.isPublic && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0" title={`Public link active • ${res.viewsCount || 0} views`}>
                        <Share2 size={10} />
                        {res.viewsCount || 0} views
                      </span>
                    )}
                  </div>
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
                  onShare={(e) => { e.stopPropagation(); setSelectedResumeForShare(res); }}
                  onExport={(e) => { e.stopPropagation(); setSelectedResumeForExport(res); }}
                  onExportJSON={(e) => {
                    e.stopPropagation();
                    exportResumeBackup(res);
                    toast.success("Resume JSON backup exported!");
                  }}
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

      <ImportResumeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportData={handleImportResume}
      />

      {selectedResumeForExport && (
        <ExportResumeModal
          isOpen={Boolean(selectedResumeForExport)}
          onClose={() => setSelectedResumeForExport(null)}
          resume={selectedResumeForExport}
          onOpenShareModal={() => {
            const r = selectedResumeForExport;
            setSelectedResumeForExport(null);
            setSelectedResumeForShare(r);
          }}
        />
      )}

      {selectedResumeForShare && (
        <ShareResumeModal
          isOpen={Boolean(selectedResumeForShare)}
          onClose={() => {
            setSelectedResumeForShare(null);
            fetchResumes();
          }}
          resumeId={selectedResumeForShare._id}
          initialPublic={selectedResumeForShare.isPublic}
        />
      )}
    </div>
  );
}

export default ResumeManagement;
