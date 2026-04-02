import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Tv, Loader2, Calendar, Film, Info, Activity, Globe, Monitor, User, Check, X } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { addMovie, deleteMovie, getAllMovies, updateMovie } from '../../services/movieService';
import toast from 'react-hot-toast';
import { getAllGenre } from '../../services/genreService';
import { getAllActors } from '../../services/actorService';
import { motion,AnimatePresence } from 'framer-motion';

// --- Form Component (Fully Responsive) ---
const TVSeriesForm = ({ series, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    runtime: "",
    synopsis: "",
    poster_url_portrait: "",
    poster_url_landscape: "",
    trailer_url: "",
    release_date: "",
    movie_type: "TV_SERIES",
    release_status: "UPCOMING",
    directorId: "",
    actorIds: [],
    genreIds: []
  });

  const [actorSearch, setActorSearch] = useState('');
  const [directorSearch, setDirectorSearch] = useState(series?.director || '');
  const [showActorTips, setShowActorTips] = useState(false);
  const [showDirectorTips, setShowDirectorTips] = useState(false);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (series) {
      setFormData(prev => ({
        ...prev,
        title: series.title || "",
        year: series.year || "",
        runtime: series.runtime || "",
        synopsis: series.synopsis || "",
        poster_url_portrait: series.poster_url_portrait || "",
        poster_url_landscape: series.poster_url_landscape || "",
        trailer_url: series.trailer_url || "",
        release_date: series.release_date || "",
        movie_type: series.movie_type || "",
        release_status: series.release_status || "",
        directorId: series.director?.id || "",
        actorIds: series.actors?.map(a => a.id) || [],
        genreIds: series.Genre?.map(g => g.id) || []
      }));

      // Set director search input value (text box ekata nama enne meken)
      setDirectorSearch(series.director?.full_name || "");
    }
  }, [series]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [genresRes, actorsRes] = await Promise.all([
        getAllGenre(),
        getAllActors()
      ]);

      setGenres(genresRes.data);
      setActors(actorsRes.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  const handleSeries = async () => {
    try {

      // VALIDATION 

      if (!formData.title.trim())
        return toast.error("Please enter series title");

      if (!formData.poster_url_portrait.trim())
        return toast.error("Please enter portrait poster URL");

      if (!formData.poster_url_landscape.trim())
        return toast.error("Please enter landscape poster URL");

      if (!formData.trailer_url.trim())
        return toast.error("Please enter trailer URL");

      if (!formData.year)
        return toast.error("Please enter movie year");

      if (!formData.runtime)
        return toast.error("Please enter episode count");

      if (!formData.release_date)
        return toast.error("Please select release date");

      if (!formData.directorId)
        return toast.error("Please select director");

      if (!formData.actorIds.length)
        return toast.error("Please select at least one actor");

      if (!formData.genreIds.length)
        return toast.error("Please select at least one genre");

      if (!formData.synopsis.trim())
        return toast.error("Please enter synopsis");

      // PREPARE PAYLOAD 

      setLoading(true);

      const basePayload = {
        title: formData.title.trim(),
        poster_url_portrait: formData.poster_url_portrait.trim(),
        poster_url_landscape: formData.poster_url_landscape.trim(),
        trailer_url: formData.trailer_url.trim(),

        year: Number(formData.year),
        runtime: Number(formData.runtime),

        release_date: formData.release_date,
        release_status: formData.release_status,
        movie_type: 'TV_SERIES',

        synopsis: formData.synopsis.trim(),

        directorId: Number(formData.directorId),
        actorIds: formData.actorIds,
        genreIds: formData.genreIds
      };

      // UPDATE

      if (series) {

        const normalizedOldMovie = {
          title: series.title,
          poster_url_portrait: series.poster_url_portrait,
          poster_url_landscape: series.poster_url_landscape,
          trailer_url: series.trailer_url,

          year: Number(series.year),
          runtime: Number(series.runtime),

          release_date: series.release_date,
          release_status: series.release_status,
          movie_type: series.movie_type,

          synopsis: series.synopsis,

          directorId: series.director?.id || null,
          actorIds: series.actors?.map(a => a.id) || [],
          genreIds: series.Genre?.map(g => g.id) || []
        };

        const payload = {};

        Object.keys(basePayload).forEach(key => {
          const newValue = basePayload[key];
          const oldValue = normalizedOldMovie[key];

          if (Array.isArray(newValue)) {
            const sortedNew = [...newValue].sort();
            const sortedOld = [...(oldValue || [])].sort();

            if (JSON.stringify(sortedNew) !== JSON.stringify(sortedOld)) {
              payload[key] = newValue;
            }
          } else if (newValue !== oldValue) {
            payload[key] = newValue;
          }
        });

        if (Object.keys(payload).length === 0) {
          toast.error("No changes detected");
          return;
        }

        await updateMovie(payload, movie.id);
        toast.success("Series updated successfully!");

      } else {

        // CREATE 

        await addMovie(basePayload);
        toast.success("Series created successfully!");
      }

      onSuccess();

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredDirectors = actors.filter(d =>
    d.full_name.toLowerCase().includes(directorSearch.toLowerCase()) &&
    d.id !== formData.directorId
  );

  const filteredActors = actors.filter(a =>
    a.full_name.toLowerCase().includes(actorSearch.toLowerCase()) &&
    !formData.actorIds.includes(a.id)
  );

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genreId) => {
    setFormData(prev => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId]
    }));
  };

  return (
    <div className="space-y-5 text-white max-h-[80vh] overflow-y-auto px-1 custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Series Title *</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Series Portrait URL *</label>
          <input type="text" value={formData.poster_url_portrait} onChange={(e) => setFormData(p => ({ ...p, poster_url_portrait: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Series Landscape URL *</label>
          <input type="text" value={formData.poster_url_landscape} onChange={(e) => setFormData(p => ({ ...p, poster_url_landscape: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Series Trailer URL *</label>
          <input type="text" value={formData.trailer_url} onChange={(e) => setFormData(p => ({ ...p, trailer_url: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
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
                  <div key={d.id}
                    onClick={() => {
                      setFormData(p => ({ ...p, directorId: d.id }));
                      setDirectorSearch(d.full_name);
                      setShowDirectorTips(false);
                    }}
                    className="p-3 hover:bg-blue-600 text-sm cursor-pointer flex justify-between">{d.full_name} <Check size={14} className="opacity-50" /></div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actor Search */}
        <div className="md:col-span-2 relative">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Cast / Actors</label>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-900 border border-gray-700 rounded-xl min-h-[52px] focus-within:ring-2 focus-within:ring-blue-500">
            {formData.actorIds.map(id => {
              const actor = actors.find(a => a.id === id);
              return (
                <span key={id} className="...">
                  {actor?.full_name}
                  <X
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        actorIds: p.actorIds.filter(aid => aid !== id)
                      }))
                    }
                  />
                </span>
              );
            })}
            <input type="text" value={actorSearch} onChange={(e) => { setActorSearch(e.target.value); setShowActorTips(true); }} onFocus={() => setShowActorTips(true)} placeholder="Search and add..." className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm p-1 text-white" />
          </div>
          <AnimatePresence>
            {showActorTips && actorSearch && filteredActors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                {filteredActors.map(a => (
                  <div key={a.id}
                    onClick={() => {
                      setFormData(p => ({
                        ...p,
                        actorIds: [...p.actorIds, a.id]
                      }));
                      setActorSearch('');
                      setShowActorTips(false);
                    }}
                    className="p-3 hover:bg-blue-600 text-sm cursor-pointer flex justify-between border-b border-gray-700/50">{a.full_name} <Plus size={14} className="opacity-50" />
                  </div>
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
            <input type="date" value={formData.release_date} onChange={(e) => setFormData(p => ({ ...p, release_date: e.target.value }))} className="bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none text-white text-sm" />
          </div>

          {/* Upcoming Toggle */}
          <div className="flex items-center gap-3 px-4 bg-gray-950/50 border border-gray-800 rounded-xl mt-5">
            <select
              value={formData.release_status}
              onChange={(e) =>
                setFormData(p => ({ ...p, release_status: e.target.value }))
              }
              className="bg-gray-900 border border-gray-700 p-3 rounded-xl"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="RELEASED">Released</option>
            </select>
          </div>
        </div>

        {/* Genres */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${formData.genreIds.includes(g.id)
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400'
                  }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase mb-1.5 block">Synopsis</label>
          <textarea rows="3" value={formData.synopsis}
            onChange={(e) =>
              setFormData(p => ({ ...p, synopsis: e.target.value }))
            }
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none resize-none" placeholder="Enter movie description..." />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800 sticky bottom-0 bg-[#0f172a] pb-2">
        <Button type="button" variant="primary" onClick={handleSeries} className="flex-1 py-3 order-1 sm:order-2">{series ? 'Save Changes' : 'Publish Series'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="order-2 sm:order-1">Cancel</Button>
      </div>
    </div>
  );
};

// --- Main Admin Component (Responsive Optimization) ---
export const AdminTVSeries = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);

  const [error, setError] = useState('');

  const fetchSeries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllMovies();

      const allMovies = res?.data?.movies || [];

      // Filter out TV_SERIES
      const tvSeries = allMovies.filter(
        movie => movie.movie_type === "TV_SERIES"
      );

      setSeriesList(tvSeries);
    } catch (err) {
      console.error("Error fetching TV series:", err);
      setError(
        err?.response?.data?.message || "Failed to load tv series. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const handleDelete = (seriesId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this TV Series?
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

              const loadingToast = toast.loading("Deleting series...");

              try {
                const res = await deleteMovie(seriesId);

                toast.dismiss(loadingToast);
                toast.success("Series deleted successfully");

                fetchSeries();

              } catch (error) {
                toast.dismiss(loadingToast);
                console.log(error);
                toast.error(
                  error?.response?.data?.message ||
                  "Failed to delete series"
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

  const filteredSeries = seriesList.filter(s => s.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">

      {/* Responsive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Tv className="text-blue-500 w-7 h-7 sm:w-8 sm:h-8" /> TV Library
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage your series production data.</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingSeries(null); setShowModal(true); }} className="w-full sm:w-auto justify-center">
          Add New Series
        </Button>
      </div>

      {/* Stats - Grid adjustments */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Shows', val: seriesList.length, icon: Film, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Ongoing', val: seriesList.filter(s => s.status === 'Ongoing').length, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Latest Year', val: seriesList[0]?.year || 'N/A', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' }
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

      {/* Table & Search Container */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-800">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search series..."
              className="w-full bg-gray-950 text-white pl-10 pr-4 py-2 rounded-xl border border-gray-800 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            />
          </div>
        </div>

        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Show Info</th>
                <th className="px-6 py-4">Director</th>
                <th className="px-6 py-4">Episodes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {filteredSeries.map((series) => (
                <tr key={series.id} className="hover:bg-blue-600/5 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-12 rounded bg-gray-800 overflow-hidden border border-gray-700">
                        {series.poster_url_portrait ? <img src={series.poster_url_portrait} className="w-full h-full object-cover" /> : <Tv className="w-full h-full p-2 text-gray-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{series.title}</p>
                        <p className="text-[10px] text-gray-500">{series.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{series.director.full_name || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">{series.runtime || '0'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${series.status === 'Ongoing' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-gray-500/20 text-gray-400 bg-gray-500/5'}`}>{series.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingSeries(series); setShowModal(true); }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(series.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout (Visible on Mobile Only) */}
        <div className="md:hidden divide-y divide-gray-800">
          {filteredSeries.map((series) => (
            <div key={series.id} className="p-4 flex gap-4 items-start bg-gray-900/30">
              <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                {series.poster ? <img src={series.poster} className="w-full h-full object-cover" /> : <Tv className="p-4 text-gray-700" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-base truncate pr-2">{series.title}</h3>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase border ${series.status === 'Ongoing' ? 'border-green-500/20 text-green-500' : 'text-gray-400 border-gray-800'}`}>{series.status}</span>
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Monitor size={12} /> {series.network || 'N/A'}</span>
                  <span>{series.year}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setEditingSeries(series); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600/10 text-blue-500 rounded-lg text-xs font-bold"><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(series.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600/10 text-red-500 rounded-lg text-xs font-bold"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSeries.length === 0 && (
          <div className="py-20 text-center">
            <Info className="mx-auto text-gray-800 mb-2" size={40} />
            <p className="text-gray-500 text-sm">No results found.</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingSeries ? 'Edit Series' : 'Add New'} size="lg">
        <TVSeriesForm
          series={editingSeries}
          onCancel={() => setShowModal(false)}
          onSuccess={() => {
            console.log("success");
            fetchSeries();
            setShowModal(false);
          }}
        />
      </Modal>
    </div>
  );
};