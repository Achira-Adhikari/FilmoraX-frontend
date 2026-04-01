import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Film, Loader2, Calendar, User, Star, Video, X, Check } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { deleteMovie, getAllMovies } from '../../services/movieService';
import toast from 'react-hot-toast';

// --- Movie Form Component ---
const MovieForm = ({ movie, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    year: movie?.year || new Date().getFullYear(),
    runtime: movie?.runtime || 120,
    directorId: movie?.directorId || '',
    actors: Array.isArray(movie?.actors) ? movie.actors : [],
    plot: movie?.plot || '',
    genreIds: Array.isArray(movie?.Genre) ? movie.Genre : [],
    poster_url_portrait: movie?.poster_url_portrait || '',
    poster_url_landscape: movie?.poster_url_landscape || '',
    trailer_url: movie?.trailer_url || '',
    backdrop: movie?.backdrop || '',
    trailer: movie?.trailer || '',
    releaseDate: movie?.releaseDate || '', // <--- නිවැරදිව එකතු කළා
    isUpcoming: movie?.isUpcoming || false // <--- නිවැරදිව එකතු කළා
  });

  const [actorSearch, setActorSearch] = useState('');
  const [directorSearch, setDirectorSearch] = useState(movie?.director || '');
  const [showActorTips, setShowActorTips] = useState(false);
  const [showDirectorTips, setShowDirectorTips] = useState(false);

  const genresList = ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
  const directorsList = ['Christopher Nolan', 'Greta Gerwig', 'Denis Villeneuve', 'Martin Scorsese', 'James Cameron', 'Quentin Tarantino'];
  const actorsList = ['Leonardo DiCaprio', 'Cillian Murphy', 'Margot Robbie', 'Timothée Chalamet', 'Robert Downey Jr.', 'Zendaya', 'Tom Hardy'];

  const loadData = async () => {
    try {
      const [genresREsponse, actorsResponse] = await Promise.allSettled([
        
      ]);

      if (genresREsponse.status === "fulfilled") {
        setExamTypes(genresREsponse.value);
      }

      if (actorsResponse.status === "fulfilled") {
        setCategory(actorsResponse.value);
      }
    } catch (error) {
      
    }
  }

  const filteredDirectors = directorsList.filter(d =>
    d.toLowerCase().includes(directorSearch.toLowerCase()) && d !== formData.director
  );

  const filteredActors = actorsList.filter(a =>
    a.toLowerCase().includes(actorSearch.toLowerCase()) && !formData.actors.includes(a)
  );

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre) => {
    const newGenres = formData.genres.includes(genre)
      ? formData.genres.filter((g) => g !== genre)
      : [...formData.genres, genre];
    setFormData(prev => ({ ...prev, genres: newGenres }));
  };

  return (
    <div className="space-y-5 text-white max-h-[80vh] overflow-y-auto px-1 custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Movie Portrait URL *</label>
          <input type="text" value={formData.poster_url_portrait} onChange={(e) => setFormData(p => ({ ...p, poster_url_portrait: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Movie Landscape URL *</label>
          <input type="text" value={formData.poster_url_landscape} onChange={(e) => setFormData(p => ({ ...p, poster_url_landscape: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Movie Trailer URL *</label>
          <input type="text" value={formData.trailer_url} onChange={(e) => setFormData(p => ({ ...p, trailer_url: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        {/* Poster */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Poster Image</label>
          <div className="mt-2 flex items-center gap-4 p-4 border-2 border-dashed border-gray-800 rounded-xl bg-gray-950/50">
            {formData.poster ? <img src={formData.poster} className="w-20 h-28 object-cover rounded-lg border border-gray-700 shadow-xl" /> : <div className="w-20 h-28 rounded-lg bg-gray-800 flex items-center justify-center"><Film className="text-gray-600" /></div>}
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'poster')} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600/10 file:text-blue-500 cursor-pointer" />
          </div>
        </div>

        {/* Director Search */}
        <div className="md:col-span-2 relative">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Director</label>
          <div className="relative">
            <input type="text" value={directorSearch} onChange={(e) => { setDirectorSearch(e.target.value); setShowDirectorTips(true); if (!e.target.value) setFormData(p => ({ ...p, director: '' })); }} onFocus={() => setShowDirectorTips(true)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          </div>
          <AnimatePresence>
            {showDirectorTips && directorSearch && filteredDirectors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                {filteredDirectors.map(d => (
                  <div key={d} onClick={() => { setFormData(p => ({ ...p, director: d })); setDirectorSearch(d); setShowDirectorTips(false); }} className="p-3 hover:bg-blue-600 text-sm cursor-pointer flex justify-between">{d} <Check size={14} className="opacity-50" /></div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actor Search */}
        <div className="md:col-span-2 relative">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Cast / Actors</label>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-900 border border-gray-700 rounded-xl min-h-[52px] focus-within:ring-2 focus-within:ring-blue-500">
            {formData.actors.map(actor => (
              <span key={actor} className="flex items-center gap-1 bg-blue-600 text-white text-[11px] font-bold px-2 py-1 rounded-lg">
                {actor} <X size={14} className="cursor-pointer hover:text-red-200" onClick={() => setFormData(p => ({ ...p, actors: p.actors.filter(a => a !== actor) }))} />
              </span>
            ))}
            <input type="text" value={actorSearch} onChange={(e) => { setActorSearch(e.target.value); setShowActorTips(true); }} onFocus={() => setShowActorTips(true)} placeholder="Search and add..." className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm p-1 text-white" />
          </div>
          <AnimatePresence>
            {showActorTips && actorSearch && filteredActors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                {filteredActors.map(a => (
                  <div key={a} onClick={() => { setFormData(p => ({ ...p, actors: [...p.actors, a] })); setActorSearch(''); setShowActorTips(false); }} className="p-3 hover:bg-blue-600 text-sm cursor-pointer flex justify-between border-b border-gray-700/50">{a} <Plus size={14} className="opacity-50" /></div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats & Release Info (මෙන්න ඔයා ඉල්ලපු කොටස) */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <div><label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">Year</label><input type="number" value={formData.year} onChange={(e) => setFormData(p => ({ ...p, year: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none" /></div>
          <div><label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">Runtime (min)</label><input type="number" value={formData.runtime} onChange={(e) => setFormData(p => ({ ...p, runtime: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none" /></div>

          {/* Release Date */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">Release Date</label>
            <input type="date" value={formData.releaseDate} onChange={(e) => setFormData(p => ({ ...p, releaseDate: e.target.value }))} className="bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none text-white text-sm" />
          </div>

          {/* Upcoming Toggle */}
          <div className="flex items-center gap-3 px-4 bg-gray-950/50 border border-gray-800 rounded-xl mt-5">
            <input
              type="checkbox"
              id="upcoming"
              checked={formData.isUpcoming}
              onChange={(e) => setFormData(p => ({ ...p, isUpcoming: e.target.checked }))}
              className="w-5 h-5 rounded text-blue-600 bg-gray-900 border-gray-700"
            />
            <label htmlFor="upcoming" className="text-xs font-semibold text-gray-400 uppercase cursor-pointer select-none">Upcoming Movie</label>
          </div>
        </div>

        {/* Genres */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genresList.map((g) => (
              <button key={g} type="button" onClick={() => toggleGenre(g)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${formData.genres.includes(g) ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}>{g}</button>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Synopsis</label>
          <textarea rows="3" value={formData.plot} onChange={(e) => setFormData(p => ({ ...p, plot: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none resize-none" placeholder="Enter movie description..." />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800 sticky bottom-0 bg-[#0f172a] pb-2">
        <Button type="submit" variant="primary" className="flex-1 py-3 order-1 sm:order-2">{movie ? 'Save Changes' : 'Publish Movie'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="order-2 sm:order-1">Cancel</Button>
      </div>
    </div>
  );
};

// --- Main AdminMovies Component ---
export const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [error, setError] = useState('');

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllMovies();

      // safe check
      setMovies(res?.data.movies || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(
        err?.response?.data?.message || "Failed to load movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleDelete = (movieId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this movie?
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs bg-gray-200 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              const loadingToast = toast.loading("Deleting movie...");

              try {
                const res = await deleteMovie(movieId);

                toast.dismiss(loadingToast);
                toast.success("Movie deleted successfully");

                fetchMovies();

              } catch (error) {
                toast.dismiss(loadingToast);
                console.log(error);
                toast.error(
                  error?.response?.data?.message ||
                  "Failed to delete movie"
                );
              }
            }}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const handleEdit = (movie) => {
    setEditingMovie(null);
    setTimeout(() => {
      setEditingMovie({
        ...movie,
        actors: Array.isArray(movie.actors) ? movie.actors : [],
        genres: Array.isArray(movie.genres) ? movie.genres : []
      });
      setShowModal(true);
    }, 10);
  };

  const filteredMovies = movies.filter(m =>
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.director?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-950"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3"><Video className="text-blue-500" /> Movies Library</h1>
        <Button icon={Plus} onClick={() => { setEditingMovie(null); setShowModal(true); }}>Add New Movie</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl"><Film className="text-blue-500" size={20} /></div>
          <div><p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Total Films</p><p className="text-xl font-bold text-white">{movies.length}</p></div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="bg-yellow-500/10 p-3 rounded-xl"><Star className="text-yellow-500" size={20} /></div>
          <div><p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Rating</p><p className="text-xl font-bold text-white">8.4</p></div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-xl"><Calendar className="text-purple-500" size={20} /></div>
          <div><p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Latest</p><p className="text-xl font-bold text-white">{movies[0]?.year || '2024'}</p></div>
        </div>
      </div>

      {/* Search & Table List */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        {/* Search Bar (මෙතැන ඇත) */}
        <div className="p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-gray-950 text-white pl-10 pr-4 py-2 rounded-xl border border-gray-800 outline-none text-sm focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-950/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <tr><th className="px-6 py-4">Movie Info</th><th className="px-6 py-4">Director</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredMovies.map((m) => (
                <tr key={m.id} className="hover:bg-blue-600/5 group transition-all">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {/* Table Image (මෙතැන ඇත) */}
                    <div className="w-10 h-14 rounded bg-gray-800 overflow-hidden border border-gray-700 shadow-md">
                      {m.poster_url_portrait ? <img src={m.poster_url_portrait} className="w-full h-full object-cover" alt="" /> : <Film className="w-full h-full p-2 text-gray-700" />}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase text-xs tracking-wide">{m.title}</p>
                      <p className="text-[10px] text-gray-500">{m.year}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{m.director.full_name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(m)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg cursor-pointer transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg cursor-pointer transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingMovie(null); }}
        title={editingMovie ? 'Edit Movie' : 'Add Movie'}
        size="lg"
      >
        <MovieForm
          key={editingMovie ? `edit-${editingMovie.id}` : 'new-movie'}
          movie={editingMovie}
          onCancel={() => { setShowModal(false); setEditingMovie(null); }}
          onSuccess={() => {
            console.log("success");
            fetchMovies();
            setShowModal(false);
          }}
        />
      </Modal>
    </div>
  );
};