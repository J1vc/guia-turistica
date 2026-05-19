const STORAGE_KEY = "guia_turistica_db";
const SESSION_KEY = "guia_turistica_session";

const seededComments = {
  1: [
    { id: 1, place_id: 1, author: "Maria Gonzalez", avatar: "https://i.pravatar.cc/150?img=1", rating: 5, date: "15 de marzo, 2026", text: "El Castillo de Salgar es hermoso. La vista del mar Caribe es espectacular. Fui al atardecer y las fotos quedaron increibles.", likes: 24 },
    { id: 2, place_id: 1, author: "Carlos Rodriguez", avatar: "https://i.pravatar.cc/150?img=2", rating: 4, date: "10 de marzo, 2026", text: "Muy bonito lugar historico. Recomiendo llevar protector solar porque hace bastante calor.", likes: 18 },
    { id: 3, place_id: 1, author: "Ana Martinez", avatar: "https://i.pravatar.cc/150?img=3", rating: 5, date: "5 de marzo, 2026", text: "Un tesoro de Barranquilla. El faro y la arquitectura son fascinantes.", likes: 31 },
  ],
  2: [
    { id: 1, place_id: 2, author: "Pedro Sanchez", avatar: "https://i.pravatar.cc/150?img=5", rating: 5, date: "20 de marzo, 2026", text: "El Malecon de Puerto Colombia es perfecto para caminar y relajarse.", likes: 45 },
    { id: 2, place_id: 2, author: "Laura Torres", avatar: "https://i.pravatar.cc/150?img=6", rating: 5, date: "18 de marzo, 2026", text: "La vista del mar es increible y el ambiente es muy tranquilo.", likes: 38 },
  ],
  3: [
    { id: 1, place_id: 3, author: "Sofia Ramirez", avatar: "https://i.pravatar.cc/150?img=8", rating: 5, date: "25 de marzo, 2026", text: "La Catedral Metropolitana es impresionante. Sus vitrales son hermosos.", likes: 19 },
  ],
  4: [
    { id: 1, place_id: 4, author: "Carolina Perez", avatar: "https://i.pravatar.cc/150?img=10", rating: 5, date: "28 de marzo, 2026", text: "El Gran Malecon es perfecto para hacer ejercicio y disfrutar del rio Magdalena.", likes: 42 },
  ],
  5: [
    { id: 1, place_id: 5, author: "Andrea Lopez", avatar: "https://i.pravatar.cc/150?img=12", rating: 5, date: "30 de marzo, 2026", text: "Bocas de Ceniza es un fenomeno natural increible.", likes: 38 },
  ],
  6: [
    { id: 1, place_id: 6, author: "Isabella Vargas", avatar: "https://i.pravatar.cc/150?img=14", rating: 5, date: "2 de abril, 2026", text: "El Museo del Caribe es fantastico. Las exposiciones son interactivas y educativas.", likes: 51 },
  ],
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useSupabase = Boolean(supabaseUrl && supabaseAnonKey);

function createSeed() {
  return {
    users: [],
    comments: Object.values(seededComments).flat(),
    favorites: [],
  };
}

function readLocalDb() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const seed = createSeed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  return JSON.parse(saved);
}

function writeLocalDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

function readSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

function writeSession({ user, accessToken }) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, accessToken }));
}

async function supabaseRequest(path, options = {}) {
  const session = readSession();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session?.accessToken || supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) return null;
  return response.json();
}

async function supabaseAuth(path, body) {
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export const db = {
  isCloudEnabled: useSupabase,

  async getCurrentUser() {
    const session = readSession();
    return session?.user || null;
  },

  async registerUser({ name, email, password }) {
    if (useSupabase) {
      const auth = await supabaseAuth("signup", {
        email,
        password,
        data: { name },
      });

      if (!auth.session?.access_token) {
        throw new Error("Cuenta creada. Revisa tu correo para confirmar el registro antes de iniciar sesion.");
      }

      const user = { id: auth.user.id, name, email };
      writeSession({ user, accessToken: auth.session.access_token });
      await supabaseRequest("profiles", {
        method: "POST",
        body: JSON.stringify(user),
      });
      return user;
    }

    const localDb = readLocalDb();
    const exists = localDb.users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("Ya existe una cuenta con ese correo.");

    const user = { id: crypto.randomUUID(), name, email, password };
    localDb.users.push(user);
    writeLocalDb(localDb);
    writeSession({ user: publicUser(user), accessToken: null });
    return publicUser(user);
  },

  async loginUser({ email, password }) {
    if (useSupabase) {
      const auth = await supabaseAuth("token?grant_type=password", { email, password });
      const accessToken = auth.access_token;
      const profileRows = await supabaseRequest(`profiles?id=eq.${auth.user.id}&select=id,name,email`);
      const user = profileRows[0] || { id: auth.user.id, name: auth.user.user_metadata?.name || email, email };
      writeSession({ user, accessToken });
      return user;
    }

    const localDb = readLocalDb();
    const user = localDb.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) throw new Error("Correo o contrasena incorrectos.");
    writeSession({ user: publicUser(user), accessToken: null });
    return publicUser(user);
  },

  async logoutUser() {
    localStorage.removeItem(SESSION_KEY);
  },

  async getFavorites(userId) {
    if (!userId) return [];
    if (useSupabase) {
      const rows = await supabaseRequest(`favorites?user_id=eq.${userId}&select=place_id`);
      return rows.map((row) => Number(row.place_id));
    }

    return readLocalDb().favorites.filter((item) => item.user_id === userId).map((item) => Number(item.place_id));
  },

  async toggleFavorite(userId, placeId) {
    if (!userId) throw new Error("Debes iniciar sesion para guardar favoritos.");
    if (useSupabase) {
      const rows = await supabaseRequest(`favorites?user_id=eq.${userId}&place_id=eq.${placeId}&select=id`);
      if (rows.length > 0) {
        await supabaseRequest(`favorites?id=eq.${rows[0].id}`, { method: "DELETE" });
        return false;
      }
      await supabaseRequest("favorites", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, place_id: placeId }),
      });
      return true;
    }

    const localDb = readLocalDb();
    const index = localDb.favorites.findIndex((item) => item.user_id === userId && Number(item.place_id) === Number(placeId));
    if (index >= 0) {
      localDb.favorites.splice(index, 1);
      writeLocalDb(localDb);
      return false;
    }

    localDb.favorites.push({ id: crypto.randomUUID(), user_id: userId, place_id: Number(placeId) });
    writeLocalDb(localDb);
    return true;
  },

  async getComments(placeId) {
    if (useSupabase) {
      return supabaseRequest(`comments?place_id=eq.${placeId}&select=*&order=created_at.desc`);
    }

    return readLocalDb().comments.filter((comment) => Number(comment.place_id) === Number(placeId));
  },

  async addComment({ placeId, user, text, rating }) {
    if (!user) throw new Error("Debes iniciar sesion para comentar.");
    const comment = {
      id: crypto.randomUUID(),
      place_id: Number(placeId),
      author: user.name,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`,
      rating: Number(rating),
      date: new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
      text,
      likes: 0,
      user_id: user.id,
    };

    if (useSupabase) {
      const [saved] = await supabaseRequest("comments", {
        method: "POST",
        body: JSON.stringify(comment),
      });
      return saved;
    }

    const localDb = readLocalDb();
    localDb.comments.unshift(comment);
    writeLocalDb(localDb);
    return comment;
  },
};
