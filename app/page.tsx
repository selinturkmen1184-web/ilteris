"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  AlertTriangle, ArrowRight, BadgeCheck, BarChart3, Bell, Blocks, BookOpen,
  Box, Check, CheckCircle2, ChevronDown, CircleUserRound, Clock3, Code2,
  Compass, Cpu, Download, ExternalLink, Eye, FileArchive, Filter, Flag,
  FolderKanban, Gauge, Hash, Heart, Home, Image as ImageIcon, Languages,
  Layers3, LockKeyhole, Menu, MessageCircle, Monitor, Moon, MoreHorizontal,
  Palette, Paperclip, Plus, Radio, RotateCcw, Search, Send, Settings,
  ShieldAlert, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Trash2,
  UserRound, Users, Volume2, VolumeX, Wifi, X,
} from "lucide-react";

type View = "home" | "explore" | "projects" | "blogs" | "profile" | "settings" | "admin";
type ContentType = "project" | "blog" | "post";
type Modal = "create" | "detail" | "report" | "download" | "external" | "delete" | null;

type ContentItem = {
  id: number;
  type: ContentType;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  time: string;
  likes: number;
  comments: number;
  views: string;
  tone: string;
  featured?: boolean;
};

const seedContent: ContentItem[] = [
  { id: 1, type: "project", title: "Bitkilerin dilinden anlayan açık kaynak saksı", excerpt: "ESP32, kapasitif nem sensörü ve açık hava verileriyle çalışan kendi kendine öğrenen bakım sistemi.", category: "IoT", tags: ["ESP32", "sensör", "açık-kaynak"], date: "Bugün", time: "12 dk", likes: 284, comments: 38, views: "2.8K", tone: "green", featured: true },
  { id: 2, type: "project", title: "Atık filamentten masaüstü enjeksiyon makinesi", excerpt: "3D baskı atıklarını yeni parçalara dönüştüren düşük maliyetli mekanik düzenek.", category: "Maker", tags: ["3D-yazıcı", "geri-dönüşüm"], date: "Dün", time: "9 dk", likes: 196, comments: 24, views: "1.9K", tone: "purple" },
  { id: 3, type: "project", title: "Raspberry Pi ile yerel yapay zekâ asistanı", excerpt: "İnternete veri göndermeden, ev ağında çalışan sesli komut ve otomasyon projesi.", category: "Yapay zekâ", tags: ["Raspberry-Pi", "Python", "yerel-AI"], date: "2 gün önce", time: "18 dk", likes: 421, comments: 57, views: "5.1K", tone: "blue" },
  { id: 4, type: "blog", title: "Bir yan projeyi gerçekten bitirmenin anatomisi", excerpt: "Fikirden ilk çalışan prototipe uzanan süreçte kapsamı korumak için kullandığım yöntemler.", category: "Proje günlüğü", tags: ["üretkenlik", "deneyim"], date: "Bugün", time: "6 dk", likes: 156, comments: 19, views: "1.4K", tone: "orange" },
  { id: 5, type: "blog", title: "Web uygulamalarında erişilebilirlik: gerçek bir kontrol listesi", excerpt: "Klavye, ekran okuyucu, kontrast ve hareket tercihleri için uygulanabilir bir rehber.", category: "Web geliştirme", tags: ["a11y", "frontend"], date: "Dün", time: "11 dk", likes: 233, comments: 31, views: "3.2K", tone: "cyan" },
  { id: 6, type: "post", title: "STM32 mi ESP32 mi? Düşük güç tüketimi için hangisini seçerdiniz?", excerpt: "Sensör verisini günde dört kez gönderecek pilli bir saha cihazı tasarlıyorum. Deneyimlerinizi merak ediyorum.", category: "Elektronik", tags: ["STM32", "ESP32", "düşük-güç"], date: "18 dk önce", time: "1 dk", likes: 47, comments: 16, views: "684", tone: "green" },
  { id: 7, type: "post", title: "Açık kaynak Türkçe veri setleri listesi hazırlıyorum", excerpt: "Kullandığınız temiz ve lisansı açık veri setlerini bağlantılarıyla paylaşabilir misiniz?", category: "Yapay zekâ", tags: ["veri", "açık-kaynak"], date: "42 dk önce", time: "1 dk", likes: 82, comments: 29, views: "912", tone: "purple" },
  { id: 8, type: "blog", title: "İlk PCB siparişimde yaptığım yedi hata", excerpt: "Footprint ölçülerinden üretim toleranslarına, pahalıya öğrendiğim küçük ama kritik detaylar.", category: "Elektronik", tags: ["PCB", "rehber"], date: "3 gün önce", time: "8 dk", likes: 308, comments: 44, views: "4.7K", tone: "red" },
];

const categories = [
  { name: "Yazılım", icon: Code2, count: "3.2K" }, { name: "Yapay zekâ", icon: Cpu, count: "1.8K" },
  { name: "Elektronik", icon: Wifi, count: "2.4K" }, { name: "Maker", icon: Blocks, count: "1.1K" },
  { name: "3D tasarım", icon: Box, count: "864" }, { name: "IoT", icon: Layers3, count: "1.5K" },
];

