'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function AddSweetPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/sweets', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
      alert('Sweet added successfully!');
      router.push('/'); // Go back to dashboard
    } catch (err) {
      alert('Failed to add sweet. Ensure you are logged in as an Admin.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Sweet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700">Name</label>
                <input 
                    className="w-full border p-2 rounded text-black"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-gray-700">Category</label>
                <input 
                    className="w-full border p-2 rounded text-black"
                    type="text" 
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-gray-700">Price ($)</label>
                    <input 
                        className="w-full border p-2 rounded text-black"
                        type="number" step="0.01" required
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-gray-700">Quantity</label>
                    <input 
                        className="w-full border p-2 rounded text-black"
                        type="number" required
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: e.target.value})}
                    />
                </div>
            </div>
            <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    Save Sweet
                </button>
                <button 
                    type="button" 
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}