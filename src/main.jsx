import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { db } from "./database";
import "./styles.css";

const iconPaths = {
  map: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  lock: "M7 10V8a5 5 0 0 1 10 0v2 M6 10h12v10H6z",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  user: "M20 21a8 8 0 0 0-16 0 M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  search: "M11 19a8 8 0 1 1 5.66-13.66A8 8 0 0 1 11 19Z M21 21l-4.35-4.35",
  star: "m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.19 6.44 20.1l1.06-6.2L3 9.53l6.22-.9L12 3Z",
  heart: "M20.84 5.61a5.5 5.5 0 0 0-7.78 0L12 6.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 22l8.84-8.61a5.5 5.5 0 0 0 0-7.78Z",
  compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M16 8l-2.2 5.8L8 16l2.2-5.8L16 8Z",
  back: "M19 12H5 M12 19l-7-7 7-7",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2",
  money: "M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6",
  calendar: "M7 3v4 M17 3v4 M4 8h16 M5 5h14v16H5z",
  message: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
  share: "M18 8a3 3 0 1 0-2.83-4 M6 13a3 3 0 1 0 0-2 M18 22a3 3 0 1 0-2.83-4 M8.6 12.4l6.8 4.2 M15.4 7.4l-6.8 4.2",
  camera: "M4 7h3l2-3h6l2 3h3v13H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  sliders: "M4 7h10 M18 7h2 M4 17h2 M10 17h10 M14 5v4 M8 15v4",
  close: "M18 6 6 18 M6 6l12 12",
  thumbs: "M7 22H4V10h3 M7 10l5-8 1 1a4 4 0 0 1 1 3l-1 4h6a2 2 0 0 1 2 2l-2 8a3 3 0 0 1-3 2H7z",
  send: "M22 2 11 13 M22 2l-7 20-4-9-9-4 20-7Z",
};

