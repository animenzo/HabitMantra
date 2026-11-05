import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import API from "../services/api";
import {
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEdit3,
  FiFileText,
  FiMenu,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiX,
  FiRotateCcw,
  FiRotateCw,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiSmile,
  FiMaximize2,
  FiMinimize2,
  FiType,
  FiDroplet,
  FiEye,
} from "react-icons/fi";

const THEMES = {
  parchment: {
    id: "parchment",
    name: "Classic Parchment",
    bodyBg: "bg-[#fcf8f0]",
    sidebarBg: "bg-[#f7f2e6]",
    sidebarBorder: "border-[#e8dfc8]",
    sheetBg: "bg-[#fffdf9]",
    sheetBorder: "border-[#e5dac0]",
    sheetShadow: "shadow-xl shadow-amber-950/5",
    textPrimary: "text-[#2a241e]",
    textSecondary: "text-[#6e6355]",
    textMuted: "text-[#9d9181]",
    cardHover: "hover:bg-[#f3ede0]",
    cardActive: "bg-[#efe6d3] border-[#d8c9a8]",
    btnAccent: "bg-[#8b5a2b] hover:bg-[#73481f] text-white shadow-sm",
    btnSecondary: "bg-[#ede4d2] hover:bg-[#e2d6c0] text-[#554737]",
    badgeBg: "bg-[#eee4d0] text-[#714820]",
    divider: "border-[#e8dfc8]",
    inputBg: "bg-[#f5efe1] border-[#ded3b9] text-[#2a241e]",
    marginGuide: "border-red-300/50",
    lineGradient:
      "linear-gradient(transparent, transparent 31px, rgba(139, 90, 43, 0.13) 31px)",
    dotGrid:
      "radial-gradient(circle, rgba(139, 90, 43, 0.18) 1px, transparent 1px) 0 0 / 24px 24px",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Obsidian",
    bodyBg: "bg-[#0b0d13]",
    sidebarBg: "bg-[#111520]",
    sidebarBorder: "border-[#1e2536]",
    sheetBg: "bg-[#151a28]",
    sheetBorder: "border-[#262f44]",
    sheetShadow: "shadow-2xl shadow-black/60",
    textPrimary: "text-[#f1f5f9]",
    textSecondary: "text-[#94a3b8]",
    textMuted: "text-[#64748b]",
    cardHover: "hover:bg-[#1a2030]",
    cardActive: "bg-[#1e263a] border-[#384564]",
    btnAccent: "bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-sm",
    btnSecondary: "bg-[#1f2639] hover:bg-[#28324a] text-[#cbd5e1]",
    badgeBg: "bg-[#21293e] text-[#a5b4fc]",
    divider: "border-[#1e2536]",
    inputBg: "bg-[#121622] border-[#252f44] text-[#f1f5f9]",
    marginGuide: "border-indigo-400/30",
    lineGradient:
      "linear-gradient(transparent, transparent 31px, rgba(129, 140, 248, 0.12) 31px)",
    dotGrid:
      "radial-gradient(circle, rgba(129, 140, 248, 0.22) 1px, transparent 1px) 0 0 / 24px 24px",
  },
  sage: {
    id: "sage",
    name: "Botanical Sage",
    bodyBg: "bg-[#f1f6f2]",
    sidebarBg: "bg-[#e8efe9]",
    sidebarBorder: "border-[#cfe0d2]",
    sheetBg: "bg-[#fbfdfa]",
    sheetBorder: "border-[#ccdecTarget]",
    sheetShadow: "shadow-xl shadow-emerald-950/5",
    textPrimary: "text-[#152a1d]",
    textSecondary: "text-[#4b6a54]",
    textMuted: "text-[#7b9c83]",
    cardHover: "hover:bg-[#e0ece2]",
    cardActive: "bg-[#d8e8da] border-[#b5d3bb]",
    btnAccent: "bg-[#2d6a4f] hover:bg-[#1b4332] text-white shadow-sm",
    btnSecondary: "bg-[#dce9de] hover:bg-[#cfded1] text-[#22442d]",
    badgeBg: "bg-[#d7ead9] text-[#1e4a32]",
    divider: "border-[#cfe0d2]",
    inputBg: "bg-[#e3ede5] border-[#c5d9c8] text-[#152a1d]",
    marginGuide: "border-emerald-300/60",
    lineGradient:
      "linear-gradient(transparent, transparent 31px, rgba(45, 106, 79, 0.12) 31px)",
    dotGrid:
      "radial-gradient(circle, rgba(45, 106, 79, 0.18) 1px, transparent 1px) 0 0 / 24px 24px",
  },
  dusk: {
    id: "dusk",
    name: "Velvet Rose",
    bodyBg: "bg-[#faf3f6]",
    sidebarBg: "bg-[#f4e6ec]",
    sidebarBorder: "border-[#e6ccd5]",
    sheetBg: "bg-[#fffafd]",
    sheetBorder: "border-[#e5ccd6]",
    sheetShadow: "shadow-xl shadow-pink-950/5",
    textPrimary: "text-[#2e1420]",
    textSecondary: "text-[#754458]",
    textMuted: "text-[#a47285]",
    cardHover: "hover:bg-[#ede0e6]",
    cardActive: "bg-[#e9d6df] border-[#d4b0be]",
    btnAccent: "bg-[#9d174d] hover:bg-[#831843] text-white shadow-sm",
    btnSecondary: "bg-[#edd9e2] hover:bg-[#e2c7d2] text-[#632a41]",
    badgeBg: "bg-[#fce7f3] text-[#9d174d]",
    divider: "border-[#e6ccd5]",
    inputBg: "bg-[#f2e2e9] border-[#d8becc] text-[#2e1420]",
    marginGuide: "border-pink-300/60",
    lineGradient:
      "linear-gradient(transparent, transparent 31px, rgba(157, 23, 77, 0.12) 31px)",
    dotGrid:
      "radial-gradient(circle, rgba(157, 23, 77, 0.18) 1px, transparent 1px) 0 0 / 24px 24px",
  },
};

