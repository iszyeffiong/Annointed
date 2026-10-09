export type BlogPostStatus = "published" | "pending" | "rejected";
export type SubmitterRole = "Teacher" | "Parent" | "Staff" | "Student" | "Admin" | "Guest";

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  authorRole: string;
  previewImage: string;
  fullImage: string;
  excerpt: string;
  readTime: string;
  content: string[];
  tags: string[];
  featured?: boolean;
  status?: BlogPostStatus;
  submitterRole?: SubmitterRole | string;
  submitterEmail?: string;
  submittedAt?: string;
  rejectionReason?: string;
};

export type BlogComment = {
  id: string;
  postId: string;
  authorName: string;
  authorRole?: string;
  isAnonymous: boolean;
  content: string;
  date: string;
  status?: "published" | "pending";
};

// Common high quality education feature image
const DEFAULT_FEATURE_IMAGE = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80";
const READING_FEATURE_IMAGE = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80";
const STEM_FEATURE_IMAGE = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80";
const FAITH_FEATURE_IMAGE = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";
const ARTS_FEATURE_IMAGE = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80";
const SECONDARY_FEATURE_IMAGE = "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80";

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Nurturing Confident Readers: The RGGA Early Years Literacy Framework",
    category: "Early Years & Primary",
    date: "October 1, 2026",
    author: "Mrs. Grace Effiong",
    authorRole: "Head of Early Years",
    previewImage: READING_FEATURE_IMAGE,
    fullImage: READING_FEATURE_IMAGE,
    featured: true,
    excerpt: "Discover how our structured phonics, story circles, and daily reading habits build joyful lifelong learners from nursery school.",
    readTime: "4 min read",
    tags: ["Literacy", "Early Childhood", "Reading Habits"],
    content: [
      "Early literacy is the bedrock upon which every future academic achievement is constructed. At Annointed comprehensive high school, we approach reading not merely as a mechanical skill, but as an exciting portal of discovery, empathy, and creative confidence.",
      "In our Creche and Nursery classrooms, literacy begins through structured phonics immersion, playful rhyming songs, and sensory storytelling. Children learn to associate sounds with letters through hands-on tactile games rather than rote memorization.",
      "By the time children transition into primary school, daily story circles and guided reading libraries ensure that they read with comprehension, clarity, and genuine enjoyment. Parents are also equipped with simple take-home reading logs to continue the momentum at home.",
      "When a child learns to love reading early, they unlock the ability to learn anything independently throughout their educational journey."
    ]
  },
  {
    id: "post-2",
    title: "Rooted in Grace: Why Moral Grounding and Faith Shape Academic Excellence",
    category: "Faith & Character",
    date: "September 28, 2026",
    author: "Dr. / Pastor (Mrs.) E. Akpan",
    authorRole: "Proprietress & Director",
    previewImage: FAITH_FEATURE_IMAGE,
    fullImage: FAITH_FEATURE_IMAGE,
    featured: true,
    excerpt: "True education is not only about what a child knows; it is about who they become and how they use their gifts in service to others.",
    readTime: "5 min read",
    tags: ["Character", "Christian Values", "Leadership"],
    content: [
      "In a fast-changing modern world, intellectual capability without moral character produces fragile success. At RGGA, our compass is grounded in the enduring values of integrity, compassion, humility, and disciplined focus.",
      "Every morning assembly, classroom interaction, and collaborative project is infused with intentional character mentoring. We teach our learners that true excellence means doing the right thing even when no one is watching.",
      "Our students participate in community outreach and mutual encouragement initiatives, learning to appreciate the dignity of every person and developing grateful, generous hearts.",
      "When faith and character underpin academic diligence, students emerge not just with certificates, but with the wisdom to lead and positively impact society."
    ]
  },
  {
    id: "post-3",
    title: "From Curiosity to Innovation: Hands-On STEM & Robotics at Primary Level",
    category: "STEM & Tech",
    date: "September 24, 2026",
    author: "Mr. Emeka Nwachukwu",
    authorRole: "Lead Instructor — STEM & ICT",
    previewImage: STEM_FEATURE_IMAGE,
    fullImage: STEM_FEATURE_IMAGE,
    featured: true,
    excerpt: "Step inside our science and coding laboratories where pupils transform abstract ideas into tangible models, circuits, and code.",
    readTime: "4 min read",
    tags: ["Robotics", "Coding", "Science", "Innovation"],
    content: [
      "The careers of tomorrow will belong to young people who can think analytically, solve complex problems, and apply technological tools creatively. That is why practical STEM education begins early at Annointed comprehensive high school.",
      "Our students don't just memorize scientific definitions from textbooks; they conduct experiments, test hypotheses, and build mechanical prototypes using accessible robotics kits and digital coding blocks.",
      "From basic circuit building and algorithmic thinking in primary classes to advanced ICT applications in secondary school, learners are empowered to become producers of technology, not just passive consumers.",
      "Watching a learner debug their own code or see their robot complete a simulated maze generates immense confidence and ignites a passion for innovation."
    ]
  },
  {
    id: "post-4",
    title: "Beyond the Timetable: How Music, Creative Arts, and Athletics Build Balanced Learners",
    category: "Student Life",
    date: "September 20, 2026",
    author: "Ms. Victoria Bassey",
    authorRole: "Creative Arts Director",
    previewImage: ARTS_FEATURE_IMAGE,
    fullImage: ARTS_FEATURE_IMAGE,
    excerpt: "How our choir, cultural exhibitions, and athletic programs cultivate emotional balance, teamwork, and creative expression.",
    readTime: "3 min read",
    tags: ["Music", "Arts", "Sports", "Wellbeing"],
    content: [
      "A complete education engages the whole child — mind, heart, voice, and body. Co-curricular activities are not secondary afterthoughts at RGGA; they are vital components of emotional balance and leadership training.",
      "Through choir rehearsals, instrument practice, drama, and visual arts, children discover their innate talents and learn the discipline of stage presence and creative expression.",
      "On the sports field, our athletic training instills teamwork, resilience in the face of setbacks, physical endurance, and healthy competitive spirit.",
      "These moments of camaraderie and shared achievement help each pupil find their unique voice and build enduring friendships."
    ]
  },
  {
    id: "post-5",
    title: "Mastering WAEC, BECE & JAMB: Strategic Examination Revision Techniques",
    category: "Academics",
    date: "September 16, 2026",
    author: "Mr. Aniekan Okon",
    authorRole: "Dean of Studies",
    previewImage: SECONDARY_FEATURE_IMAGE,
    fullImage: SECONDARY_FEATURE_IMAGE,
    excerpt: "Strategic revision methods, mock assessment systems, and personalized mentoring that ensure stellar examination results.",
    readTime: "6 min read",
    tags: ["Secondary School", "Exams", "WAEC", "Study Skills"],
    content: [
      "Preparing students for national and international examinations requires both thorough curriculum coverage and strategic exam mastery techniques.",
      "At RGGA Secondary School, we begin examination orientation well in advance through continuous diagnostic testing, timed past-question workshops, and individualized revision plans tailored to each learner's strengths and areas of growth.",
      "Our experienced educators emphasize critical thinking, structured essay writing, and analytical problem-solving rather than cramming.",
      "By coupling rigorous academic preparation with calm, focused study habits and moral encouragement, we ensure our students step into examination halls with supreme confidence."
    ]
  },
  {
    id: "post-6",
    title: "The Power of Phonics: Laying Strong Foundations for Early Childhood Reading",
    category: "Early Years & Primary",
    date: "September 12, 2026",
    author: "Mrs. Imaobong Inyang",
    authorRole: "Head Teacher — Primary Section",
    previewImage: READING_FEATURE_IMAGE,
    fullImage: READING_FEATURE_IMAGE,
    excerpt: "Why systematic synthetic phonics gives young learners the decoding superpower to pronounce new words with ease.",
    readTime: "4 min read",
    tags: ["Phonics", "Reading", "Foundations"],
    content: [
      "Synthetic phonics equips children with the foundational keys to decode written language with remarkable speed and confidence.",
      "By breaking down words into distinct phonemes and teaching corresponding graphemes, our pupils develop auditory discrimination and word blending skills early.",
      "Interactive multisensory phonics sessions combine tactile sandpaper letters, sound buttons, and auditory repetition to ensure every learning style is supported.",
      "The result is young children who transition effortlessly from guided readers to passionate, independent bookworms."
    ]
  },
  {
    id: "post-7",
    title: "Developing Critical Thinking in Primary Mathematics and Problem Solving",
    category: "STEM & Tech",
    date: "September 8, 2026",
    author: "Mr. Bassey Udoh",
    authorRole: "Principal / Head of School",
    previewImage: STEM_FEATURE_IMAGE,
    fullImage: STEM_FEATURE_IMAGE,
    excerpt: "Moving beyond rote arithmetic formulas to nurture logical reasoning, mental math agility, and spatial visualization.",
    readTime: "5 min read",
    tags: ["Mathematics", "Logic", "Problem Solving"],
    content: [
      "Mathematics is not just about memorizing times tables; it is the universal language of logic, pattern recognition, and analytical deduction.",
      "At RGGA, our mathematics curriculum emphasizes concrete, pictorial, and abstract representations so that abstract concepts become intuitive.",
      "Students solve open-ended real-world problems in collaborative groups, articulating their reasoning and exploring multiple solution pathways.",
      "This approach demystifies math and inspires a deep, lifelong appreciation for analytical inquiry."
    ]
  },
  {
    id: "post-8",
    title: "Cultivating Joyful Discipline: Positive Behavior Support in Modern Classrooms",
    category: "Faith & Character",
    date: "September 4, 2026",
    author: "Dr. / Pastor (Mrs.) E. Akpan",
    authorRole: "Proprietress & Director",
    previewImage: FAITH_FEATURE_IMAGE,
    fullImage: FAITH_FEATURE_IMAGE,
    excerpt: "How gentle guidance, clear boundaries, and consistent praise create an atmosphere of mutual respect and classroom harmony.",
    readTime: "4 min read",
    tags: ["Discipline", "Classroom Management", "Mentorship"],
    content: [
      "Discipline at RGGA is never punitive or fear-based; it is rooted in discipleship, mutual dignity, and personal responsibility.",
      "We believe that when children understand the 'why' behind school community rules, self-regulation becomes second nature.",
      "Teachers celebrate positive actions, empathetic behavior, and quiet acts of kindness through recognition badges and values certificates.",
      "This positive reinforcement builds an orderly, peaceful classroom atmosphere where children feel safe to take academic risks and learn from mistakes."
    ]
  },
  {
    id: "post-9",
    title: "Digital Literacy & Online Safety: Equipping Students for the Modern Age",
    category: "STEM & Tech",
    date: "August 30, 2026",
    author: "Mr. Emeka Nwachukwu",
    authorRole: "Lead Instructor — STEM & ICT",
    previewImage: DEFAULT_FEATURE_IMAGE,
    fullImage: DEFAULT_FEATURE_IMAGE,
    excerpt: "Teaching safe internet habits, cyber ethics, and digital citizenship alongside practical computer skills.",
    readTime: "4 min read",
    tags: ["Digital Literacy", "Cyber Safety", "Technology"],
    content: [
      "As technology becomes ubiquitous, teaching young people how to navigate the digital realm safely and responsibly is an indispensable educational duty.",
      "Our ICT syllabus combines practical skills like keyboarding, spreadsheets, and basic coding with essential lessons in digital ethics and privacy protection.",
      "Students learn how to discern reliable sources from misinformation, protect personal credentials, and practice respectful online communication.",
      "We prepare our learners to be conscious digital citizens who harness technology for constructive learning and creativity."
    ]
  },
  {
    id: "post-10",
    title: "Parent-Teacher Partnerships: How Collaborative Mentorship Drives Student Growth",
    category: "Student Life",
    date: "August 26, 2026",
    author: "Mrs. Grace Effiong",
    authorRole: "Head of Early Years",
    previewImage: READING_FEATURE_IMAGE,
    fullImage: READING_FEATURE_IMAGE,
    excerpt: "When the home and school speak with one unified voice, the child experiences exponential growth in confidence and academic diligence.",
    readTime: "3 min read",
    tags: ["Parenting", "Community", "Collaboration"],
    content: [
      "A child's education is a three-way partnership among the pupil, the teachers, and the family.",
      "At RGGA, we maintain transparent, ongoing communication through daily progress books, parent-teacher conferences, and digital updates.",
      "We encourage parents to create quiet homework routines, celebrate small milestones, and model a love for reading at home.",
      "Together, parents and educators create an unbreakable safety net that supports the child through every developmental milestone."
    ]
  },
  {
    id: "post-11",
    title: "Science in Action: Practical Laboratory Experiments in Secondary School",
    category: "Academics",
    date: "August 22, 2026",
    author: "Mr. Aniekan Okon",
    authorRole: "Dean of Studies",
    previewImage: STEM_FEATURE_IMAGE,
    fullImage: STEM_FEATURE_IMAGE,
    excerpt: "Hands-on physics, chemistry, and biology laboratory sessions that bring theoretical textbook concepts to life.",
    readTime: "5 min read",
    tags: ["Science Lab", "Secondary", "Experiments"],
    content: [
      "Theoretical science is incomplete without empirical verification. In our dedicated science laboratories, students put theory to the test.",
      "From titrations in chemistry and optics in physics to dissection and microscope work in biology, learners develop precision laboratory techniques.",
      "Safety protocols, meticulous measurement, and clear lab reporting are taught as essential foundational habits.",
      "These authentic experiments ignite scientific curiosity and prepare future doctors, engineers, and researchers."
    ]
  },
  {
    id: "post-12",
    title: "The Art of Public Speaking: Building Oratory Confidence and Debate Skills",
    category: "Student Life",
    date: "August 18, 2026",
    author: "Ms. Victoria Bassey",
    authorRole: "Creative Arts Director",
    previewImage: ARTS_FEATURE_IMAGE,
    fullImage: ARTS_FEATURE_IMAGE,
    excerpt: "How speech competitions, assembly presentations, and the debate club help learners express ideas with clarity and poise.",
    readTime: "4 min read",
    tags: ["Public Speaking", "Debate", "Confidence"],
    content: [
      "The ability to articulate thoughts clearly, persuasively, and respectfully is one of the most powerful leadership traits a young person can cultivate.",
      "Through weekly debate club sessions, inter-house speech contests, and classroom presentations, our students learn the art of structured rhetoric.",
      "They practice projection, body language, research-backed argumentation, and active listening.",
      "Shy children blossom into confident communicators capable of addressing audiences with grace and conviction."
    ]
  },
  {
    id: "post-13",
    title: "Promoting Physical Fitness & Health Wellness in Young Learners",
    category: "Student Life",
    date: "August 14, 2026",
    author: "Mr. Kufre Asuquo",
    authorRole: "Sports & PE Lead",
    previewImage: DEFAULT_FEATURE_IMAGE,
    fullImage: DEFAULT_FEATURE_IMAGE,
    excerpt: "A healthy body supports an active mind: physical education drills, sports days, and nutritional wellness habits at RGGA.",
    readTime: "3 min read",
    tags: ["Sports", "Fitness", "Health"],
    content: [
      "Physical activity is directly correlated with cognitive performance, emotional resilience, and sound sleep habits in growing children.",
      "Our structured physical education program introduces pupils to football, volleyball, athletics, gymnastics, and aerobic fitness.",
      "Beyond physical conditioning, sports teach teamwork, emotional composure under pressure, and gracious victory and defeat.",
      "We encourage balanced nutrition, proper hydration, and daily movement to build energetic, resilient young people."
    ]
  },
  {
    id: "post-14",
    title: "Creative Writing & Storytelling: Inspiring the Next Generation of Authors",
    category: "Early Years & Primary",
    date: "August 10, 2026",
    author: "Mrs. Imaobong Inyang",
    authorRole: "Head Teacher — Primary Section",
    previewImage: READING_FEATURE_IMAGE,
    fullImage: READING_FEATURE_IMAGE,
    excerpt: "Unlocking children's boundless imaginations through guided narrative writing, poetry workshops, and storytelling festivals.",
    readTime: "4 min read",
    tags: ["Creative Writing", "Storytelling", "Expression"],
    content: [
      "Every child possesses a vivid, imaginative internal world waiting to be given voice through the written word.",
      "Our creative writing workshops guide learners through character development, world-building, descriptive sensory details, and narrative pacing.",
      "Children write their own illustrated storybooks and perform original poems during school literacy showcases.",
      "This creative practice deepens vocabulary, sharpens grammatical intuition, and instills pride in personal creative expression."
    ]
  },
  {
    id: "post-15",
    title: "Civic Responsibility & Leadership: Raising Tomorrow's Ethical Community Leaders",
    category: "Faith & Character",
    date: "August 6, 2026",
    author: "Mr. Bassey Udoh",
    authorRole: "Principal / Head of School",
    previewImage: FAITH_FEATURE_IMAGE,
    fullImage: FAITH_FEATURE_IMAGE,
    excerpt: "Preparing pupils to actively contribute to the development of Akwa Ibom State, Nigeria, and the global community.",
    readTime: "5 min read",
    tags: ["Civic Duty", "Leadership", "Service"],
    content: [
      "True leadership is not measured by title or power, but by humble service and dedication to the common good.",
      "Through civic education, student council elections, and environmental stewardship projects, RGGA pupils experience active citizenship.",
      "We encourage young leaders to identify community needs, propose collaborative solutions, and practice servant leadership daily.",
      "We are proud to raise patriotic, principled leaders who will champion progress, equity, and peace in Nigeria and beyond."
    ]
  },
  {
    id: "post-16",
    title: "Continuous Assessment & Formative Feedback: Checking Every Learner's Understanding",
    category: "Academics",
    date: "August 2, 2026",
    author: "Mr. Aniekan Okon",
    authorRole: "Dean of Studies",
    previewImage: SECONDARY_FEATURE_IMAGE,
    fullImage: SECONDARY_FEATURE_IMAGE,
    excerpt: "How weekly diagnostic checkpoints and constructive feedback ensure no child gets left behind in any subject.",
    readTime: "4 min read",
    tags: ["Assessment", "Pedagogy", "Academics"],
    content: [
      "Assessment at RGGA is not a high-stress post-mortem exam; it is an ongoing compass that guides daily classroom teaching.",
      "Through formative exit tickets, low-stakes weekly quizzes, and verbal check-ins, educators gauge comprehension in real-time.",
      "Identified gaps are immediately addressed through peer tutoring, small group interventions, and personalized practice exercises.",
      "This consistent feedback loop builds mastery, prevents anxiety, and ensures steady, verifiable academic progress."
    ]
  },
  {
    id: "post-17",
    title: "Music Education & Cognitive Development: Why Choir and Instruments Matter",
    category: "Student Life",
    date: "July 28, 2026",
    author: "Ms. Victoria Bassey",
    authorRole: "Creative Arts Director",
    previewImage: ARTS_FEATURE_IMAGE,
    fullImage: ARTS_FEATURE_IMAGE,
    excerpt: "The neurological and emotional benefits of early music education, rhythmic training, and choral performance.",
    readTime: "4 min read",
    tags: ["Music", "Choir", "Brain Development"],
    content: [
      "Neuroscience affirms that active musical training engages nearly every area of the brain simultaneously, enhancing memory and spatial reasoning.",
      "Our music syllabus introduces students to pitch, rhythm, keyboard basics, brass, percussion, and choral harmony.",
      "Singing in harmony requires deep listening, disciplined timing, and collective synchronization.",
      "The joy and spiritual uplift of school worship and choral performances leave an indelible, positive imprint on each pupil's soul."
    ]
  },
  {
    id: "post-18",
    title: "Developing Independent Study Habits and Time Management in Teens",
    category: "Academics",
    date: "July 24, 2026",
    author: "Mr. Bassey Udoh",
    authorRole: "Principal / Head of School",
    previewImage: DEFAULT_FEATURE_IMAGE,
    fullImage: DEFAULT_FEATURE_IMAGE,
    excerpt: "Equipping secondary students with planner systems, focus techniques, and spaced repetition methods for lifelong autonomy.",
    readTime: "5 min read",
    tags: ["Study Habits", "Teens", "Time Management"],
    content: [
      "The shift from structured childhood to secondary education demands greater autonomy and intentional time management.",
      "We teach students how to break complex syllabus topics into manageable study blocks, create personalized timetables, and eliminate digital distractions.",
      "Techniques such as active recall, self-quizzing, and spaced repetition replace ineffective passive rereading.",
      "These self-discipline habits ensure that our graduates excel not only in secondary school, but throughout university and professional careers."
    ]
  }
];

