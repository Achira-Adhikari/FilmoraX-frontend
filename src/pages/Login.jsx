import React, { useState, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Mail, Lock, Chrome, User, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { userLogin, userRegister } from '../services/authService';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleAuth = async (e) => {
    if (e) e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      //common validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[0-9]{10}$/; // 10 digit mobile

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!isLogin && !mobileRegex.test(mobile)) {
        throw new Error("Please enter a valid 10-digit mobile number");
      }

      //login
      if (isLogin) {

        const res = await userLogin({ email, password });

        const loggedUser = res.data.user;

        setSuccess(res.data.message || "Login successful! Redirecting...");

        setTimeout(() => {

          if (loggedUser?.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }

        }, 1000);

      }

      //register
      else {

        if (!name || !mobile || !confirmPassword) {
          throw new Error("All fields are required");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const payload = {
          full_name: name,
          email,
          mobile,
          password,
          user_type: "USER",
        };

        const res = await userRegister(payload);

        setSuccess(res.data.message || "Registration successful! Logging you in...");

        await userLogin({ email, password });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-[400px] z-10">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 mb-4"
          >
            <Film className="w-10 h-10 text-blue-500" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight">CineVault</h1>
        </div>

        <div className="bg-[#0f1115] border border-gray-800/50 rounded-3xl p-1 shadow-2xl">
          <div className="p-7">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Welcome Back</h2>
                  <div className="space-y-4">
                    <Input icon={<Mail />} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input icon={<Lock />} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={handleAuth} className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl mt-2" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Join CineVault</h2>
                  <div className="space-y-4">
                    <Input icon={<User />} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input icon={<Mail />} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input icon={<Phone />} type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                    <Input icon={<Lock />} type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Input icon={<ShieldCheck />} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button onClick={handleAuth} className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl mt-2">
                      {loading ? 'Starting...' : 'Get Started'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-red-500 text-xs mt-4 text-center font-medium">{error}</p>}
            {success && <p className="text-green-500 text-xs mt-4 text-center font-medium">{success}</p>}

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
              <span className="relative px-4 bg-[#0f1115] text-xs text-gray-500 uppercase tracking-widest font-bold">Or</span>
            </div>

            <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold h-12 rounded-xl transition-all">
              <Chrome size={20} />
              <span className="text-sm">Continue with Google</span>
            </button>

            <div className="mt-8 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setEmail(''); setPassword(''); }}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto group"
              >
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span className="text-blue-500 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  {isLogin ? 'Sign up' : 'Login'} <ArrowRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Input Component ---
const Input = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
      {icon && cloneElement(icon, { size: 18 })}
    </div>
    <input
      {...props}
      className="w-full bg-[#1a1d23] text-white pl-12 pr-4 h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 border border-gray-800 focus:border-blue-500/50 transition-all placeholder:text-gray-600 text-sm"
      required
    />
  </div>
);