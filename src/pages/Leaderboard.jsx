import React, { useState, useEffect } from 'react';

const mockRankings = [
  { id: 1, name: 'Alice Smith', rank: 1, rating: 4.9, points: 1540, skills: ['Python', 'AI'] },
  { id: 2, name: 'John Doe', rank: 2, rating: 4.8, points: 1420, skills: ['React', 'Node.js'] },
  { id: 3, name: 'Bob Johnson', rank: 3, rating: 4.6, points: 1280, skills: ['Java', 'Spring'] },
  { id: 4, name: 'Emma Davis', rank: 4, rating: 4.5, points: 1150, skills: ['UI/UX', 'Figma'] },
  { id: 5, name: 'Michael Brown', rank: 5, rating: 4.2, points: 950, skills: ['C++', 'Rust'] }
];

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setUsers(mockRankings);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) return <div className="text-center mt-2">Loading leaderboard...</div>;

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
              <tr key={user.id} style={{ borderBottom: index < users.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{user.name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {user.skills.map(s => <span key={s} className="badge" style={{ marginBottom: 0 }}>{s}</span>)}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#F59E0B', fontWeight: 500 }}>★ {user.rating}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