export const BLOG_COVER_PRESETS = [
  { label: "Early Childhood & Literacy", url: READING_FEATURE_IMAGE },
  { label: "STEM & Robotics Innovation", url: STEM_FEATURE_IMAGE },
  { label: "Faith, Morals & Character", url: FAITH_FEATURE_IMAGE },
  { label: "Music & Creative Arts", url: ARTS_FEATURE_IMAGE },
  { label: "Secondary Science & Labs", url: SECONDARY_FEATURE_IMAGE },
  { label: "General Campus Life", url: DEFAULT_FEATURE_IMAGE },
];

export const initialBlogComments: BlogComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    authorName: "Mrs. Nseobong Udoh",
    authorRole: "Nursery 2 Parent",
    isAnonymous: false,
    content: "The synthetic phonics framework has worked wonders for my daughter. She now eagerly decodes bedtime storybooks by herself!",
    date: "October 1, 2026 at 4:30 PM",
    status: "published",
  },
  {
    id: "comment-2",
    postId: "post-1",
    authorName: "Anonymous Parent",
    authorRole: "Parent",
    isAnonymous: true,
    content: "Thank you for the take-home reading logs. It has made home reading revision structured, joyful, and consistent.",
    date: "October 2, 2026 at 9:15 AM",
    status: "published",
  },
  {
    id: "comment-3",
    postId: "post-3",
    authorName: "Engr. Patrick Etim",
    authorRole: "Primary 5 Parent",
    isAnonymous: false,
    content: "Seeing the children build circuits and write simple code is truly inspiring. Kudos to the STEM instructors!",
    date: "September 25, 2026 at 2:10 PM",
    status: "published",
  },
  {
    id: "comment-4",
    postId: "post-2",
    authorName: "Anonymous Reader",
    authorRole: "Community Member",
    isAnonymous: true,
    content: "Moral grounding and character education are so essential in today's world. Blessings to the leadership of RGGA.",
    date: "September 29, 2026 at 11:04 AM",
    status: "published",
  },
];

