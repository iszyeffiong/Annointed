import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  FileText,
  Key,
  Layers,
  Lock,
  LogOut,
  MessageSquare,
  Newspaper,
  Plus,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  approveBlogPost,
  approveComment,
  approveCommentsBulk,
  deleteBlogPost,
  deleteComment,
  deleteCommentsBulk,
  getAllBlogPosts,
  getStoredBlogPosts,
  getStoredComments,
  isAdminAuthenticated,
  isCommentApprovalRequired,
  loginAdmin,
  logoutAdmin,
  rejectBlogPost,
  resetBlogPosts,
  saveBlogPost,
  setCommentApprovalRequired,
  updateBlogPost,
  type BlogComment,
  type BlogPost,
  type BlogPostStatus,
} from "@/lib/blog-storage";
import {
  addRestrictedWord,
  getRestrictedWordList,
  removeRestrictedWord,
  resetRestrictedWords,
  validateSchoolSafeContent,
  type ContentCheckResult,
} from "@/lib/content-moderator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & Faculty Portal — Annointed Chronicle" },
      {
        name: "description",
        content: "Faculty and teacher login to review pending student/parent submissions, publish, edit, and moderate school blog posts.",
      },
    ],
  }),
  component: AdminPage,
});

const defaultCategories = [
  "Academics",
  "Early Years & Primary",
  "STEM & Tech",
  "Faith & Character",
  "Student Life",
  "General",
] as const;

type ActiveTab = "all" | "published" | "pending" | "rejected" | "comments" | "safety";

