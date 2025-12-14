'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); // State for search text
  const router = useRouter();

  // Function to fetch sweets (now accepts a query)
  const fetchSweets = async (query = '') => {
    setLoading(true);
    try {
      // If query exists, use search endpoint, else list all
      const endpoint = query ? `/sweets/search?q=${query}` : '/sweets';
      const response = await api.get(endpoint);
      setSweets(response.data);
    } catch (err) {
      console.error("Failed to fetch", err);
      // Optional: Redirect to login on specific error
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchSweets();
  }, []);

  // Handle Search Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSweets(search);
  };

  // Handle Purchase Logic
  const handlePurchase = async (id: number) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      alert('Sweet purchased!');
      // Refresh list to update stock
      fetchSweets(search); 
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Purchase failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">🍭 Sweet Shop</h1>
        <div className="flex gap-4">
             {/* Admin Link (We will build this next) */}
            <a href="/admin/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              + Add Sweet
            </a>
            <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded">
              Logout
            </button>
        </div>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input 
            type="text" 
            placeholder="Search for sweets..." 
            className="flex-1 p-3 border rounded shadow-sm text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="bg-pink-500 text-white px-6 rounded font-bold">
            Search
        </button>
        {search && (
            <button 
                type="button" 
                onClick={() => { setSearch(''); fetchSweets(''); }}
                className="bg-gray-300 text-gray-700 px-4 rounded"
            >
                Clear
            </button>
        )}
      </form>

      {/* Sweets Grid */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <div key={sweet.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{sweet.name}</h2>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    {sweet.category}
                  </span>
                </div>
                <p className="text-lg font-bold text-green-600">${sweet.price.toFixed(2)}</p>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className={`text-sm ${sweet.quantity > 0 ? 'text-gray-600' : 'text-red-500 font-bold'}`}>
                  Stock: {sweet.quantity}
                </p>
                <button
                  onClick={() => handlePurchase(sweet.id)}
                  disabled={sweet.quantity === 0}
                  className={`px-4 py-2 rounded text-white ${
                    sweet.quantity > 0 ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-300'
                  }`}
                >
                  {sweet.quantity > 0 ? 'Buy' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}