const STORAGE_KEY = "rgga_blog_posts";
const COMMENTS_KEY = "rgga_blog_comments";
const AUTH_KEY = "rgga_admin_auth";

// Normalize seed posts to have published status
const normalizedInitialPosts: BlogPost[] = initialBlogPosts.map((p) => ({
  ...p,
  status: p.status || "published",
}));

export function getStoredBlogPosts(includeAllStatuses = false): BlogPost[] {
  if (typeof window === "undefined") {
    return includeAllStatuses
      ? normalizedInitialPosts
      : normalizedInitialPosts.filter((p) => p.status === "published" || !p.status);
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedInitialPosts));
      return includeAllStatuses
        ? normalizedInitialPosts
        : normalizedInitialPosts.filter((p) => p.status === "published" || !p.status);
    }
    const parsed: BlogPost[] = JSON.parse(saved);
    const postList = Array.isArray(parsed) && parsed.length > 0 ? parsed : normalizedInitialPosts;
    
    if (includeAllStatuses) {
      return postList;
    }
    return postList.filter((p) => p.status === "published" || !p.status);
  } catch (e) {
    console.error("Failed to load blog posts from localStorage", e);
    return includeAllStatuses
      ? normalizedInitialPosts
      : normalizedInitialPosts.filter((p) => p.status === "published" || !p.status);
  }
}