function Icon({ name, size = 20, className = "", filled = false }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={iconPaths[name]} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const places = [
  {
    id: 1,
    name: "Castillo de Salgar",
    location: "Barranquilla, Colombia",
    rating: 4.6,
    reviews: 1847,
    category: "Monumentos",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/02/Vista_diagonal_del_Castillo_de_San_Antonio_de_Salgar._Puerto_Colombia._Atl%C3%A1ntico._Colombia.JPG",
    description: "El Castillo de Salgar es un faro historico ubicado en el municipio de Puerto Colombia. Construido en 1848, este emblematico lugar sirvio como faro para guiar a los barcos que llegaban al puerto. Hoy en dia es un sitio turistico con vistas espectaculares del Mar Caribe.",
    hours: "8:00 AM - 6:00 PM",
    price: "Entrada gratuita",
    bestTime: "Todo el ano",
    highlights: ["Vistas panoramicas del Mar Caribe", "Arquitectura historica del siglo XIX", "Perfecto para fotografia y atardeceres", "Rica historia maritima y cultural"],
    gallery: [
      "https://zonacero.com/sites/default/files/styles/1280_x_530_noticia_interna/public/2024-10/Castillo%201_0.jpeg?h=89c5e8d2&itok=zMST7J8u",
      "https://clasarnoticias.com/wp-content/uploads/2022/04/Castillo-de-salgar-1080x723.jpg",
      "https://elturismoencolombia.com/wp-content/uploads/2023/07/Castillo-Puerto-Salgar-Barranquilla-Colombia.jpg",
    ],
  },
  {
    id: 2,
    name: "Malecon de Puerto Colombia",
    location: "Barranquilla, Colombia",
    rating: 4.5,
    reviews: 2293,
    category: "Paseos",
    image: "https://transferstours.com/wp-content/uploads/2024/11/Tour-Puerto-Colombia-4.png",
    description: "El Malecon de Puerto Colombia es un paseo costero que ofrece hermosas vistas del Mar Caribe. Es ideal para caminar, disfrutar la brisa marina y contemplar atardeceres junto a restaurantes y espacios recreativos.",
    hours: "Abierto 24 horas",
    price: "Entrada gratuita",
    bestTime: "Diciembre a Marzo",
    highlights: ["Paseo frente al mar Caribe", "Restaurantes con comida tipica", "Ideal para caminatas y deportes", "Ambiente familiar y seguro"],
    gallery: [
      "https://caracol.com.co/resizer/v2/EMWJDYTU45DYZKABYH6Y5GNPB4.jpg?auth=e7b137ca23f97a1826fa09afa0911773cb2351d60b2ac9c2df53af55723991b3&quality=70&width=1200&height=900&focal=935,419",
      "https://www.semana.com/resizer/v2/LXTTW7RCPNHW3MGEPPFMGYNBG4.jpeg?auth=51b9c12330ddff9f0a692928ee02302a474b813e5af2253c40cb2e2f175fd803&smart=true&quality=75&width=1920",
      "https://imagenes2.eltiempo.com/files/image_600_455/uploads/2021/12/01/61a7fb53e488d.jpeg",
    ],
  },
  {
    id: 3,
    name: "Catedral Metropolitana",
    location: "Barranquilla, Colombia",
    rating: 4.7,
    reviews: 1523,
    category: "Patrimonio",
    image: "https://www.elheraldo.co/resizer/v2/6EMLB5YFDRGWZJOWARBUNRIWJQ.jpg?auth=290d0848be27413cdff2607b0f081b4c712e9c3808b62b5b8e7f4c5ec2378576&smart=true&quality=70&width=1200&height=1200",
    description: "La Catedral Metropolitana Maria Reina es la iglesia principal de Barranquilla. Su arquitectura moderna, inaugurada en 1982, la convierte en un centro religioso y cultural con vitrales y espacios de reflexion.",
    hours: "6:00 AM - 7:00 PM",
    price: "Entrada gratuita",
    bestTime: "Todo el ano",
    highlights: ["Arquitectura religiosa moderna", "Hermosos vitrales y arte sacro", "Servicios religiosos diarios", "Centro espiritual de la ciudad"],
    gallery: [
      "https://barranquilla.gov.co/wp-content/uploads/2025/09/catedral-scaled.jpeg",
      "https://www.elheraldo.co/resizer/v2/XHY4BNJ37JCBLCAXYB37FHONLA.jpeg?auth=34a654ecfdb3c53753869f654a90abe24aee62cd82ac2ac98d993fcd245edfd6&smart=true&quality=70&width=1200&height=675",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/75/d7/c2/cristo-y-vitrales.jpg?w=900&h=500&s=1",
    ],
  },
  {
    id: 4,
    name: "Gran Malecon",
    location: "Barranquilla, Colombia",
    rating: 4.8,
    reviews: 3142,
    category: "Paseos",
    image: "https://cloudfront-us-east-1.images.arcpublishing.com/prisaradioco/MCHYPU4UCJDKJKLONNUOTBAG5Y.JPG",
    description: "El Gran Malecon del Rio es un moderno paseo construido a lo largo del rio Magdalena. Ofrece areas verdes, ciclovias, zonas deportivas y una vista privilegiada del rio.",
    hours: "5:00 AM - 10:00 PM",
    price: "Entrada gratuita",
    bestTime: "Todo el ano",
    highlights: ["Vista panoramica del rio Magdalena", "Ciclovias y areas deportivas", "Espacios verdes y recreativos", "Eventos culturales frecuentes"],
    gallery: [
      "https://noticartagena.com.co/wp-content/uploads/2020/01/gran-malecon-del-rio-barranquilla.jpg",
      "https://granmalecon.com/wp-content/uploads/2024/11/DJI_0271_11zon-scaled.webp",
      "https://blog.redbus.co/wp-content/uploads/2025/01/malecon-rio-magdalena.jpg",
    ],
  },
  {
    id: 5,
    name: "Bocas de Ceniza",
    location: "Barranquilla, Colombia",
    rating: 4.6,
    reviews: 1987,
    category: "Naturaleza",
    image: "https://cloudfront-us-east-1.images.arcpublishing.com/prisaradioco/YSR2IBHJQJCY5P43TUXH35CHNE.jpg",
    description: "Bocas de Ceniza es el punto donde el rio Magdalena desemboca en el Mar Caribe. El encuentro de aguas dulces y saladas crea un paisaje unico para observar naturaleza y tomar fotografias.",
    hours: "8:00 AM - 5:00 PM",
    price: "Entrada gratuita",
    bestTime: "Diciembre a Marzo",
    highlights: ["Encuentro del rio Magdalena con el mar", "Paisajes naturales unicos", "Observacion de aves y fauna", "Tours en lancha disponibles"],
    gallery: [
      "https://www.civitatis.com/f/colombia/barranquilla/excursion-bocas-ceniza-589x392.jpg",
      "https://www.mundomaritimo.cl/noticias/get_image/43104/798",
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/12/e1/9a/50.jpg",
    ],
  },
  {
    id: 6,
    name: "Museo del Caribe",
    location: "Barranquilla, Colombia",
    rating: 4.9,
    reviews: 2756,
    category: "Museos",
    image: "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/4XDDODOUYNEE3EUDKWUGV6GIPM.jpg",
    description: "El Museo del Caribe celebra la diversidad de la region Caribe colombiana con exposiciones interactivas sobre historia, cultura, musica y tradiciones.",
    hours: "8:00 AM - 5:00 PM (Martes a Sabado)",
    price: "$15,000 - $20,000 COP",
    bestTime: "Todo el ano",
    highlights: ["Exposiciones interactivas sobre el Caribe", "Sala dedicada a Gabriel Garcia Marquez", "Historia del Carnaval de Barranquilla", "Coleccion de musica y folclor caribeno"],
    gallery: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/59/82/76/museo-del-caribe.jpg?w=1200&h=-1&s=1",
      "https://staging.maguared.gov.co/wp-content/uploads/2015/08/PCC2.jpg",
      "https://viajandox.com.co/uploads/min_Museo%20del%20Caribe_4.jpg",
    ],
  },
  {
    id: 7,
    name: "Parque Cultural del Caribe",
    location: "Barranquilla, Colombia",
    rating: 4.7,
    reviews: 1260,
    category: "Museos",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiqPo4bJ5DYMDq_bFeKULPHbsbVBpe2bgNsQ&s",
  },
  {
    id: 8,
    name: "Zoologico de Barranquilla",
    location: "Barranquilla, Colombia",
    rating: 4.4,
    reviews: 980,
    category: "Naturaleza",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Barranquilla_Zool%C3%B3gico_Flamencos.jpg",
  },
  {
    id: 9,
    name: "Plaza de la Paz",
    location: "Barranquilla, Colombia",
    rating: 4.3,
    reviews: 870,
    category: "Monumentos",
    image: "https://cloudfront-us-east-1.images.arcpublishing.com/elheraldoco/C3DX7QWFCVFGBJH7JZ2PCPAJYU.jpg",
  },
  {
    id: 10,
    name: "Parque Washington",
    location: "Barranquilla, Colombia",
    rating: 4.5,
    reviews: 734,
    category: "Paseos",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/83/c1/bf/parque-washington.jpg?w=1200&h=-1&s=1",
  },
];

