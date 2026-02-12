import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Tv, Loader2, Calendar, Film, Info, Activity, Globe, Monitor } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

// --- Form Component (Fully Responsive) ---
const TVSeriesForm = ({ series, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    series || {
      title: '',
      year: new Date().getFullYear(),
      seasons_count: 1,
      network: '',
      director: '',
      plot: '',
      genres: [],
      poster: '',
      trailer_url: '',
      status: 'Ongoing'
    }
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, poster: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4 md:space-y-5 text-white max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Title */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Series Title *</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="e.g. Breaking Bad"
            required 
          />
        </div>

        {/* Image Upload Area */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Poster Image</label>
          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-gray-800 rounded-xl bg-gray-950/50">
            {formData.poster ? (
              <img src={formData.poster} alt="Preview" className="w-24 h-32 sm:w-20 sm:h-28 object-cover rounded-lg border border-gray-700 shadow-xl" />
            ) : (
              <div className="w-24 h-32 sm:w-20 sm:h-28 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                <Film className="text-gray-600" />
              </div>
            )}
            <div className="flex-1 w-full text-center sm:text-left">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-400 file:mr-auto sm:file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-500 hover:file:bg-blue-600/20 cursor-pointer"
              />
              <p className="mt-2 text-[10px] text-gray-500 uppercase font-bold tracking-tighter sm:tracking-normal">Recommended: 600x900px</p>
            </div>
          </div>
        </div>

        {/* Video URL */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
             Trailer URL <span className="text-red-500 font-normal hidden sm:inline">(YouTube / MP4)</span>
          </label>
          <input 
            type="url" 
            value={formData.trailer_url} 
            onChange={(e) => setFormData({...formData, trailer_url: e.target.value})} 
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none" 
            placeholder="https://..."
          />
        </div>
        
        {/* Year & Network */}
        <div className="grid grid-cols-2 gap-4 md:contents">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Network</label>
                <input type="text" value={formData.network} onChange={(e) => setFormData({...formData, network: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="HBO" />
            </div>
        </div>

        {/* Seasons & Status */}
        <div className="grid grid-cols-2 gap-4 md:contents">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Seasons</label>
                <input type="number" value={formData.seasons_count} onChange={(e) => setFormData({...formData, seasons_count: parseInt(e.target.value)})} className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Ongoing">Ongoing</option>
                    <option value="Ended">Ended</option>
                </select>
            </div>
        </div>

        {/* Plot */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Synopsis</label>
          <textarea rows="3" value={formData.plot} onChange={(e) => setFormData({...formData, plot: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800 sticky bottom-0 bg-gray-900 sm:bg-transparent pb-2 sm:pb-0">
        <Button type="submit" variant="primary" className="w-full sm:flex-1 py-3 order-1 sm:order-2">
          {series ? 'Update Changes' : 'Publish Series'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto order-2 sm:order-1">
          Discard
        </Button>
      </div>
    </form>
  );
};

// --- Main Admin Component (Responsive Optimization) ---
export const AdminTVSeries = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      if (api.tvSeries?.getAll) {
        const res = await api.tvSeries.getAll();
        setSeriesList(res.data || []);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSeries(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try { await api.tvSeries.delete(id); fetchSeries(); } catch (err) { alert("Failed"); }
    }
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
                <th className="px-6 py-4">Network</th>
                <th className="px-6 py-4">Seasons</th>
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
                        {series.poster ? <img src={series.poster} className="w-full h-full object-cover" /> : <Tv className="w-full h-full p-2 text-gray-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{series.title}</p>
                        <p className="text-[10px] text-gray-500">{series.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{series.network || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">{series.seasons_count}</td>
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
                  <span className="flex items-center gap-1"><Monitor size={12}/> {series.network || 'N/A'}</span>
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
          onSubmit={async (data) => {
            if (editingSeries) await api.tvSeries.update(editingSeries.id, data);
            else await api.tvSeries.create(data);
            setShowModal(false); fetchSeries();
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};