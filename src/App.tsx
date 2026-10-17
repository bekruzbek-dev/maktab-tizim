import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./Maktab.css";

type News = {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

type SchoolSettings = {
  school_name: string;
  slogan: string | null;
  about_text: string | null;
  students_count: number;
  teachers_count: number;
  school_image_url: string | null;
  address: string | null;
  legal_address: string | null;
  location_type: string | null;
  building_year: number | null;
  building_condition: string | null;
  renovation_year: number | null;
  renovation_type: string | null;
  classes_count: number | null;
  experience_years: number | null;
  education_language: string | null;
  shifts_count: number | null;
  teachers_highest_category_count: number | null;
  special_classrooms: string | null;
  assembly_hall_condition: string | null;
  sports_hall_condition: string | null;
  library_condition: string | null;
  cafeteria_condition: string | null;
  phone: string | null;
  email: string | null;
  working_hours: string | null;
};
type GalleryImage = {
  id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  created_at: string;
};

type SchoolRoom = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

type Leadership = {
  id: number;
  full_name: string;
  position: string;
  image_url: string | null;
  phone: string | null;
  description: string | null;
  created_at: string;
};
type Achievement = {
  id: number
  title: string
  description: string | null
  achievement_date: string | null
  category: string | null
  image_url: string | null
  created_at: string
}

type SchoolEvent = {
  id: number;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
  created_at: string;
};

function App() {
  const [news, setNews] = useState<News[]>([]);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(
    null,
  );
  const [heroImage, setHeroImage] = useState("/images.jpg");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAllEvents, setShowAllEvents] = useState(false);
  // @ts-ignore 
  const [schoolRooms, setSchoolRooms] = useState<SchoolRoom[]>([]);
  // @ts-ignore 
  const [showAllAchievements, setShowAllAchievements] = useState(false);
 const [events, setEvents] = useState<SchoolEvent[]>([]);



  useEffect(() => {
    void loadNews();
    void loadSchoolSettings();
    void loadGalleryImages();
    void loadRooms();
    void loadLeadership();
    void loadEvents();
    void loadAchievements();

    const elements = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));

    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
        setSelectedNews(null);
        return;
      }

      if (selectedImage === null) return;

      const images = galleryImages;
      if (!images.length) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedImage((current) =>
          current === null || current === images.length - 1 ? 0 : current + 1,
        );
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedImage((current) =>
          current === null || current === 0 ? images.length - 1 : current - 1,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, galleryImages]);

  // Keep the fast local hero image as the initial LCP resource.
  // If an administrator configured a custom school image, swap it after the
  // first paint so the remote Supabase image does not become the critical path.
 useEffect(() => {
  const remoteImage = schoolSettings?.school_image_url

  if (remoteImage) {
    setHeroImage(remoteImage)
  } else {
    setHeroImage("/images.jpg")
  }
}, [schoolSettings?.school_image_url])


  async function loadAchievements() {
  const { data, error } = await supabase
    .from("school_achievements")
    .select("id,title,description,achievement_date,category,image_url,created_at")
    .order('achievement_date', {
      ascending: false,
      nullsFirst: false,
    })

  if (error) {
    console.error(
      'Yutuqlarni yuklashda xato:',
      error.message
    )
    return
  }

  setAchievements(data || [])
}
async function loadEvents() {
  const { data, error } = await supabase
    .from("school_events")
    .select("id,title,description,event_date,image_url,created_at")
    .order("event_date", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    console.error("Events error:", error);
    return;
  }

  setEvents(data || []);
}

  async function loadNews() {
    const { data, error } = await supabase
      .from("news")
      .select("id,title,content,image_url,created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setNews(data || []);
    setLoading(false);
  }

  async function loadGalleryImages() {
    const { data, error } = await supabase
      .from("school_gallery")
      .select("id,image_url,title,description,created_at")
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("Gallery error:", error);
      return;
    }

    setGalleryImages(data || []);
  }

  async function loadRooms() {
    const { data, error } = await supabase
      .from("school_rooms")
      .select("id,name,description,image_url,sort_order,created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Rooms error:", error.message);
      return;
    }

    setSchoolRooms(data || []);
  }

  