export function getAllBlogPosts(): BlogPost[] {
  return getStoredBlogPosts(true);
}

export function saveBlogPost(post: BlogPost): BlogPost[] {
  const current = getAllBlogPosts();
  const postToSave: BlogPost = {
    ...post,
    status: post.status || "published",
  };
  const updated = [postToSave, ...current.filter((p) => p.id !== post.id)];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function submitPostForReview(postData: {
  title: string;
  category: string;
  author: string;
  authorRole: string;
  submitterRole?: SubmitterRole | string;
  submitterEmail?: string;
  previewImage: string;
  fullImage: string;
  excerpt: string;
  content: string[];
  tags: string[];
}): BlogPost {
  const allPosts = getAllBlogPosts();
  const wordCount = postData.content.join(" ").split(" ").length;
  const readTimeCalc = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

  const newPost: BlogPost = {
    id: `post-sub-${Date.now()}`,
    title: postData.title,
    category: postData.category,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    author: postData.author,
    authorRole: postData.authorRole || (postData.submitterRole ? `${postData.submitterRole} Contributor` : "Community Contributor"),
    submitterRole: postData.submitterRole || "Parent",
    submitterEmail: postData.submitterEmail,
    submittedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    previewImage: postData.previewImage || DEFAULT_FEATURE_IMAGE,
    fullImage: postData.fullImage || postData.previewImage || DEFAULT_FEATURE_IMAGE,
    excerpt: postData.excerpt,
    readTime: readTimeCalc,
    content: postData.content,
    tags: postData.tags.length > 0 ? postData.tags : ["Community", "Education"],
    status: "pending",
  };

  const updated = [newPost, ...allPosts];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newPost;
}

export function approveBlogPost(id: string): BlogPost[] {
  const current = getAllBlogPosts();
  const updated = current.map((p) =>
    p.id === id
      ? {
          ...p,
          status: "published" as BlogPostStatus,
          rejectionReason: undefined,
          date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        }
      : p
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function rejectBlogPost(id: string, reason?: string): BlogPost[] {
  const current = getAllBlogPosts();
  const updated = current.map((p) =>
    p.id === id
      ? {
          ...p,
          status: "rejected" as BlogPostStatus,
          rejectionReason: reason || "Does not meet editorial guidelines at this time.",
        }
      : p
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function updateBlogPost(post: BlogPost): BlogPost[] {
  const current = getAllBlogPosts();
  const updated = current.map((p) => (p.id === post.id ? post : p));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteBlogPost(id: string): BlogPost[] {
  const current = getAllBlogPosts();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function resetBlogPosts(): BlogPost[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedInitialPosts));
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(initialBlogComments));
  }
  return normalizedInitialPosts;
}

// ==========================================
// Blog Comments Storage & Moderation Helpers
// ==========================================

export function getStoredComments(): BlogComment[] {
  if (typeof window === "undefined") return initialBlogComments;
  try {
    const saved = localStorage.getItem(COMMENTS_KEY);
    if (!saved) {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(initialBlogComments));
      return initialBlogComments;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialBlogComments;
  } catch (e) {
    console.error("Failed to load blog comments from localStorage", e);
    return initialBlogComments;
  }
}

const COMMENT_MODERATION_MODE_KEY = "rgga_require_comment_approval";

export function isCommentApprovalRequired(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COMMENT_MODERATION_MODE_KEY) === "true";
}

export function setCommentApprovalRequired(required: boolean): boolean {
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENT_MODERATION_MODE_KEY, required ? "true" : "false");
  }
  return required;
}