function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredBlogPosts(true));
  const [comments, setComments] = useState<BlogComment[]>(() => getStoredComments());
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const [requireCommentApproval, setRequireCommentApproval] = useState<boolean>(false);
  const [restrictedWords, setRestrictedWords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  // Safety & Word Filter state
  const [newWordInput, setNewWordInput] = useState("");
  const [safetySearch, setSafetySearch] = useState("");
  const [testText, setTestText] = useState("");
  const [testResult, setTestResult] = useState<ContentCheckResult | null>(null);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Post editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Academics");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("Faculty Member");
  const [submitterRole, setSubmitterRole] = useState("Teacher");
  const [postStatus, setPostStatus] = useState<BlogPostStatus>("published");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("Academics, School Life");
  const [featured, setFeatured] = useState(false);

  // Preview state
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  // Success banner notification
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const isAuth = isAdminAuthenticated();
    setAuthenticated(isAuth);
    if (isAuth) {
      refreshData();
    }
  }, []);

  const refreshData = () => {
    setPosts(getAllBlogPosts());
    setComments(getStoredComments());
    setRestrictedWords(getRestrictedWordList());
    setRequireCommentApproval(isCommentApprovalRequired());
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4500);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const success = loginAdmin(username, password);
    if (success) {
      setAuthenticated(true);
      refreshData();
      triggerSuccess("Welcome back, Administrator!");
    } else {
      setLoginError("Invalid username or password. Check .env configuration.");
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const openNewPostModal = () => {
    setEditingPostId(null);
    setTitle("");
    setCategory("Academics");
    setAuthor("Faculty Member");
    setAuthorRole("Teacher / Educator");
    setSubmitterRole("Teacher");
    setPostStatus("published");
    setImageUrl("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80");
    setExcerpt("");
    setContent("");
    setTags("Education, Learning, Annointed");
    setFeatured(false);
    setIsEditorOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setAuthor(post.author);
    setAuthorRole(post.authorRole);
    setSubmitterRole((post.submitterRole as string) || "Teacher");
    setPostStatus(post.status || "published");
    setImageUrl(post.fullImage || post.previewImage);
    setExcerpt(post.excerpt);
    setContent(post.content.join("\n\n"));
    setTags(post.tags.join(", "));
    setFeatured(Boolean(post.featured));
    setIsEditorOpen(true);
  };

  const handleSavePost = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !author) return;

    const contentParagraphs = content.split("\n\n").filter((p) => p.trim().length > 0);
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const wordCount = content.split(" ").length;
    const readTimeCalc = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

    if (editingPostId) {
      const existing = posts.find((p) => p.id === editingPostId);
      const updatedPost: BlogPost = {
        id: editingPostId,
        title,
        category,
        date: existing ? existing.date : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        author,
        authorRole,
        submitterRole,
        previewImage: imageUrl,
        fullImage: imageUrl,
        excerpt,
        readTime: readTimeCalc,
        content: contentParagraphs,
        tags: tagList,
        featured,
        status: postStatus,
      };
      const updatedList = updateBlogPost(updatedPost);
      setPosts(updatedList);
      triggerSuccess("Article successfully updated!");
    } else {
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title,
        category,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        author,
        authorRole,
        submitterRole,
        previewImage: imageUrl,
        fullImage: imageUrl,
        excerpt,
        readTime: readTimeCalc,
        content: contentParagraphs,
        tags: tagList,
        featured,
        status: postStatus,
      };
      const updatedList = saveBlogPost(newPost);
      setPosts(updatedList);
      triggerSuccess("New article saved & published!");
    }

    setIsEditorOpen(false);
  };

  const handleApprove = (id: string, postTitle: string) => {
    const updated = approveBlogPost(id);
    setPosts(updated);
    triggerSuccess(`✓ Article "${postTitle}" is now Approved & Published to the live Gazette!`);
  };

  const handleReject = (id: string, postTitle: string) => {
    const reason = window.prompt(
      `Provide an optional note/reason for declining "${postTitle}":`,
      "Content requires revision or does not align with school editorial policies."
    );
    if (reason !== null) {
      const updated = rejectBlogPost(id, reason);
      setPosts(updated);
      triggerSuccess(`Article "${postTitle}" moved to Rejected.`);
    }
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to permanently delete the article:\n"${postTitle}"?`)) {
      const updated = deleteBlogPost(id);
      setPosts(updated);
      triggerSuccess("Article deleted from the system.");
    }
  };

  const handleToggleCommentApproval = () => {
    const nextVal = !requireCommentApproval;
    setCommentApprovalRequired(nextVal);
    setRequireCommentApproval(nextVal);
    triggerSuccess(
      nextVal
        ? "🛡️ Pre-Approval Mode Enabled: All newly submitted comments will require Admin Approval before publishing."
        : "⚡ Direct Publish Mode: School-safe comments will appear immediately after passing the word filter."
    );
  };

  const handleApproveComment = (commentId: string) => {
    const updated = approveComment(commentId);
    setComments(updated);
    triggerSuccess("✓ Comment approved and published to the live Gazette!");
  };

  const handleApproveBulkComments = () => {
    if (selectedCommentIds.length === 0) return;
    const updated = approveCommentsBulk(selectedCommentIds);
    setComments(updated);
    const count = selectedCommentIds.length;
    setSelectedCommentIds([]);
    triggerSuccess(`✓ Successfully approved & published ${count} comments!`);
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const updated = deleteComment(commentId);
      setComments(updated);
      setSelectedCommentIds((prev) => prev.filter((id) => id !== commentId));
      triggerSuccess("Comment removed successfully.");
    }
  };

  const handleDeleteBulkComments = () => {
    if (selectedCommentIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedCommentIds.length} selected comments?`
      )
    ) {
      const updated = deleteCommentsBulk(selectedCommentIds);
      setComments(updated);
      const count = selectedCommentIds.length;
      setSelectedCommentIds([]);
      triggerSuccess(`Successfully deleted ${count} comments.`);
    }
  };

  const toggleSelectComment = (id: string) => {
    setSelectedCommentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllComments = () => {
    if (selectedCommentIds.length === comments.length && comments.length > 0) {
      setSelectedCommentIds([]);
    } else {
      setSelectedCommentIds(comments.map((c) => c.id));
    }
  };

  const handleAddRestrictedWord = (e: FormEvent) => {
    e.preventDefault();
    if (!newWordInput.trim()) return;
    const updated = addRestrictedWord(newWordInput.trim());
    setRestrictedWords(updated);
    setNewWordInput("");
    triggerSuccess(`Added "${newWordInput.trim()}" to restricted wordlist.`);
  };

  const handleRemoveRestrictedWord = (word: string) => {
    const updated = removeRestrictedWord(word);
    setRestrictedWords(updated);
    triggerSuccess(`Removed "${word}" from restricted wordlist.`);
  };

  const handleResetRestrictedWordlist = () => {
    if (window.confirm("Reset restricted words list to school default dictionary?")) {
      const defaults = resetRestrictedWords();
      setRestrictedWords(defaults);
      triggerSuccess("Restored default school-safe restricted wordlist.");
    }
  };

  const handleRunSafetyTest = () => {
    if (!testText.trim()) return;
    const res = validateSchoolSafeContent(testText);
    setTestResult(res);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Restore default educational blog posts and reset comments? Custom submissions will be reset.")) {
      const defaults = resetBlogPosts();
      setPosts(defaults);
      setComments(getStoredComments());
      setRestrictedWords(getRestrictedWordList());
      triggerSuccess("Restored 18 default educational articles & sample comments.");
    }
  };

  const pendingPostsCount = posts.filter((p) => p.status === "pending").length;
  const publishedPostsCount = posts.filter((p) => p.status === "published" || !p.status).length;
  const rejectedPostsCount = posts.filter((p) => p.status === "rejected").length;
  const pendingCommentsCount = comments.filter((c) => c.status === "pending").length;

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const isPublished = post.status === "published" || !post.status;
    const isPending = post.status === "pending";
    const isRejected = post.status === "rejected";

    let matchesTab = true;
    if (activeTab === "published") matchesTab = isPublished;
    if (activeTab === "pending") matchesTab = isPending;
    if (activeTab === "rejected") matchesTab = isRejected;

    return matchesCategory && matchesSearch && matchesTab;
  });

  const filteredRestrictedWords = restrictedWords.filter((w) =>
    w.toLowerCase().includes(safetySearch.toLowerCase())
  );

  // If not logged in, render the Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#f7f5f0] py-16 px-4">
        <div className="w-full max-w-md rounded-sm border-2 border-stone-800 bg-white p-8 shadow-xl">
          <div className="text-center">
            <span className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-stone-900 text-gold font-bold">
              <Lock className="h-5 w-5" />
            </span>
            <span className="mt-4 block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-stone-500">
              Annointed Chronicle
            </span>
            <h1 className="mt-1 font-display text-2xl font-black uppercase text-stone-950">
              Editorial CMS & Review Portal
            </h1>
            <p className="mt-2 text-xs font-serif text-stone-600">
              Enter your authorized staff credentials to review student, parent & teacher submissions, publish articles, and moderate discussions.
            </p>
          </div>

          {loginError && (
            <div className="mt-5 rounded-xs border border-red-300 bg-red-50 p-3 text-xs font-medium text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Admin Username
              </label>
              <Input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 border-stone-300 bg-stone-50 focus-visible:ring-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 border-stone-300 bg-stone-50 focus-visible:ring-stone-800"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-stone-900 text-white hover:bg-stone-800 font-bold uppercase tracking-wider text-xs cursor-pointer"
            >
              Sign In to Editorial Panel
            </Button>
          </form>

          {/* Credentials Info Note */}
          <div className="mt-6 rounded-xs border border-stone-200 bg-stone-50 p-3.5 text-[0.75rem] text-stone-600">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-amber-700" /> Default Credentials:
            </p>
            <div className="mt-1 font-mono text-stone-800 flex justify-between">
              <span>Username: <strong>admin</strong></span>
              <span>Password: <strong>admin</strong></span>
            </div>
            <p className="mt-1 text-[0.68rem] text-stone-500 italic">
              Configured via project <code className="text-amber-800">.env</code> file.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/news" className="text-xs font-bold text-stone-700 hover:text-stone-950 inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Return to School Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-stone-900 font-sans pb-20">
      {/* Top Header Bar */}
      <header className="border-b-2 border-stone-900 bg-stone-900 text-white py-4 px-6 sticky top-0 z-20 shadow-md">
        <div className="page-shell flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xs bg-gold text-stone-950 font-black font-display text-base">
              AN
            </div>
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-gold block">
                Editorial Review & CMS Portal
              </span>
              <h1 className="font-display text-lg font-bold">Annointed Chronicle CMS</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-stone-600 text-white hover:bg-stone-800 text-xs font-bold h-9">
              <Link to="/news" target="_blank">
                <Eye className="h-3.5 w-3.5 mr-1.5" /> Live Newspaper
              </Link>
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-stone-300 hover:text-white hover:bg-stone-800 text-xs font-bold h-9 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Log Out
            </Button>
          </div>
        </div>
      </header>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 shadow-sm animate-fade-in">
          <div className="page-shell flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> {successMessage}
            </span>
            <button onClick={() => setSuccessMessage("")} className="text-white hover:text-stone-200 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <main className="page-shell py-8 space-y-8">
        {/* Quick Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-stone-300 bg-white p-5 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-emerald-700" /> Published Articles
            </span>
            <p className="mt-2 font-display text-3xl font-black text-stone-950">{publishedPostsCount}</p>
            <p className="mt-1 text-xs text-stone-500 font-serif">Live on the school newspaper</p>
          </div>

          <div
            onClick={() => setActiveTab("pending")}
            className={cn(
              "rounded-2xl border p-5 shadow-2xs cursor-pointer transition-all",
              pendingPostsCount > 0
                ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-400"
                : "border-stone-300 bg-white"
            )}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-700" /> Pending Review
              </span>
              {pendingPostsCount > 0 && (
                <span className="bg-amber-600 text-white text-[0.65rem] font-black px-2 py-0.5 rounded-full animate-pulse">
                  Action Needed
                </span>
              )}
            </span>
            <p className="mt-2 font-display text-3xl font-black text-amber-950">{pendingPostsCount}</p>
            <p className="mt-1 text-xs text-amber-800 font-serif">Awaiting admin review & approval</p>
          </div>

          <div
            onClick={() => setActiveTab("comments")}
            className="rounded-2xl border border-stone-300 bg-white p-5 shadow-2xs cursor-pointer hover:border-stone-400 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-amber-700" /> Community Comments
            </span>
            <p className="mt-2 font-display text-3xl font-black text-stone-950">{comments.length}</p>
            <p className="mt-1 text-xs text-stone-500 font-serif">Reader reflections & responses</p>
          </div>

          <div
            onClick={() => setActiveTab("safety")}
            className="rounded-2xl border border-stone-300 bg-white p-5 shadow-2xs cursor-pointer hover:border-stone-400 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700" /> School Word Filter
            </span>
            <p className="mt-2 font-display text-3xl font-black text-stone-950">{restrictedWords.length}</p>
            <p className="mt-1 text-xs text-stone-500 font-serif">Protected banned words & phrases</p>
          </div>
        </div>

        {/* Action Header & Moderation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-stone-900 pb-4">
          <div>
            <h2 className="font-display text-2xl font-black uppercase text-stone-950">
              Chronicle Editorial & Moderation Desk
            </h2>
            <p className="text-xs font-serif text-stone-600">
              Review student/parent/teacher submissions, publish new articles, moderate comments, and configure school content safety.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleResetDefaults}
              variant="outline"
              className="border-stone-400 text-stone-700 hover:bg-stone-200 text-xs font-bold h-10 cursor-pointer"
              title="Restore 18 default educational articles"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Restore Defaults
            </Button>

            <Button
              onClick={openNewPostModal}
              className="bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider h-10 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Write Editorial Story
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-300 pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer",
              activeTab === "all"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
            )}
          >
            All Articles ({posts.length})
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "pending"
                ? "bg-amber-800 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
            )}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Pending Review ({pendingPostsCount})
          </button>

          <button
            onClick={() => setActiveTab("published")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer",
              activeTab === "published"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
            )}
          >
            Published ({publishedPostsCount})
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer",
              activeTab === "rejected"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
            )}
          >
            Rejected ({rejectedPostsCount})
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "comments"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
            )}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Comments ({comments.length})
            {pendingCommentsCount > 0 && (
              <span className="bg-amber-600 text-white text-[0.62rem] font-black px-1.5 py-0.2 rounded-full">
                {pendingCommentsCount} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("safety")}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "safety"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100"
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            School Word Filter ({restrictedWords.length})
          </button>
        </div>

        {/* TAB CONTENT: School Safety & Word Filter */}
        {activeTab === "safety" && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-sm border-2 border-emerald-800 bg-white p-6 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-emerald-700" />
                    <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                      School-Safe Content & Word Filter Engine
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-stone-600 font-serif max-w-2xl">
                    Protects learners and students under 12 by automatically blocking vulgarities, swear words, insults, bullying phrases, and leetspeak evasion attempts.
                  </p>
                </div>

                <Button
                  onClick={handleResetRestrictedWordlist}
                  variant="outline"
                  className="border-stone-300 text-xs font-bold h-9 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset to Default Wordlist
                </Button>
              </div>

              {/* Add Word Form */}
              <div className="mt-6 bg-stone-50 p-4 rounded-xs border border-stone-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 mb-2">
                  Add Custom Restricted Word / Bullying Slang
                </h4>
                <form onSubmit={handleAddRestrictedWord} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
                  <Input
                    required
                    placeholder="Enter word or phrase to ban (e.g. insults, local slang)..."
                    value={newWordInput}
                    onChange={(e) => setNewWordInput(e.target.value)}
                    className="bg-white border-stone-300 text-xs h-9"
                  />
                  <Button
                    type="submit"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs h-9 px-4 cursor-pointer uppercase shrink-0"
                  >
                    Add Word
                  </Button>
                </form>
              </div>

              {/* Word List Viewer & Search */}
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Active Restricted Words ({filteredRestrictedWords.length} of {restrictedWords.length})
                  </span>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
                    <Input
                      placeholder="Search restricted list..."
                      value={safetySearch}
                      onChange={(e) => setSafetySearch(e.target.value)}
                      className="pl-8 h-8 text-xs border-stone-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-4 rounded-xs border border-stone-200 bg-stone-50">
                  {filteredRestrictedWords.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1.5 rounded-xs bg-white border border-stone-300 px-2.5 py-1 text-xs font-mono text-stone-800 shadow-2xs"
                    >
                      <span>{word}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRestrictedWord(word)}
                        className="text-stone-400 hover:text-red-700 cursor-pointer font-bold ml-1"
                        title="Remove word"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Live Content Safety Tester */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-700" />
                  <h4 className="font-display font-bold text-sm uppercase tracking-wider text-stone-900">
                    Interactive Content Safety Tester
                  </h4>
                </div>
                <p className="text-xs text-stone-500 font-serif mb-3">
                  Type any simulated comment or paragraph to test how the filter intercepts insults or vulgar words.
                </p>

                <div className="space-y-3">
                  <Textarea
                    rows={3}
                    placeholder="e.g. Try typing: 'This post is stupid and f*ck' or a polite comment: 'Great job, loved the reading tips!'..."
                    value={testText}
                    onChange={(e) => {
                      setTestText(e.target.value);
                      setTestResult(null);
                    }}
                    className="bg-white border-stone-300 text-xs font-serif leading-relaxed"
                  />

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleRunSafetyTest}
                      className="bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider h-9 cursor-pointer"
                    >
                      Run Safety Check
                    </Button>
                    <span className="text-[0.7rem] text-stone-400 font-serif italic">
                      Simulates real-time validation performed during comment & story submissions.
                    </span>
                  </div>

                  {testResult && (
                    <div
                      className={cn(
                        "rounded-xs p-4 border-2 mt-3 animate-fade-in text-xs font-sans",
                        testResult.isValid
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                          : "border-red-500 bg-red-50 text-red-900"
                      )}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {testResult.isValid ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            <span>Passed: Content is Safe & Appropriate for School Portal</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                            <span>Blocked: Inappropriate Language Detected ({testResult.prohibitedWordsFound.length} match)</span>
                          </>
                        )}
                      </div>

                      {!testResult.isValid && (
                        <div className="mt-2.5 space-y-1.5 text-xs font-serif">
                          <p>
                            <strong>Flagged Words:</strong> {testResult.prohibitedWordsFound.map((w) => `"${w}"`).join(", ")}
                          </p>
                          <p>
                            <strong>Masked Clean Preview:</strong> <span className="font-mono bg-white px-2 py-0.5 rounded-xs border border-red-200 text-stone-800">{testResult.cleanPreview}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Comments Moderation */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-sm border border-stone-300 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-800" />
                  <h3 className="font-display text-base font-bold text-stone-950 uppercase">
                    Community Reflections & Comments Moderation
                  </h3>
                </div>
                <p className="text-xs text-stone-500 font-serif mt-1">
                  Manage reader reflections across all articles. You can approve pending comments, delete single comments, or select multiple for bulk deletion or approval.
                </p>
              </div>

              {/* Pre-Publish Approval Mode Toggle Switch */}
              <div className="flex items-center gap-3 bg-[#fcfbf9] border-2 border-stone-800 p-3 rounded-xs shrink-0">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Pre-Approval Mode:
                    </span>
                    <span
                      className={cn(
                        "text-[0.68rem] font-black uppercase px-1.5 py-0.2 rounded-2xs",
                        requireCommentApproval
                          ? "bg-amber-800 text-white"
                          : "bg-emerald-800 text-white"
                      )}
                    >
                      {requireCommentApproval ? "Enabled (Strict)" : "Direct (Safe Only)"}
                    </span>
                  </div>
                  <p className="text-[0.65rem] text-stone-500 font-serif">
                    {requireCommentApproval
                      ? "All comments must be approved by admin before appearing live"
                      : "Comments post immediately if they pass the school word filter"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleCommentApproval}
                  className={cn(
                    "relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-stone-900 transition-colors duration-200 ease-in-out focus:outline-hidden",
                    requireCommentApproval ? "bg-amber-700" : "bg-stone-300"
                  )}
                  role="switch"
                  aria-checked={requireCommentApproval}
                  title="Toggle pre-approval requirement for comments"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out border border-stone-400",
                      requireCommentApproval ? "translate-x-6" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Bulk Action Controls */}
            {selectedCommentIds.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900 text-white px-4 py-2.5 rounded-xs animate-fade-in shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gold">
                    {selectedCommentIds.length} Comment{selectedCommentIds.length === 1 ? "" : "s"} Selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleApproveBulkComments}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold h-8 px-3 cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve Selected ({selectedCommentIds.length})
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleDeleteBulkComments}
                    className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold h-8 px-3 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete Selected ({selectedCommentIds.length})
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedCommentIds([])}
                    className="text-stone-300 hover:text-white text-xs h-8 px-2"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-sm border border-stone-300 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-stone-900 bg-[#f4efe6] text-stone-900 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCommentIds.length === comments.length && comments.length > 0}
                        onChange={toggleSelectAllComments}
                        className="cursor-pointer h-3.5 w-3.5 rounded border-stone-300"
                        title="Select All Comments"
                      />
                    </th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Commenter</th>
                    <th className="py-3 px-4">Comment Content</th>
                    <th className="py-3 px-4 hidden md:table-cell">Article</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Date</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-sans">
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-500 font-serif">
                        No comments found in the system.
                      </td>
                    </tr>
                  ) : (
                    comments.map((c) => {
                      const relatedPost = posts.find((p) => p.id === c.postId);
                      const isSelected = selectedCommentIds.includes(c.id);
                      const isPending = c.status === "pending";

                      return (
                        <tr
                          key={c.id}
                          className={cn(
                            "hover:bg-stone-50 transition-colors",
                            isPending && "bg-amber-50/50",
                            isSelected && "bg-amber-100/70"
                          )}
                        >
                          <td className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectComment(c.id)}
                              className="cursor-pointer h-3.5 w-3.5 rounded border-stone-300"
                            />
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 rounded-xs bg-amber-100 border border-amber-300 px-2 py-0.5 text-[0.65rem] font-bold text-amber-900">
                                <Clock className="h-3 w-3" /> Pending Approval
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-xs bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-900">
                                <CheckCircle className="h-3 w-3" /> Published
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {c.isAnonymous ? (
                                <span className="inline-flex items-center gap-1 rounded-xs bg-stone-100 border border-stone-300 px-2 py-0.5 text-[0.65rem] font-bold text-stone-700">
                                  <Shield className="h-3 w-3" /> Anonymous
                                </span>
                              ) : (
                                <div>
                                  <p className="font-bold text-stone-900">{c.authorName}</p>
                                  <span className="text-[0.65rem] text-amber-800 font-medium">
                                    {c.authorRole}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-md">
                            <p className="font-serif text-stone-800 text-xs line-clamp-2">
                              "{c.content}"
                            </p>
                          </td>

                          <td className="py-3.5 px-4 hidden md:table-cell text-stone-600 max-w-xs">
                            <p className="font-bold text-stone-900 truncate">
                              {relatedPost?.title || c.postId}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 hidden sm:table-cell text-stone-500 whitespace-nowrap text-[0.7rem]">
                            {c.date}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPending && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveComment(c.id)}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-[0.7rem] font-bold h-7 px-2.5 cursor-pointer"
                                  title="Approve Comment"
                                >
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteComment(c.id)}
                                className="h-7 w-7 p-0 text-red-700 hover:bg-red-50 cursor-pointer"
                                title="Delete Single Comment"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Articles Management */}
        {activeTab !== "comments" && activeTab !== "safety" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-sm border border-stone-300">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Search by title, author, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs border-stone-300"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap">
                  Filter Category:
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 rounded-sm border border-stone-300 bg-white px-3 text-xs font-medium text-stone-800"
                >
                  <option value="All">All Categories</option>
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto rounded-sm border border-stone-300 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-stone-900 bg-[#f4efe6] text-stone-900 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Status & Submitter</th>
                    <th className="py-3 px-4 hidden md:table-cell">Category</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Author</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Date</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-sans">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-500 font-serif">
                        No articles found for this filter tab.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => {
                      const isPending = post.status === "pending";
                      const isPublished = post.status === "published" || !post.status;
                      const isRejected = post.status === "rejected";

                      return (
                        <tr key={post.id} className={cn("hover:bg-stone-50 transition-colors", isPending && "bg-amber-50/40")}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={post.previewImage}
                                alt={post.title}
                                className="h-12 w-16 shrink-0 rounded-xs object-cover border border-stone-200"
                              />
                              <div className="min-w-0 max-w-md">
                                <h3 className="font-display font-bold text-sm text-stone-950 truncate">
                                  {post.title}
                                </h3>
                                <p className="text-[0.7rem] text-stone-500 font-serif line-clamp-1">
                                  {post.excerpt}
                                </p>
                                {post.rejectionReason && (
                                  <p className="text-[0.65rem] text-red-600 font-sans italic mt-0.5">
                                    Declined note: {post.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 rounded-xs bg-amber-100 border border-amber-300 px-2 py-0.5 text-[0.65rem] font-bold text-amber-900">
                                  <Clock className="h-3 w-3" /> Pending Review
                                </span>
                              )}
                              {isPublished && (
                                <span className="inline-flex items-center gap-1 rounded-xs bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-900">
                                  <CheckCircle className="h-3 w-3" /> Published
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 rounded-xs bg-red-100 border border-red-300 px-2 py-0.5 text-[0.65rem] font-bold text-red-900">
                                  <AlertCircle className="h-3 w-3" /> Rejected
                                </span>
                              )}
                              <p className="text-[0.65rem] text-stone-500">
                                Role: <strong>{post.submitterRole || "Faculty"}</strong>
                              </p>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <span className="inline-block rounded-xs bg-stone-100 border border-stone-200 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-stone-800">
                              {post.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 hidden lg:table-cell">
                            <div>
                              <p className="font-bold text-stone-900">{post.author}</p>
                              <p className="text-[0.65rem] text-stone-500">{post.authorRole}</p>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 hidden sm:table-cell text-stone-600 whitespace-nowrap">
                            {post.date}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If Pending: Show Approve / Decline buttons */}
                              {isPending && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(post.id, post.title)}
                                    className="h-8 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                                    title="Approve and Publish to Gazette"
                                  >
                                    <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Approve
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReject(post.id, post.title)}
                                    className="h-8 px-2 border-red-300 text-red-700 hover:bg-red-50 text-xs cursor-pointer"
                                    title="Decline Submission"
                                  >
                                    <ThumbsDown className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPreviewPost(post)}
                                className="h-8 w-8 p-0 text-stone-700 hover:text-stone-950 cursor-pointer"
                                title="Preview Article"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditModal(post)}
                                className="h-8 px-2.5 text-xs font-bold border-stone-300 text-stone-800 hover:bg-stone-100 cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(post.id, post.title)}
                                className="h-8 w-8 p-0 text-red-700 hover:bg-red-50 cursor-pointer"
                                title="Delete Article"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Editor Modal (Create or Edit Article) */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/80 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative my-8 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-sm border-2 border-stone-900 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b-2 border-stone-900 pb-3">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-800">
                Editorial Workbench
              </span>
              <h2 className="font-display text-2xl font-black uppercase text-stone-950">
                {editingPostId ? "Edit Chronicle Story" : "Compose New School Article"}
              </h2>
            </div>

            <form onSubmit={handleSavePost} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Article Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Science Fair Highlights: Students Showcase Robotics Models"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-stone-300 font-display text-sm font-bold"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 rounded-sm border border-stone-300 bg-white px-3 font-medium text-stone-900"
                  >
                    {defaultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Author Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Mr. Bassey Udoh"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value as BlogPostStatus)}
                    className="w-full h-9 rounded-sm border border-stone-300 bg-white px-3 font-medium text-stone-900"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected / Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Submitter Type
                  </label>
                  <select
                    value={submitterRole}
                    onChange={(e) => setSubmitterRole(e.target.value)}
                    className="w-full h-9 rounded-sm border border-stone-300 bg-white px-3 font-medium text-stone-900"
                  >
                    <option value="Student">Student / Pupil</option>
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Teacher">Teacher / Faculty</option>
                    <option value="Staff">School Staff</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Author Designation / Role
                  </label>
                  <Input
                    placeholder="e.g. Head of School / JSS 2 Student / Parent"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Topic Tags (comma-separated)
                  </label>
                  <Input
                    placeholder="e.g. Mathematics, Exams, WAEC"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Feature Cover Image URL *
                </label>
                <Input
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border-stone-300 font-mono text-[0.7rem]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Summary / Lead Excerpt *
                </label>
                <Textarea
                  required
                  rows={2}
                  placeholder="A compelling 1-2 sentence lead paragraph that appears in the newspaper preview..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="border-stone-300 font-serif text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Full Article Content * (Separate paragraphs with double newlines)
                </label>
                <Textarea
                  required
                  rows={7}
                  placeholder="Write the full body text here. Use double newlines to separate paragraphs..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border-stone-300 font-serif text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditorOpen(false)}
                  className="border-stone-300 text-stone-700 cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-stone-900 text-white hover:bg-stone-800 font-bold uppercase tracking-wider text-xs cursor-pointer"
                >
                  {editingPostId ? "Save Changes" : "Save Article"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/80 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewPost(null)}
        >
          <div
            className="relative my-8 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-sm border-2 border-stone-900 bg-[#fdfbf7] p-6 sm:p-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPost(null)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-stone-200 text-stone-800 hover:bg-stone-900 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Preview Mode · {previewPost.category}
              </span>
              <span className="rounded-xs bg-stone-200 px-2 py-0.5 text-[0.65rem] font-bold uppercase">
                Status: {previewPost.status || "published"}
              </span>
            </div>

            <h1 className="mt-2 font-display text-3xl font-black leading-tight text-stone-950">
              {previewPost.title}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-xs font-serif text-stone-600 border-b border-stone-300 pb-3">
              <span className="font-bold text-stone-900">By {previewPost.author} ({previewPost.authorRole})</span>
              <span>•</span>
              <span>{previewPost.date}</span>
              <span>•</span>
              <span>{previewPost.readTime}</span>
            </div>

            <div className="my-5 aspect-[16/9] max-h-[400px] w-full overflow-hidden rounded-xs border border-stone-300 bg-stone-100">
              <img
                src={previewPost.fullImage || previewPost.previewImage}
                alt={previewPost.title}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="border-l-4 border-amber-700 bg-amber-50/70 p-4 font-serif text-base italic text-stone-900 mb-5">
              "{previewPost.excerpt}"
            </p>

            <div className="space-y-4 font-serif text-sm leading-relaxed text-stone-800">
              {previewPost.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-300 flex justify-between items-center">
              {previewPost.status === "pending" && (
                <Button
                  onClick={() => {
                    handleApprove(previewPost.id, previewPost.title);
                    setPreviewPost(null);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Approve & Publish Story
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setPreviewPost(null)}
                className="border-stone-800 text-stone-900 text-xs font-bold cursor-pointer ml-auto"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