async function loadLeadership() {
  const { data, error } = await supabase
    .from("school_leadership")
    .select("id,full_name,position,image_url,phone,description,created_at,sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Leadership error:", error);
    return;
  }

  setLeadership(data || []);
}


  async function loadSchoolSettings() {
    const { data, error } = await supabase
      .from("school_settings")
      .select(
        "school_name,slogan,about_text,students_count,teachers_count,classes_count,experience_years,school_image_url,address,legal_address,location_type,building_year,building_condition,renovation_year,renovation_type,education_language,shifts_count,teachers_highest_category_count,special_classrooms,assembly_hall_condition,sports_hall_condition,library_condition,cafeteria_condition,phone,email,working_hours",
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("School settings error:", error);
      return;
    }

    setSchoolSettings(data);
  }
  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="site">
      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="container nav-inner">
          <a href="#home" className="logo">
            <span>7</span>
            MAKTAB
          </a>

          <nav
            id="main-navigation"
            className={menuOpen ? "nav-menu open" : "nav-menu"}
          >
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Bosh sahifa
            </a>

            <a href="#about" onClick={() => setMenuOpen(false)}>
              Maktab haqida
            </a>

            <a href="#director" onClick={() => setMenuOpen(false)}>
              Rahbariyat
            </a>

            <a href="#news" onClick={() => setMenuOpen(false)}>
              Yangiliklar
            </a>

            <a href="#events" onClick={() => setMenuOpen(false)}>
              Tadbirlar
            </a>


            <a href="#gallery" onClick={() => setMenuOpen(false)}>
              Galereya
            </a>

            
                <a href="#achievements" onClick={() => setMenuOpen(false)}>
                  Yutuqlar
                </a>

            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Aloqa
            </a>
          </nav>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main id="main-content">
        {/* ================= HERO ================= */}

      <section id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="eyebrow">
              {schoolSettings?.school_name ||
                "Baliqchi tumani 7-umumiy o‘rta ta’lim maktabi"}
            </p>

            <h1>{schoolSettings?.slogan || "Kelajak sari birgalikda!"}</h1>

            <p className="hero-description">
              Bilimli, faol va zamonaviy fikrlaydigan yosh avlodni tarbiyalash —
              bizning asosiy maqsadimiz.
            </p>

            <div className="hero-buttons">
              <a href="#about" className="primary-btn">
                Maktab haqida
              </a>

              <a href="#news" className="secondary-btn">
                Yangiliklarni ko‘rish
              </a>
            </div>
          </div>

       <div className="hero-card">
 <img
  src={heroImage}
  alt="7-sonli umumiy o‘rta ta’lim maktabi"
  className="school-photo"
  width="900"
  height="600"
  fetchPriority="high"
  decoding="async"
/>

  <div className="hero-photo-overlay">
    <h3>
      7-sonli umumiy o‘rta ta’lim maktabi
    </h3>

    <p>Ta'lim • Tarbiya • Kelajak</p>
  </div>
