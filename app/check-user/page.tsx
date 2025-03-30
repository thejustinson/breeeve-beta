'use client';

import { useState } from 'react';

export default function CheckUser() {
  const [privyId, setPrivyId] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/users/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privy_id: privyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred');
        return;
      }

      setResult(data.message);
    } catch (err) {
      setError('Failed to check user status');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Check User Status</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="privyId" className="block text-sm font-medium mb-2">
              Privy ID
            </label>
            <input
              id="privyId"
              type="text"
              value={privyId}
              onChange={(e) => setPrivyId(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Privy ID"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Check Status
          </button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-green-100 rounded-md">
            <p>Status: {result === 'exists' ? 'User exists' : 'New user'}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 