const commentsData = {
  1: [
    { id: 1, author: "Maria Gonzalez", avatar: "https://i.pravatar.cc/150?img=1", rating: 5, date: "15 de marzo, 2026", text: "El Castillo de Salgar es hermoso. La vista del mar Caribe es espectacular. Fui al atardecer y las fotos quedaron increibles.", likes: 24 },
    { id: 2, author: "Carlos Rodriguez", avatar: "https://i.pravatar.cc/150?img=2", rating: 4, date: "10 de marzo, 2026", text: "Muy bonito lugar historico. Recomiendo llevar protector solar porque hace bastante calor.", likes: 18 },
    { id: 3, author: "Ana Martinez", avatar: "https://i.pravatar.cc/150?img=3", rating: 5, date: "5 de marzo, 2026", text: "Un tesoro de Barranquilla. El faro y la arquitectura son fascinantes.", likes: 31 },
  ],
  2: [
    { id: 1, author: "Pedro Sanchez", avatar: "https://i.pravatar.cc/150?img=5", rating: 5, date: "20 de marzo, 2026", text: "El Malecon de Puerto Colombia es perfecto para caminar y relajarse.", likes: 45 },
    { id: 2, author: "Laura Torres", avatar: "https://i.pravatar.cc/150?img=6", rating: 5, date: "18 de marzo, 2026", text: "La vista del mar es increible y el ambiente es muy tranquilo.", likes: 38 },
  ],
  3: [
    { id: 1, author: "Sofia Ramirez", avatar: "https://i.pravatar.cc/150?img=8", rating: 5, date: "25 de marzo, 2026", text: "La Catedral Metropolitana es impresionante. Sus vitrales son hermosos.", likes: 19 },
  ],
  4: [
    { id: 1, author: "Carolina Perez", avatar: "https://i.pravatar.cc/150?img=10", rating: 5, date: "28 de marzo, 2026", text: "El Gran Malecon es perfecto para hacer ejercicio y disfrutar del rio Magdalena.", likes: 42 },
  ],
  5: [
    { id: 1, author: "Andrea Lopez", avatar: "https://i.pravatar.cc/150?img=12", rating: 5, date: "30 de marzo, 2026", text: "Bocas de Ceniza es un fenomeno natural increible.", likes: 38 },
  ],
  6: [
    { id: 1, author: "Isabella Vargas", avatar: "https://i.pravatar.cc/150?img=14", rating: 5, date: "2 de abril, 2026", text: "El Museo del Caribe es fantastico. Las exposiciones son interactivas y educativas.", likes: 51 },
  ],
};

