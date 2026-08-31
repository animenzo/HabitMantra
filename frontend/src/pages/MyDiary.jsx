import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import API from "../services/api";
import {
  FiCalendar,
  FiCheckCircle,
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
} from "react-icons/fi";

const linedPaperStyle = {
  backgroundImage:
    "linear-gradient(transparent, transparent 31px, rgba(217, 119, 6, 0.18) 31px)",
  backgroundSize: "100% 32px",
  lineHeight: "32px",
};

const PAGE_BODY_HEIGHT = 560;
const EMOJIS = ["😊", "😂", "🥲", "😍", "😌", "😤", "🙏", "💪", "✨", "🌙", "☀️", "❤️", "🔥", "🌱", "🎯", "⭐"];

const diaryRequest = async (request) => {
  try {
    return await request("/diary");
  } catch (err) {
    if (err.response?.status === 404) {
      return request("/diaries");
    }

    throw err;
  }
};

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const MyDiary = () => {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [diaryPages, setDiaryPages] = useState([""]);
  const [diaryFindTerm, setDiaryFindTerm] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const pageMeasureRef = useRef(null);
  const pageWidthRef = useRef(null);
  const pageRefs = useRef([]);
  const autosaveRef = useRef(null);
  const typingRef = useRef(false);
  const paginationTimeoutRef = useRef(null);
  const contentRef = useRef("");
  const dirtyRef = useRef(false);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry._id === selectedId),
    [entries, selectedId],
  );

  const writingDate = selectedEntry?.createdAt || new Date();
  const diaryFindCount = useMemo(() => {
    const term = diaryFindTerm.trim().toLowerCase();
    if (!term) return 0;

    return stripHtml(content)
      .toLowerCase()
      .split(term)
      .length - 1;
  }, [content, diaryFindTerm]);

  const paginateContentByHeight = (text) => {
    const measurer = pageMeasureRef.current;
    if (!measurer || !text) return [""];

    const pages = [];
    let remainingText = text;

    while (remainingText.length) {
      let low = 1;
      let high = remainingText.length;
      let bestFit = 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        measurer.innerHTML = remainingText.slice(0, mid) || " ";

        if (measurer.scrollHeight <= PAGE_BODY_HEIGHT) {
          bestFit = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      let splitIndex = bestFit;

      if (bestFit < remainingText.length) {
        const candidate = remainingText.slice(0, bestFit);
        const newlineIndex = candidate.lastIndexOf("\n");
        const spaceIndex = candidate.lastIndexOf(" ");
        const wordBoundary = Math.max(newlineIndex, spaceIndex);

        if (wordBoundary > bestFit * 0.65) {
          splitIndex = wordBoundary + 1;
        }
      }

      pages.push(remainingText.slice(0, splitIndex));
      remainingText = remainingText.slice(splitIndex);
    }

    return pages.length ? pages : [""];
  };

  const updatePageContent = (pageIndex, pageContent, { commit = false } = {}) => {
    const nextPages = [...diaryPages];
    nextPages[pageIndex] = pageContent;
    const nextContent = nextPages.join("");
    contentRef.current = nextContent;
    dirtyRef.current = true;

    if (commit) {
      setContent(nextContent);
      setHasUnsavedChanges(true);
    }
  };

  const runEditorCommand = (command, value = null) => {
    const activePage = pageRefs.current[activePageIndex];
    if (!activePage) return;

    activePage.focus();
    document.execCommand(command, false, value);
    updatePageContent(activePageIndex, activePage.innerHTML);
  };

  const insertEmoji = (emoji) => {
    runEditorCommand("insertText", emoji);
    setEmojiOpen(false);
  };

  const findInDiary = (backwards = false) => {
    const term = diaryFindTerm.trim();
    if (!term) return;

    const editor = pageWidthRef.current;
    if (editor) {
      editor.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.find(term, false, backwards, true, false, false, false);
  };

  const autoFormatContent = () => {
    const formattedContent = content
      .replace(/&nbsp;/g, " ")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/(<div><br><\/div>){3,}/g, "<div><br></div><div><br></div>")
      .trim();

    setContent(formattedContent);
    setTitle(title.trim() || "Untitled Diary");
    setHasUnsavedChanges(true);
  };

  const fetchEntries = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (filters.keyword ?? keyword) params.keyword = filters.keyword ?? keyword;
      if (filters.searchDate ?? searchDate) params.date = filters.searchDate ?? searchDate;

      const hasFilters = params.keyword || params.date;
      const res = await diaryRequest((basePath) =>
        API.get(hasFilters ? `${basePath}/search` : basePath, { params }),
      );
      setEntries(res.data);

      if (res.data.length && !res.data.some((entry) => entry._id === selectedId)) {
        selectEntry(res.data[res.data.length - 1]);
      }

      if (!res.data.length) {
        startNewDiary();
      }
    } catch (err) {
      console.error("Error fetching diary entries:", err);
      setError(err.response?.data?.message || "Could not load diaries.");
    } finally {
      setLoading(false);
    }
  };

  const selectEntry = (entry) => {
    setSelectedId(entry._id);
    setTitle(entry.title || "Untitled Diary");
    contentRef.current = entry.content || "";
    dirtyRef.current = false;
    setContent(entry.content || "");
    setLastSavedAt(entry.updatedAt || entry.createdAt || null);
    setHasUnsavedChanges(false);
    setSidebarOpen(false);
  };

  const startNewDiary = () => {
    setSelectedId(null);
    setTitle("");
    contentRef.current = "";
    dirtyRef.current = false;
    setContent("");
    setLastSavedAt(null);
    setHasUnsavedChanges(false);
    setSidebarOpen(false);
  };

  const handleCreateDiary = async () => {
    try {
      setCreating(true);
      setError("");

      const res = await diaryRequest((basePath) =>
        API.post(basePath, {
          title: "Untitled Diary",
          content: "",
        }),
      );

      const createdDiary = res.data;
      setEntries((currentEntries) => [createdDiary, ...currentEntries]);
      selectEntry(createdDiary);
    } catch (err) {
      console.error("Create diary error:", err);
      setError(err.response?.data?.message || "Could not create diary.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchEntries({ keyword: "", searchDate: "" });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEntries();
    }, 350);

    return () => clearTimeout(timeout);
  }, [keyword, searchDate]);

  useEffect(() => {
    if (selectedEntry) {
      setTitle(selectedEntry.title || "Untitled Diary");
      contentRef.current = selectedEntry.content || "";
      dirtyRef.current = false;
      setContent(selectedEntry.content || "");
      setLastSavedAt(selectedEntry.updatedAt || selectedEntry.createdAt || null);
      setHasUnsavedChanges(false);
    }
  }, [selectedEntry]);

  useLayoutEffect(() => {
    if (typingRef.current) return;
    setDiaryPages(paginateContentByHeight(content));
  }, [content]);

  useEffect(() => {
    if (!pageWidthRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (typingRef.current) return;
      setDiaryPages(paginateContentByHeight(content));
    });

    resizeObserver.observe(pageWidthRef.current);
    return () => resizeObserver.disconnect();
  }, [content]);

  const schedulePagination = () => {
    clearTimeout(paginationTimeoutRef.current);
    paginationTimeoutRef.current = setTimeout(() => {
      typingRef.current = false;
      setContent(contentRef.current);
      setHasUnsavedChanges(dirtyRef.current);
      setDiaryPages(paginateContentByHeight(contentRef.current));
    }, 900);
  };

  useEffect(() => {
    if (!selectedId || !hasUnsavedChanges) return;

    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      handleSave({ silent: true });
    }, 1200);

    return () => clearTimeout(autosaveRef.current);
  }, [selectedId, title, content, hasUnsavedChanges]);

  const handleSearch = () => {
    fetchEntries();
  };

  const clearSearch = () => {
    setKeyword("");
    setSearchDate("");
    fetchEntries({ keyword: "", searchDate: "" });
  };

  const handleSave = async ({ silent = false } = {}) => {
    if (!title.trim() && !content.trim()) return;

    try {
      if (!silent) setSaving(true);
      const payload = {
        title: title.trim() || "Untitled Diary",
        content: contentRef.current,
      };

      const res = selectedId
        ? await diaryRequest((basePath) =>
            API.patch(`${basePath}/${selectedId}`, payload),
          )
        : await diaryRequest((basePath) => API.post(basePath, payload));

      const savedDiary = res.data;
      setEntries((currentEntries) => {
        const withoutSaved = currentEntries.filter((entry) => entry._id !== savedDiary._id);
        return [savedDiary, ...withoutSaved];
      });
      setSelectedId(savedDiary._id);
      setTitle(savedDiary.title || "Untitled Diary");
      contentRef.current = savedDiary.content || "";
      dirtyRef.current = false;
      setContent(savedDiary.content || "");
      setLastSavedAt(savedDiary.updatedAt || new Date());
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error saving diary:", err);
      if (!silent) {
        setError(err.response?.data?.message || "Could not save diary.");
      }
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setError("");
      await diaryRequest((basePath) => API.delete(`${basePath}/${selectedId}`));
      const nextEntries = entries.filter((entry) => entry._id !== selectedId);
      setEntries(nextEntries);

      if (nextEntries.length) {
        selectEntry(nextEntries[nextEntries.length - 1]);
      } else {
        startNewDiary();
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Could not delete diary.");
    }
  };

  const renderSidebar = () => (
    <aside className="h-full bg-white border-r border-amber-100 flex flex-col">
      <div className="p-4 border-b border-amber-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-amber-900">My Diaries</h2>
            <p className="text-xs text-gray-500">{entries.length} saved files</p>
          </div>
          <button
            onClick={handleCreateDiary}
            disabled={creating}
            className="p-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed"
            aria-label="Create new diary"
          >
            <FiPlus />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
            <FiSearch className="text-amber-700" />
            <input
              className="bg-transparent outline-none text-sm w-full text-gray-700"
              placeholder="Search keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
            <FiCalendar className="text-amber-700" />
            <input
              type="date"
              className="bg-transparent outline-none text-sm w-full text-gray-700"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 py-2 rounded-lg bg-amber-700 text-white text-sm hover:bg-amber-800"
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {entries.map((entry) => (
          <button
            key={entry._id}
            onClick={() => selectEntry(entry)}
            className={`w-full text-left p-3 rounded-xl border transition ${
              selectedId === entry._id
                ? "bg-amber-100 border-amber-300"
                : "bg-white border-gray-100 hover:bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <FiFileText className="mt-1 text-amber-700 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {entry.title || "Untitled Diary"}
                </p>
                <p className="text-xs text-gray-500">
                  {moment(entry.updatedAt || entry.createdAt).format("MMM D, YYYY")}
                </p>
                <p className="text-xs text-gray-400 truncate mt-1">{stripHtml(entry.content)}</p>
              </div>
            </div>
          </button>
        ))}

        {!entries.length && (
          <div className="text-center text-sm text-gray-400 py-10">
            {loading ? "Loading diaries..." : "No diaries found. Create your first one."}
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-br from-amber-50 via-gray-50 to-indigo-50">
      <div className="lg:hidden sticky top-[57px] z-30 bg-white/90 backdrop-blur border-b border-amber-100 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-700 text-white"
        >
          <FiMenu /> Diaries
        </button>
        <button
          onClick={handleCreateDiary}
          disabled={creating}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          <FiPlus /> {creating ? "Creating..." : "New"}
        </button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close diary sidebar overlay"
          />
          <div className="relative w-[86vw] max-w-sm h-full shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 z-10 p-2 rounded-full bg-white text-gray-600 shadow"
              aria-label="Close diary sidebar"
            >
              <FiX />
            </button>
            {renderSidebar()}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:h-[calc(100vh-65px)]">
        <div className="hidden lg:block overflow-hidden">
          {renderSidebar()}
        </div>

        <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-[#fdfbf7] rounded-3xl shadow-xl border border-amber-100 p-5 sm:p-8">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-amber-800">
                <FiEdit3 />
                <span className="text-sm font-semibold">
                  {selectedId ? "Editing diary" : "New diary"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={!selectedId}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 disabled:text-gray-300 disabled:bg-gray-100 hover:bg-red-100"
                >
                  <FiTrash2 /> Delete
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || (!title.trim() && !content.trim())}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 text-white disabled:bg-amber-300 disabled:cursor-not-allowed hover:bg-amber-800"
                >
                  <FiSave /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            <input
              className="w-full bg-transparent border-none outline-none text-3xl sm:text-4xl font-serif text-amber-950 placeholder:text-amber-900/30 mb-4"
              placeholder="Diary name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
            />

            <div className="mb-3 flex flex-col gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-indigo-100">
                <FiSearch className="text-indigo-500" />
                <input
                  className="w-full bg-transparent text-sm text-gray-700 outline-none"
                  placeholder="Find inside this diary..."
                  value={diaryFindTerm}
                  onChange={(e) => setDiaryFindTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      findInDiary(e.shiftKey);
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-indigo-700">
                  {diaryFindTerm.trim() ? `${diaryFindCount} found` : "Type and press Enter"}
                </span>
                <button
                  type="button"
                  onClick={() => findInDiary(true)}
                  disabled={!diaryFindTerm.trim()}
                  className="rounded-lg bg-white p-2 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 disabled:text-gray-300"
                  aria-label="Previous match"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => findInDiary(false)}
                  disabled={!diaryFindTerm.trim()}
                  className="rounded-lg bg-white p-2 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100 disabled:text-gray-300"
                  aria-label="Next match"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-amber-100 bg-white/70 p-2 shadow-sm">
              <button
                type="button"
                onClick={() => runEditorCommand("undo")}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-100"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("redo")}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-100"
              >
                Redo
              </button>
              <span className="h-7 w-px bg-amber-100" />
              <button
                type="button"
                onClick={() => runEditorCommand("bold")}
                className="rounded-lg px-3 py-2 text-sm font-bold text-gray-700 hover:bg-amber-100"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("italic")}
                className="rounded-lg px-3 py-2 text-sm italic text-gray-700 hover:bg-amber-100"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("underline")}
                className="rounded-lg px-3 py-2 text-sm underline text-gray-700 hover:bg-amber-100"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("backColor", "#fef08a")}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-yellow-100"
              >
                Highlight
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("insertText", "⭐ Important: ")}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-100"
              >
                Important
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("foreColor", "#dc2626")}
                className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Red
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("foreColor", "#2563eb")}
                className="rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
              >
                Blue
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("foreColor", "#15803d")}
                className="rounded-lg px-3 py-2 text-sm text-green-700 hover:bg-green-50"
              >
                Green
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("insertUnorderedList")}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-100"
              >
                Bullet
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("insertOrderedList")}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-100"
              >
                Numbered
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("formatBlock", "h2")}
                className="rounded-lg px-3 py-2 text-sm font-serif text-gray-700 hover:bg-amber-100"
              >
                Heading
              </button>
              <button
                type="button"
                onClick={() => runEditorCommand("formatBlock", "p")}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-100"
              >
                Normal
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setEmojiOpen((value) => !value)}
                  className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-100"
                >
                  Emoji
                </button>
                {emojiOpen && (
                  <div className="absolute right-0 top-11 z-20 grid w-56 grid-cols-8 gap-1 rounded-xl border border-amber-100 bg-white p-2 shadow-xl">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="rounded-lg p-2 text-lg hover:bg-amber-50"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={autoFormatContent}
                className="ml-auto rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
              >
                Auto Format
              </button>
            </div>

            <div ref={pageWidthRef} className="relative space-y-6">
              <div
                ref={pageMeasureRef}
                className="pointer-events-none invisible absolute left-0 top-0 w-full whitespace-pre-wrap break-words bg-transparent text-lg text-gray-800"
                style={{
                  ...linedPaperStyle,
                  lineHeight: "32px",
                  padding: 0,
                }}
                aria-hidden="true"
              />

              {diaryPages.map((pageContent, pageIndex) => (
                <section
                  key={pageIndex}
                  className="relative min-h-[680px] rounded-2xl border border-amber-100 bg-[#fffdf7] px-5 py-6 shadow-sm sm:px-8"
                >
                  <div className="mb-5 flex items-center justify-between border-b border-amber-100 pb-3 text-sm text-amber-800">
                    <span className="font-serif">
                      {moment(writingDate).format("MMMM D, YYYY")}
                    </span>
                    <span className="font-medium">Page {pageIndex + 1}</span>
                  </div>

                  <div
                    ref={(element) => {
                      pageRefs.current[pageIndex] = element;
                    }}
                    className="h-[560px] w-full overflow-hidden bg-transparent text-lg text-gray-800 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
                    style={linedPaperStyle}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder={pageIndex === 0 ? "Dear Diary..." : ""}
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                    onFocus={() => {
                      typingRef.current = true;
                      setActivePageIndex(pageIndex);
                    }}
                    onClick={() => setActivePageIndex(pageIndex)}
                    onInput={(e) => {
                      typingRef.current = true;
                      updatePageContent(pageIndex, e.currentTarget.innerHTML);
                      schedulePagination();
                    }}
                    onBlur={() => {
                      typingRef.current = false;
                      setContent(contentRef.current);
                      setHasUnsavedChanges(dirtyRef.current);
                      setDiaryPages(paginateContentByHeight(contentRef.current));
                    }}
                  />

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-amber-700/60">
                    {pageIndex + 1}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyDiary;
