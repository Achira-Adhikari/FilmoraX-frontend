import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit2, Heart, Bookmark, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import toast, { Toaster } from 'react-hot-toast';
import { deleteProfile, updateProfile } from '../services/profileService';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, updateUser, logout } = useStore();
    const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    console.log("user", user);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const saveProfile = async () => {

    const payload = {};

    if (!formData.full_name)
      return toast.error("Please enter your name");

    if (!formData.email)
      return toast.error("Please enter your email");

    try {
      if (user.full_name !== formData.full_name) {
        payload.full_name = formData.full_name;
      }

      if (user.email !== formData.email) {
        payload.email = formData.email;
      }

      if (Object.keys(payload).length === 0) {
        toast.error("No changes detected");
        return;
      }

      const response = await updateProfile(payload, user.id);
      console.log(response);
      updateUser(response.data);
      toast.success(response.message || "Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setIsEditing(false);
    }
  };

  const deleteAccount = async()=>{
toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to delete your account?
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

              const loadingToast = toast.loading("Deleting account...");

              try {
                const res = await deleteProfile(user.id);

                toast.dismiss(loadingToast);
                toast.success(res.message || "Account deleted successfully");
                logout();
                navigate("/");

              } catch (error) {
                toast.dismiss(loadingToast);
                console.log(error);
                toast.error(
                  error?.response?.data?.message ||
                  "Failed to delete account"
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

  const stats = [
    { icon: Heart, label: 'Favorites', value: user.favorites?.length || 0, color: 'text-red-400' },
    { icon: Bookmark, label: 'Watchlist', value: user.watchlist?.length || 0, color: 'text-blue-400' },
    { icon: Star, label: 'Ratings', value: user.ratings?.length || 0, color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <Toaster position='top-center' />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-xl bg-blue-600 flex items-center justify-center">
                    <span className="text-4xl font-black text-white tracking-widest">
                      {user.full_name
                        ?.split(" ")
                        .map((name) => name[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>

                  <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 mt-4 md:mt-12">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{user.full_name}</h1>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                    <Button
                      variant={isEditing ? 'secondary' : 'primary'}
                      icon={Edit2}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-gray-800 rounded-lg p-4 text-center">
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800 rounded-lg p-6 space-y-4"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <Button type="button" variant="primary" className="w-full" onClick={saveProfile}>
                    Save Changes
                  </Button>
                </motion.div>
              )}

              <div className="bg-gray-800 rounded-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                    Notification Preferences
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                    Privacy Settings
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-red-600/10 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors" onClick={deleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
