'use client'; // Required for using hooks like useState

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api'; // Import the helper we just made

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        // Create Form Data (URLSearchParams)
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
  
        // Send as Form Data
        const response = await api.post('/auth/login', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        // Save the token
        localStorage.setItem('token', response.data.access_token);
        
        router.push('/');
        
      } catch (err: any) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sweet Shop Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
            Need sweets? <a href="/register" className="text-pink-500">Register here</a>
        </p>
      </div>
    </div>
  );
}