const categories = ["Todos", "Monumentos", "Paseos", "Patrimonio", "Naturaleza", "Museos"];

function buildPlaceStats(comments) {
  return comments.reduce((stats, comment) => {
    const placeId = Number(comment.place_id);
    const current = stats[placeId] || { count: 0, totalRating: 0, average: null };
    const totalRating = current.totalRating + Number(comment.rating || 0);
    const count = current.count + 1;

    return {
      ...stats,
      [placeId]: {
        count,
        totalRating,
        average: Number((totalRating / count).toFixed(1)),
      },
    };
  }, {});
}

function getPlaceStats(stats, placeId) {
  return stats[placeId] || { count: 0, totalRating: 0, average: null };
}

function App() {
  const [page, setPage] = useState("login");
  const [selectedPlaceId, setSelectedPlaceId] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [placeStats, setPlaceStats] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    db.getCurrentUser().then((user) => {
      setCurrentUser(user);
      if (user) {
        db.getFavorites(user.id).then(setFavorites);
        setPage("home");
      }
    });
    db.getAllComments().then((comments) => setPlaceStats(buildPlaceStats(comments)));
  }, []);

  const go = (nextPage, id = selectedPlaceId) => {
    setSelectedPlaceId(id);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const handleAuth = (user) => {
    setCurrentUser(user);
    db.getFavorites(user.id).then(setFavorites);
    go("home");
  };

  const logout = async () => {
    await db.logoutUser();
    setCurrentUser(null);
    setFavorites([]);
    go("login");
  };

  const toggleFavorite = async (placeId) => {
    try {
      if (!currentUser) {
        showNotice("Inicia sesion para guardar favoritos.");
        return;
      }

      const isFavorite = await db.toggleFavorite(currentUser.id, placeId);
      setFavorites((items) => (isFavorite ? [...items, placeId] : items.filter((id) => id !== placeId)));
      showNotice(isFavorite ? "Destino agregado a favoritos." : "Destino eliminado de favoritos.");
    } catch (error) {
      showNotice(error.message);
    }
  };

  const handleCommentAdded = (comment) => {
    setPlaceStats((current) => {
      const placeId = Number(comment.place_id);
      const previous = getPlaceStats(current, placeId);
      const totalRating = previous.totalRating + Number(comment.rating || 0);
      const count = previous.count + 1;

      return {
        ...current,
        [placeId]: {
          count,
          totalRating,
          average: Number((totalRating / count).toFixed(1)),
        },
      };
    });
  };

  const appProps = { go, currentUser, favorites, toggleFavorite, logout, showNotice, placeStats, handleCommentAdded };

  return (
    <>
      {notice && <div className="toast">{notice}</div>}
      {page === "register" && <Register go={go} onAuth={handleAuth} />}
      {page === "home" && <Home {...appProps} />}
      {page === "search" && <SearchPage {...appProps} />}
      {page === "detail" && <PlaceDetail {...appProps} placeId={selectedPlaceId} />}
      {page === "comments" && <Comments {...appProps} placeId={selectedPlaceId} />}
      {page === "profile" && <ProfilePage {...appProps} />}
      {page === "login" && <Login go={go} onAuth={handleAuth} />}
    </>
  );
}

