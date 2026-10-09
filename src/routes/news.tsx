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
      { title: "News & Blog — Annointed comprehensive high school" },
      {
        name: "description",
        content:
          "Explore the official blog, news, student stories, and academic updates from Annointed comprehensive high school, Uyo.",
      },
      { property: "og:title", content: "News & Blog — Annointed comprehensive high school" },
      {
        property: "og:description",
        content: "Discover inspiring school news, educational insights, and classroom stories.",
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
  const [posts, setPosts] = useState<BlogPost[]>(() => getStoredBlogPosts(false));
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
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Blog Top Utility & Ticker Bar */}
      <div className="border-b border-primary/20 bg-primary text-primary-foreground text-xs py-2.5 px-4">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gold tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Annointed Journal & Blog
            </span>
            <span className="text-primary-foreground/30">|</span>
            <span className="text-primary-foreground/80 font-medium">{todayFormatted}</span>
            <span className="hidden md:inline text-primary-foreground/30">|</span>
            <span className="hidden md:inline text-primary-foreground/75">Uyo, Nigeria</span>
          </div>

          {/* Breaking News Ticker */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-4 overflow-hidden">
            <span className="bg-gold text-ink font-bold uppercase text-[0.65rem] px-2 py-0.5 rounded-full tracking-wider">
              Trending
            </span>
            {posts.length > 0 && (
              <p
                onClick={() => setSelectedPost(posts[currentTickerIndex])}
                className="truncate text-primary-foreground/90 hover:text-gold cursor-pointer transition-colors"
              >
                {posts[currentTickerIndex]?.title}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenSubmitModal("Student")}
              className="inline-flex items-center gap-1.5 font-bold text-ink transition-colors bg-gold hover:bg-gold/90 px-3.5 py-1.5 rounded-full text-xs shadow-xs cursor-pointer"
            >
              <PenSquare className="h-3.5 w-3.5" /> Submit Story
            </button>
          </div>
        </div>
      </div>

      {/* Global Notification Banner */}
      {notificationMessage && (
        <div className="bg-primary text-primary-foreground text-xs font-semibold py-3 px-4 shadow-md animate-fade-in border-b border-primary-foreground/20">
          <div className="page-shell flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 shrink-0 text-gold" />
              <span>{notificationMessage}</span>
            </div>
            <button
              onClick={() => setNotificationMessage("")}
              className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modern Blog Header Banner */}
      <header className="page-hero texture-grid relative overflow-hidden py-12 md:py-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-sky-soft/10 blur-3xl" />
        <div className="page-shell relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Stories, Insights & School Life
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-primary-foreground">
                The Annointed Blog & Magazine
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-primary-foreground/80">
                Explore student perspectives, teacher innovations, STEM breakthroughs, and inspirational community stories from Annointed comprehensive high school.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleOpenSubmitModal("Student")}
                className="bg-gold text-ink hover:bg-gold/90 font-bold px-5 h-11 rounded-full shadow-md cursor-pointer"
              >
                <PenSquare className="h-4 w-4 mr-1.5" /> Write for the Blog
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Category Pill Navigation & Search Bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 shadow-xs backdrop-blur-md">
        <div className="page-shell flex flex-col md:flex-row items-center justify-between gap-4 py-3.5">
          {/* Categories */}
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0" aria-label="Blog topics">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "cursor-pointer px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-full whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-card text-muted-foreground hover:bg-gold-soft hover:text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles, authors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-full bg-card pl-9 pr-4 text-xs border-border focus-visible:ring-primary shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Main Blog Layout */}
      <main className="page-shell py-10">
        {filteredPosts.length === 0 ? (
          <div className="my-16 rounded-3xl border-2 border-dashed border-border bg-soft p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h2 className="mt-4 font-display text-2xl font-bold text-primary">
              No Articles Found in This Section
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              No published stories match your active filter. Try resetting your search or contribute a new article.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                className="border-border text-foreground rounded-full"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All Editions");
                }}
              >
                View All Articles
              </Button>
              <Button
                onClick={() => handleOpenSubmitModal("Student")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              >
                <PenSquare className="h-4 w-4 mr-2" /> Submit an Article
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left & Center Columns: Editorial Features (8 of 12 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Featured / Lead Story Card */}
              {leadStory && (
                <article
                  onClick={() => setSelectedPost(leadStory)}
                  className="group cursor-pointer overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] max-h-[460px] w-full overflow-hidden bg-muted">
                    <img
                      src={leadStory.fullImage || leadStory.previewImage}
                      alt={leadStory.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                    
                    <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gold px-3.5 py-1 text-xs font-bold text-ink shadow-md flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5" /> Featured Story
                      </span>
                      <span className="rounded-full bg-background/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-primary shadow-md">
                        {leadStory.category}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 text-primary-foreground">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-primary-foreground/80 mb-2">
                        <span className="flex items-center gap-1 font-semibold">
                          <CalendarDays className="h-3.5 w-3.5 text-gold" /> {leadStory.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gold" /> {leadStory.readTime}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white group-hover:text-gold transition-colors">
                        {leadStory.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-3">
                      {leadStory.excerpt}
                    </p>

                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-soft text-primary font-bold text-sm shadow-inner">
                          {leadStory.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{leadStory.author}</p>
                          <p className="text-[0.68rem] text-muted-foreground uppercase tracking-wider">{leadStory.authorRole}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:text-gold-deep transition-colors">
                        Read Full Story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Secondary Stories (3-Column Grid) */}
              {secondaryStories.length > 0 && (
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
                    <h3 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-gold-deep" /> Highlights & Trending Insights
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Reads</span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {secondaryStories.map((story) => (
                      <article
                        key={story.id}
                        onClick={() => setSelectedPost(story)}
                        className="group flex flex-col justify-between cursor-pointer rounded-3xl border border-border bg-card p-4 shadow-2xs hover:shadow-lg transition-all duration-300"
                      >
                        <div>
                          <div className="aspect-[16/10] h-40 w-full overflow-hidden rounded-2xl bg-muted relative">
                            <img
                              src={story.previewImage}
                              alt={story.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <span className="absolute top-2.5 left-2.5 rounded-full bg-background/90 px-2.5 py-0.5 text-[0.65rem] font-bold text-primary shadow-xs">
                              {story.category}
                            </span>
                          </div>

                          <h4 className="mt-3 font-display text-base font-bold leading-snug text-primary group-hover:text-gold-deep transition-colors line-clamp-2">
                            {story.title}
                          </h4>

                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                            {story.excerpt}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[0.7rem] text-muted-foreground">
                          <span className="font-semibold text-primary">{story.author.split(" ")[0]}</span>
                          <span className="flex items-center gap-1 text-gold-deep font-bold group-hover:underline">
                            Read <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* IN-PAGE / IN-FEED ADVERTISEMENT BANNER                      */}
              {/* ============================================================ */}
              <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-gold/40 bg-gradient-to-r from-primary via-primary/95 to-primary p-6 sm:p-8 text-primary-foreground shadow-lg">
                <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gold/20 blur-2xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-lg">
                    <span className="inline-block rounded-full bg-gold px-3 py-0.5 text-[0.65rem] font-black uppercase tracking-widest text-ink shadow-sm">
                      Sponsored Announcement
                    </span>
                    <h3 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold text-white">
                      Admissions Open: 2026/2027 Session
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-primary-foreground/80 leading-relaxed">
                      Give your child a nurturing, faith-informed foundation with STEM labs, creative arts, and WAEC/BECE leadership training at Annointed comprehensive high school.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <Button asChild className="bg-gold text-ink hover:bg-gold/90 font-bold px-6 h-11 rounded-full shadow-md">
                      <Link to="/admissions">Apply Online Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Remaining Blog Feed */}
              {remainingStories.length > 0 && (
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
                    <h3 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
                      <Layers className="h-5 w-5 text-gold-deep" /> All Published Stories
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{remainingStories.length} Articles</span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {remainingStories.map((story) => (
                      <article
                        key={story.id}
                        onClick={() => setSelectedPost(story)}
                        className="group flex flex-col justify-between cursor-pointer rounded-3xl border border-border bg-card p-5 shadow-2xs hover:shadow-lg hover:border-gold/50 transition-all duration-300"
                      >
                        <div>
                          <div className="aspect-[16/10] h-44 w-full overflow-hidden rounded-2xl bg-muted mb-4 relative">
                            <img
                              src={story.previewImage}
                              alt={story.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-0.5 text-[0.68rem] font-bold text-primary shadow-xs">
                              {story.category}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">
                            <span>{story.date}</span>
                            <span>{story.readTime}</span>
                          </div>

                          <h4 className="mt-2 font-display text-lg font-bold leading-snug text-primary group-hover:text-gold-deep transition-colors line-clamp-2">
                            {story.title}
                          </h4>

                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                            {story.excerpt}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-semibold text-primary">{story.author}</span>
                          <span className="font-bold text-gold-deep group-hover:underline flex items-center gap-1">
                            Read Article <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Modern Blog Sidebar & Ad Corners (4 of 12 cols) */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Community & Contributor Box */}
              <div className="rounded-3xl border border-border bg-gradient-to-br from-gold-soft/70 via-background to-card p-6 shadow-sm">
                <div className="flex items-center gap-2 text-primary border-b border-border/80 pb-3">
                  <PenSquare className="h-5 w-5 text-gold-deep" />
                  <h3 className="font-display text-lg font-bold text-primary">
                    Join Our Blog Contributors
                  </h3>
                </div>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Pupils, parents, and teachers can share poetry, STEM experiments, parenting reflections, and school club achievements with our community.
                </p>

                <div className="mt-5 space-y-2.5">
                  <Button
                    onClick={() => handleOpenSubmitModal("Student")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-wider h-10 rounded-full shadow-xs cursor-pointer"
                  >
                    <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-gold" /> Submit as Student / Pupil
                  </Button>

                  <Button
                    onClick={() => handleOpenSubmitModal("Parent")}
                    variant="outline"
                    className="w-full border-border bg-card text-primary hover:bg-gold-soft text-xs font-bold uppercase tracking-wider h-10 rounded-full shadow-xs cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 mr-1.5 text-gold-deep" /> Submit as Parent / Guardian
                  </Button>

                  <Button
                    onClick={() => handleOpenSubmitModal("Teacher")}
                    variant="outline"
                    className="w-full border-border bg-card text-primary hover:bg-gold-soft text-xs font-bold uppercase tracking-wider h-10 rounded-full cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 text-gold-deep" /> Submit as Teacher / Educator
                  </Button>
                </div>

                <p className="mt-3 text-[0.68rem] text-muted-foreground italic text-center">
                  *Submissions are reviewed by school administrators before publishing.
                </p>
              </div>

              {/* ============================================================ */}
              {/* SIDEBAR AD CORNER 1: SUMMER CODING & ROBOTICS CAMP          */}
              {/* ============================================================ */}
              <div className="rounded-3xl border-2 border-gold/50 bg-gradient-to-b from-primary via-primary/95 to-primary p-6 text-primary-foreground shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-widest text-gold mb-2">
                  <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Sponsor Spotlight</span>
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-gold font-black">Ad</span>
                </div>

                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-primary/50 my-3 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
                    alt="Annointed Robotics & Coding Camp"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-gold text-ink text-[0.65rem] font-bold px-2 py-0.5">
                    Ages 6 – 16
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-white leading-snug">
                  Annointed STEM & Robotics Summer Bootcamp
                </h4>

                <p className="mt-2 text-xs text-primary-foreground/80 leading-relaxed">
                  Hands-on drone piloting, game development, Python programming, and practical electronics labs during the holidays.
                </p>

                <Button asChild className="mt-4 w-full bg-gold text-ink hover:bg-gold/90 font-bold text-xs h-10 rounded-full shadow-md">
                  <Link to="/contact">Register Your Child Today <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </div>

              {/* Trending Headlines Widget */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-border pb-3 text-primary">
                  <Flame className="h-5 w-5 text-gold-deep" />
                  <h3 className="font-display text-lg font-bold">
                    Most Read Articles
                  </h3>
                </div>

                <div className="mt-4 divide-y divide-border">
                  {trendingStories.map((post, index) => (
                    <article
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group cursor-pointer py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5"
                    >
                      <span className="font-display text-2xl font-bold text-border group-hover:text-gold-deep transition-colors">
                        0{index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gold-deep">
                          {post.category}
                        </span>
                        <h4 className="font-display text-sm font-bold leading-snug text-primary group-hover:text-gold-deep transition-colors line-clamp-2 mt-0.5">
                          {post.title}
                        </h4>
                        <p className="mt-1 text-[0.68rem] text-muted-foreground">
                          {post.date} · {post.readTime}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* ============================================================ */}
              {/* SIDEBAR AD CORNER 2: UNIFORMS & BOOKSHOP HUB                */}
              {/* ============================================================ */}
              <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  <span>Academy Resource Corner</span>
                  <span className="rounded-full bg-soft px-2 py-0.5 text-xs font-semibold text-primary">Sponsored</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-soft text-primary">
                    <BookOpen className="h-6 w-6 text-gold-deep" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-sm text-primary">
                      Official Bookshop & Uniforms
                    </h5>
                    <p className="text-[0.7rem] text-muted-foreground">
                      Order government-approved curriculum textbooks, stationery sets & branded uniforms.
                    </p>
                  </div>
                </div>

                <Button asChild variant="outline" className="mt-4 w-full rounded-full border-border text-xs font-bold text-primary hover:bg-gold-soft h-9">
                  <Link to="/contact">Enquire at Bookshop Desk</Link>
                </Button>
              </div>

              {/* Head of School Quote / Message */}
              <div className="rounded-3xl border border-border bg-soft p-6 relative">
                <Quote className="h-8 w-8 text-gold-deep/30 absolute top-4 right-4" />
                <span className="text-xs font-bold uppercase tracking-widest text-gold-deep">
                  Proprietress Reflection
                </span>
                <blockquote className="mt-3 font-serif italic text-sm leading-relaxed text-foreground/80">
                  "Education is not merely training the mind for examinations; it is molding character, stirring imagination, and equipping children to walk in godly purpose."
                </blockquote>
                <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary font-display font-bold text-xs text-primary-foreground shadow-sm">
                    EA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">Dr. / Pastor (Mrs.) E. Akpan</p>
                    <p className="text-[0.68rem] text-muted-foreground">Proprietress & Director of Schools</p>
                  </div>
                </div>
              </div>

              {/* School Notice & Calendar Box */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-2xs">
                <h3 className="font-display text-base font-bold uppercase tracking-wider border-b border-border pb-2 text-primary">
                  Academy Noticeboard
                </h3>
                <ul className="mt-4 space-y-3.5 text-xs">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-deep mt-0.5" />
                    <div>
                      <strong className="text-primary block font-semibold">Admissions in Progress</strong>
                      <span className="text-muted-foreground">Creche, Nursery, Primary & Secondary</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-deep mt-0.5" />
                    <div>
                      <strong className="text-primary block font-semibold">Parent-Teacher Fellowship</strong>
                      <span className="text-muted-foreground">Termly family updates & student exhibitions</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-deep mt-0.5" />
                    <div>
                      <strong className="text-primary block font-semibold">STEM Science Fair 2026</strong>
                      <span className="text-muted-foreground">Student innovation prototypes on showcase</span>
                    </div>
                  </li>
                </ul>
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
                  <strong>Editorial Review Process:</strong> Submitted posts from students, parents, and teachers are held in a pending state and verified by school administrators before going live on the Annointed School Chronicle.
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
                  Annointed Chronicle · {selectedPost.category}
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