const copy = {
  tr: {
    home: "Ana sayfa", explore: "Keşfet", projects: "Projeler", blogs: "Bloglar", profile: "Profil", settings: "Ayarlar",
    community: "Topluluk", safety: "Güvenlik", signIn: "Anonim giriş", create: "İçerik üret", anonymous: "Anonim",
    heroTag: "Türkiye’nin anonim teknoloji topluluğu", heroA: "Fikrini özgür bırak.", heroB: "Kimliğini değil.",
    heroP: "Projeni göster, bildiklerini paylaş, merak ettiklerini sor. Gerçek isimler olmadan; sadece üreten insanlar ve iyi fikirler.",
    searchPlaceholder: "Proje, blog, konu veya kullanıcı ID’si ara...", search: "Ara", trending: "Şu an gündemde",
    discoverTitle: "Bugün ne üretiliyor?", seeAll: "Tümünü keşfet", popular: "Öne çıkan projeler", freshBlogs: "Taze fikirler, derin yazılar",
    recent: "Topluluk akışı", all: "Tümü", project: "Proje", blog: "Blog", post: "Gönderi", report: "Raporla",
    loadMore: "Daha fazlasını göster", categories: "Teknoloji alanları", profileSub: "Ürettiklerin burada, kimliğin sende kalır.",
  },
  en: {
    home: "Home", explore: "Explore", projects: "Projects", blogs: "Blog", profile: "Profile", settings: "Settings",
    community: "Community", safety: "Safety", signIn: "Anonymous sign in", create: "Create", anonymous: "Anonymous",
    heroTag: "Türkiye’s anonymous technology community", heroA: "Set your idea free.", heroB: "Not your identity.",
    heroP: "Show your project, share what you know and ask what you wonder. No real names—just makers and good ideas.",
    searchPlaceholder: "Search projects, blogs, topics or a user ID...", search: "Search", trending: "Trending now",
    discoverTitle: "What is being built today?", seeAll: "Explore all", popular: "Featured projects", freshBlogs: "Fresh ideas, deeper reads",
    recent: "Community feed", all: "All", project: "Project", blog: "Blog", post: "Post", report: "Report",
    loadMore: "Show more", categories: "Technology fields", profileSub: "Your work is here; your identity stays with you.",
  },
} as const;

const accentColors = { lime: "#b8f65b", blue: "#5dd9ff", purple: "#9a7cff", red: "#ff6e77", white: "#f5f7f6" };

