'use client';

import { useState, useEffect } from 'react';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscribedAt = localStorage.getItem('subscribedAt');
    if (subscribedAt) {
      setIsSubscribed(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
        localStorage.setItem('subscribedAt', new Date().toISOString());
        setIsSubscribed(true);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect. Please try again.');
    }
  };

  if (isSubscribed) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-[60ch]">
        <h3 className="text-lg font-semibold mb-2">I'll be writing and making more </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
          Want to see?
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-zinc-200 dark:text-zinc-900 rounded hover:bg-gray-700 dark:hover:bg-zinc-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-3 text-sm ${
              status === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
