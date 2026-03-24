import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(search.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" className="nav-brand">SkillNet</Link>
        {user && (
          <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)', width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search or jump to..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: 'rgba(13, 17, 23, 1)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '5px 12px 5px 32px',
                color: 'var(--header-text)',
                outline: 'none',
                width: '260px',
                fontSize: '14px',
                lineHeight: '20px',
                transition: 'width 0.2s ease, border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--link-color)';
                e.target.style.width = '320px'; // GitHub style expand
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                if(!search.trim()) e.target.style.width = '260px';
              }}
            />
          </form>
        )}
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/projects/create">Create Project</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
