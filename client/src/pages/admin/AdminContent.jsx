import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit,
  Eye,
  Sparkles,
  X,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getSharedContent,
  createSharedContent,
  updateSharedContent,
  toggleArchiveContent,
  deleteSharedContent,
  seedSharedContent,
} from "../../services/adminService";

function AdminContent() {
  const [contentList, setContentList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [archiveFilter, setArchiveFilter] = useState("false");
  const [search, setSearch] = useState("");

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'preview' | 'delete'
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "interview",
    category: "Technical",
    topic: "",
    difficulty: "Medium",
    experienceLevel: "All",
    questionText: "",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ],
    correctOptionId: "a",
    explanation: "",
    suggestedPoints: "",
    keywords: "",
    tags: "",
  });

  const fetchContent = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        type: typeFilter !== "all" ? typeFilter : undefined,
        category: categoryFilter.trim() || undefined,
        difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
        archived: archiveFilter,
        search: search.trim() || undefined,
      };

      const res = await getSharedContent(params);
      if (res.data?.success) {
        setContentList(res.data.content);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Fetch content error:", err);
      toast.error("Failed to load shared content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchContent(1);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [typeFilter, categoryFilter, difficultyFilter, archiveFilter, search]);

  const openCreateModal = () => {
    setFormData({
      title: "",
      type: "interview",
      category: "Technical",
      topic: "",
      difficulty: "Medium",
      experienceLevel: "All",
      questionText: "",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctOptionId: "a",
      explanation: "",
      suggestedPoints: "",
      keywords: "",
      tags: "",
    });
    setSelectedItem(null);
    setActiveModal("create");
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      category: item.category,
      topic: item.topic,
      difficulty: item.difficulty,
      experienceLevel: item.experienceLevel || "All",
      questionText: item.questionText,
      options:
        item.options && item.options.length > 0
          ? item.options
          : [
              { id: "a", text: "" },
              { id: "b", text: "" },
              { id: "c", text: "" },
              { id: "d", text: "" },
            ],
      correctOptionId: item.correctOptionId || "a",
      explanation: item.explanation || "",
      suggestedPoints: (item.suggestedPoints || []).join("\n"),
      keywords: (item.keywords || []).join(", "),
      tags: (item.tags || []).join(", "),
    });
    setActiveModal("edit");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const payload = {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        topic: formData.topic,
        difficulty: formData.difficulty,
        experienceLevel: formData.experienceLevel,
        questionText: formData.questionText,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (formData.type === "interview") {
        payload.suggestedPoints = formData.suggestedPoints
          ? formData.suggestedPoints
              .split("\n")
              .map((p) => p.trim())
              .filter(Boolean)
          : [];
        payload.keywords = formData.keywords
          ? formData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [];
      } else if (formData.type === "aptitude") {
        payload.options = formData.options;
        payload.correctOptionId = formData.correctOptionId;
        payload.explanation = formData.explanation;
      }

      if (activeModal === "create") {
        await createSharedContent(payload);
        toast.success("Question created and added to question bank.");
      } else if (activeModal === "edit" && selectedItem) {
        await updateSharedContent(selectedItem._id, payload);
        toast.success("Question updated successfully.");
      }

      setActiveModal(null);
      fetchContent(pagination.page);
    } catch (err) {
      console.error("Content submit error:", err);
      toast.error(err.response?.data?.message || "Failed to save question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = async (item) => {
    try {
      await toggleArchiveContent(item._id);
      toast.success(item.isArchived ? "Question restored" : "Question archived");
      fetchContent(pagination.page);
    } catch (err) {
      console.error("Archive error:", err);
      toast.error("Failed to update archive status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      setIsSubmitting(true);
      await deleteSharedContent(selectedItem._id);
      toast.success("Question deleted permanently");
      setActiveModal(null);
      fetchContent(pagination.page);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedContent = async () => {
    try {
      const res = await seedSharedContent();
      toast.success(res.data?.message || "Standard question bank seeded successfully");
      fetchContent(1);
    } catch (err) {
      console.error("Seed error:", err);
      toast.error(err.response?.data?.message || "Failed to seed content");
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Question Bank</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curate technical interview and aptitude questions powering preparation sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeedContent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Seed verified questions if bank is low"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Seed Questions</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-xs"
          >
            <Plus size={15} />
            <span>New Question</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TABS & SEARCH FILTERS CONTROL BAR
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          {[
            { id: "all", label: "All Questions" },
            { id: "interview", label: "Interview Questions" },
            { id: "aptitude", label: "Aptitude MCQs" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by title, topic, or question text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:outline-hidden focus:border-indigo-600"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy / Beginner</option>
              <option value="Medium">Medium / Intermediate</option>
              <option value="Hard">Hard / Advanced</option>
            </select>
          </div>

          <div>
            <select
              value={archiveFilter}
              onChange={(e) => setArchiveFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:outline-hidden focus:border-indigo-600"
            >
              <option value="false">Active Only</option>
              <option value="true">Archived Only</option>
              <option value="all">Active & Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTENT CARDS GRID
          ========================================================================= */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-slate-200 p-5 animate-pulse" />
          ))}
        </div>
      ) : contentList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
          <h3 className="font-bold text-slate-800 text-sm">No Questions Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No questions match your current search and filter criteria. You can create a new question or seed verified defaults.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSeedContent}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Seed Defaults
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
            >
              New Question
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentList.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition hover:shadow-md ${
                item.isArchived
                  ? "border-amber-200 bg-amber-50/20 opacity-80"
                  : "border-slate-200/90"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.type === "interview"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.category} &bull; {item.topic}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.difficulty === "Easy"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : item.difficulty === "Hard"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {item.questionText}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {item.isArchived && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      Archived
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveModal("preview");
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                    title="Preview Full Question"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                    title="Edit Question"
                  >
                    <Edit size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleArchive(item)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    title={item.isArchived ? "Restore Question" : "Archive Question"}
                  >
                    {item.isArchived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveModal("delete");
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Question"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <strong className="text-slate-800">{contentList.length}</strong> of{" "}
          <strong className="text-slate-800">{pagination.total}</strong> questions
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => fetchContent(pagination.page - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-2 font-semibold text-slate-700">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchContent(pagination.page + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          CREATE / EDIT MODAL
          ========================================================================= */}
      {(activeModal === "create" || activeModal === "edit") && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {activeModal === "create" ? "Create New Shared Question" : "Edit Shared Question"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Question Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Short descriptive label"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Content Type *</label>
                  <select
                    disabled={activeModal === "edit"}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="interview">Interview Question</option>
                    <option value="aptitude">Aptitude MCQ Question</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Technical, Quantitative Aptitude"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Topic *</label>
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. React, Percentages, System Design"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="All">All Levels</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Question Prompt *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="The full question wording..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Aptitude MCQ Options */}
              {formData.type === "aptitude" && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block">Multiple Choice Options</span>
                  {formData.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={formData.correctOptionId === opt.id}
                        onChange={() => setFormData({ ...formData, correctOptionId: opt.id })}
                        title="Mark as correct answer"
                      />
                      <span className="font-mono uppercase font-bold text-slate-500 w-4">
                        {opt.id}:
                      </span>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[idx].text = e.target.value;
                          setFormData({ ...formData, options: newOpts });
                        }}
                        placeholder={`Option ${opt.id.toUpperCase()} text`}
                        className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="font-semibold text-slate-700 block mb-1">Explanation</label>
                    <input
                      type="text"
                      value={formData.explanation}
                      onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                      placeholder="Step-by-step mathematical or logical explanation"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Interview rubric points */}
              {formData.type === "interview" && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Suggested Rubric Points (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.suggestedPoints}
                    onChange={(e) => setFormData({ ...formData, suggestedPoints: e.target.value })}
                    placeholder="Key concepts or signals the evaluator should look for"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. react, hooks, frontend"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition"
                >
                  {isSubmitting && <RefreshCw size={13} className="animate-spin" />}
                  <span>Save Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          PREVIEW MODAL
          ========================================================================= */}
      {activeModal === "preview" && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                {selectedItem.type}
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900">{selectedItem.title}</h3>
            <div className="text-xs text-slate-500 mt-1">
              {selectedItem.category} &bull; {selectedItem.topic} &bull; Difficulty: {selectedItem.difficulty}
            </div>

            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800 leading-relaxed">
              {selectedItem.questionText}
            </div>

            {selectedItem.type === "aptitude" && selectedItem.options?.length > 0 && (
              <div className="mt-4 space-y-2 text-xs">
                <span className="font-semibold text-slate-700 block">Options:</span>
                {selectedItem.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      opt.id === selectedItem.correctOptionId
                        ? "bg-emerald-50 border-emerald-300 font-semibold text-emerald-900"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>
                      <strong className="uppercase mr-2">{opt.id}:</strong> {opt.text}
                    </span>
                    {opt.id === selectedItem.correctOptionId && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        Correct Answer
                      </span>
                    )}
                  </div>
                ))}

                {selectedItem.explanation && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <strong>Explanation:</strong> {selectedItem.explanation}
                  </div>
                )}
              </div>
            )}

            {selectedItem.suggestedPoints?.length > 0 && (
              <div className="mt-4 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">Key Evaluation Points:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {selectedItem.suggestedPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
          ========================================================================= */}
      {activeModal === "delete" && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle size={24} />
              <h3 className="text-base font-bold text-slate-900">Delete Question Permanently</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>{selectedItem.title}</strong>? This action is audited and cannot be undone. Consider archiving instead if you want to temporarily hide it.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContent;
