import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/api';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const { data } = await fetchLeaderboard();
        setUsers(data || []);
      } catch (err) {
        console.error('Error loading leaderboard', err);
        setError('Unable to load leaderboard at the moment.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) return <div className="text-center mt-2">Loading leaderboard...</div>;

  if (error) return <div className="text-center mt-2 text-red-500">{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-2">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Leaderboard</h1>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Rank</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>User</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Top Skills</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Rating</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id || user.id || index} style={{ borderBottom: index < users.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{user.name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {(user.skills || []).map(s => (
                    <span key={s} className="badge" style={{ marginBottom: 0 }}>{s}</span>
                  ))}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#F59E0B', fontWeight: 500 }}>★ {user.rating ?? 0}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>{Math.floor((user.rating || 0) * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
