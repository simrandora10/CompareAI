  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

  export async function apiFetch(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers||{}) };
    if (opts.token) headers['Authorization'] = 'Bearer ' + opts.token;
    try {
      const method = opts.method || (opts.body ? 'POST' : 'GET');
      const res = await fetch(API_BASE + path, { headers, method, body: opts.body ? JSON.stringify(opts.body) : undefined });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      return data;
    } catch (err) {
      console.error('API error', err);
      alert('API error: ' + err.message);
      return null;
    }
  }
  export default apiFetch;
