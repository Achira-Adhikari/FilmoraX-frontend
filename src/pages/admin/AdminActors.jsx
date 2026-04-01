import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, Search, Users, Loader2, Info,
  User, Camera, Globe, Star, CheckCircle2, Film
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { addActor, deleteActor, getAllActors, updateActor } from '../../services/actorService';
import toast from 'react-hot-toast';

// --- Actor Form Component ---
const ActorForm = ({ actor, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(
    {
      full_name: '',
      birth_date: '',
      nationality: '',
      biography: '',
      image_url: '',
    }
  );

  const [allProductions, setAllProductions] = useState([]);
  const [loadingProds, setLoadingProds] = useState(true);
  const [loading, setLoading] = useState(false);

  // පද්ධතියේ ඇති සියලුම Movies සහ TV Series ලබා ගැනීම
  // useEffect(() => {
  //   const loadProductions = async () => {
  //     try {
  //       const [moviesRes, tvRes] = await Promise.all([
  //         api.movies.getAll(),
  //         api.tvseries.getAll()
  //       ]);

  //       const combined = [
  //         ...(moviesRes.data || []).map(m => ({ ...m, type: 'Movie' })),
  //         ...(tvRes.data || []).map(t => ({ ...t, type: 'TV Series' }))
  //       ];
  //       setAllProductions(combined);
  //     } catch (err) {
  //       console.error("Error loading productions:", err);
  //     } finally {
  //       setLoadingProds(false);
  //     }
  //   };
  //   loadProductions();
  // }, []);

  useEffect(() => {
    if (actor) {
      setFormData({
        full_name: actor.full_name || "",
        image_url: actor.image_url || "",
        nationality: actor.nationality || "",
        birth_date: formatDateForInput(actor.birth_date),
        biography: actor.biography || "",
      });
    }
  }, [actor]);

  const formatDateForInput = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // 1956-04-10
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const toggleProduction = (id) => {
    const updated = formData.popular_movies.includes(id)
      ? formData.popular_movies.filter(item => item !== id)
      : [...formData.popular_movies, id];
    setFormData({ ...formData, popular_movies: updated });
  };

  const handleActor = async () => {
    try {
      // Validation
      if (!formData.full_name.trim())
        return toast.error("Please enter actor name");

      if (!formData.image_url.trim())
        return toast.error("Please enter actor image URL");

      if (!formData.nationality.trim())
        return toast.error("Please enter actor nationality");

      if (!formData.birth_date)
        return toast.error("Please enter actor birth date");

      if (!formData.biography.trim())
        return toast.error("Please enter actor biography");

      // Always send YYYY-MM-DD format
      const formattedBirthDate = formData.birth_date.split("T")[0];

      setLoading(true);

      if (actor) {
        // UPDATE 
        const payload = {};

        if (formData.full_name !== actor.full_name)
          payload.full_name = formData.full_name;

        if (formData.image_url !== actor.image_url)
          payload.image_url = formData.image_url;

        if (formData.nationality !== actor.nationality)
          payload.nationality = formData.nationality;

        if (formattedBirthDate !== formatDateForInput(actor.birth_date))
          payload.birth_date = formattedBirthDate;

        if (formData.biography !== actor.biography)
          payload.biography = formData.biography;

        if (Object.keys(payload).length === 0) {
          toast.error("No changes detected");
          return;
        }

        const res = await updateActor(payload, actor.id);
        toast.success(res.data.message || "Actor updated successfully");
      } else {
        // CREATE 
        const payload = {
          ...formData,
          birth_date: formattedBirthDate,
        };

        const res = await addActor(payload);
        toast.success(res.data.message || "Actor created successfully");
      }

      onSuccess();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white max-h-[80vh] overflow-y-auto px-1 custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Profile Image Section */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-950/50">
          <div className="relative group">
            {formData.image_url ? (
              <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-full border-4 border-blue-600 shadow-2xl transition-transform group-hover:scale-105" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-800 text-gray-700">
                <User size={48} />
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
              <Camera size={18} />
            </label>
          </div>
        </div>

        {/* Basic Info */}

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Full Name</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Robert Downey Jr."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Image URL</label>
          <input
            type="text"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="American"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Nationality</label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="American"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Birth Date</label>
          <input
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Filmography Selection */}
        {/* <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Filmography (Assign Projects)</label>
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
            {loadingProds ? (
              <div className="flex justify-center py-4"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                {allProductions.map((item) => {
                  const selected = formData.popular_movies.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleProduction(item.id)}
                      className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${selected ? 'bg-blue-600/10 border-blue-600/50' : 'bg-gray-900/50 border-gray-800 hover:border-gray-600'
                        }`}
                    >
                      <div className="w-10 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.poster && <img src={item.poster} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className={`text-xs font-bold truncate ${selected ? 'text-blue-400' : 'text-gray-300'}`}>{item.title}</p>
                        <p className="text-[9px] text-gray-500 uppercase">{item.type} • {item.year}</p>
                      </div>
                      {selected && <CheckCircle2 size={16} className="text-blue-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div> */}

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Biography</label>
          <textarea
            rows="4"
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Career highlights and history..."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-800">
        <Button type="submit" variant="primary" className="flex-1 py-3 order-1 sm:order-2"
          onClick={handleActor}>
          {actor ? 'Update Profile' : 'Register Actor'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="sm:w-32 order-2 sm:order-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

// --- Main AdminActors Page ---
export const AdminActors = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingActor, setEditingActor] = useState(null);
  const [error, setError] = useState('');

  const fetchActors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllActors();

      // safe check
      setActors(res?.data || []);
    } catch (err) {
      console.error("Error fetching actors:", err);
      setError(
        err?.response?.data?.message || "Failed to load actors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActors();
  }, [fetchActors]);

  const handleDelete = (actorId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete this actor?
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

              const loadingToast = toast.loading("Deleting actor...");

              try {
                await deleteActor(actorId);

                toast.dismiss(loadingToast);
                toast.success("Actor deleted successfully");

                fetchActors();

              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error(
                  error?.response?.data?.message ||
                  "Failed to delete actor"
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

  const filteredActors = actors.filter(a =>
    a.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Actors Management</h1>
          <p className="text-gray-500 text-sm">Control talent profiles and filmography relations.</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingActor(null); setShowModal(true); }}>
          Add New Actor
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search actor names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-3 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
        </div>
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center gap-3 p-3">
          <Users className="text-blue-500" size={20} />
          <span className="text-white font-bold">{actors.length}</span>
          <span className="text-blue-500 text-xs uppercase font-bold">Total Talents</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden shadow-xl backdrop-blur-sm">

        {!loading && error && (
          <div className="text-center text-red-500 py-10">
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchActors}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Desktop View */}
        {!error && (
          <div className="hidden md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-950/50 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Profile</th>
                  <th className="px-8 py-5">Nationality</th>
                  <th className="px-8 py-5">Projects</th>
                  <th className="px-8 py-5 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredActors.map((actor) => (
                  <tr key={actor.id} className="hover:bg-white/[0.02] group transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border-2 border-gray-700 shadow-lg">
                          {actor.image_url ? <img src={actor.image_url} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-gray-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{actor.full_name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">DOB: {new Date(actor.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-gray-400 font-medium">{actor.nationality || '---'}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <Film size={14} className="text-blue-500" />
                        <span className="text-white font-bold text-xs">{actor.acted_movies?.length + actor.directed_movies?.length || 0}</span>
                        <span className="text-gray-600 text-[10px] uppercase font-bold">Works</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => { setEditingActor(actor); setShowModal(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(actor.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card View */}
        {!error && (
          <div className="md:hidden divide-y divide-gray-800">
            {filteredActors.map((actor) => (
              <div key={actor.id} className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <img src={actor.image_url || '/api/placeholder/40/40'} className="w-14 h-14 rounded-full object-cover border-2 border-gray-700" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{actor.full_name}</h3>
                    <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">{actor.nationality}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setEditingActor(actor); setShowModal(true); }} className="flex items-center justify-center gap-2 py-3 bg-blue-600/10 text-blue-500 rounded-xl text-xs font-bold transition-active:scale-95"><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(actor.id)} className="flex items-center justify-center gap-2 py-3 bg-red-600/10 text-red-500 rounded-xl text-xs font-bold transition-active:scale-95"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredActors.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex p-6 rounded-full bg-gray-950 mb-4 border border-gray-800">
              <Users size={48} className="text-gray-800" />
            </div>
            <p className="text-gray-500 font-medium">No talent records found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingActor ? 'Modify Talent Profile' : 'Register New Talent'}
        size="lg"
      >
        <ActorForm
          actor={editingActor}
          onCancel={() => setShowModal(false)}
          onSuccess={() => {
            console.log("success");
            fetchActors();
            setShowModal(false);
          }}
        />
      </Modal>
    </div>
  );
};