</div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="stats scroll-reveal">
        <div className="container stats-grid">
          <div className="stat">
            <strong>{schoolSettings?.students_count ?? 906}</strong>
            <span>O‘quvchi</span>
          </div>

          <div className="stat">
            <strong>{schoolSettings?.teachers_count ?? 90}</strong>
            <span>Ustoz</span>
          </div>

          <div className="stat">
            <strong>{schoolSettings?.classes_count ?? "—"}</strong>
            <span>Sinf</span>
          </div>

          <div className="stat">
            <strong>{schoolSettings?.experience_years ?? "—"}</strong>
            <span>Tajriba yili</span>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section id="about" className="section scroll-reveal">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="section-label">MAKTAB HAQIDA</p>

              <h2>
                Har bir o‘quvchi —<span> kelajak bunyodkori</span>
              </h2>
            </div>
          </div>

          <div className="about-grid">
            <div className="about-main">
              <p>
                {schoolSettings?.about_text ||
                  `Maktab ${schoolSettings?.legal_address || "Baliqchi tumani “Barkamol MFY”, Yangi yo‘l ko‘chasi 28-uy"} manzilida, ${schoolSettings?.location_type?.toLowerCase() || "qishloq"} hududida joylashgan. Asosiy bino ${schoolSettings?.building_year ?? 1985}-yilda qurilgan va ${schoolSettings?.building_condition?.toLowerCase() || "yaxshi"} holatda.`}
              </p>

              <p>
                Bino {schoolSettings?.renovation_year ?? 2018}-yilda {schoolSettings?.renovation_type?.toLowerCase() || "joriy ta’mir"} qilingan. Ta’lim {schoolSettings?.education_language?.toLowerCase() || "o‘zbek"} tilida {schoolSettings?.shifts_count ?? 2} smenada olib boriladi. {schoolSettings?.teachers_count ?? 90} nafar pedagogning {schoolSettings?.teachers_highest_category_count ?? 11} nafari oliy toifali.
              </p>

              <p>
                Maxsus fan xonalari {schoolSettings?.special_classrooms?.toLowerCase() || "jihozlangan"}. Sport zali — {schoolSettings?.sports_hall_condition?.toLowerCase() || "mavjud, yaxshi"}; kutubxona — {schoolSettings?.library_condition?.toLowerCase() || "mavjud, yaxshi"}; oshxona — {schoolSettings?.cafeteria_condition?.toLowerCase() || "mavjud, yaxshi"}. Faollar zali — {schoolSettings?.assembly_hall_condition?.toLowerCase() || "mavjud, ta’mirtalab"}.
              </p>
            </div>

            <div className="about-features">
              <div className="feature-box">
                <span>🎓</span>
                <div>
                  <h3>Sifatli ta'lim</h3>
                  <p>Zamonaviy bilim va ko‘nikmalar.</p>
                </div>
              </div>

              <div className="feature-box">
                <span>💡</span>
                <div>
                  <h3>Innovatsiya</h3>
                  <p>Yangi texnologiyalar va g‘oyalar.</p>
                </div>
              </div>

              <div className="feature-box">
                <span>🤝</span>
                <div>
                  <h3>Hamjihatlik</h3>
                  <p>O‘quvchi, ustoz va ota-ona hamkorligi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}

      <section className="section why-section scroll-reveal">
        <div className="container">
          <div className="section-heading centered">
            <p className="section-label">NEGA BIZ?</p>

            <h2>Maktabimizning afzalliklari</h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">📚</div>
              <h3>Bilimga e'tibor</h3>
              <p>
                O‘quvchilarning chuqur bilim olishi uchun barcha imkoniyatlarni
                yaratamiz.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">🏆</div>
              <h3>Yuqori natijalar</h3>
              <p>
                Fan olimpiadalari va turli tanlovlarda faol ishtirok etamiz.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">💻</div>
              <h3>Zamonaviy texnologiya</h3>
              <p>Ta'lim jarayonida zamonaviy texnologiyalardan foydalanamiz.</p>
            </div>

            <div className="why-card">
              <div className="why-icon">❤️</div>
              <h3>Sog‘lom muhit</h3>
              <p>
                O‘quvchilar uchun do‘stona va xavfsiz ta'lim muhitini yaratamiz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DIRECTOR ================= */}

      <section id="director" className="section director-section scroll-reveal">
        <div className="container director-grid">
          <div className="director-photo">
            <div className="director-placeholder">👨‍🏫</div>
          </div>

          <div className="director-content">
            <p className="section-label">MAKTAB RAHBARIYATI</p>

            <h2>
              Maktab direktorining
              <span> murojaati</span>
            </h2>

            <p className="director-quote">
              “Farzandlarimizning bilimli, tarbiyali va Vatanga foydali inson
              bo‘lib ulg‘ayishi — barchamizning eng katta maqsadimizdir.”
            </p>

            <p>
              Maktabimiz jamoasi har bir o‘quvchining qobiliyatini ochish,
              ularni qo‘llab-quvvatlash va zamonaviy ta'lim berish yo‘lida
              birgalikda mehnat qiladi.
            </p>

          </div>
  {/* =================maktab rahbaryati ================= */}





        </div>
        <section
  id="leadership"
  className="section leadership-section scroll-reveal"
