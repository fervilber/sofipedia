import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');

  const handleAdmin = () => setShowPass(true);
  const handlePass = e => setPass(e.target.value);
  const checkPass = e => {
    e.preventDefault();
    if (pass === 'sofia123') {
      setIsAdmin(true);
      setShowPass(false);
      setPass('');
      setMsg('¡Modo admin activado!');
      setTimeout(() => setMsg(''), 2000);
    } else {
      setMsg('Contraseña incorrecta');
      setTimeout(() => setMsg(''), 2000);
    }
  };
  return { isAdmin, showPass, msg, handleAdmin, handlePass, checkPass, setMsg };
}

function Home() {
  // Imágenes de ejemplo (puedes cambiarlas por dibujos propios si los tienes)
  const collage = [
    'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png', // Pikachu
    'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png', // Charmander
    'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png', // Squirtle
    'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png', // Bulbasaur
    'https://static.wikia.nocookie.net/zelda_gamepedia_en/images/6/6e/Link_Artwork_2_%28Ocarina_of_Time%29.png', // Link Zelda
    'https://static.wikia.nocookie.net/mario/images/9/99/MarioNSMBUDeluxe.png', // Mario
    'https://static.wikia.nocookie.net/animalcrossing/images/6/6e/Isabelle_NH.png', // Animal Crossing
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/51/Steve.png', // Minecraft
  ];
  return (
    <div className="page home-page">
      <div className="collage-bg">
        {collage.map((img, i) => (
          <img key={i} src={img} alt="collage" className="collage-img" />
        ))}
      </div>
      <h2>¡Bienvenid@ a Sofipedia!</h2>
      <p className="home-desc">
        Sofipedia es una enciclopedia divertida y creativa donde Sofía, una niña super lista, comparte su propio idioma inventado, sus dibujos y trucos de videojuegos.<br /><br />
        Aquí puedes traducir palabras al idioma de Sofía, ver su galería de dibujos (¡incluyendo Pokémon y personajes de videojuegos!), y descubrir los mejores trucos para juegos como Zelda, Mario, Animal Crossing, Minecraft y muchos más.<br /><br />
        ¡Explora, aprende y diviértete en el mundo de Sofía!
      </p>
    </div>
  );
}