function Login({ go, onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <AuthShell title="Guia turistica" subtitle="Descubre Barranquilla">
      <form className="form" onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        try {
          const user = await db.loginUser({ email, password });
          onAuth(user);
        } catch (authError) {
          setError(authError.message);
        }
      }}>
        <Field icon="mail" label="Correo electronico" type="email" value={email} setValue={setEmail} placeholder="tu@email.com" />
        <Field icon="lock" label="Contrasena" type="password" value={password} setValue={setPassword} placeholder="********" />
        {error && <p className="form-error">{error}</p>}
        <div className="auth-options">
          <label><input type="checkbox" /> Recordarme</label>
          <button type="button" className="link-button">Olvidaste tu contrasena?</button>
        </div>
        <button className="primary-button" type="submit">Iniciar sesion</button>
      </form>
      <p className="auth-switch">No tienes cuenta? <button onClick={() => go("register")}>Registrate</button></p>
    </AuthShell>
  );
}

function Register({ go, onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const setValue = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <AuthShell title="Crear cuenta" subtitle="Unete a nuestra comunidad">
      <form className="form" onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        if (form.password !== form.confirm) {
          setError("Las contrasenas no coinciden.");
          return;
        }
        try {
          const user = await db.registerUser({ name: form.name, email: form.email, password: form.password });
          onAuth(user);
        } catch (registerError) {
          setError(registerError.message);
        }
      }}>
        <Field icon="user" label="Nombre completo" value={form.name} setValue={setValue("name")} placeholder="Tu nombre" />
        <Field icon="mail" label="Correo electronico" type="email" value={form.email} setValue={setValue("email")} placeholder="tu@email.com" />
        <Field icon="lock" label="Contrasena" type="password" value={form.password} setValue={setValue("password")} placeholder="********" />
        <Field icon="lock" label="Confirmar contrasena" type="password" value={form.confirm} setValue={setValue("confirm")} placeholder="********" />
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit">Registrarse</button>
      </form>
      <p className="auth-switch">Ya tienes cuenta? <button onClick={() => go("login")}>Inicia sesion</button></p>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-block">
          <span className="brand-icon"><Icon name="map" size={34} /></span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}

function Field({ icon, label, type = "text", value, setValue, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-wrap">
        <Icon name={icon} className="input-icon" />
        <input type={type} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} required />
      </span>
    </label>
  );
}

function Header({ go, currentUser, logout }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <button className="logo-button" onClick={() => go("home")}>
          <Icon name="map" className="blue" />
          <span>Guia turistica</span>
        </button>
        <div className="topbar-actions">
          <button className="search-pill" onClick={() => go("search")}>
            <Icon name="search" size={16} />
            <span>Buscar destinos...</span>
          </button>
          {currentUser && <button className="user-chip" onClick={() => go("profile")}>{currentUser.name}</button>}
          {currentUser && <button className="logout-button" onClick={logout}>Salir</button>}
        </div>
      </div>
    </header>
  );
}

function Home({ go, currentUser, favorites, toggleFavorite, logout, placeStats }) {
  return (
    <div className="app-page">
      <Header go={go} currentUser={currentUser} logout={logout} />
      <main className="container main-space bottom-safe">
        <section>
          <h2 className="section-title">Sitios Turisticos de Barranquilla</h2>
          <div className="place-grid">
            {places.slice(0, 6).map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                go={go}
                isFavorite={favorites.includes(place.id)}
                toggleFavorite={toggleFavorite}
                stats={getPlaceStats(placeStats, place.id)}
              />
            ))}
          </div>
        </section>
        <section className="cta-band">
          <div className="cta-title"><Icon name="compass" size={34} /><h2>Listo para tu proxima aventura?</h2></div>
          <p>Explora destinos increibles de Barranquilla. Encuentra tu proximo plan perfecto.</p>
          <button onClick={() => go("search")}>Explorar destinos</button>
        </section>
      </main>
      <MobileNav go={go} active="home" />
    </div>
  );
}

function PlaceCard({ place, go, isFavorite = false, toggleFavorite = () => {}, stats = getPlaceStats({}, 0) }) {
  return (
    <article className="place-card" onClick={() => go("detail", place.id)}>
      <div className="image-box">
        <img src={place.image} alt={place.name} />
        <button className={`round-button ${isFavorite ? "favorite" : ""}`} onClick={(event) => { event.stopPropagation(); toggleFavorite(place.id); }}><Icon name="heart" filled={isFavorite} /></button>
        <span className="category-badge">{place.category}</span>
      </div>
      <div className="card-body">
        <h3>{place.name}</h3>
        <p className="muted-row"><Icon name="map" size={16} /> {place.location}</p>
        <div className="card-footer">
          <span className="rating"><Icon name="star" size={16} filled /> {stats.count > 0 ? stats.average : "Sin valoraciones"}</span>
          <button>Ver detalles</button>
        </div>
        <p className="review-count">{stats.count} {stats.count === 1 ? "comentario" : "comentarios"}</p>
      </div>
    </article>
  );
}

