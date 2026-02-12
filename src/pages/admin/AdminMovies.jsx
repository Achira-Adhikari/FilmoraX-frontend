import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Film, Loader2, Calendar, Clock, Info, User, Star, Video } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

// --- Movie Form Component ---
const MovieForm = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    movie || {
      title: '',
      year: new Date().getFullYear(),
      runtime: 120,
      director: '',
      plot: '',
      genres: [],
      poster: '',
      backdrop: '',
      trailer: ''
    }
  );

  const genres = ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre) => {
    const newGenres = formData.genres.includes(genre)
      ? formData.genres.filter((g) => g !== genre)
      : [...formData.genres, genre];
    setFormData({ ...formData, genres: newGenres });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-5 text-white max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Title */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Movie Title *</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="e.g. Inception"
            required 
          />
        </div>

        {/* Poster Image Upload */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Poster Image</label>
          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-gray-800 rounded-xl bg-gray-950/50">
            {formData.poster ? (
              <img src={formData.poster} alt="Preview" className="w-24 h-32 object-cover rounded-lg border border-gray-700 shadow-xl" />
            ) : (
              <div className="w-24 h-32 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                <Film className="text-gray-600" />
              </div>
            )}
            <div className="flex-1 w-full">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageChange(e, 'poster')}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-500 hover:file:bg-blue-600/20 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Year & Runtime */}
        <div className="grid grid-cols-2 gap-4 md:contents">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Runtime (min)</label>
                <input type="number" value={formData.runtime} onChange={(e) => setFormData({...formData, runtime: parseInt(e.target.value)})} className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
        </div>

        {/* Director */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Director</label>
          <input type="text" value={formData.director} onChange={(e) => setFormData({...formData, director: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Christopher Nolan" />
        </div>

        {/* Genres */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  formData.genres.includes(genre)
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Trailer URL */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Trailer URL</label>
          <input type="url" value={formData.trailer} onChange={(e) => setFormData({...formData, trailer: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none" placeholder="https://youtube.com/..." />
        </div>

        {/* Plot */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Synopsis</label>
          <textarea rows="3" value={formData.plot} onChange={(e) => setFormData({...formData, plot: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Movie story..." />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800 sticky bottom-0 bg-gray-900 sm:bg-transparent pb-2">
        <Button type="submit" variant="primary" className="w-full sm:flex-1 py-3 order-1 sm:order-2">
          {movie ? 'Update Changes' : 'Publish Movie'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-2 sm:order-1">
          Discard
        </Button>
      </div>
    </form>
  );
};

// --- Main AdminMovies Component ---
export const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.movies.getAll();
      setMovies(res.data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this movie?')) {
      try { await api.movies.delete(id); fetchMovies(); } catch (err) { alert("Failed"); }
    }
  };

  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.director?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Video className="text-blue-500 w-7 h-7 sm:w-8 sm:h-8" /> Movies Library
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage your film collection and metadata.</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingMovie(null); setShowModal(true); }} className="w-full sm:w-auto justify-center">
          Add New Movie
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Films', val: movies.length, icon: Film, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Avg Rating', val: (movies.reduce((acc, m) => acc + (m.rating || 0), 0) / movies.length || 0).toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Latest Year', val: movies[0]?.year || 'N/A', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' }
        ].map((item, i) => (
          <div key={i} className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
            <div className={`${item.bg} p-3 rounded-xl`}><item.icon className={item.color} size={20} /></div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{item.label}</p>
              <p className="text-xl font-bold text-white">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List Container */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-800">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search films..."
              className="w-full bg-gray-950 text-white pl-10 pr-4 py-2 rounded-xl border border-gray-800 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Movie Info</th>
                <th className="px-6 py-4">Director</th>
                <th className="px-6 py-4">Runtime</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-blue-600/5 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded bg-gray-800 overflow-hidden border border-gray-700 shadow-lg">
                        {movie.poster ? <img src={movie.poster} className="w-full h-full object-cover" /> : <Film className="w-full h-full p-2 text-gray-700" />}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{movie.title}</p>
                        <p className="text-[10px] text-gray-500 flex gap-2">
                           <span>{movie.year}</span> • <span className="text-blue-500/80">{movie.genres?.slice(0, 2).join(', ')}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center gap-2"><User size={14} className="text-gray-600"/> {movie.director}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center gap-2"><Clock size={14} className="text-gray-600"/> {movie.runtime}m</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                       <Star size={14} fill="currentColor" /> {movie.rating?.toFixed(1) || '0.0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(movie)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(movie.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-800">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="p-4 flex gap-4 items-start bg-gray-900/30">
              <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                {movie.poster ? <img src={movie.poster} className="w-full h-full object-cover" /> : <Film className="p-4 text-gray-700" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-base truncate pr-2">{movie.title}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                     <Star size={12} fill="currentColor" /> {movie.rating?.toFixed(1)}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{movie.year} • {movie.runtime}m</p>
                <p className="text-[10px] text-blue-500/70 mt-1 uppercase font-bold">{movie.genres?.join(' / ')}</p>
                
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(movie)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600/10 text-blue-500 rounded-lg text-xs font-bold transition-all active:scale-95"><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(movie.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600/10 text-red-500 rounded-lg text-xs font-bold transition-all active:scale-95"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredMovies.length === 0 && (
          <div className="py-20 text-center">
            <Info className="mx-auto text-gray-800 mb-2" size={40} />
            <p className="text-gray-500 text-sm">No movies found.</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingMovie ? 'Edit Movie' : 'Add New Movie'} size="lg">
        <MovieForm
          movie={editingMovie}
          onSubmit={async (data) => {
            if (editingMovie) await api.movies.update(editingMovie.id, data);
            else await api.movies.create(data);
            setShowModal(false); fetchMovies();
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};