function Translator() {
  const [translations, setTranslations] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ spanish: '', sofia: '' });
  const [msg, setMsg] = useState('');
  const admin = useAdmin();

  const fetchTranslations = () => {
    fetch('http://localhost:4000/api/translations')
      .then(res => res.json())
      .then(data => setTranslations(data));
  };
  useEffect(() => { fetchTranslations(); }, []);

  const filtered = translations.filter(t =>
    t.spanish.toLowerCase().includes(search.toLowerCase()) ||
    t.sofia.toLowerCase().includes(search.toLowerCase())
  );

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value });
  const addTranslation = e => {
    e.preventDefault();
    if (!form.spanish.trim() || !form.sofia.trim()) return;
    fetch('http://localhost:4000/api/translations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setMsg('¡Traducción añadida!');
        setForm({ spanish: '', sofia: '' });
        fetchTranslations();
        setTimeout(() => setMsg(''), 2000);
      })
      .catch(() => {
        setMsg('Error al guardar');
        setTimeout(() => setMsg(''), 2000);
      });
  };

  return (
    <div className="page">
      <h2>Traductor Sofipedia</h2>
      <input
        className="search-input"
        type="text"
        placeholder="Buscar palabra o frase..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="table">
        <thead><tr><th>Español</th><th>Idioma Sofía</th></tr></thead>
        <tbody>
          {filtered.map((t, i) => (
            <tr key={i}><td>{t.spanish}</td><td>{t.sofia}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="admin-section">
        {!admin.isAdmin && !admin.showPass && (
          <button className="admin-btn" onClick={admin.handleAdmin}>Entrar como admin</button>
        )}
        {admin.showPass && (
          <form className="admin-form" onSubmit={admin.checkPass}>
            <input
              type="password"
              className="admin-input"
              placeholder="Contraseña admin"
              value={admin.pass}
              onChange={admin.handlePass}
            />
            <button className="admin-btn" type="submit">Entrar</button>
          </form>
        )}
        {admin.isAdmin && (
          <form className="add-form" onSubmit={addTranslation}>
            <h4>Añadir nueva traducción</h4>
            <input
              className="add-input"
              name="spanish"
              placeholder="Español"
              value={form.spanish}
              onChange={handleForm}
              autoComplete="off"
            />
            <input
              className="add-input"
              name="sofia"
              placeholder="Idioma Sofía"
              value={form.sofia}
              onChange={handleForm}
              autoComplete="off"
            />
            <button className="add-btn" type="submit">Añadir</button>
          </form>
        )}
        {(msg || admin.msg) && <div className="msg-info">{msg || admin.msg}</div>}
      </div>
    </div>
  );
}

function Gallery() {
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState('');
  const admin = useAdmin();
  const [form, setForm] = useState({ text: '' });
  const [file, setFile] = useState(null);
  const fileInput = useRef();

  const fetchGallery = () => {
    fetch('http://localhost:4000/api/gallery')
      .then(res => res.json())
      .then(data => setImages(data));
  };
  useEffect(() => { fetchGallery(); }, []);

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = e => setFile(e.target.files[0]);

  const addImage = e => {
    e.preventDefault();
    if (!file || !form.text.trim()) return;
    const data = new FormData();
    data.append('image', file);
    data.append('text', form.text);
    fetch('http://localhost:4000/api/gallery', {
      method: 'POST',
      body: data
    })
      .then(res => res.json())
      .then(() => {
        setMsg('¡Imagen subida!');
        setForm({ text: '' });
        setFile(null);
        fileInput.current.value = '';
        fetchGallery();
        setTimeout(() => setMsg(''), 2000);
      })
      .catch(() => {
        setMsg('Error al subir');
        setTimeout(() => setMsg(''), 2000);
      });
  };

  return (
    <div className="page">
      <h2>Galería de Dibujos</h2>
      <div className="gallery">
        {images.map((img, i) => (
          <div className="gallery-item" key={i}>
            <img src={img.image.startsWith('http') ? img.image : `http://localhost:4000${img.image}`} alt={img.text} />
            <p>{img.text}</p>
          </div>
        ))}
      </div>
      <div className="admin-section">
        {!admin.isAdmin && !admin.showPass && (
          <button className="admin-btn" onClick={admin.handleAdmin}>Entrar como admin</button>
        )}
        {admin.showPass && (
          <form className="admin-form" onSubmit={admin.checkPass}>
            <input
              type="password"
              className="admin-input"
              placeholder="Contraseña admin"
              value={admin.pass}
              onChange={admin.handlePass}
            />
            <button className="admin-btn" type="submit">Entrar</button>
          </form>
        )}
        {admin.isAdmin && (
          <form className="add-form" onSubmit={addImage} encType="multipart/form-data">
            <h4>Añadir nueva imagen</h4>
            <input
              className="add-input"
              type="file"
              accept="image/*"
              onChange={handleFile}
              ref={fileInput}
            />
            <input
              className="add-input"
              name="text"
              placeholder="Descripción"
              value={form.text}
              onChange={handleForm}
              autoComplete="off"
            />
            <button className="add-btn" type="submit">Subir</button>
          </form>
        )}
        {(msg || admin.msg) && <div className="msg-info">{msg || admin.msg}</div>}
      </div>
    </div>
  );
}

function Tricks() {
  const [tricks, setTricks] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [form, setForm] = useState({ game: '', title: '', description: '' });
  const [msg, setMsg] = useState('');
  const admin = useAdmin();

  const fetchTricks = () => {
    fetch('http://localhost:4000/api/tricks')
      .then(res => res.json())
      .then(data => setTricks(data));
  };
  useEffect(() => { fetchTricks(); }, []);

  const games = Array.from(new Set(tricks.map(t => t.game)));
  const filtered = selectedGame ? tricks.filter(t => t.game === selectedGame) : tricks;

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value });
  const addTrick = e => {
    e.preventDefault();
    if (!form.game.trim() || !form.title.trim() || !form.description.trim()) return;
    fetch('http://localhost:4000/api/tricks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setMsg('¡Truco añadido!');
        setForm({ game: '', title: '', description: '' });
        fetchTricks();
        setTimeout(() => setMsg(''), 2000);
      })
      .catch(() => {
        setMsg('Error al guardar');
        setTimeout(() => setMsg(''), 2000);
      });
  };

  return (
    <div className="page">
      <h2>Trucos de Juegos</h2>
      <div className="games-filter">
        <span>Filtrar por juego:</span>
        {games.map(game => (
          <button
            key={game}
            className={selectedGame === game ? 'game-btn selected' : 'game-btn'}
            onClick={() => setSelectedGame(game)}
          >
            {game}
          </button>
        ))}
        {selectedGame && (
          <button className="game-btn clear" onClick={() => setSelectedGame('')}>Ver todos</button>
        )}
      </div>
      <ul className="tricks-list">
        {filtered.map((t, i) => (
          <li key={i}><strong>{t.game} - {t.title}:</strong> {t.description}</li>
        ))}
      </ul>
      <div className="admin-section">
        {!admin.isAdmin && !admin.showPass && (
          <button className="admin-btn" onClick={admin.handleAdmin}>Entrar como admin</button>
        )}
        {admin.showPass && (
          <form className="admin-form" onSubmit={admin.checkPass}>
            <input
              type="password"
              className="admin-input"
              placeholder="Contraseña admin"
              value={admin.pass}
              onChange={admin.handlePass}
            />
            <button className="admin-btn" type="submit">Entrar</button>
          </form>
        )}
        {admin.isAdmin && (
          <form className="add-form" onSubmit={addTrick}>
            <h4>Añadir nuevo truco</h4>
            <input
              className="add-input"
              name="game"
              placeholder="Juego (ej: Zelda)"
              value={form.game}
              onChange={handleForm}
              autoComplete="off"
            />
            <input
              className="add-input"
              name="title"
              placeholder="Título del truco"
              value={form.title}
              onChange={handleForm}
              autoComplete="off"
            />
            <input
              className="add-input"
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleForm}
              autoComplete="off"
            />
            <button className="add-btn" type="submit">Añadir</button>
          </form>
        )}
        {(msg || admin.msg) && <div className="msg-info">{msg || admin.msg}</div>}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h1 className="logo logo-contrast">Sofipedia</h1>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/traductor">Traductor</Link></li>
          <li><Link to="/galeria">Galería</Link></li>
          <li><Link to="/trucos">Trucos</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/traductor" element={<Translator />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/trucos" element={<Tricks />} />
      </Routes>
    </Router>
  );
}

export default App;