>
  <div className="container">

    <div className="section-heading">
      <div>
        <p className="section-label">
        
        </p>

        <h2>
          Maktab rahbariyatlari
        </h2>

        <p className="gallery-description">
          Maktabimiz rivoji va taʼlim sifatini
          taʼminlash yo‘lida faoliyat yuritayotgan
          rahbariyat aʼzolari.
        </p>
      </div>
    </div>

    <div className="leadership-grid">
      {leadership.map((person) => (
        <div
          className="leadership-card"
          key={person.id}
        >
          {person.image_url ? (
            <img
              src={person.image_url}
              alt={`${person.full_name} — ${person.position}`}
              loading="lazy"
              decoding="async"
              width="600"
              height="700"
            />
          ) : (
            <div className="leadership-placeholder">
              👤
            </div>
          )}

          <div className="leadership-info">
            <h3>
              {person.full_name}
            </h3>

            <p className="leadership-position">
              {person.position}
            </p>

            {person.description && (
              <p>
                {person.description}
              </p>
            )}

            {person.phone && (
              <a href={`tel:${person.phone}`}>
                📞 {person.phone}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

      </section>

      {/* ================= NEWS ================= */}

      <section id="news" className="section news-section scroll-reveal">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="section-label">SO‘NGGI YANGILIKLAR</p>

              <h2>Maktab hayotidan</h2>
            </div>

            <a href="#news" className="view-all">
              Barcha yangiliklar →
            </a>
          </div>

          {loading ? (
            <div className="loading">Yangiliklar yuklanmoqda...</div>
          ) : news.length === 0 ? (
            <div className="empty-news">Hozircha yangiliklar mavjud emas.</div>
          ) : (
            <div className="news-grid">
              {news.map((item) => (
                <article className="news-card" key={item.id}>
                  <button
                    type="button"
                    className="news-card-button"
                    onClick={() => setSelectedNews(item)}
                    aria-label={`${item.title} yangiligini batafsil ko‘rish`}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="news-image"
                        loading="lazy"
                        decoding="async"
                        width="800"
                        height="500"
                      />
                    ) : (
                      <div className="news-image-placeholder" aria-hidden="true">
                        7-MAKTAB
                      </div>
                    )}

                  <div className="news-content">
                    <div className="news-meta">
                      <span>
                        {new Date(item.created_at).toLocaleDateString("uz-UZ")}
                      </span>

                      <span className="news-badge">YANGI</span>
                    </div>

                    <h3>{item.title}</h3>

                    <p>{item.content}</p>

                    <span className="news-read-more">Batafsil ko‘rish →</span>
                  </div>
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* ================= NEWS MODAL ================= */}

      {selectedNews && (
        <div className="news-modal" onClick={() => setSelectedNews(null)}>
          <div
            className="news-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="news-modal-close"
              onClick={() => setSelectedNews(null)}
              aria-label="Yangilik oynasini yopish"
            >
              ×
            </button>

            {selectedNews.image_url && (
              <img
                src={selectedNews.image_url}
                alt={selectedNews.title}
                className="news-modal-image"
                loading="eager"
                decoding="async"
                width="1200"
                height="700"
              />
            )}

            <div className="news-modal-body">
              <p className="news-modal-date">
                {new Date(selectedNews.created_at).toLocaleDateString("uz-UZ")}
              </p>

              <h2>{selectedNews.title}</h2>

              <p>{selectedNews.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= EVENTS ================= */}

{/* ================= EVENTS ================= */}

<section
  id="events"
  className="section events-section scroll-reveal"
>
  <div className="container">

    <div className="section-heading centered">
      <p className="section-label">MAKTAB HAYOTI</p>

      <h2>Tadbirlar va faoliyat</h2>

      <p className="gallery-description">
        Maktabimizda o‘tkazilayotgan tadbirlar,
        musobaqalar va loyihalar.
      </p>
    </div>

   {events.length === 0 ? (
  <div className="events-empty">
    <div>📅</div>
    <h3>Hozircha tadbirlar mavjud emas</h3>
    <p>Tez orada maktabimiz tadbirlari shu yerda e'lon qilinadi.</p>
  </div>
) : (
  <>
    <div className="events-grid">
      {(showAllEvents ? events : events.slice(0, 6)).map((event) => (
        <article className="event-card" key={event.id}>
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="event-image"
              loading="lazy"
              decoding="async"
              width="800"
              height="500"
            />
          ) : (
            <div className="event-image-placeholder">
              📅
            </div>
          )}

          <div className="event-number">
            {event.event_date
              ? new Date(event.event_date).toLocaleDateString("uz-UZ", {
                  day: "2-digit",
                  month: "2-digit",
                })
              : "EVENT"}
          </div>

          <div className="event-content">
            <h3>{event.title}</h3>

            {event.description && (
              <p>{event.description}</p>
            )}

            {event.event_date && (
              <time
                dateTime={event.event_date}
                className="event-date"
              >
                📅{" "}
                {new Date(event.event_date).toLocaleDateString("uz-UZ")}
              </time>
            )}
          </div>
        </article>
      ))}
    </div>

    {events.length > 6 && (
      <div className="show-all-wrapper">
        <button
          type="button"
          className="show-all-button"
          onClick={() => setShowAllEvents((prev) => !prev)}
        >
          {showAllEvents
            ? "Yopish"
            : `Barchasini ko‘rish (${events.length})`}
        </button>
      </div>
    )}
  </>
)}

  </div>
</section>



      {/* ================= GALLERY ================= */}
      <section id="gallery" className="section gallery-section scroll-reveal">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="section-label">GALEREYA</p>

              <h2>Maktabimizdan lavhalar</h2>

              <p className="gallery-description">
                Maktabimiz hayoti, tadbirlari va o‘quvchilarimiz faoliyatidan
                suratlar.
              </p>
            </div>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                key={`${image.id}-${index}`}
                className={`gallery-item ${index === 0 ? "large" : ""}`}
                onClick={() => setSelectedImage(index)}
                aria-label={`${image.title || "7-Maktab"} rasmini kattalashtirish`}
              >
                <img
                  src={image.image_url}
                  alt={image.title || "7-Maktab"}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="600"
                />

                <div className="gallery-overlay">
                  <strong>{image.title || "7-Maktab"}</strong>

                  <small>{image.description || "Maktab hayoti"}</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY LIGHTBOX ================= */}

      {selectedImage !== null && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Rasmni yopish"
          >
            ×
          </button>

          <button
            type="button"
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();

              setSelectedImage((current) => {
                const images = galleryImages;

                if (current === null) return 0;

                return current === 0 ? images.length - 1 : current - 1;
              });
            }}
            aria-label="Oldingi rasm"
          >
            ←
          </button>

          <img
            src={
              galleryImages[selectedImage]
                ?.image_url
            }
            alt="7-Maktab"
            className="lightbox-image"
            loading="eager"
            decoding="async"
            width="1200"
            height="900"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();

              setSelectedImage((current) => {
                const images = galleryImages;

                if (current === null) return 0;

                return current === images.length - 1 ? 0 : current + 1;
              });
            }}
            aria-label="Keyingi rasm"
          >
            →
          </button>

          <div className="lightbox-counter">
            {selectedImage + 1} /{" "}
            {galleryImages.length}
          </div>
        </div>
      )}

      




    {/* ================= Maktab Yutqlari ================= */}


<section
  id="achievements"
  className="section achievements-section scroll-reveal"
>
  <div className="container">
    <div className="section-heading">
      <div>
        <p className="section-label">
          YUTUQLAR
        </p>

        <h2>
          Maktabimiz yutuqlari
        </h2>

        <p className="gallery-description">
          O‘quvchilarimiz va ustozlarimizning
          taʼlim, fan, sport va turli tanlovlardagi
          yutuqlari.
        </p>
      </div>
    </div>

    {achievements.length === 0 ? (
      <div className="achievements-empty-public">
        <div>🏆</div>

        <h3>
          Hozircha yutuqlar mavjud emas
        </h3>

        <p>
          Tez orada maktabimiz yutuqlari
          shu yerda eʼlon qilinadi.
        </p>
      </div>
    ) : (
      <div className="achievements-public-grid">
        {achievements.map((achievement) => (
          <article
            className="achievement-public-card"
            key={achievement.id}
          >
            {achievement.image_url ? (
              <div className="achievement-public-image-wrap">
                <img
                  src={achievement.image_url}
                  alt={achievement.title}
                  className="achievement-public-image"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                />
              </div>
            ) : (
              <div className="achievement-public-placeholder">
                🏆
              </div>
            )}

            <div className="achievement-public-content">
              {achievement.category && (
                <span className="achievement-public-category">
                  {achievement.category}
                </span>
              )}

              <h3>
                {achievement.title}
              </h3>

              {achievement.description && (
                <p>
                  {achievement.description}
                </p>
              )}

              {achievement.achievement_date && (
                <div className="achievement-public-date">
                  📅 {achievement.achievement_date}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</section>




{/* ================= FAQ ================= */}

      <section className="section faq-section scroll-reveal">
        <div className="container">
          <div className="section-heading centered">
            <p className="section-label">SAVOLLAR</p>

            <h2>Ko‘p beriladigan savollar</h2>
          </div>

          <div className="faq-grid">
            <details>
              <summary>Maktabda nechta o‘quvchi tahsil oladi?</summary>

              <p>Hozirda maktabimizda       <strong>{schoolSettings?.students_count ?? 906}</strong>
             dan ortiq o‘quvchi tahsil oladi.</p>
            </details>

            <details>
              <summary>Maktabda qanday tadbirlar o‘tkaziladi?</summary>

              <p>
                Fan olimpiadalari, sport musobaqalari, madaniy tadbirlar va
                turli loyihalar muntazam tashkil etiladi.
              </p>
            </details>

            <details>
              <summary>Maktab bilan qanday bog‘lanish mumkin?</summary>

              <p>
                Aloqa bo‘limidagi telefon raqami yoki maktab manzili orqali
                bog‘lanishingiz mumkin.
              </p>
            </details>

            <details>
              <summary>Yangiliklarni qayerdan ko‘rish mumkin?</summary>

              <p>
                Barcha yangi ma'lumotlar saytning “Yangiliklar” bo‘limida e'lon
                qilinadi.
              </p>
            </details>
          </div>
        </div>
      </section>




      {/* ================= CONTACT ================= */}

      <section id="contact" className="contact-section">
        <div className="container">
          
          <div className="section-heading contact-heading">
            <div>
              <p className="section-label">ALOQA</p>

              <h2>Biz bilan bog‘laning 📞</h2>

              <p>
                Maktabimiz faoliyati, ta’lim jarayoni va boshqa savollar
                bo‘yicha biz bilan bog‘lanishingiz mumkin.
              </p>
            </div>
          </div>
          <div className="contact-grid">
            {/* MANZIL */}
            <div className="contact-card">
              <div className="contact-icon">📍</div>

              <div>
                <span>Manzil</span>

                <strong>
                  {schoolSettings?.legal_address ||
                    schoolSettings?.address ||
                    "Baliqchi tumani “Barkamol MFY”, Yangi yo‘l ko‘chasi 28-uy"}
                </strong>

                <p>Maktab manzili</p>
              </div>
            </div>

            {/* TELEFON */}
            <div className="contact-card">
              <div className="contact-icon">📞</div>

              <div>
                <span>Telefon</span>

                <strong>{schoolSettings?.phone || "+998 97 169 08 07"}</strong>

                <p>Biz bilan telefon orqali bog‘laning</p>
              </div>
            </div>

            {/* EMAIL */}
            {schoolSettings?.email && (
              <div className="contact-card">
                <div className="contact-icon">✉️</div>

                <div>
                  <span>Elektron pochta</span>

                  <strong>{schoolSettings.email}</strong>

                  <p>Savollaringizni elektron pochta orqali yuboring</p>
                </div>
              </div>
            )}

            {/* ISH VAQTI */}
            <div className="contact-card">
              <div className="contact-icon">🕐</div>

              <div>
                <span>Ish vaqti</span>

                <strong>
                  {schoolSettings?.working_hours || "Dushanba — Shanba"}
                </strong>

                <p>Maktab ish kunlari</p>
              </div>
            </div>
          </div>
          {/* GOOGLE MAPS */}
          <div className="contact-map">
            <iframe
              title="7-sonli maktab xaritasi"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.145410105192!2d71.91611699688272!3d40.87823825348676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb59c968fbbd99%3A0x5c0b6c40bc7af46!2s7-Maktab!5e0!3m2!1suz!2s!4v1791206881378!5m2!1suz!2s"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
        </div>
      </section>

      </main>






















      {/* ================= FOOTER ================= */}

      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">7</div>

              <div>
                <strong>7-MAKTAB</strong>
                <p>Kelajak sari birgalikda!</p>
              </div>
            </div>

            <div className="footer-column">
              <h3>Tezkor havolalar</h3>

              <a href="#home">Bosh sahifa</a>
              <a href="#about">Maktab haqida</a>
              <a href="#news">Yangiliklar</a>
              <a href="#gallery">Galereya</a>
            </div>

            <div className="footer-column">
              <h3>Maktab</h3>

              <a href="#leadership">Rahbariyat</a>
              <a href="#events">Tadbirlar</a>
              <a href="#achievements">Yutuqlar</a>
              <a href="#contact">Aloqa</a>
            </div>

            <div className="footer-column footer-contact">

<h3>Manzil 📍</h3>
 <strong>
                  {schoolSettings?.legal_address ||
                    schoolSettings?.address ||
                    "Baliqchi tumani “Barkamol MFY”, Yangi yo‘l ko‘chasi 28-uy"}
                </strong>
                    <h5>Aloqa  📞 </h5>
                                <strong>
                                  {schoolSettings?.phone || "+998 97 169 08 07"}</strong>
              {schoolSettings?.email && <p>✉️ {schoolSettings.email}</p>}
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 7-MAKTAB. Barcha huquqlar himoyalangan.</p>

            <p>Kelajak sari birgalikda! 🎓</p>
          </div>
        </div>
      </footer>

      {/* ================= TOP BUTTON ================= */}

      {showTop && (
        <button
          type="button"
          className="back-to-top"
          onClick={scrollTop}
          aria-label="Sahifaning yuqorisiga chiqish"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;