export function getCommentsForPost(postId: string): BlogComment[] {
  const allComments = getStoredComments();
  return allComments.filter((c) => c.postId === postId && (c.status === "published" || !c.status));
}

export function saveComment(commentData: {
  postId: string;
  authorName: string;
  authorRole?: string;
  isAnonymous: boolean;
  content: string;
}): BlogComment {
  const allComments = getStoredComments();
  const requiresApproval = isCommentApprovalRequired();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const newComment: BlogComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    postId: commentData.postId,
    authorName: commentData.isAnonymous ? "Anonymous Contributor" : (commentData.authorName.trim() || "Community Member"),
    authorRole: commentData.isAnonymous ? (commentData.authorRole || "Anonymous Reader") : (commentData.authorRole || "Community Member"),
    isAnonymous: commentData.isAnonymous,
    content: commentData.content.trim(),
    date: formattedDate,
    status: requiresApproval ? "pending" : "published",
  };

  const updated = [newComment, ...allComments];
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  }
  return newComment;
}

export function approveComment(id: string): BlogComment[] {
  const allComments = getStoredComments();
  const updated = allComments.map((c) =>
    c.id === id ? { ...c, status: "published" as const } : c
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function approveCommentsBulk(ids: string[]): BlogComment[] {
  const idSet = new Set(ids);
  const allComments = getStoredComments();
  const updated = allComments.map((c) =>
    idSet.has(c.id) ? { ...c, status: "published" as const } : c
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteComment(id: string): BlogComment[] {
  const allComments = getStoredComments();
  const updated = allComments.filter((c) => c.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteCommentsBulk(ids: string[]): BlogComment[] {
  const idSet = new Set(ids);
  const allComments = getStoredComments();
  const updated = allComments.filter((c) => !idSet.has(c.id));
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

// Authentication Helpers
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true" || localStorage.getItem(AUTH_KEY) === "true";
}

export function loginAdmin(username: string, pass: string): boolean {
  const expectedUser = import.meta.env.VITE_ADMIN_USERNAME || "admin";
  const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD || "admin";

  if (username.trim() === expectedUser && pass.trim() === expectedPass) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_KEY, "true");
    }
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  }
}

