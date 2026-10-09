import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  Clock,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  MessageSquare,
  Newspaper,
  PenSquare,
  Quote,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Tag,
  TrendingUp,
  User,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BLOG_COVER_PRESETS,
  getCommentsForPost,
  getStoredBlogPosts,
  isCommentApprovalRequired,
  saveComment,
  submitPostForReview,
  type BlogComment,
  type BlogPost,
  type SubmitterRole,
} from "@/lib/blog-storage";
import { validateSchoolSafeContent } from "@/lib/content-moderator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "The RGGA Chronicle — Official School Newspaper & Blog" },
      {
        name: "description",
        content:
          "Read the official newspaper and educational journal of Annointed comprehensive high school, Uyo. Covering classroom discoveries, STEM innovations, student creative writing, and academic achievements.",
      },
      { property: "og:title", content: "The RGGA Chronicle — School Newspaper & Blog" },
      {
        property: "og:description",
        content: "Discover inspiring school news, educational thought leadership, and classroom stories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});

const categories = [
  "All Editions",
  "Academics",
  "Early Years & Primary",
  "STEM & Tech",
  "Faith & Character",
  "Student Life",
  "General",
] as const;

const contributorRoles: { value: SubmitterRole; label: string; desc: string }[] = [
  {
    value: "Student",
    label: "Student / Pupil Voice",
    desc: "Submit poems, essays, club reports, science experiments, or student perspectives",
  },
  {
    value: "Parent",
    label: "Parent / Guardian",
    desc: "Share home learning reflections, parenting insights, or family encouragement",
  },
  {
    value: "Teacher",
    label: "Teacher / Faculty",
    desc: "Publish lesson discoveries, academic projects, or classroom stories",
  },
  {
    value: "Staff",
    label: "School Staff / Department",
    desc: "Post sports, guidance, arts, or school community announcements",
  },
];

function NewsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All Editions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  // Global Notification Banner
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  // Submit Article Modal State (For Students, Parents & Teachers)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submittingRole, setSubmittingRole] = useState<SubmitterRole>("Student");
  const [submitAuthorName, setSubmitAuthorName] = useState("");
  const [submitAuthorRole, setSubmitAuthorRole] = useState("Primary 5 Pupil");
  const [submitAuthorEmail, setSubmitAuthorEmail] = useState("");
  const [submitTitle, setSubmitTitle] = useState("");
  const [submitCategory, setSubmitCategory] = useState<string>("Student Life");
  const [submitCoverImage, setSubmitCoverImage] = useState<string>(BLOG_COVER_PRESETS[0].url);
  const [customCoverInput, setCustomCoverInput] = useState("");
  const [submitExcerpt, setSubmitExcerpt] = useState("");
  const [submitContent, setSubmitContent] = useState("");
  const [submitTags, setSubmitTags] = useState("Student Life, Creative Writing");

  // Comments State for Currently Selected Post
  const [postComments, setPostComments] = useState<BlogComment[]>([]);
  const [commentIsAnonymous, setCommentIsAnonymous] = useState(false);
  const [commenterName, setCommenterName] = useState("");
  const [commenterRole, setCommenterRole] = useState("Student");
  const [commentText, setCommentText] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [commentError, setCommentError] = useState("");
  const [submitModalError, setSubmitModalError] = useState("");

  // Sync posts from storage on mount
  useEffect(() => {
    setPosts(getStoredBlogPosts(false));
  }, []);

  // Sync comments when an article modal is opened
  useEffect(() => {
    if (selectedPost) {
      setPostComments(getCommentsForPost(selectedPost.id));
      setCommentSuccess("");
      setCommentError("");
      setCommentText("");
    }
  }, [selectedPost]);

  // Breaking news ticker rotation
  useEffect(() => {
    if (posts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 1) % posts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [posts.length]);

  const triggerNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => setNotificationMessage(""), 6000);
  };

  const handleOpenSubmitModal = (roleDefault: SubmitterRole = "Student") => {
    setSubmittingRole(roleDefault);
    setSubmitAuthorName("");
    setSubmitAuthorRole(
      roleDefault === "Student"
        ? "Primary 5 Pupil / JSS Student"
        : roleDefault === "Parent"
          ? "Parent of Pupil"
          : roleDefault === "Teacher"
            ? "Class Teacher / Educator"
            : "Staff Member"
    );
    setSubmitAuthorEmail("");
    setSubmitTitle("");
    setSubmitCategory(roleDefault === "Student" ? "Student Life" : "Early Years & Primary");
    setSubmitCoverImage(BLOG_COVER_PRESETS[0].url);
    setCustomCoverInput("");
    setSubmitExcerpt("");
    setSubmitContent("");
    setSubmitTags(roleDefault === "Student" ? "Creative Writing, Student Life" : "Community, Education");
    setSubmitModalError("");
    setIsSubmitModalOpen(true);
  };

  const handleArticleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitModalError("");

    if (!submitTitle.trim() || !submitAuthorName.trim() || !submitAuthorEmail.trim() || !submitContent.trim() || !submitExcerpt.trim()) {
      setSubmitModalError("Please fill in all required fields marked with * (including your contact detail).");
      return;
    }

    // School Content Safety & Vulgarity Filter
    const fullTextToCheck = `${submitTitle} ${submitExcerpt} ${submitContent} ${submitAuthorName} ${submitTags}`;
    const safetyCheck = validateSchoolSafeContent(fullTextToCheck);

    if (!safetyCheck.isValid) {
      setSubmitModalError(
        `⚠️ School Safety Policy Alert: Your submission contains inappropriate, restricted, or disrespectful words (${safetyCheck.prohibitedWordsFound.map((w) => `"${w}"`).join(", ")}). As a school platform, all posts must be respectful and age-appropriate for children.`
      );
      return;
    }

    const paragraphs = submitContent
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const tagList = submitTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const finalCover = customCoverInput.trim() || submitCoverImage;

    submitPostForReview({
      title: submitTitle.trim(),
      category: submitCategory,
      author: submitAuthorName.trim(),
      authorRole: submitAuthorRole.trim() || `${submittingRole} Contributor`,
      submitterRole: submittingRole,
      submitterEmail: submitAuthorEmail.trim(),
      previewImage: finalCover,
      fullImage: finalCover,
      excerpt: submitExcerpt.trim(),
      content: paragraphs,
      tags: tagList,
    });

    setIsSubmitModalOpen(false);
    triggerNotification(
      `🎉 Thank you, ${submitAuthorName}! Your article "${submitTitle}" has been submitted for review. It will appear on the Gazette once reviewed and approved by the school admin.`
    );
  };

  const handlePostComment = (e: FormEvent) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess("");

    if (!selectedPost || !commentText.trim()) return;

    if (!commentIsAnonymous && !commenterName.trim()) {
      return;
    }

    // School Safety Check for Comments (No insults, swear words, or rude language)
    const textToCheck = `${commentText} ${commentIsAnonymous ? "" : commenterName}`;
    const safetyCheck = validateSchoolSafeContent(textToCheck);

    if (!safetyCheck.isValid) {
      setCommentError(
        `⚠️ Restricted Language Blocked: Your reflection contains restricted words (${safetyCheck.prohibitedWordsFound.map((w) => `"${w}"`).join(", ")}). Please keep your comments polite, encouraging, and suitable for students under 12.`
      );
      return;
    }

    const newComment = saveComment({
      postId: selectedPost.id,
      authorName: commentIsAnonymous ? "Anonymous Contributor" : commenterName.trim(),
      authorRole: commentIsAnonymous ? "Anonymous Reader" : commenterRole,
      isAnonymous: commentIsAnonymous,
      content: commentText.trim(),
    });

    if (newComment.status === "pending") {
      setCommentSuccess(
        "Thank you! Your reflection has been submitted and will appear on the Gazette once approved by the school administrator."
      );
    } else {
      setPostComments((prev) => [newComment, ...prev]);
      setCommentSuccess("Your comment has been posted successfully!");
    }

    setCommentText("");
    setCommentError("");
    setTimeout(() => setCommentSuccess(""), 6000);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All Editions" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const leadStory = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const secondaryStories = filteredPosts.slice(1, 4);
  const remainingStories = filteredPosts.slice(4);
  const trendingStories = posts.slice(0, 5);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1c1c1c] font-sans">
      {/* Newspaper Top Utility Bar */}
      <div className="border-b border-stone-300 bg-stone-900 text-stone-200 text-xs py-2 px-4">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gold tracking-wide uppercase flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Uyo, Akwa Ibom State
            </span>
            <span className="text-stone-500">|</span>
            <span className="text-stone-300 font-medium">{todayFormatted}</span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:inline text-stone-300">Vol. XXIV · Special Edition</span>
          </div>

          {/* Breaking News Ticker */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-4 overflow-hidden">
            <span className="bg-red-700 text-white font-bold uppercase text-[0.65rem] px-2 py-0.5 rounded-xs tracking-wider animate-pulse">
              Gazette Ticker
            </span>
            {posts.length > 0 && (
              <p
                onClick={() => setSelectedPost(posts[currentTickerIndex])}
                className="truncate text-stone-300 hover:text-gold cursor-pointer transition-colors"
              >
                {posts[currentTickerIndex]?.title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenSubmitModal("Student")}
              className="inline-flex items-center gap-1.5 font-bold text-stone-900 hover:text-stone-950 transition-colors bg-gold hover:bg-amber-400 px-3 py-1 rounded-sm text-xs shadow-xs cursor-pointer"
            >
              <PenSquare className="h-3.5 w-3.5" /> Submit Story (Students, Parents & Teachers)
            </button>
          </div>
        </div>
      </div>

      {/* Global Notification Banner */}
      {notificationMessage && (
        <div className="bg-emerald-800 text-white text-xs font-semibold py-3 px-4 shadow-md animate-fade-in border-b border-emerald-900">
          <div className="page-shell flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-300" />
              <span>{notificationMessage}</span>
            </div>
            <button
              onClick={() => setNotificationMessage("")}
              className="text-emerald-200 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Newspaper Masthead */}
      <header className="border-b-4 border-double border-stone-900 bg-[#faf8f5] py-8">
        <div className="page-shell text-center">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.25em] text-stone-600 mb-2">
            <span>Faith</span>
            <span>•</span>
            <span>Character</span>
            <span>•</span>
            <span>Academic Excellence</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-stone-950 scale-y-95">
            The RGGA Chronicle
          </h1>

          <p className="mt-2 text-xs sm:text-sm font-serif italic text-stone-600 max-w-2xl mx-auto">
            The Official Educational Gazette of Annointed comprehensive high school — Anita Street (by Basumoh Gas Plant), Uyo
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between border-y-2 border-stone-800 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-800">
            <span>Established on Grace</span>
            <span className="hidden sm:inline">"A Place to Belong, Believe & Become"</span>
            <div className="flex items-center gap-4">
              <span>{posts.length} Gazette Editions</span>
              <button
                onClick={() => handleOpenSubmitModal("Student")}
                className="text-amber-800 hover:text-amber-950 underline cursor-pointer font-black"
              >
                + Submit a Student or Community Story
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Newspaper Category Navigation & Search Bar */}
      <div className="sticky top-0 z-30 border-b border-stone-300 bg-[#f8f6f0] shadow-xs backdrop-blur-md">
        <div className="page-shell flex flex-col md:flex-row items-center justify-between gap-3 py-2.5">
          {/* Categories */}
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2" aria-label="Newspaper sections">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "cursor-pointer px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xs",
                  activeCategory === cat
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-200 hover:text-stone-900"
                )}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
            <Input
              type="text"
              placeholder="Search newspaper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 rounded-full bg-white pl-8 pr-3 text-xs border-stone-300 focus-visible:ring-stone-800"
            />
          </div>
        </div>
      </div>

      {/* Main Newspaper Layout */}
      <main className="page-shell py-8">
        {filteredPosts.length === 0 ? (
          <div className="my-16 rounded-md border-2 border-dashed border-stone-300 bg-stone-100 p-12 text-center">
            <Newspaper className="mx-auto h-12 w-12 text-stone-400" />
            <h2 className="mt-4 font-display text-2xl font-bold text-stone-800">
              No Articles Found in This Section
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              No published stories match your active filter. Try resetting search parameters or contribute a new post.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                className="border-stone-800 text-stone-800"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All Editions");
                }}
              >
                View All Articles
              </Button>
              <Button
                onClick={() => handleOpenSubmitModal("Student")}
                className="bg-stone-900 text-white hover:bg-stone-800"
              >
                <PenSquare className="h-4 w-4 mr-2" /> Submit an Article
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left & Center Columns: Editorial Features (8 of 12 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Front-Page Lead Story */}
              {leadStory && (
                <article
                  onClick={() => setSelectedPost(leadStory)}
                  className="group cursor-pointer border-b-2 border-stone-800 pb-8 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700 mb-2">
                    <Flame className="h-4 w-4" /> Front Page Lead Story · {leadStory.category}
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-stone-950 group-hover:text-amber-800 transition-colors">
                    {leadStory.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-serif text-stone-600">
                    <span className="font-sans font-bold text-stone-900 uppercase tracking-wider">
                      By {leadStory.author} ({leadStory.authorRole})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {leadStory.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {leadStory.readTime}
                    </span>
                  </div>

                  {/* Fixed Minimal Size Lead Feature Image */}
                  <div className="mt-5 relative aspect-[16/9] max-h-[440px] w-full overflow-hidden rounded-sm border border-stone-300 bg-stone-200 shadow-xs">
                    <img
                      src={leadStory.fullImage || leadStory.previewImage}
                      alt={leadStory.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="eager"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-stone-900/85 text-stone-200 px-4 py-2 text-xs font-serif italic">
                      Special Gazette Report · Annointed comprehensive high school, Uyo
                    </div>
                  </div>

                  <p className="mt-5 font-serif text-lg leading-relaxed text-stone-800 line-clamp-3">
                    <span className="float-left text-5xl leading-none font-display font-bold pr-3 pt-1 text-stone-950">
                      {leadStory.excerpt.charAt(0)}
                    </span>
                    {leadStory.excerpt.slice(1)}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-stone-900 group-hover:text-amber-800">
                      Read Complete Front Page Story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-sans text-stone-500">
                      <MessageSquare className="h-3.5 w-3.5 text-amber-700" /> Join Discussion
                    </span>
                  </div>
                </article>
              )}

              {/* Secondary Front-Page Stories (2-3 Columns) */}
              {secondaryStories.length > 0 && (
                <div>
                  <div className="flex items-center justify-between border-b-2 border-stone-800 pb-2 mb-6">
                    <h3 className="font-display text-xl font-bold uppercase tracking-wider text-stone-950 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-amber-700" /> Academic Highlights & Columns
                    </h3>
                    <span className="text-xs font-serif text-stone-600">Featured Insights</span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {secondaryStories.map((story) => (
                      <article
                        key={story.id}
                        onClick={() => setSelectedPost(story)}
                        className="group flex flex-col cursor-pointer border-r border-stone-300 last:border-r-0 pr-4 last:pr-0"
                      >
                        <div className="aspect-[16/10] h-40 w-full overflow-hidden rounded-xs border border-stone-300 bg-stone-100">
                          <img
                            src={story.previewImage}
                            alt={story.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        <span className="mt-3 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
                          {story.category}
                        </span>

                        <h4 className="mt-1 font-display text-base font-bold leading-snug text-stone-950 group-hover:text-amber-800 transition-colors line-clamp-2">
                          {story.title}
                        </h4>

                        <p className="mt-2 text-xs font-serif leading-relaxed text-stone-700 line-clamp-3 flex-1">
                          {story.excerpt}
                        </p>

                        <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[0.7rem] text-stone-500">
                          <span>By {story.author.split(" ")[0]}</span>
                          <span className="font-bold text-stone-800 group-hover:text-amber-800">
                            Read →
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Remaining Newspaper Story Feed */}
              {remainingStories.length > 0 && (
                <div>
                  <div className="flex items-center justify-between border-b-2 border-stone-800 pb-2 mb-6">
                    <h3 className="font-display text-xl font-bold uppercase tracking-wider text-stone-950 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-amber-700" /> Full Chronicle Gazette
                    </h3>
                    <span className="text-xs font-serif text-stone-600">All Published Articles</span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {remainingStories.map((story) => (
                      <article
                        key={story.id}
                        onClick={() => setSelectedPost(story)}
                        className="group flex flex-col justify-between cursor-pointer border border-stone-300 rounded-sm bg-white p-5 shadow-2xs hover:border-stone-800 hover:shadow-sm transition-all"
                      >
                        <div>
                          <div className="aspect-[16/10] h-44 w-full overflow-hidden rounded-xs border border-stone-200 bg-stone-100 mb-4">
                            <img
                              src={story.previewImage}
                              alt={story.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex items-center justify-between text-[0.68rem] font-bold uppercase tracking-wider text-stone-500">
                            <span className="text-amber-800">{story.category}</span>
                            <span>{story.date}</span>
                          </div>

                          <h4 className="mt-2 font-display text-lg font-bold leading-snug text-stone-950 group-hover:text-amber-800 transition-colors line-clamp-2">
                            {story.title}
                          </h4>

                          <p className="mt-2 text-xs font-serif leading-relaxed text-stone-700 line-clamp-3">
                            {story.excerpt}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                          <span className="font-semibold text-stone-900">{story.author}</span>
                          <span className="font-bold text-amber-800 group-hover:underline">
                            Read Story →
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Newspaper Editorial Sidebar (4 of 12 cols) */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Community & Student Contributor Box */}
              <div className="border-2 border-stone-900 rounded-sm bg-[#faf6ed] p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-center gap-2 text-amber-900 border-b border-amber-300 pb-3">
                  <PenSquare className="h-5 w-5 text-amber-800" />
                  <h3 className="font-display text-base font-black uppercase tracking-wider text-stone-950">
                    Student, Parent & Teacher Voice
                  </h3>
                </div>

                <p className="mt-3 text-xs text-stone-700 font-serif leading-relaxed">
                  Have a student creative writing piece, classroom breakthrough, STEM project, or parenting reflection? Submit your article for review and publication in the Gazette.
                </p>

                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => handleOpenSubmitModal("Student")}
                    className="w-full bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider h-10 shadow-xs cursor-pointer"
                  >
                    <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-gold" /> Submit as Student / Pupil
                  </Button>

                  <Button
                    onClick={() => handleOpenSubmitModal("Parent")}
                    className="w-full bg-amber-800 text-white hover:bg-amber-900 text-xs font-bold uppercase tracking-wider h-10 shadow-xs cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" /> Submit as Parent / Guardian
                  </Button>

                  <Button
                    onClick={() => handleOpenSubmitModal("Teacher")}
                    variant="outline"
                    className="w-full border-stone-800 text-stone-900 hover:bg-stone-200 text-xs font-bold uppercase tracking-wider h-10 cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Submit as Teacher / Educator
                  </Button>
                </div>

                <p className="mt-3 text-[0.68rem] text-stone-500 font-serif italic text-center">
                  *All submissions are reviewed by school administrators before publication.
                </p>
              </div>

              {/* Trending Headlines Widget */}
              <div className="border border-stone-300 rounded-sm bg-white p-6 shadow-2xs">
                <div className="flex items-center gap-2 border-b-2 border-stone-900 pb-3 text-stone-950">
                  <Flame className="h-5 w-5 text-red-700" />
                  <h3 className="font-display text-lg font-black uppercase tracking-wider">
                    Most Read in Gazette
                  </h3>
                </div>

                <div className="mt-4 divide-y divide-stone-200">
                  {trendingStories.map((post, index) => (
                    <article
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group cursor-pointer py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5"
                    >
                      <span className="font-display text-2xl font-black text-stone-300 group-hover:text-amber-700 transition-colors">
                        0{index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
                          {post.category}
                        </span>
                        <h4 className="font-display text-sm font-bold leading-snug text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 mt-0.5">
                          {post.title}
                        </h4>
                        <p className="mt-1 text-[0.68rem] text-stone-500 font-serif">
                          {post.date} · {post.readTime}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Head of School Quote / Message */}
              <div className="border-2 border-stone-800 bg-[#f4efe6] p-6 rounded-xs relative">
                <Quote className="h-8 w-8 text-amber-700/40 absolute top-4 right-4" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  Editorial Dispatch
                </span>
                <blockquote className="mt-3 font-serif italic text-sm leading-relaxed text-stone-800">
                  "Education is not merely training the mind for examinations; it is molding character, stirring imagination, and equipping children to walk in godly purpose."
                </blockquote>
                <div className="mt-4 pt-3 border-t border-stone-300 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-stone-900 font-display font-bold text-xs text-white">
                    EA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Dr. / Pastor (Mrs.) E. Akpan</p>
                    <p className="text-[0.68rem] text-stone-600">Proprietress & Director of Schools</p>
                  </div>
                </div>
              </div>

              {/* School Notice & Calendar Box */}
              <div className="border border-stone-300 bg-white p-6 rounded-sm">
                <h3 className="font-display text-base font-bold uppercase tracking-wider border-b-2 border-stone-900 pb-2 text-stone-950">
                  Academy Noticeboard
                </h3>
                <ul className="mt-4 space-y-3 text-xs">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block">Admissions in Progress</strong>
                      <span className="text-stone-600">Creche, Nursery, Primary & Secondary</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block">Parent-Teacher Fellowship</strong>
                      <span className="text-stone-600">Termly consultation sessions scheduled</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block">STEM & Robotics Exhibition</strong>
                      <span className="text-stone-600">Annual Science & Tech showcase</span>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-4 border-t border-stone-200">
                  <Button asChild className="w-full bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold uppercase tracking-wider">
                    <Link to="/admissions">Enquire About Enrollment</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* SUBMIT ARTICLE MODAL (For Students, Teachers, Parents, etc.)  */}
      {/* ============================================================ */}
      {isSubmitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/80 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative my-8 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-stone-900 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b-2 border-stone-900 pb-3">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-800 block">
                Student & Community Gazette Submissions
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-stone-950">
                Submit an Educational Story
              </h2>
              <p className="mt-1 text-xs text-stone-600 font-serif">
                Articles submitted by students, parents, and teachers are reviewed by school administrators before appearing on the public newspaper.
              </p>
            </div>

            <form onSubmit={handleArticleSubmit} className="mt-6 space-y-5 text-xs">
              {/* Prohibited Content Safety Alert */}
              {submitModalError && (
                <div className="rounded-xs bg-red-50 border-2 border-red-400 p-4 text-xs font-semibold text-red-800 flex items-start gap-3 animate-shake">
                  <ShieldAlert className="h-5 w-5 text-red-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-serif">
                    {submitModalError}
                  </div>
                </div>
              )}
              {/* Contributor Role Selector */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-2">
                  I am contributing as: *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {contributorRoles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setSubmittingRole(role.value);
                        setSubmitAuthorRole(
                          role.value === "Student"
                            ? "Primary 5 Pupil / JSS Student"
                            : role.value === "Parent"
                              ? "Parent of Pupil"
                              : role.value === "Teacher"
                                ? "Class Teacher / Educator"
                                : "Staff Member"
                        );
                        if (role.value === "Student") {
                          setSubmitCategory("Student Life");
                        }
                      }}
                      className={cn(
                        "text-left p-3 rounded-xs border transition-all cursor-pointer flex flex-col justify-between",
                        submittingRole === role.value
                          ? "border-stone-900 bg-[#fbf7ee] ring-1 ring-stone-900 shadow-2xs"
                          : "border-stone-200 bg-stone-50 hover:bg-stone-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{role.label}</span>
                        {submittingRole === role.value && (
                          <CheckCircle className="h-4 w-4 text-amber-700" />
                        )}
                      </div>
                      <span className="mt-1 text-[0.68rem] text-stone-500 font-serif line-clamp-1">
                        {role.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Author Info Grid */}
              <div className="grid gap-4 sm:grid-cols-3 bg-stone-50 p-4 rounded-xs border border-stone-200">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Your Full Name *
                  </label>
                  <Input
                    required
                    placeholder={submittingRole === "Student" ? "e.g. Master David Bassey" : "e.g. Mrs. Blessing Okon"}
                    value={submitAuthorName}
                    onChange={(e) => setSubmitAuthorName(e.target.value)}
                    className="border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Designation / Class / Role
                  </label>
                  <Input
                    placeholder={submittingRole === "Student" ? "e.g. JSS 2 Student / Debate Leader" : "e.g. Grade 4 Parent / Science Teacher"}
                    value={submitAuthorRole}
                    onChange={(e) => setSubmitAuthorRole(e.target.value)}
                    className="border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Contact Detail (Phone / Email) *
                  </label>
                  <Input
                    required
                    type="text"
                    placeholder="e.g. 08012345678 or parent@gmail.com"
                    value={submitAuthorEmail}
                    onChange={(e) => setSubmitAuthorEmail(e.target.value)}
                    className="border-stone-300 bg-white"
                  />
                </div>
              </div>

              {/* Article Title & Category */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Article Title *
                  </label>
                  <Input
                    required
                    placeholder={
                      submittingRole === "Student"
                        ? "e.g. My Experience in the Young Scientists Robotics Exhibition"
                        : "e.g. Building Early Reading Confidence at Home and School"
                    }
                    value={submitTitle}
                    onChange={(e) => setSubmitTitle(e.target.value)}
                    className="border-stone-300 font-display text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Category *
                  </label>
                  <select
                    value={submitCategory}
                    onChange={(e) => setSubmitCategory(e.target.value)}
                    className="w-full h-9 rounded-sm border border-stone-300 bg-white px-3 font-medium text-stone-900"
                  >
                    {categories
                      .filter((c) => c !== "All Editions")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Cover Image Preset Picker */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                  Select a Cover Photograph *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BLOG_COVER_PRESETS.map((preset) => (
                    <div
                      key={preset.url}
                      onClick={() => {
                        setSubmitCoverImage(preset.url);
                        setCustomCoverInput("");
                      }}
                      className={cn(
                        "relative group cursor-pointer overflow-hidden rounded-xs border-2 transition-all aspect-[16/9]",
                        submitCoverImage === preset.url && !customCoverInput
                          ? "border-amber-800 ring-2 ring-amber-700/50"
                          : "border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100"
                      )}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 p-1 text-[0.65rem] font-medium text-stone-200 truncate">
                        {preset.label}
                      </div>
                      {submitCoverImage === preset.url && !customCoverInput && (
                        <span className="absolute top-1 right-1 grid h-4 w-4 place-items-center rounded-full bg-amber-700 text-white text-[0.55rem] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2.5">
                  <Input
                    placeholder="Or paste a custom image URL (optional)"
                    value={customCoverInput}
                    onChange={(e) => setCustomCoverInput(e.target.value)}
                    className="border-stone-300 text-xs font-mono h-8"
                  />
                </div>
              </div>

              {/* Lead Summary Excerpt */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Lead Summary / Highlight * (1-2 sentences)
                </label>
                <Textarea
                  required
                  rows={2}
                  placeholder="Summarize the core message or takeaway of your article..."
                  value={submitExcerpt}
                  onChange={(e) => setSubmitExcerpt(e.target.value)}
                  className="border-stone-300 font-serif text-xs"
                />
              </div>

              {/* Full Article Content */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Full Story Content * (Use double newlines between paragraphs)
                </label>
                <Textarea
                  required
                  rows={6}
                  placeholder="Share your complete story, essay, or thoughts here. Separate paragraphs with double newlines..."
                  value={submitContent}
                  onChange={(e) => setSubmitContent(e.target.value)}
                  className="border-stone-300 font-serif text-xs leading-relaxed"
                />
              </div>

              {/* Topic Tags */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Topic Tags (comma separated)
                </label>
                <Input
                  placeholder="e.g. Science, Robotics, Essay, Student Life"
                  value={submitTags}
                  onChange={(e) => setSubmitTags(e.target.value)}
                  className="border-stone-300"
                />
              </div>

              {/* Moderation Notice & Submit Buttons */}
              <div className="rounded-xs border border-amber-300 bg-amber-50/70 p-3.5 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
                <div className="text-[0.72rem] text-amber-900 leading-relaxed font-serif">
                  <strong>Editorial Review Process:</strong> Submitted posts from students, parents, and teachers are held in a pending state and verified by school administrators before going live on The RGGA Chronicle.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="border-stone-300 text-stone-700 cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-stone-900 text-white hover:bg-stone-800 font-bold uppercase tracking-wider text-xs h-10 px-6 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 mr-2" /> Submit Article for Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FULL ARTICLE READER & COMMENT SECTION MODAL                   */}
      {/* ============================================================ */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/80 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative my-8 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-stone-900 bg-[#fdfbf7] p-6 sm:p-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-6 top-6 grid h-9 w-9 place-items-center rounded-full bg-stone-200 text-stone-800 hover:bg-stone-900 hover:text-white cursor-pointer transition-colors"
              aria-label="Close article"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Newspaper Header Strip */}
            <div className="border-b-2 border-stone-900 pb-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-widest text-stone-600">
                <span className="text-amber-800 font-black">
                  RGGA Chronicle · {selectedPost.category}
                </span>
                <span>{selectedPost.date}</span>
              </div>

              <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-stone-950">
                {selectedPost.title}
              </h1>

              {/* Byline */}
              <div className="mt-4 flex items-center justify-between flex-wrap gap-4 text-xs font-serif text-stone-600">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-stone-900 font-display text-sm font-bold text-white">
                    {selectedPost.author
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-sans font-bold text-stone-900 text-sm">{selectedPost.author}</p>
                    <p className="text-[0.7rem] text-stone-500 uppercase tracking-wider">{selectedPost.authorRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-sans text-xs">
                  <span className="flex items-center gap-1.5 text-stone-600">
                    <Clock className="h-3.5 w-3.5 text-amber-800" />
                    {selectedPost.readTime}
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {postComments.length} {postComments.length === 1 ? "Comment" : "Comments"}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Article Hero Image */}
            <div className="my-6 aspect-[16/9] max-h-[460px] w-full overflow-hidden rounded-xs border border-stone-300 bg-stone-100 shadow-xs">
              <img
                src={selectedPost.fullImage || selectedPost.previewImage}
                alt={selectedPost.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <p className="text-[0.7rem] font-serif italic text-stone-500 text-center -mt-4 mb-6">
              Photograph: Educational activities at Annointed comprehensive high school, Uyo
            </p>

            {/* Lead Excerpt */}
            <div className="border-l-4 border-amber-700 bg-amber-50/70 p-5 rounded-r-xs font-serif text-lg italic leading-relaxed text-stone-900 mb-6">
              "{selectedPost.excerpt}"
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed text-stone-800">
              {selectedPost.content.map((paragraph, index) => (
                <p key={index}>
                  {index === 0 ? (
                    <>
                      <span className="float-left text-5xl leading-none font-display font-black pr-3 pt-1 text-stone-950">
                        {paragraph.charAt(0)}
                      </span>
                      {paragraph.slice(1)}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>

            {/* Topic Tags */}
            <div className="mt-8 pt-4 border-t border-stone-300 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-amber-800" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mr-1">Filed Under:</span>
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs bg-stone-200 px-2.5 py-1 text-xs font-sans font-semibold text-stone-700"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* ============================================================ */}
            {/* COMMENTS & DISCUSSION SECTION                                */}
            {/* ============================================================ */}
            <section className="mt-10 pt-8 border-t-2 border-stone-900 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-800" />
                  <h3 className="font-display text-xl font-black uppercase tracking-wider text-stone-950">
                    Community Reflections & Comments ({postComments.length})
                  </h3>
                </div>
                <span className="text-xs font-serif text-stone-500">
                  Open community discussion
                </span>
              </div>

              {/* Comment Success Feedback */}
              {commentSuccess && (
                <div className="rounded-xs bg-emerald-50 border border-emerald-300 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="h-4 w-4 text-emerald-600" /> {commentSuccess}
                </div>
              )}

              {/* Comment Restricted Language Blocked Alert */}
              {commentError && (
                <div className="rounded-xs bg-red-50 border-2 border-red-400 p-3.5 text-xs font-semibold text-red-800 flex items-start gap-2.5 animate-shake">
                  <ShieldAlert className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
                  <div className="font-serif leading-relaxed">
                    {commentError}
                  </div>
                </div>
              )}

              {/* Comment Form */}
              <div className="rounded-sm border-2 border-stone-800 bg-[#fbf9f5] p-5 sm:p-6 shadow-2xs">
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-stone-900 mb-3">
                  Leave a Comment / Reflection
                </h4>

                <form onSubmit={handlePostComment} className="space-y-4 text-xs">
                  {/* Anonymous vs Named Toggle Cards */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-700 mb-2">
                      How would you like to submit your comment? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCommentIsAnonymous(false)}
                        className={cn(
                          "p-3 rounded-xs border text-left cursor-pointer transition-all flex items-start gap-3",
                          !commentIsAnonymous
                            ? "border-stone-900 bg-white ring-1 ring-stone-900 shadow-2xs"
                            : "border-stone-200 bg-stone-100 hover:bg-stone-50"
                        )}
                      >
                        <UserCheck className={cn("h-5 w-5 mt-0.5", !commentIsAnonymous ? "text-amber-800" : "text-stone-400")} />
                        <div>
                          <p className="font-bold text-stone-900">Submit with My Name</p>
                          <p className="text-[0.68rem] text-stone-500 font-serif">
                            Show your name and affiliation (e.g. Student, Parent, Teacher)
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCommentIsAnonymous(true)}
                        className={cn(
                          "p-3 rounded-xs border text-left cursor-pointer transition-all flex items-start gap-3",
                          commentIsAnonymous
                            ? "border-stone-900 bg-white ring-1 ring-stone-900 shadow-2xs"
                            : "border-stone-200 bg-stone-100 hover:bg-stone-50"
                        )}
                      >
                        <Shield className={cn("h-5 w-5 mt-0.5", commentIsAnonymous ? "text-amber-800" : "text-stone-400")} />
                        <div>
                          <p className="font-bold text-stone-900">Submit Anonymously</p>
                          <p className="text-[0.68rem] text-stone-500 font-serif">
                            Mask your personal identity as "Anonymous Contributor"
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* If Named: Name & Affiliation Inputs */}
                  {!commentIsAnonymous ? (
                    <div className="grid gap-3 sm:grid-cols-2 animate-fade-in">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Your Name *
                        </label>
                        <Input
                          required
                          placeholder="e.g. Master David Bassey / Mrs. Grace"
                          value={commenterName}
                          onChange={(e) => setCommenterName(e.target.value)}
                          className="bg-white border-stone-300 h-9"
                        />
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Community Role
                        </label>
                        <select
                          value={commenterRole}
                          onChange={(e) => setCommenterRole(e.target.value)}
                          className="w-full h-9 rounded-sm border border-stone-300 bg-white px-3 font-medium text-stone-800"
                        >
                          <option value="Student">Student / Pupil</option>
                          <option value="Parent">Parent / Guardian</option>
                          <option value="Teacher">Teacher / Educator</option>
                          <option value="Alumni">Alumni</option>
                          <option value="Community Member">Community Member</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xs bg-amber-50 border border-amber-200 p-3 text-[0.72rem] text-amber-900 font-serif flex items-center gap-2 animate-fade-in">
                      <Shield className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>
                        Your name and details are hidden. Your comment will appear with an <strong>Anonymous Contributor</strong> badge.
                      </span>
                    </div>
                  )}

                  {/* Comment Textarea */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Reflection / Comment *
                    </label>
                    <Textarea
                      required
                      rows={3}
                      placeholder="Write your constructive thoughts, words of appreciation, or questions on this article..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="bg-white border-stone-300 font-serif text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      type="submit"
                      className="bg-stone-900 text-white hover:bg-stone-800 font-bold uppercase tracking-wider text-xs h-9 px-5 cursor-pointer"
                    >
                      <Send className="h-3 w-3 mr-1.5" /> Post Comment
                    </Button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {postComments.length === 0 ? (
                  <div className="rounded-xs border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-xs font-serif text-stone-500">
                    Be the first to share a reflection or comment on this article!
                  </div>
                ) : (
                  postComments.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xs border border-stone-200 bg-white p-4 shadow-2xs hover:border-stone-300 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 pb-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          {c.isAnonymous ? (
                            <div className="grid h-7 w-7 place-items-center rounded-full bg-stone-200 text-stone-700">
                              <Shield className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <div className="grid h-7 w-7 place-items-center rounded-full bg-stone-900 text-white font-bold text-[0.65rem]">
                              {c.authorName.charAt(0)}
                            </div>
                          )}

                          <div>
                            <span className="font-bold text-stone-900 text-xs mr-2">
                              {c.authorName}
                            </span>
                            <span className={cn(
                              "inline-block text-[0.6rem] font-bold uppercase px-1.5 py-0.2 rounded-2xs",
                              c.isAnonymous
                                ? "bg-stone-100 text-stone-600 border border-stone-300"
                                : "bg-amber-100 text-amber-900 border border-amber-300"
                            )}>
                              {c.authorRole || (c.isAnonymous ? "Anonymous" : "Member")}
                            </span>
                          </div>
                        </div>

                        <span className="text-[0.68rem] text-stone-400 font-serif">
                          {c.date}
                        </span>
                      </div>

                      <p className="text-xs font-serif text-stone-800 leading-relaxed pl-1">
                        {c.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Modal Actions */}
            <div className="mt-10 pt-6 border-t-2 border-stone-900 flex flex-wrap items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedPost(null)}
                className="border-stone-800 text-stone-900 cursor-pointer text-xs font-bold uppercase"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Return to Chronicle
              </Button>

              <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold uppercase">
                <Link to="/contact">Enquire with School Admissions</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}