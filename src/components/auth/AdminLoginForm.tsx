import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { loginSchema, type LoginInput } from '../../lib/validation';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const input: LoginInput = { email, password };
      loginSchema.parse(input);

      // Check if it's the admin email
      if (email !== 'admin@store.com') {
        throw new Error('Invalid admin credentials');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/admin');
      toast.success('Welcome back, Admin!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label
          htmlFor="admin-email"
          className="block text-sm font-medium text-gray-700"
        >
          Admin Email
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none"
            placeholder="admin@store.com"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none"
            placeholder="******"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        {loading ? "Signing in..." : "Sign in as Admin"}
      </button>
    </form>
  );
}