function SearchPage({ go, placeStats }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPlaces = useMemo(() => places.filter((place) => {
    const text = `${place.name} ${place.location}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (selectedCategory === "Todos" || place.category === selectedCategory);
  }), [query, selectedCategory]);

  return (
    <div className="app-page">
      <header className="search-header">
        <div className="container">
          <div className="search-row">
            <button className="icon-button" onClick={() => go("home")}><Icon name="back" /></button>
            <div className="search-input">
              <Icon name="search" className="input-icon" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar lugares turisticos..." autoFocus />
              {query && <button onClick={() => setQuery("")}><Icon name="close" size={16} /></button>}
            </div>
            <button className="filter-button" onClick={() => setShowFilters((value) => !value)}><Icon name="sliders" /></button>
          </div>
          {showFilters && <div className="filters">{categories.map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "active" : ""}>{category}</button>)}</div>}
        </div>
      </header>
      <main className="container main-space">
        <p className="results-count">{filteredPlaces.length} {filteredPlaces.length === 1 ? "resultado encontrado" : "resultados encontrados"}</p>
        {filteredPlaces.length === 0 ? (
          <section className="empty-state"><Icon name="search" size={62} /><h2>No se encontraron resultados</h2><p>Intenta con otros terminos de busqueda o filtros.</p></section>
        ) : (
          <div className="result-grid">{filteredPlaces.map((place) => <ResultCard key={place.id} place={place} go={go} stats={getPlaceStats(placeStats, place.id)} />)}</div>
        )}
      </main>
    </div>
  );
}

function ResultCard({ place, go, stats = getPlaceStats({}, 0) }) {
  return (
    <article className="result-card" onClick={() => go("detail", place.id)}>
      <img src={place.image} alt={place.name} />
      <div>
        <div className="result-title"><h3>{place.name}</h3><span>{place.category}</span></div>
        <p className="muted-row small"><Icon name="map" size={14} /> {place.location}</p>
        <div className="card-footer"><span className="rating"><Icon name="star" size={16} filled /> {stats.count > 0 ? stats.average : "Sin valoraciones"}</span><button>Ver mas</button></div>
        <p className="review-count">{stats.count} {stats.count === 1 ? "comentario" : "comentarios"}</p>
      </div>
    </article>
  );
}

function PlaceDetail({ go, placeId, favorites, toggleFavorite, placeStats }) {
  const place = places.find((item) => item.id === placeId) || places[0];
  const gallery = place.gallery || [place.image, place.image, place.image];
  const isFavorite = favorites.includes(place.id);
  const stats = getPlaceStats(placeStats, place.id);

  return (
    <div className="app-page">
      <section className="hero-image">
        <img src={place.image} alt={place.name} />
        <div className="hero-actions">
          <button className="round-button" onClick={() => go("home")}><Icon name="back" /></button>
          <div><button className="round-button"><Icon name="share" /></button><button className={`round-button ${isFavorite ? "favorite" : ""}`} onClick={() => toggleFavorite(place.id)}><Icon name="heart" filled={isFavorite} /></button></div>
        </div>
      </section>
      <main className="container detail-wrap">
        <article className="detail-card">
          <h1>{place.name}</h1>
          <p className="muted-row"><Icon name="map" /> {place.location}</p>
          <div className="detail-rating">
            <span className="rating"><Icon name="star" filled /> {stats.count > 0 ? stats.average : "Sin valoraciones"}</span>
            <span>({stats.count} {stats.count === 1 ? "comentario" : "comentarios"})</span>
          </div>
          <div className="info-grid">
            <InfoTile color="blue" icon="clock" title="Horario" value={place.hours || "Consultar horarios"} />
            <InfoTile color="green" icon="money" title="Precio" value={place.price || "Consultar precio"} />
            <InfoTile color="purple" icon="calendar" title="Mejor epoca" value={place.bestTime || "Todo el ano"} />
          </div>
          <ContentSection title="Descripcion"><p>{place.description || "Un lugar recomendado para descubrir la cultura, el paisaje y la vida urbana de Barranquilla."}</p></ContentSection>
          <ContentSection title="Lo mas destacado">
            <ul className="highlights">{(place.highlights || ["Lugar recomendado para visitar", "Buen punto para fotografia", "Experiencia local de Barranquilla"]).map((item) => <li key={item}>{item}</li>)}</ul>
          </ContentSection>
          <ContentSection title="Galeria" action={<button className="gallery-action"><Icon name="camera" size={16} /> Ver todas</button>}>
            <div className="gallery">{gallery.map((image, index) => <img key={image + index} src={image} alt={`Galeria ${index + 1}`} />)}</div>
          </ContentSection>
          <button className="primary-button wide" onClick={() => go("comments", place.id)}><Icon name="message" /> Ver comentarios ({stats.count})</button>
        </article>
      </main>
    </div>
  );
}

function InfoTile({ color, icon, title, value }) {
  return <div className={`info-tile ${color}`}><Icon name={icon} /><div><span>{title}</span><strong>{value}</strong></div></div>;
}

function ContentSection({ title, action, children }) {
  return <section className="content-section"><div className="section-head"><h2>{title}</h2>{action}</div>{children}</section>;
}

function Comments({ go, placeId, currentUser, showNotice, handleCommentAdded }) {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([]);
  const commentStats = buildPlaceStats(comments)[Number(placeId)] || { count: 0, totalRating: 0, average: null };
  const ratingRows = [5, 4, 3, 2, 1].map((stars) => {
    const total = comments.filter((comment) => Number(comment.rating) === stars).length;
    const percent = commentStats.count > 0 ? Math.round((total / commentStats.count) * 100) : 0;
    return { stars, percent };
  });

  useEffect(() => {
    db.getComments(placeId).then(setComments);
  }, [placeId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    try {
      const savedComment = await db.addComment({ placeId, user: currentUser, text: newComment.trim(), rating });
      setComments((items) => [savedComment, ...items]);
      handleCommentAdded(savedComment);
      setNewComment("");
      setRating(5);
      showNotice("Comentario guardado.");
    } catch (error) {
      showNotice(error.message);
    }
  };

  return (
    <div className="app-page comments-page">
      <header className="comments-header">
        <div className="container narrow header-row">
          <button className="icon-button" onClick={() => go("detail", placeId)}><Icon name="back" /></button>
          <div><h1>Comentarios y Resenas</h1><p>{commentStats.count} {commentStats.count === 1 ? "comentario" : "comentarios"}</p></div>
        </div>
      </header>
      <main className="container narrow main-space comments-main">
        <section className="rating-panel">
          <h2>Calificacion general</h2>
          <div className="rating-summary">
            <strong>{commentStats.count > 0 ? commentStats.average : "0.0"}</strong>
            <div>
              {commentStats.count > 0 ? <StarRow count={Math.round(commentStats.average)} /> : <span className="no-rating">Sin valoraciones</span>}
              <p>Basado en {commentStats.count} {commentStats.count === 1 ? "valoracion" : "valoraciones"}</p>
            </div>
          </div>
          {ratingRows.map(({ stars, percent }) => <div className="rating-bar" key={stars}><span>{stars}</span><Icon name="star" size={14} filled /><div><i style={{ width: `${percent}%` }} /></div><span>{percent}%</span></div>)}
        </section>
        <section className="comment-list">
          {comments.length === 0 ? (
            <div className="empty-comments">Aun no hay comentarios. Se el primero en valorar este lugar.</div>
          ) : (
            comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          )}
        </section>
      </main>
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="container narrow">
          <div className="comment-tools"><span className="avatar-placeholder"><Icon name="user" size={18} /></span><StarPicker rating={rating} setRating={setRating} /></div>
          <div className="comment-input-row"><input value={newComment} onChange={(event) => setNewComment(event.target.value)} placeholder="Escribe tu comentario..." /><button disabled={!newComment.trim()}><Icon name="send" size={16} /> Enviar</button></div>
        </div>
      </form>
    </div>
  );
}

function ProfilePage({ go, currentUser, favorites, logout, placeStats }) {
  const [userComments, setUserComments] = useState([]);
  const favoritePlaces = places.filter((place) => favorites.includes(place.id));
  const averageRating = userComments.length > 0
    ? Number((userComments.reduce((total, comment) => total + Number(comment.rating || 0), 0) / userComments.length).toFixed(1))
    : null;

  useEffect(() => {
    if (currentUser) {
      db.getUserComments(currentUser.id).then(setUserComments);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="app-page">
        <main className="container narrow main-space bottom-safe">
          <section className="profile-card">
            <h1>Perfil</h1>
            <p className="profile-muted">Inicia sesion para ver tu perfil, favoritos y comentarios.</p>
            <button className="primary-button" onClick={() => go("login")}>Iniciar sesion</button>
          </section>
        </main>
        <MobileNav go={go} active="profile" />
      </div>
    );
  }

  return (
    <div className="app-page">
      <Header go={go} currentUser={currentUser} logout={logout} />
      <main className="container main-space bottom-safe">
        <section className="profile-hero">
          <div className="profile-avatar"><Icon name="user" size={36} /></div>
          <div>
            <h1>{currentUser.name}</h1>
            <p>{currentUser.email}</p>
          </div>
          <button className="logout-button profile-logout" onClick={logout}>Cerrar sesion</button>
        </section>

        <section className="profile-stats">
          <ProfileStat label="Favoritos" value={favorites.length} />
          <ProfileStat label="Comentarios" value={userComments.length} />
          <ProfileStat label="Promedio dado" value={averageRating ? averageRating : "0.0"} />
        </section>

        <section className="profile-section">
          <div className="section-head">
            <h2>Mis favoritos</h2>
          </div>
          {favoritePlaces.length === 0 ? (
            <div className="empty-comments">Aun no tienes favoritos. Guarda destinos tocando el corazon.</div>
          ) : (
            <div className="profile-list">
              {favoritePlaces.map((place) => (
                <button className="profile-place" key={place.id} onClick={() => go("detail", place.id)}>
                  <img src={place.image} alt={place.name} />
                  <span>
                    <strong>{place.name}</strong>
                    <small>{getPlaceStats(placeStats, place.id).count} comentarios</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="profile-section">
          <div className="section-head">
            <h2>Mis comentarios</h2>
          </div>
          {userComments.length === 0 ? (
            <div className="empty-comments">Todavia no has publicado comentarios.</div>
          ) : (
            <div className="profile-list">
              {userComments.map((comment) => {
                const place = places.find((item) => item.id === Number(comment.place_id));
                return (
                  <button className="profile-comment" key={comment.id} onClick={() => go("comments", Number(comment.place_id))}>
                    <span>
                      <strong>{place?.name || "Destino"}</strong>
                      <small>{comment.date}</small>
                    </span>
                    <span className="rating"><Icon name="star" size={16} filled /> {comment.rating}</span>
                    <p>{comment.text}</p>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <MobileNav go={go} active="profile" />
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div className="profile-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function CommentCard({ comment }) {
  return (
    <article className="comment-card">
      <img src={comment.avatar} alt={comment.author} />
      <div>
        <div className="comment-top"><div><h3>{comment.author}</h3><p>{comment.date}</p></div><StarRow count={comment.rating} /></div>
        <p className="comment-text">{comment.text}</p>
        <button className="helpful"><Icon name="thumbs" size={16} /> Util ({comment.likes})</button>
      </div>
    </article>
  );
}

function StarRow({ count }) {
  return <div className="stars">{Array.from({ length: count }, (_, index) => <Icon key={index} name="star" size={16} filled />)}</div>;
}

function StarPicker({ rating, setRating }) {
  return <div className="stars picker">{[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} onClick={() => setRating(star)}><Icon name="star" size={20} filled={star <= rating} /></button>)}</div>;
}

function MobileNav({ go, active }) {
  return (
    <nav className="mobile-nav">
      <button className={active === "home" ? "active" : ""} onClick={() => go("home")}><Icon name="map" /><span>Inicio</span></button>
      <button onClick={() => go("search")}><Icon name="search" /><span>Buscar</span></button>
      <button><Icon name="heart" /><span>Favoritos</span></button>
      <button className={active === "profile" ? "active" : ""} onClick={() => go("profile")}><Icon name="user" /><span>Perfil</span></button>
    </nav>
  );
}

createRoot(document.getElementById("root")).render(<App />);