const EMOJIS = [
  "😊", "😂", "🥲", "😍", "😌", "😤", "🙏", "💪",
  "✨", "🌙", "☀️", "❤️", "🔥", "🌱", "🎯", "⭐"
];

const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const findMatchesInElement = (element, term) => {
  if (!element || !term) return [];
  const textNodes = [];
  const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  let n;
  while ((n = walk.nextNode())) {
    textNodes.push(n);
  }

  const matches = [];
  const lowerTerm = term.toLowerCase();

  for (const node of textNodes) {
    const text = node.textContent.toLowerCase();
    let index = 0;
    while ((index = text.indexOf(lowerTerm, index)) !== -1) {
      matches.push({ node, start: index, end: index + term.length });
      index += term.length;
    }
  }
  return matches;
};

const MyDiary = () => {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [diaryFindTerm, setDiaryFindTerm] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  // New Impeccable Visual Controls: Themes, Fonts, Paper styles, Zen Focus
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem("diary_theme") || "parchment");
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem("diary_font") || "serif");
  const [paperStyle, setPaperStyle] = useState(() => localStorage.getItem("diary_paper") || "ruled");
  const [zenMode, setZenMode] = useState(false);

  const theme = THEMES[themeKey] || THEMES.parchment;

  const editorRef = useRef(null);
  const contentRef = useRef("");
  const dirtyRef = useRef(false);
  const autosaveRef = useRef(null);
  const initialFetchDone = useRef(false);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry._id === selectedId),
    [entries, selectedId],
  );

  const writingDate = selectedEntry?.createdAt || new Date();

  // Metrics: words, chars, estimated reading time
  const stats = useMemo(() => {
    const plain = stripHtml(contentRef.current);
    const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
    const chars = plain.length;
    const readMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readMinutes };
  }, [hasUnsavedChanges, selectedId]);

  // Persist aesthetic choices
  useEffect(() => {
    localStorage.setItem("diary_theme", themeKey);
  }, [themeKey]);

  useEffect(() => {
    localStorage.setItem("diary_font", fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem("diary_paper", paperStyle);
  }, [paperStyle]);

  // Dynamic Paper Background Styles
  const getPaperBackground = () => {
    if (paperStyle === "blank") {
      return { lineHeight: "32px" };
    }
    if (paperStyle === "dotted") {
      return {
        backgroundImage: theme.dotGrid,
        backgroundSize: "24px 24px",
        lineHeight: "32px",
      };
    }
    // Ruled lines default
    return {
      backgroundImage: theme.lineGradient,
      backgroundSize: "100% 32px",
      lineHeight: "32px",
    };
  };

  // Font class switcher
  const getFontClass = () => {
    if (fontFamily === "sans") return "font-sans";
    if (fontFamily === "mono") return "font-mono";
    return "font-serif";
  };

  // Fetch entries
  const fetchEntries = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const activeKeyword = filters.keyword !== undefined ? filters.keyword : keyword;
      const activeDate = filters.searchDate !== undefined ? filters.searchDate : searchDate;

      const params = {};
      if (activeKeyword.trim()) params.keyword = activeKeyword.trim();
      if (activeDate) params.date = activeDate;

      const hasFilters = Boolean(params.keyword || params.date);
      const url = hasFilters ? "/diary/search" : "/diary";

      const res = await API.get(url, { params });
      const data = res.data || [];
      setEntries(data);

      if (data.length > 0) {
        if (!selectedId || !data.some((entry) => entry._id === selectedId)) {
          loadEntryIntoEditor(data[0]);
        }
      } else {
        startNewDiary();
      }
    } catch (err) {
      console.error("Error fetching diary entries:", err);
      setError(err.response?.data?.message || "Could not load diaries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries({ keyword: "", searchDate: "" });
    initialFetchDone.current = true;
  }, []);

  useEffect(() => {
    if (!initialFetchDone.current) return;

    const timeout = setTimeout(() => {
      fetchEntries();
    }, 350);

    return () => clearTimeout(timeout);
  }, [keyword, searchDate]);

  const loadEntryIntoEditor = (entry) => {
    setSelectedId(entry._id);
    setTitle(entry.title || "Untitled Diary");
    contentRef.current = entry.content || "";
    dirtyRef.current = false;
    setHasUnsavedChanges(false);
    setLastSavedAt(entry.updatedAt || entry.createdAt || null);
    if (editorRef.current) {
      editorRef.current.innerHTML = entry.content || "";
    }
  };

  const startNewDiary = () => {
    if (dirtyRef.current && selectedId) {
      handleSave({ silent: true });
    }

    setSelectedId(null);
    setTitle("");
    contentRef.current = "";
    dirtyRef.current = false;
    setHasUnsavedChanges(false);
    setLastSavedAt(null);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      editorRef.current.focus();
    }
    setSidebarOpen(false);
  };

  const handleSelectEntry = async (entry) => {
    if (entry._id === selectedId) {
      setSidebarOpen(false);
      return;
    }

    if (dirtyRef.current && (title.trim() || contentRef.current.trim())) {
      await handleSave({ silent: true });
    }

    loadEntryIntoEditor(entry);
    setSidebarOpen(false);
  };

  const handleCreateDiary = async () => {
    try {
      setCreating(true);
      setError("");

      if (dirtyRef.current && selectedId) {
        await handleSave({ silent: true });
      }

      const res = await API.post("/diary", {
        title: "Untitled Diary",
        content: "",
      });

      const created = res.data;
      setEntries((prev) => [created, ...prev]);
      loadEntryIntoEditor(created);
    } catch (err) {
      console.error("Create diary error:", err);
      setError(err.response?.data?.message || "Could not create diary.");
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async ({ silent = false } = {}) => {
    const currentTitle = title.trim() || "Untitled Diary";
    const currentContent = contentRef.current || "";

    if (!currentTitle && !currentContent) return;

    try {
      if (!silent) setSaving(true);
      setError("");

      const payload = {
        title: currentTitle,
        content: currentContent,
      };

      let saved;
      if (selectedId) {
        const res = await API.patch(`/diary/${selectedId}`, payload);
        saved = res.data;
      } else {
        const res = await API.post("/diary", payload);
        saved = res.data;
        setSelectedId(saved._id);
      }

      setEntries((prev) => {
        const filtered = prev.filter((e) => e._id !== saved._id);
        return [saved, ...filtered];
      });

      dirtyRef.current = false;
      setHasUnsavedChanges(false);
      setLastSavedAt(saved.updatedAt || new Date());
    } catch (err) {
      console.error("Error saving diary:", err);
      if (!silent) {
        setError(err.response?.data?.message || "Could not save diary.");
      }
    } finally {
      if (!silent) setSaving(false);
    }
  };

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      handleSave({ silent: true });
    }, 1500);

    return () => clearTimeout(autosaveRef.current);
  }, [hasUnsavedChanges, title]);

  const handleDelete = async () => {
    if (!selectedId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this diary entry? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await API.delete(`/diary/${selectedId}`);
      const remaining = entries.filter((entry) => entry._id !== selectedId);
      setEntries(remaining);

      if (remaining.length > 0) {
        loadEntryIntoEditor(remaining[0]);
      } else {
        startNewDiary();
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Could not delete diary.");
    } finally {
      setDeleting(false);
    }
  };

  const runEditorCommand = (command, value = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    contentRef.current = editorRef.current.innerHTML;
    dirtyRef.current = true;
    setHasUnsavedChanges(true);
  };

  const insertEmoji = (emoji) => {
    runEditorCommand("insertText", emoji);
    setEmojiOpen(false);
  };

  const handleAutoFormat = () => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    html = html
      .replace(/&nbsp;/g, " ")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/(<div><br\s*\/?>\s*<\/div>){3,}/gi, "<div><br></div><div><br></div>")
      .replace(/(<p><br\s*\/?>\s*<\/p>){3,}/gi, "<p><br></p><p><br></p>")
      .trim();

    editorRef.current.innerHTML = html;
    contentRef.current = html;
    setTitle((prev) => prev.trim() || "Untitled Diary");
    dirtyRef.current = true;
    setHasUnsavedChanges(true);
  };

  const executeFind = (forward = true) => {
    const term = diaryFindTerm.trim();
    if (!term || !editorRef.current) {
      setTotalMatches(0);
      return;
    }

    const matches = findMatchesInElement(editorRef.current, term);
    setTotalMatches(matches.length);

    if (matches.length === 0) return;

    let nextIndex = forward ? matchIndex + 1 : matchIndex - 1;
    if (nextIndex >= matches.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = matches.length - 1;
    setMatchIndex(nextIndex);

    const match = matches[nextIndex];
    const range = document.createRange();
    range.setStart(match.node, match.start);
    range.setEnd(match.node, match.end);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    match.node.parentElement?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const clearSearch = () => {
    setKeyword("");
    setSearchDate("");
    fetchEntries({ keyword: "", searchDate: "" });
  };

  // Sidebar Component
  const renderSidebar = () => (
    <aside
      className={`h-full ${theme.sidebarBg} border-r ${theme.sidebarBorder} flex flex-col transition-colors duration-300`}
    >
      <div className={`p-4 border-b ${theme.sidebarBorder}`}>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className={`text-base font-bold font-serif ${theme.textPrimary}`}>
              My Journal
            </h2>
            <p className={`text-xs ${theme.textMuted}`}>{entries.length} preserved entries</p>
          </div>
          <button
            onClick={handleCreateDiary}
            disabled={creating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${theme.btnAccent} disabled:opacity-50 transition`}
            aria-label="Create new diary entry"
          >
            <FiPlus size={14} /> New
          </button>
        </div>

        <div className="space-y-2">
          <div
            className={`flex items-center gap-2 ${theme.inputBg} px-3 py-2 rounded-xl border text-xs`}
          >
            <FiSearch className="text-slate-400 shrink-0" />
            <input
              className={`bg-transparent outline-none w-full ${theme.textPrimary} placeholder:text-slate-400`}
              placeholder="Search journals..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div
            className={`flex items-center gap-2 ${theme.inputBg} px-3 py-2 rounded-xl border text-xs`}
          >
            <FiCalendar className="text-slate-400 shrink-0" />
            <input
              type="date"
              className={`bg-transparent outline-none w-full ${theme.textPrimary}`}
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          {(keyword || searchDate) && (
            <button
              onClick={clearSearch}
              className={`w-full py-1 rounded-lg ${theme.badgeBg} text-xs font-semibold hover:opacity-80 transition`}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
        {entries.map((entry) => (
          <button
            key={entry._id}
            onClick={() => handleSelectEntry(entry)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${
              selectedId === entry._id
                ? `${theme.cardActive} shadow-xs`
                : `border-transparent ${theme.cardHover} opacity-90`
            }`}
          >
            <div className="flex items-start gap-2.5">
              <FiFileText
                className={`mt-0.5 shrink-0 ${
                  selectedId === entry._id ? "text-amber-600" : theme.textMuted
                }`}
                size={15}
              />
              <div className="min-w-0 flex-1">
                <p className={`font-semibold text-xs truncate ${theme.textPrimary}`}>
                  {entry.title || "Untitled Diary"}
                </p>
                <p className={`text-[11px] ${theme.textMuted} mt-0.5`}>
                  {moment(entry.updatedAt || entry.createdAt).format("MMM D, YYYY · h:mm A")}
                </p>
                <p className={`text-xs ${theme.textSecondary} truncate mt-1 line-clamp-1`}>
                  {stripHtml(entry.content) || "Empty reflection..."}
                </p>
              </div>
            </div>
          </button>
        ))}

        {!entries.length && (
          <div className={`text-center text-xs ${theme.textMuted} py-12 px-4`}>
            {loading ? "Loading entries..." : "No entries found. Click New to begin writing."}
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div
      className={`min-h-[calc(100vh-65px)] ${theme.bodyBg} transition-colors duration-300 font-sans`}
    >
      {/* Mobile Top Navigation */}
      <div
        className={`lg:hidden sticky top-[57px] z-30 ${theme.sidebarBg} border-b ${theme.sidebarBorder} px-4 py-2.5 flex items-center justify-between shadow-xs`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${theme.btnAccent}`}
        >
          <FiMenu /> Entries ({entries.length})
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZenMode((v) => !v)}
            className={`p-2 rounded-lg ${theme.btnSecondary} text-xs font-semibold`}
            title="Toggle Zen Mode"
          >
            {zenMode ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
          </button>
          <button
            onClick={handleCreateDiary}
            disabled={creating}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${theme.btnAccent} disabled:opacity-50`}
          >
            <FiPlus /> New
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-[85vw] max-w-sm h-full shadow-2xl bg-white">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 z-10 p-1.5 rounded-full bg-white text-slate-700 shadow border border-slate-200"
              aria-label="Close sidebar"
            >
              <FiX />
            </button>
            {renderSidebar()}
          </div>
        </div>
      )}

      {/* Main Grid: Sidebar + Writing Canvas */}
      <div
        className={`max-w-7xl mx-auto transition-all ${
          zenMode
            ? "max-w-4xl"
            : "lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:h-[calc(100vh-65px)]"
        }`}
      >
        {!zenMode && (
          <div className="hidden lg:block overflow-hidden border-r border-stone-200/50">
            {renderSidebar()}
          </div>
        )}

        <main
          className={`p-3 sm:p-6 lg:p-8 overflow-y-auto transition-all ${
            zenMode ? "py-6 sm:py-10" : ""
          }`}
        >
          <div
            className={`max-w-3xl mx-auto ${theme.sheetBg} rounded-3xl ${theme.sheetBorder} border ${theme.sheetShadow} p-5 sm:p-10 transition-all duration-300`}
          >
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
                  <FiX />
                </button>
              </div>
            )}

            {/* TOP CONTROLS & PALETTE SWITCHER BAR */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b ${theme.divider}`}
            >
              <div className="flex items-center flex-wrap gap-2 text-xs">
                {/* Theme Selector Pill Group */}
                <div
                  className={`inline-flex items-center p-1 rounded-xl border ${theme.divider} ${theme.sidebarBg}`}
                  title="Switch Visual Atmosphere"
                >
                  <FiDroplet size={13} className="mr-1.5 ml-1 text-amber-600" />
                  {Object.keys(THEMES).map((key) => (
                    <button
                      key={key}
                      onClick={() => setThemeKey(key)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                        themeKey === key
                          ? `${theme.btnAccent} scale-102`
                          : `${theme.textSecondary} hover:${theme.textPrimary}`
                      }`}
                    >
                      {THEMES[key].name.split(" ")[1]}
                    </button>
                  ))}
                </div>

                {/* Font Selector */}
                <div
                  className={`inline-flex items-center p-1 rounded-xl border ${theme.divider} ${theme.sidebarBg}`}
                  title="Switch Reading Typography"
                >
                  <FiType size={13} className="mr-1.5 ml-1 text-slate-500" />
                  <button
                    onClick={() => setFontFamily("serif")}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-serif transition-all ${
                      fontFamily === "serif"
                        ? `${theme.btnAccent}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    Serif
                  </button>
                  <button
                    onClick={() => setFontFamily("sans")}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-sans transition-all ${
                      fontFamily === "sans"
                        ? `${theme.btnAccent}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    Sans
                  </button>
                  <button
                    onClick={() => setFontFamily("mono")}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                      fontFamily === "mono"
                        ? `${theme.btnAccent}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    Mono
                  </button>
                </div>

                {/* Paper Style Selector */}
                <div
                  className={`inline-flex items-center p-1 rounded-xl border ${theme.divider} ${theme.sidebarBg}`}
                  title="Switch Paper Ruling"
                >
                  <button
                    onClick={() => setPaperStyle("ruled")}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                      paperStyle === "ruled"
                        ? `${theme.btnAccent}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    Ruled
                  </button>
                  <button
                    onClick={() => setPaperStyle("dotted")}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                      paperStyle === "dotted"
                        ? `${theme.btnAccent}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    Dotted
                  </button>
                  <button
                    onClick={() => setPaperStyle("blank")}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                      paperStyle === "blank"
                        ? `${theme.btnAccent}`
                        : `${theme.textSecondary}`
                    }`}
                  >
                    Clean
                  </button>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-xs flex items-center gap-1.5 mr-1">
                  {saving ? (
                    <span className="text-amber-600 flex items-center gap-1 font-semibold text-[11px]">
                      <FiClock className="animate-spin" /> Saving...
                    </span>
                  ) : hasUnsavedChanges ? (
                    <span className="text-amber-700 flex items-center gap-1 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Unsaved
                    </span>
                  ) : lastSavedAt ? (
                    <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-medium">
                      <FiCheck className="text-emerald-600" /> Saved {moment(lastSavedAt).format("h:mm A")}
                    </span>
                  ) : null}
                </div>

                {/* Zen Mode Button */}
                <button
                  type="button"
                  onClick={() => setZenMode((v) => !v)}
                  className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border ${theme.divider} ${theme.btnSecondary} text-xs font-semibold transition`}
                  title={zenMode ? "Exit Zen Mode" : "Focus / Zen Mode"}
                >
                  {zenMode ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
                  <span>{zenMode ? "Exit Zen" : "Zen"}</span>
                </button>

                <button
                  onClick={handleDelete}
                  disabled={!selectedId || deleting}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30 transition"
                  title="Delete entry"
                >
                  <FiTrash2 size={15} />
                </button>

                <button
                  onClick={() => handleSave()}
                  disabled={saving || (!title.trim() && !contentRef.current.trim())}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${theme.btnAccent} disabled:opacity-40 transition`}
                >
                  <FiSave size={14} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* DATE & READING STATS BAR */}
            <div className="flex items-center justify-between text-xs mb-3">
              <div className={`flex items-center gap-2 font-medium ${theme.textSecondary}`}>
                <FiCalendar className="text-amber-600" />
                <span className="font-serif font-semibold">
                  {moment(writingDate).format("dddd, MMMM D, YYYY")}
                </span>
              </div>

              <div className={`flex items-center gap-2 text-[11px] ${theme.textMuted}`}>
                <span>{stats.words} words</span>
                <span>•</span>
                <span>{stats.readMinutes} min read</span>
              </div>
            </div>

            {/* DIARY TITLE INPUT */}
            <input
              className={`w-full bg-transparent border-none outline-none text-2xl sm:text-3xl md:text-4xl ${getFontClass()} font-bold ${theme.textPrimary} placeholder:${theme.textMuted} mb-3`}
              placeholder="Title of this reflection..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                dirtyRef.current = true;
                setHasUnsavedChanges(true);
              }}
            />

            {/* IN-DIARY SEARCH TOOLBAR */}
            <div
              className={`mb-4 flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border ${theme.divider} ${theme.sidebarBg} p-2 text-xs`}
            >
              <div
                className={`flex flex-1 items-center gap-2 bg-white/90 rounded-lg px-2.5 py-1.5 border ${theme.divider}`}
              >
                <FiSearch className="text-slate-400 shrink-0" />
                <input
                  className="w-full bg-transparent outline-none text-xs text-slate-800 placeholder:text-slate-400"
                  placeholder="Search in this diary..."
                  value={diaryFindTerm}
                  onChange={(e) => {
                    setDiaryFindTerm(e.target.value);
                    if (editorRef.current && e.target.value.trim()) {
                      const matches = findMatchesInElement(editorRef.current, e.target.value.trim());
                      setTotalMatches(matches.length);
                      setMatchIndex(0);
                    } else {
                      setTotalMatches(0);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      executeFind(!e.shiftKey);
                    }
                  }}
                />
              </div>

              {diaryFindTerm.trim() && (
                <div className="flex items-center gap-2 px-1">
                  <span className={`text-[11px] font-semibold ${theme.textSecondary}`}>
                    {totalMatches > 0
                      ? `${matchIndex + 1} of ${totalMatches}`
                      : "No matches"}
                  </span>
                  <button
                    type="button"
                    onClick={() => executeFind(false)}
                    disabled={totalMatches === 0}
                    className={`p-1 rounded bg-white border ${theme.divider} ${theme.textPrimary} disabled:opacity-30`}
                    title="Previous match"
                  >
                    <FiChevronLeft size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeFind(true)}
                    disabled={totalMatches === 0}
                    className={`p-1 rounded bg-white border ${theme.divider} ${theme.textPrimary} disabled:opacity-30`}
                    title="Next match"
                  >
                    <FiChevronRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* RICH TEXT FORMATTING TOOLBAR */}
            <div
              className={`mb-5 flex flex-wrap items-center gap-1 sm:gap-1.5 rounded-2xl border ${theme.divider} ${theme.sidebarBg} p-2 shadow-2xs backdrop-blur-xs`}
            >
              <button
                type="button"
                onClick={() => runEditorCommand("undo")}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Undo"
              >
                <FiRotateCcw className="sm:hidden" />
                <span className="hidden sm:inline">Undo</span>
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("redo")}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Redo"
              >
                <FiRotateCw className="sm:hidden" />
                <span className="hidden sm:inline">Redo</span>
              </button>

              <span className={`h-4 w-px ${theme.divider} mx-1`} />

              <button
                type="button"
                onClick={() => runEditorCommand("bold")}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-bold ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Bold"
              >
                <FiBold />
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("italic")}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs italic ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Italic"
              >
                <FiItalic />
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("underline")}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs underline ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Underline"
              >
                <FiUnderline />
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("backColor", "#fef08a")}
                className="px-2 py-1 rounded-lg text-[11px] font-bold text-yellow-900 bg-yellow-100 hover:bg-yellow-200 transition"
                title="Highlight"
              >
                Highlight
              </button>

              <span className={`h-4 w-px ${theme.divider} mx-1`} />

              {/* Ink Color Swatches */}
              <button
                type="button"
                onClick={() => runEditorCommand("foreColor", theme.id === "midnight" ? "#f1f5f9" : "#1c1917")}
                className={`w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition ${
                  theme.id === "midnight" ? "bg-slate-100" : "bg-stone-900"
                }`}
                title="Default Ink"
              />
              <button
                type="button"
                onClick={() => runEditorCommand("foreColor", "#dc2626")}
                className="w-4 h-4 rounded-full bg-red-600 border border-red-300 hover:scale-110 transition"
                title="Red Ink"
              />
              <button
                type="button"
                onClick={() => runEditorCommand("foreColor", "#2563eb")}
                className="w-4 h-4 rounded-full bg-blue-600 border border-blue-300 hover:scale-110 transition"
                title="Blue Ink"
              />
              <button
                type="button"
                onClick={() => runEditorCommand("foreColor", "#15803d")}
                className="w-4 h-4 rounded-full bg-emerald-600 border border-emerald-300 hover:scale-110 transition"
                title="Green Ink"
              />

              <span className={`h-4 w-px ${theme.divider} mx-1`} />

              <button
                type="button"
                onClick={() => runEditorCommand("insertUnorderedList")}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Bullet List"
              >
                <FiList />
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("formatBlock", "h2")}
                className={`px-2 py-1 rounded-lg text-xs font-serif font-bold ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Heading"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("formatBlock", "p")}
                className={`px-2 py-1 rounded-lg text-xs ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                title="Paragraph"
              >
                P
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("insertText", "⭐ Important: ")}
                className={`hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${theme.badgeBg} transition`}
                title="Insert callout"
              >
                Important
              </button>

              {/* Emoji Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setEmojiOpen((v) => !v)}
                  className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold ${theme.textSecondary} hover:${theme.textPrimary} transition`}
                  title="Insert emoji"
                >
                  <FiSmile /> <span className="hidden sm:inline">Emoji</span>
                </button>
                {emojiOpen && (
                  <div className="absolute left-0 sm:right-0 top-9 z-20 grid w-56 grid-cols-8 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="rounded-lg p-1.5 text-base hover:bg-slate-100 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleAutoFormat}
                className={`ml-auto px-2.5 py-1 rounded-lg ${theme.badgeBg} text-xs font-semibold hover:opacity-80 transition`}
                title="Auto format and clean up whitespace"
              >
                Auto Format
              </button>
            </div>

            {/* TACTILE WRITING CANVAS */}
            <div
              className={`relative rounded-2xl border ${theme.sheetBorder} p-6 sm:p-10 transition-all duration-300`}
              style={getPaperBackground()}
            >
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Dear Diary, reflect on your moments, progress, and thoughts..."
                className={`min-h-[500px] w-full bg-transparent text-lg ${getFontClass()} ${
                  theme.textPrimary
                } outline-none empty:before:opacity-35 empty:before:content-[attr(data-placeholder)] empty:before:pointer-events-none border-l-2 ${
                  theme.marginGuide
                } pl-4 sm:pl-7 focus:border-opacity-100 transition-colors`}
                onInput={(e) => {
                  contentRef.current = e.currentTarget.innerHTML;
                  dirtyRef.current = true;
                  setHasUnsavedChanges(true);
                }}
                onBlur={() => {
                  if (dirtyRef.current) {
                    handleSave({ silent: true });
                  }
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyDiary;