export default function HomePage() {
  const [view, setView] = useState<View>("home");
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<ContentItem>(seedContent[0]);
  const [content, setContent] = useState<ContentItem[]>(seedContent);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ContentType>("all");
  const [categoryFilter, setCategoryFilter] = useState("Tümü");
  const [sort, setSort] = useState("Popülerlik");
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accent, setAccent] = useState<keyof typeof accentColors>("lime");
  const [aurora, setAurora] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [atmosphere, setAtmosphere] = useState(false);
  const [volume, setVolume] = useState(18);
  const [notifications, setNotifications] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileTab, setProfileTab] = useState("Projeler");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");
  const [toast, setToast] = useState("");
  const [newType, setNewType] = useState<ContentType>("project");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("Yazılım");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>(["Devre şemasını da paylaşabilir misin? Çok iyi görünüyor.", "Benzer bir sensörü dış mekânda denedim; kalibrasyon kısmına dikkat etmek gerekiyor."]);
  const [userId, setUserId] = useState("583920174");
  const [pendingUrl, setPendingUrl] = useState("https://github.com/");
  const searchRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode; sources: OscillatorNode[] } | null>(null);
  const t = copy[lang];

  useEffect(() => {
    const saved = localStorage.getItem("ilteris-preferences");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.lang) setLang(p.lang); if (p.theme) setTheme(p.theme); if (p.accent) setAccent(p.accent);
        if (typeof p.aurora === "boolean") setAurora(p.aurora); if (typeof p.reduceMotion === "boolean") setReduceMotion(p.reduceMotion);
      } catch { /* Ignore invalid local demo data. */ }
    }
    const storedId = localStorage.getItem("ilteris-anon-id");
    if (storedId) setUserId(storedId);
    else localStorage.setItem("ilteris-anon-id", userId);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("ilteris-preferences", JSON.stringify({ lang, theme, accent, aurora, reduceMotion }));
    document.documentElement.lang = lang;
  }, [lang, theme, accent, aurora, reduceMotion]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") { setModal(null); setMobileMenu(false); }
    };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.gain.gain.setTargetAtTime(volume / 1000, audioRef.current.ctx.currentTime, .08);
  }, [volume]);

  useEffect(() => () => { audioRef.current?.ctx.close(); }, []);

  const showToast = (message: string) => {
    setToast(message); window.setTimeout(() => setToast(""), 2800);
  };

  const go = (next: View) => {
    setView(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const submitSearch = (e?: FormEvent) => {
    e?.preventDefault(); const clean = query.trim(); setSearchTerm(clean); setView("explore");
    if (/^\d{7,10}$/.test(clean)) { setUserId(clean); setView("profile"); showToast("Anonim profil ID ile bulundu."); }
  };

  const filtered = useMemo(() => {
    const needle = searchTerm.toLocaleLowerCase("tr");
    return content.filter((item) => (typeFilter === "all" || item.type === typeFilter) && (categoryFilter === "Tümü" || item.category === categoryFilter) && (!needle || [item.title, item.excerpt, item.category, ...item.tags].join(" ").toLocaleLowerCase("tr").includes(needle)));
  }, [content, searchTerm, typeFilter, categoryFilter]);

  const openDetail = (item: ContentItem) => { setSelected(item); setModal("detail"); };
  const openReport = (item: ContentItem) => { setSelected(item); setModal("report"); };

  const createContent = (e: FormEvent) => {
    e.preventDefault();
    if (newTitle.trim().length < 5 || newBody.trim().length < 20) { showToast("Başlık ve içerik alanlarını biraz daha ayrıntılı doldur."); return; }
    const item: ContentItem = { id: Date.now(), type: newType, title: newTitle.trim(), excerpt: newBody.trim(), category: newCategory, tags: [newCategory.toLocaleLowerCase("tr"), "yeni"], date: "Şimdi", time: "1 dk", likes: 0, comments: 0, views: "1", tone: "green" };
    setContent((items) => [item, ...items]); setSelected(item); setNewTitle(""); setNewBody(""); setModal("detail"); showToast("İçeriğin anonim olarak yayınlandı.");
  };

  const addComment = () => {
    if (comment.trim().length < 3) return;
    const now = Date.now(); const saved: number[] = JSON.parse(localStorage.getItem("ilteris-comment-times") || "[]");
    const recent = saved.filter((time) => now - time < 3600000);
    if (recent.length >= 4) { showToast("Saatlik 4 yorum sınırına ulaştın."); return; }
    localStorage.setItem("ilteris-comment-times", JSON.stringify([...recent, now]));
    setComments((items) => [comment.trim(), ...items]); setComment(""); showToast("Yorumun anonim olarak eklendi.");
  };

  const toggleAtmosphere = async () => {
    if (atmosphere) {
      await audioRef.current?.ctx.close(); audioRef.current = null; setAtmosphere(false); return;
    }
    const ctx = new AudioContext(); const gain = ctx.createGain(); gain.gain.value = volume / 1000; gain.connect(ctx.destination);
    const freqs = [110, 164.81, 220];
    const sources = freqs.map((frequency, index) => { const oscillator = ctx.createOscillator(); const localGain = ctx.createGain(); oscillator.type = index === 1 ? "triangle" : "sine"; oscillator.frequency.value = frequency; localGain.gain.value = index === 0 ? .7 : .22; oscillator.connect(localGain).connect(gain); oscillator.start(); return oscillator; });
    audioRef.current = { ctx, gain, sources }; setAtmosphere(true); showToast("Atmosfer sesi açıldı. Kontrol tamamen sende.");
  };

  const typeName = (type: ContentType) => t[type];

  const navItems: { key: View; label: string; icon: typeof Home }[] = [
    { key: "home", label: t.home, icon: Home }, { key: "explore", label: t.explore, icon: Compass },
    { key: "projects", label: t.projects, icon: FolderKanban }, { key: "blogs", label: t.blogs, icon: BookOpen },
  ];

  const ContentCard = ({ item, wide = false }: { item: ContentItem; wide?: boolean }) => (
    <article className={`content-card tone-${item.tone} ${wide ? "wide" : ""}`}>
      <button className="card-main" onClick={() => openDetail(item)} aria-label={`${item.title} içeriğini aç`}>
        <div className="card-visual" aria-hidden="true">
          <div className="visual-grid" /><span className="visual-code">{item.type === "project" ? "{ build(); }" : item.type === "blog" ? "// learn → share" : "010101"}</span>
          <div className="visual-orbit"><i /><i /><i /></div>
        </div>
        <div className="card-body">
          <div className="card-topline"><span>{typeName(item.type)}</span><small>{item.date} · {item.time}</small></div>
          <h3>{item.title}</h3><p>{item.excerpt}</p>
          <div className="tag-row">{item.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</div>
        </div>
      </button>
      <div className="card-footer"><span><CircleUserRound size={14} /> {t.anonymous}</span><div><span><Eye size={14} />{item.views}</span><span><Heart size={14} />{item.likes}</span><span><MessageCircle size={14} />{item.comments}</span><button onClick={() => openReport(item)} aria-label={t.report}><Flag size={14} /></button></div></div>
    </article>
  );

  const FeedItem = ({ item }: { item: ContentItem }) => (
    <article className="feed-item">
      <button className="avatar" onClick={() => go("profile")} aria-label="Anonim profili aç">A</button>
      <div className="feed-copy"><div className="feed-meta"><b>{t.anonymous}</b><span>· {item.date}</span><em>{typeName(item.type)}</em></div><button onClick={() => openDetail(item)}><h3>{item.title}</h3><p>{item.excerpt}</p></button><div className="tag-row">{item.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><div className="feed-actions"><button><Heart size={16} />{item.likes}</button><button onClick={() => openDetail(item)}><MessageCircle size={16} />{item.comments}</button><button onClick={() => openReport(item)}><Flag size={15} />{t.report}</button></div></div>
      <button className="more-button" onClick={() => openReport(item)} aria-label="Diğer seçenekler"><MoreHorizontal size={18} /></button>
    </article>
  );

  const Header = () => (
    <header className="topbar">
      <button className="mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Menüyü aç"><Menu /></button>
      <button className="wordmark" onClick={() => go("home")}>ilteris<span>.com.tr</span></button>
      <nav className="top-links" aria-label="Hızlı bağlantılar"><button onClick={() => go("explore")}>{t.community}</button><button onClick={() => go("settings")}>{t.safety}</button></nav>
      <button className="compact-search" onClick={() => { go("explore"); setTimeout(() => searchRef.current?.focus(), 50); }} aria-label="Arama"><Search size={17} /><span>{t.search}</span><kbd>⌘K</kbd></button>
      <div className="header-actions"><button className="icon-button" aria-label="Bildirimler"><Bell size={16} /><i /></button><button className="sign-in" onClick={() => go("profile")}><CircleUserRound size={16} /> {t.signIn}</button></div>
    </header>
  );

  const SearchBar = ({ hero = false }: { hero?: boolean }) => (
    <form className={`search-box ${hero ? "hero-search" : ""}`} onSubmit={submitSearch} role="search">
      <Search size={20} /><input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Site içinde ara" placeholder={t.searchPlaceholder} /><kbd>⌘ K</kbd><button type="submit">{t.search}<ArrowRight size={15} /></button>
    </form>
  );

  const HomeView = () => (
    <>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> {t.heroTag}</div><h1>{t.heroA}<br /><em>{t.heroB}</em></h1><p>{t.heroP}</p><SearchBar hero /><div className="topics"><span>{t.trending}</span>{["#yapay-zeka", "#arduino", "#react", "#3d-yazici"].map((topic) => <button key={topic} onClick={() => { setQuery(topic.slice(1)); setSearchTerm(topic.slice(1)); go("explore"); }}>{topic}</button>)}</div></div>
        <div className="signal-panel" aria-label="Topluluk özeti"><div className="signal-head"><span><Radio size={12} /> CANLI AKIŞ</span><b>son 24 saat</b></div><div className="signal-count"><strong>1.284</strong><span>üretim<br />paylaşıldı</span></div><div className="wave-bars" aria-hidden="true">{[35,52,41,68,47,82,59,93,64,78,46,71,57,86,67,97,61,74,48,62,42,56].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div><div className="signal-stats"><div><b>328</b><span>aktif üretici</span></div><div><b>92%</b><span>çözülen soru</span></div></div><div className="privacy-note"><ShieldCheck size={20} /><p><b>Anonim, ama sahipsiz değil.</b><br />ID tabanlı yapı, topluluk kuralları ve şeffaf moderasyon.</p></div></div>
      </section>
      <section className="pulse-strip"><div><span>TOPLULUK NABZI</span><small>CANLI</small></div><p><b>12.840</b> anonim üretici</p><i /><p><b>4.206</b> açık proje</p><i /><p><b>31.7K</b> çözüm &amp; yorum</p></section>
      <section className="content-section" id="kesfet"><SectionTitle kicker="KEŞFET" title={t.discoverTitle} action={t.seeAll} onAction={() => go("explore")} /><div className="feature-grid">{content.filter((x) => x.type === "project").slice(0,3).map((item) => <ContentCard key={item.id} item={item} />)}</div></section>
      <section className="category-band"><div><span className="kicker">{t.categories.toLocaleUpperCase(lang)}</span><h2>Merak ettiğin alana dal.</h2><p>16 teknoloji alanı, binlerce ortak merak.</p></div><div className="category-grid">{categories.map(({ name, icon: Icon, count }) => <button key={name} onClick={() => { setCategoryFilter(name); go("explore"); }}><Icon size={21} /><span>{name}<small>{count} içerik</small></span><ArrowRight size={15} /></button>)}</div></section>
      <section className="content-section"><SectionTitle kicker="BLOG" title={t.freshBlogs} action={t.seeAll} onAction={() => go("blogs")} /><div className="editorial-grid">{content.filter((x) => x.type === "blog").slice(0,3).map((item, index) => <ContentCard key={item.id} item={item} wide={index === 0} />)}</div></section>
      <section className="community-section"><div className="community-head"><div><span className="kicker">AKIŞ</span><h2>{t.recent}</h2></div><button onClick={() => setModal("create")}><Plus size={17} /> {t.create}</button></div><div className="feed-list">{content.filter((x) => x.type === "post").map((item) => <FeedItem key={item.id} item={item} />)}</div></section>
      <TrustSection />
    </>
  );

  const ListingView = ({ mode }: { mode: "explore" | "projects" | "blogs" }) => {
    const title = mode === "explore" ? "Merakını takip et." : mode === "projects" ? "Fikirden çalışan şeye." : "Deneyim, rehber ve notlar.";
    const subtitle = mode === "explore" ? "Projeler, yazılar ve sorular arasında tek aramayla dolaş." : mode === "projects" ? "Topluluğun açıkça anlattığı, geliştirilebilir teknoloji projeleri." : "Anonim üreticilerden sahada sınanmış bilgi ve gerçek deneyim.";
    const visible = filtered.filter((item) => mode === "explore" || item.type === (mode === "projects" ? "project" : "blog"));
    return <section className="listing-page"><div className={`listing-hero ${mode}`}><span className="kicker">{mode === "explore" ? "MERKEZİ ARAMA" : mode.toLocaleUpperCase("tr")}</span><h1>{title}</h1><p>{subtitle}</p><SearchBar /></div><div className="filter-bar"><div className="filter-tabs">{(["all","project","blog","post"] as const).map((type) => <button key={type} className={typeFilter === type ? "active" : ""} onClick={() => setTypeFilter(type)}>{type === "all" ? t.all : typeName(type)}</button>)}</div><label><Filter size={15} /><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option>Tümü</option>{categories.map((cat) => <option key={cat.name}>{cat.name}</option>)}</select><ChevronDown size={14} /></label><label><SlidersHorizontal size={15} /><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Popülerlik</option><option>En yeni</option><option>En çok yorum</option></select><ChevronDown size={14} /></label></div><div className="results-meta"><span>{searchTerm ? <><b>“{searchTerm}”</b> için </> : null}{visible.length} sonuç</span><button onClick={() => { setSearchTerm(""); setQuery(""); setTypeFilter("all"); setCategoryFilter("Tümü"); }}><RotateCcw size={14} /> Filtreleri temizle</button></div>{visible.length ? <div className="listing-grid">{visible.map((item) => <ContentCard key={item.id} item={item} />)}</div> : <div className="empty-state"><Search size={35} /><h3>Bu aramada bir şey bulamadık.</h3><p>Başka bir anahtar kelime veya daha geniş bir filtre deneyebilirsin.</p></div>}</section>;
  };

  const ProfileView = () => {
    const tabs = ["Projeler", "Bloglar", "Gönderiler", "Yorumlar", "Rozetler"];
    return <section className="profile-page"><div className="profile-banner"><div className="profile-glow" /><div className="profile-identity"><div className="profile-avatar">A<span /></div><div><div className="profile-name"><h1>{t.anonymous}</h1><BadgeCheck size={20} /><span>DOĞRULANMIŞ</span></div><p>ID: <strong>{userId}</strong><button onClick={() => { navigator.clipboard?.writeText(userId); showToast("ID kopyalandı."); }}>Kopyala</button></p><small>{t.profileSub}</small></div></div><button className="outline-button" onClick={() => go("settings")}><Settings size={16} /> {t.settings}</button></div><div className="profile-stats"><div><b>12</b><span>Proje</span></div><div><b>8</b><span>Blog</span></div><div><b>34</b><span>Gönderi</span></div><div><b>1.8K</b><span>Katkı puanı</span></div><div className="profile-badge"><ShieldCheck size={22} /><span>Güvenilir üretici<small>2024’ten beri toplulukta</small></span></div></div><div className="profile-tabs">{tabs.map((tab) => <button key={tab} className={profileTab === tab ? "active" : ""} onClick={() => setProfileTab(tab)}>{tab}</button>)}</div>{profileTab === "Rozetler" ? <div className="badge-gallery"><BadgeCard icon={<BadgeCheck />} title="Doğrulanmış" text="Topluluk katkıları doğrulandı." /><BadgeCard icon={<Code2 />} title="Kod Ustası" text="10 açık kaynak proje yayınladı." /><BadgeCard icon={<MessageCircle />} title="İyi Komşu" text="100 faydalı yorum yaptı." /></div> : <div className="listing-grid profile-content">{content.filter((item) => profileTab === "Projeler" ? item.type === "project" : profileTab === "Bloglar" ? item.type === "blog" : true).slice(0,4).map((item) => <ContentCard key={item.id} item={item} />)}</div>}</section>;
  };

  const SettingsView = () => (
    <section className="settings-page"><div className="page-intro"><span className="kicker">KONTROL SENDE</span><h1>Deneyimini kendine göre ayarla.</h1><p>Tercihlerin yalnızca bu cihazda saklanır. İstediğin zaman değiştirebilirsin.</p></div><div className="settings-layout"><nav>{[[Palette,"Görünüm"],[Languages,"Dil"],[Bell,"Bildirimler"],[ShieldCheck,"Gizlilik"],[CircleUserRound,"Hesap"]].map(([Icon,label]) => { const C = Icon as typeof Palette; return <a key={label as string} href={`#setting-${label}`}><C size={17} />{label as string}</a>; })}</nav><div className="settings-panels"><SettingPanel id="setting-Görünüm" icon={<Palette />} title="Görünüm ve atmosfer" text="Temayı, vurgu rengini ve hareket düzeyini seç."><div className="setting-group"><label>Tema</label><div className="choice-row">{(["dark","light","system"] as const).map((item) => <button key={item} className={theme === item ? "active" : ""} onClick={() => setTheme(item)}>{item === "dark" ? <Moon /> : item === "light" ? <Sun /> : <Monitor />}{item === "dark" ? "Koyu" : item === "light" ? "Açık" : "Sistem"}<span>{theme === item && <Check />}</span></button>)}</div></div><div className="setting-group"><label>Vurgu rengi</label><div className="swatches">{Object.entries(accentColors).map(([name,color]) => <button key={name} className={accent === name ? "active" : ""} style={{background: color}} onClick={() => setAccent(name as keyof typeof accentColors)} aria-label={`${name} vurgu rengi`} />)}</div></div><ToggleRow title="Akışkan aurora" text="Mor, mavi ve yeşil ışık dalgaları." value={aurora} setValue={setAurora} /><ToggleRow title="Animasyonları azalt" text="Geçişleri ve arka plan hareketini sınırlar." value={reduceMotion} setValue={setReduceMotion} /><div className="atmosphere-row"><div><b>Atmosfer sesi</b><span>Yalnızca sen başlattığında çalan sakin synth dokusu.</span></div><button onClick={toggleAtmosphere}>{atmosphere ? <Volume2 /> : <VolumeX />}{atmosphere ? "Açık" : "Kapalı"}</button>{atmosphere && <input type="range" min="0" max="60" value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Ses seviyesi" />}</div></SettingPanel><SettingPanel id="setting-Dil" icon={<Languages />} title="Dil" text="Menü, buton ve sistem mesajlarının dilini değiştir."><div className="language-cards"><button className={lang === "tr" ? "active" : ""} onClick={() => setLang("tr")}><b>TR</b><span>Türkçe<small>Varsayılan</small></span>{lang === "tr" && <CheckCircle2 />}</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}><b>EN</b><span>English<small>International</small></span>{lang === "en" && <CheckCircle2 />}</button></div></SettingPanel><SettingPanel id="setting-Bildirimler" icon={<Bell />} title="Bildirimler" text="Yorum, rapor ve sistem bildirimlerini yönet."><ToggleRow title="Topluluk bildirimleri" text="İçeriklerine gelen yorumlar ve yanıtlar." value={notifications} setValue={setNotifications} /><ToggleRow title="Yönetici ve sistem mesajları" text="Güvenlik ve hesapla ilgili önemli bildirimler." value={true} setValue={() => showToast("Güvenlik bildirimleri kapatılamaz.")} /></SettingPanel><SettingPanel id="setting-Gizlilik" icon={<ShieldCheck />} title="Gizlilik" text="Anonimlik sınırlarımızı açıkça gör."><div className="transparency-box"><ShieldCheck /><p><b>Gerçek adın içeriklerde gösterilmez.</b> Gönderi, proje, blog ve yorumlarda yalnızca “Anonim” görünür; sayısal ID sadece profil sayfanda yer alır.</p></div><p className="fine-print">Kötüye kullanımı önlemek ve yasal yükümlülükleri yerine getirmek için gerekli teknik güvenlik kayıtları sınırlı süreyle tutulabilir. Bu demo herhangi bir sunucu verisi toplamaz.</p></SettingPanel><SettingPanel id="setting-Hesap" icon={<CircleUserRound />} title="Hesap" text="Anonim hesabın ve verilerin."><div className="account-id"><span>Anonim kullanıcı ID</span><b>{userId}</b></div><button className="danger-button" onClick={() => setModal("delete")}><Trash2 size={16} /> Hesabımı sil</button></SettingPanel></div></div>
    </section>
  );

  const AdminView = () => !adminUnlocked ? (
    <section className="admin-lock"><div className="lock-orbit"><LockKeyhole /></div><span className="kicker">AYRI YÖNETİM ALANI</span><h1>Bu bölüm yetki gerektirir.</h1><p>Yönetim paneli normal kullanıcı oturumlarından ayrılır. Rol ve izin kontrolleri sunucu tarafında uygulanmalıdır.</p><button onClick={() => setAdminUnlocked(true)}><ShieldCheck size={17} /> Kurucu demo panelini görüntüle</button><small>Bu buton yalnızca arayüz prototipini gösterir; gerçek yetkilendirme değildir.</small></section>
  ) : (
    <section className="admin-page"><div className="admin-head"><div><span className="kicker">YÖNETİM / GENEL BAKIŞ</span><h1>Topluluğun sağlığı.</h1><p>Kurucu rolü · Tüm sistem yetkileri</p></div><button onClick={() => setAdminUnlocked(false)}><LockKeyhole size={15} /> Paneli kilitle</button></div><div className="admin-metrics"><Metric icon={<Users />} value="12.840" label="Toplam kullanıcı" trend="+184 bu hafta" /><Metric icon={<BarChart3 />} value="4.206" label="Yayındaki içerik" trend="+8.4%" /><Metric icon={<Flag />} value="23" label="Açık rapor" trend="7 yüksek öncelik" warning /><Metric icon={<FileArchive />} value="4" label="Şüpheli dosya" trend="İnceleme bekliyor" warning /></div><div className="admin-grid"><div className="admin-panel moderation-panel"><div className="panel-title"><div><ShieldAlert /><span><b>Moderasyon kuyruğu</b><small>Önceliğe göre sıralandı</small></span></div><button>Tümünü aç <ArrowRight /></button></div>{[["Zararlı bağlantı","Gönderi #1482","Yüksek","red"],["Kişisel bilgi paylaşımı","Yorum #9041","Yüksek","red"],["Spam","Kullanıcı 724••••91","Orta","orange"],["Şüpheli dosya","esp-firmware.zip","İncele","purple"]].map((row) => <div className="queue-row" key={row[1]}><i className={row[3]} /><span><b>{row[0]}</b><small>{row[1]} · 12 dk önce</small></span><em>{row[2]}</em><button aria-label="İncele"><ArrowRight /></button></div>)}</div><div className="admin-panel system-panel"><div className="panel-title"><div><Gauge /><span><b>Sistem durumu</b><small>Son 24 saat</small></span></div></div><StatusRow label="Yorum limiti" value="4 / saat" /><StatusRow label="Dosya üst sınırı" value="25 MB" /><StatusRow label="Yeni kayıtlar" value="Açık" /><StatusRow label="Otomatik tarama" value="Planlandı" muted /><button className="panel-button"><Settings size={15} /> Sistem ayarlarını aç</button></div></div><div className="admin-actions">{[[Users,"Kullanıcılar"],[FolderKanban,"İçerikler"],[Flag,"Raporlar"],[FileArchive,"Dosyalar"],[Hash,"Kategori & etiket"],[Settings,"Genel ayarlar"]].map(([Icon,label]) => { const C = Icon as typeof Users; return <button key={label as string}><C />{label as string}<ArrowRight /></button>; })}</div></section>
  );

  return (
    <main className={`site-shell theme-${theme} ${!aurora ? "no-aurora" : ""} ${reduceMotion ? "reduce-motion" : ""}`} style={{ "--accent": accentColors[accent] } as CSSProperties}>
      <div className="aurora" aria-hidden="true"><span /><span /><span /></div><div className="noise" aria-hidden="true" />
      <aside className={`side-rail ${mobileMenu ? "mobile-open" : ""}`} aria-label="Ana menü"><button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Menüyü kapat"><X /></button><button className="brand-mark" onClick={() => go("home")} aria-label="ilteris ana sayfa">i.</button><nav>{navItems.map(({ key,label,icon:Icon }) => <button key={key} className={`rail-link ${view === key ? "active" : ""}`} onClick={() => go(key)}><Icon /><span>{label}</span></button>)}</nav><div className="rail-bottom"><button className={`rail-link ${atmosphere ? "active" : ""}`} onClick={toggleAtmosphere}>{atmosphere ? <Volume2 /> : <VolumeX />}<span>Atmosfer</span></button><button className={`rail-link ${view === "settings" ? "active" : ""}`} onClick={() => go("settings")}><Settings /><span>{t.settings}</span></button><button className={`rail-link ${view === "profile" ? "active" : ""}`} onClick={() => go("profile")}><UserRound /><span>{t.profile}</span></button></div></aside>
      <div className="page-wrap"><Header />{view === "home" && <HomeView />}{view === "explore" && <ListingView mode="explore" />}{view === "projects" && <ListingView mode="projects" />}{view === "blogs" && <ListingView mode="blogs" />}{view === "profile" && <ProfileView />}{view === "settings" && <SettingsView />}{view === "admin" && <AdminView />}<Footer onAdmin={() => go("admin")} /></div>
      <button className="floating-create" onClick={() => setModal("create")}><Plus /><span>{t.create}</span></button>
      {modal && <ModalLayer modal={modal} close={() => setModal(null)} selected={selected} t={t} newType={newType} setNewType={setNewType} newTitle={newTitle} setNewTitle={setNewTitle} newBody={newBody} setNewBody={setNewBody} newCategory={newCategory} setNewCategory={setNewCategory} createContent={createContent} reportReason={reportReason} setReportReason={setReportReason} openReport={() => setModal("report")} submitReport={() => { setModal(null); showToast("Raporun moderasyon kuyruğuna alındı."); }} pendingUrl={pendingUrl} setPendingUrl={setPendingUrl} openExternal={(url) => { setPendingUrl(url); setModal("external"); }} download={() => setModal("download")} comments={comments} comment={comment} setComment={setComment} addComment={addComment} deleteAccount={() => { localStorage.removeItem("ilteris-anon-id"); setModal(null); go("home"); showToast("Demo hesap verileri bu cihazdan kaldırıldı."); }} />}
      {toast && <div className="toast" role="status"><CheckCircle2 />{toast}</div>}
    </main>
  );
}

function SectionTitle({ kicker, title, action, onAction }: { kicker: string; title: string; action: string; onAction: () => void }) { return <div className="section-head"><div><span className="kicker">{kicker}</span><h2>{title}</h2></div><button onClick={onAction}>{action}<ArrowRight /></button></div>; }
function BadgeCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="badge-card"><div>{icon}</div><b>{title}</b><p>{text}</p></div>; }
function SettingPanel({ id, icon, title, text, children }: { id: string; icon: React.ReactNode; title: string; text: string; children: React.ReactNode }) { return <section className="setting-panel" id={id}><div className="setting-title"><span>{icon}</span><div><h2>{title}</h2><p>{text}</p></div></div>{children}</section>; }
function ToggleRow({ title, text, value, setValue }: { title: string; text: string; value: boolean; setValue: (v: boolean) => void }) { return <div className="toggle-row"><div><b>{title}</b><span>{text}</span></div><button className={value ? "on" : ""} onClick={() => setValue(!value)} role="switch" aria-checked={value}><i /></button></div>; }
function Metric({ icon, value, label, trend, warning = false }: { icon: React.ReactNode; value: string; label: string; trend: string; warning?: boolean }) { return <div className={`metric ${warning ? "warning" : ""}`}><span>{icon}</span><div><b>{value}</b><p>{label}</p><small>{trend}</small></div></div>; }
function StatusRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) { return <div className="status-row"><span>{label}</span><b className={muted ? "muted" : ""}><i />{value}</b></div>; }

function TrustSection() { return <section className="trust-section" id="guven"><div><span className="kicker">GÜVEN &amp; ANONİMLİK</span><h2>Kimliğini değil,<br />katkını hatırlarız.</h2></div><div className="trust-grid"><div><ShieldCheck /><h3>ID tabanlı anonimlik</h3><p>İçeriklerde yalnızca “Anonim” görünür. Benzersiz ID sadece profil sayfasında yer alır.</p></div><div><LockKeyhole /><h3>Şeffaf güvenlik</h3><p>Dosya ve harici bağlantı riskleri gizlenmez; kullanıcı her adımda açıkça uyarılır.</p></div><div><Users /><h3>Topluluk moderasyonu</h3><p>Kullanıcı, içerik, yorum ve dosyalar ayrı ayrı raporlanabilir; kararlar izlenebilir.</p></div></div><p className="legal-note">Platform anonim paylaşım amacıyla tasarlanmıştır. Güvenlik ve yasal yükümlülükler kapsamında gerekli teknik kayıtlar tutulabilir. Hukuka aykırı içerikler için gerekli işlemler uygulanır.</p></section>; }

function Footer({ onAdmin }: { onAdmin: () => void }) { return <footer><div className="footer-brand"><b>ilteris<span>.com.tr</span></b><p>Üret. Paylaş. Öğren. Anonim Kal.</p></div><div><b>Platform</b><a href="#kesfet">Keşfet</a><a href="#projeler">Projeler</a><a href="#bloglar">Blog</a></div><div><b>Güven</b><a href="#guven">Topluluk kuralları</a><a href="#guven">Gizlilik</a><a href="#guven">Dosya güvenliği</a></div><div><b>Yönetim</b><button onClick={onAdmin}>Yönetim paneli</button><a href="mailto:destek@ilteris.com.tr">Destek</a></div><small>© 2026 ilteris.com.tr · Anonim teknoloji topluluğu</small></footer>; }

type ModalProps = {
  modal: Exclude<Modal, null>; close: () => void; selected: ContentItem; t: typeof copy.tr | typeof copy.en;
  newType: ContentType; setNewType: (v: ContentType) => void; newTitle: string; setNewTitle: (v: string) => void; newBody: string; setNewBody: (v: string) => void; newCategory: string; setNewCategory: (v: string) => void; createContent: (e: FormEvent) => void;
  reportReason: string; setReportReason: (v: string) => void; openReport: () => void; submitReport: () => void; pendingUrl: string; setPendingUrl: (v: string) => void; openExternal: (v: string) => void; download: () => void;
  comments: string[]; comment: string; setComment: (v: string) => void; addComment: () => void; deleteAccount: () => void;
};

function ModalLayer(p: ModalProps) {
  const reasons = ["Spam", "Hakaret", "Dolandırıcılık", "Zararlı içerik", "Zararlı bağlantı", "Kişisel bilgi paylaşımı", "Tehlikeli içerik", "Yanlış bilgi", "Uygunsuz içerik", "Diğer"];
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) p.close(); }}><div className={`modal-card modal-${p.modal}`} role="dialog" aria-modal="true" aria-label="İşlem penceresi"><button className="modal-close" onClick={p.close} aria-label="Kapat"><X /></button>
    {p.modal === "create" && <form onSubmit={p.createContent}><div className="modal-heading"><span><Plus /></span><div><h2>Yeni bir şey üret.</h2><p>Kimliğin değil, katkın görünür.</p></div></div><div className="create-tabs">{(["project","blog","post"] as const).map((type) => <button type="button" key={type} className={p.newType === type ? "active" : ""} onClick={() => p.setNewType(type)}>{type === "project" ? <FolderKanban /> : type === "blog" ? <BookOpen /> : <MessageCircle />}{p.t[type]}</button>)}</div><label className="field"><span>Başlık</span><input value={p.newTitle} onChange={(e) => p.setNewTitle(e.target.value)} maxLength={120} placeholder="Ne ürettin veya ne paylaşmak istiyorsun?" required /><small>{p.newTitle.length}/120</small></label><label className="field"><span>{p.newType === "project" ? "Açıklama ve yapım aşamaları" : "İçerik"}</span><textarea value={p.newBody} onChange={(e) => p.setNewBody(e.target.value)} placeholder="Detayları, öğrendiklerini ve önemli notları anlat..." required /></label><div className="two-fields"><label className="field"><span>Kategori</span><select value={p.newCategory} onChange={(e) => p.setNewCategory(e.target.value)}>{categories.map((c) => <option key={c.name}>{c.name}</option>)}</select></label><label className="field"><span>Etiketler</span><input placeholder="arduino, sensör, açık-kaynak" /></label></div>{p.newType === "project" && <div className="project-extras"><button type="button"><ImageIcon /> Görsel ekle</button><button type="button"><Paperclip /> Dosya ekle</button><button type="button"><Code2 /> Kod bloğu</button></div>}<div className="anonymous-publish"><ShieldCheck /><p><b>Anonim yayınlanacak</b><span>Kullanıcı ID’n içerikte gösterilmeyecek.</span></p></div><div className="form-actions"><button type="button" onClick={p.close}>Vazgeç</button><button type="submit">Anonim yayınla <Send /></button></div></form>}
    {p.modal === "detail" && <article className="detail-content"><div className={`detail-cover tone-${p.selected.tone}`}><span>{p.t[p.selected.type]}</span><div className="detail-grid" /><Code2 /></div><div className="detail-body"><div className="detail-meta"><span><CircleUserRound /> {p.t.anonymous}</span><span>{p.selected.date}</span><span>{p.selected.time} okuma</span></div><h1>{p.selected.title}</h1><p className="lead">{p.selected.excerpt}</p>{p.selected.type === "project" && <><h2>Kullanılan malzemeler</h2><ul><li>ESP32 geliştirme kartı</li><li>Kapasitif nem ve sıcaklık sensörü</li><li>3D baskı gövde ve bağlantı parçaları</li></ul><h2>Yapım aşamaları</h2><p>Önce sensör değerleri kalibre edildi, ardından güç tüketimini azaltmak için derin uyku döngüsü eklendi. Tüm bileşenler değiştirilebilir ve proje açık kaynak olarak geliştirilebilir.</p><pre><code>{`const moisture = readSensor();\nif (moisture < threshold) notify();`}</code></pre><div className="file-box"><FileArchive /><span><b>proje-dosyalari.zip</b><small>ZIP · 3.4 MB · kullanıcı yüklemesi</small></span><button onClick={p.download}><Download /> İndir</button></div></>}{p.selected.type !== "project" && <><h2>Neden bunu paylaşıyorum?</h2><p>Bu içerik, aynı problemle uğraşan üreticilerin daha hızlı ilerlemesi için gerçek deneyimlerden derlendi. Kendi koşullarına göre test etmeyi ve kaynakları doğrulamayı unutma.</p></>}<div className="tag-row">{p.selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><button className="external-demo" onClick={() => p.openExternal("https://github.com/ilteris-community/example")}><ExternalLink /> Açık kaynak deposunu görüntüle</button><div className="content-warning"><AlertTriangle /><p>Bu içerik bir kullanıcı tarafından oluşturulmuştur. İçeriğin doğruluğu ve güvenliği ilteris.com.tr tarafından garanti edilmez.</p></div><div className="detail-actions"><button><Heart /> {p.selected.likes} beğeni</button><button onClick={() => document.getElementById("detail-comment")?.focus()}><MessageCircle /> {p.comments.length} yorum</button><button onClick={p.openReport}><Flag /> Raporla</button></div><section className="comments"><h2>Yorumlar <span>{p.comments.length}</span></h2><div className="comment-form"><div className="mini-avatar">A</div><input id="detail-comment" value={p.comment} onChange={(e) => p.setComment(e.target.value)} placeholder="Anonim bir yorum yaz..." onKeyDown={(e) => { if (e.key === "Enter") p.addComment(); }} /><button onClick={p.addComment}><Send /></button></div><small>Saatlik yorum sınırı: 4</small>{p.comments.map((text, index) => <div className="comment" key={`${text}-${index}`}><div className="mini-avatar">A</div><div><b>Anonim</b><span>{index === 0 ? "Şimdi" : `${index + 1} sa önce`}</span><p>{text}</p><button onClick={p.openReport}><Flag /> Raporla</button></div></div>)}</section></div></article>}
    {p.modal === "report" && <div className="report-form"><div className="modal-heading"><span className="danger"><Flag /></span><div><h2>İçeriği raporla</h2><p>Raporun kimliğin gösterilmeden moderasyon ekibine iletilir.</p></div></div><div className="reported-item"><small>RAPORLANAN İÇERİK</small><b>{p.selected.title}</b></div><label className="field"><span>Rapor nedeni</span><div className="reason-grid">{reasons.map((reason) => <button key={reason} className={p.reportReason === reason ? "active" : ""} onClick={() => p.setReportReason(reason)}>{reason}{p.reportReason === reason && <Check />}</button>)}</div></label><label className="field"><span>Ek açıklama <em>isteğe bağlı</em></span><textarea placeholder="İncelemeye yardımcı olacak ayrıntılar..." /></label><div className="form-actions"><button onClick={p.close}>Vazgeç</button><button className="danger-submit" onClick={p.submitReport}>Raporu gönder <Flag /></button></div></div>}
    {p.modal === "download" && <div className="warning-modal"><div className="warning-icon"><AlertTriangle /></div><span className="warning-label">DOSYA GÜVENLİĞİ</span><h2>Bu dosyayı indirmek istediğine emin misin?</h2><p>Bu dosya bir kullanıcı tarafından yüklenmiştir. İçerisinde zararlı yazılım bulunabilir. Açmadan veya çalıştırmadan önce güvenli olduğundan emin ol.</p><div className="download-file"><FileArchive /><span><b>proje-dosyalari.zip</b><small>3.4 MB · Otomatik olarak güvenli ilan edilmemiştir</small></span></div><div className="form-actions"><button onClick={p.close}>Geri dön</button><button className="warning-submit" onClick={() => { p.close(); }}><Download /> Riski anladım, indir</button></div></div>}
    {p.modal === "external" && <div className="warning-modal external"><div className="warning-icon"><ExternalLink /></div><span className="warning-label">HARİCİ BAĞLANTI</span><h2>ilteris.com.tr dışına gidiyorsun.</h2><p>Bu site bize ait değildir ve içeriğini kontrol etmiyoruz. Zararlı yazılım veya güvenli olmayan içerik barındırabilir.</p><div className="url-box"><LockKeyhole /><span>{p.pendingUrl}</span></div><div className="form-actions"><button onClick={p.close}>Geri dön</button><a className="continue-link" href={p.pendingUrl} target="_blank" rel="noopener noreferrer" onClick={p.close}>Siteye devam et <ExternalLink /></a></div></div>}
    {p.modal === "delete" && <div className="warning-modal delete"><div className="warning-icon"><Trash2 /></div><span className="warning-label">GERİ ALINAMAZ İŞLEM</span><h2>Anonim hesabını silmek üzeresin.</h2><p>Profil erişimin, tercihler ve bu cihazdaki demo hesap verileri kalıcı olarak kaldırılır. Gerçek bir sistemde yasal olarak tutulması gereken kayıtlar gizlilik politikasındaki süreler boyunca korunabilir.</p><label className="confirm-check"><input type="checkbox" /> <span>Bu işlemin geri alınamayacağını anlıyorum.</span></label><div className="form-actions"><button onClick={p.close}>Hesabımı koru</button><button className="danger-submit" onClick={p.deleteAccount}><Trash2 /> Hesabımı kalıcı sil</button></div></div>}
  </div></div>;
}
