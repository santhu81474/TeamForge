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
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Custom TeamForge mark (no GitHub logo) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="9" height="16" rx="2" fill="url(#tf-left)"/>
            <rect x="13" y="4" width="9" height="9" rx="2" fill="url(#tf-top)"/>
            <rect x="13" y="15" width="9" height="5" rx="2" fill="url(#tf-bottom)"/>
            <defs>
              <linearGradient id="tf-left" x1="2" y1="4" x2="11" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#58A6FF"/>
                <stop offset="1" stopColor="#1F6FEB"/>
              </linearGradient>
              <linearGradient id="tf-top" x1="13" y1="4" x2="22" y2="13" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3FB950"/>
                <stop offset="1" stopColor="#1A7F37"/>
              </linearGradient>
              <linearGradient id="tf-bottom" x1="13" y1="15" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F2CC60"/>
                <stop offset="1" stopColor="#DB6D28"/>
              </linearGradient>
            </defs>
          </svg>
          TeamForge
        </Link>
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
                e.target.style.width = '320px';
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
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.906.664a1.749 1.749 0 0 1 2.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0 1 13.25 15h-3.5a.75.75 0 0 1-.75-.75V9H7v5.25a.75.75 0 0 1-.75.75h-3.5A1.75 1.75 0 0 1 1 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2Zm1.25 1.171a.25.25 0 0 0-.312 0l-5.25 4.2a.25.25 0 0 0-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v5.25h2.75a.25.25 0 0 0 .25-.25V6.23a.25.25 0 0 0-.094-.195Z"></path></svg>
              Dashboard
            </Link>
            <Link to="/explore" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a.75.75 0 01.67.415l3.5 7A.75.75 0 0111.5 8H8.75l-2 7a.75.75 0 01-1.4.05l-3.5-9A.75.75 0 012.56 5H5.25L7.4.55A.75.75 0 018 0z" /></svg>
              Explore
            </Link>
            <Link to="/projects/create" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path></svg>
              Create
            </Link>
            <Link to="/applications" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25ZM6 4.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 6 4.75ZM6 8a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 6 8ZM5.5 11.25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4Z"></path></svg>
              Applications
            </Link>
            <Link to="/leaderboard" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
              Leaderboard
            </Link>
            <Link to="/arena" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.5 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0V1.5H6.75v13h1.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5h1.5V1.5H3.75v6.75a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 3 0h6.5Z"></path></svg>
              Arena
            </Link>
            <Link to="/forge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 1.5a.75.75 0 0 0-1.5 0v13a.75.75 0 0 0 1.5 0v-13Zm12.5 0a.75.75 0 0 0-1.5 0v13a.75.75 0 0 0 1.5 0v-13ZM8 2.75a.75.75 0 0 1 .75.75v3.25h3.25a.75.75 0 0 1 0 1.5H8.75v3.25a.75.75 0 0 1-1.5 0V8.25H4a.75.75 0 0 1 0-1.5h3.25V3.5A.75.75 0 0 1 8 2.75Z"></path></svg>
              Forge
            </Link>
            <Link to="/skill-test" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 1.75v11.5c0 .138.112.25.25.25h3.17l1.22 1.22a.25.25 0 0 0 .354 0l1.22-1.22h4.536a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H2.75a.25.25 0 0 0-.25.25ZM1 1.75C1 .784 1.784 0 2.75 0h10.5C14.216 0 15 .784 15 1.75v11.5A1.75 1.75 0 0 1 13.25 15H9.06l-2.573 2.573A1.458 1.458 0 0 1 4.427 15H2.75A1.75 1.75 0 0 1 1 13.25Zm4.75 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0ZM9 5.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0Z"></path></svg>
              Skill Tests
            </Link>
            <Link to="/gemini-chat" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm.75 3v2.75H11.5a.75.75 0 0 1 0 1.5H8.75V11.5a.75.75 0 0 1-1.5 0V8.75H4.5a.75.75 0 0 1 0-1.5h2.75V4.5a.75.75 0 0 1 1.5 0Z"></path></svg>
              AI Assistant
            </Link>
            <Link to="/bounties" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.5 1.5H5.5a.75.75 0 0 0-.75.75v1.5h6.5v-1.5a.75.75 0 0 0-.75-.75Zm-2 1a.25.25 0 0 1 .25.25v.75h-1.5v-.75a.25.25 0 0 1 .25-.25h1ZM1.5 6C1.5 4.895 2.395 4 3.5 4h9c1.105 0 2 .895 2 2v6.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6Zm11.5 0a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6Z"></path></svg>
              Bounty Board
            </Link>
            <Link to="/network" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 3.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm8.5 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM10.5 12.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM7.334 5.378a3.5 3.5 0 0 1 1.332 0A13.882 13.882 0 0 1 12.87 8a13.882 13.882 0 0 1-4.204 2.622 3.5 3.5 0 0 1-1.332 0 13.882 13.882 0 0 1-4.204-2.622 13.882 13.882 0 0 1 4.204-2.622ZM3.7 8c.706-1.127 1.83-2.02 3.125-2.529a2.003 2.003 0 0 0 2.35 0c1.295.508 2.419 1.402 3.125 2.529-1.341 2.143-3.69 3.5-6.3 3.5S1.041 10.143 3.7 8Z"></path></svg>
              Network
            </Link>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path></svg>
              Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.75.75 0 1 1 1.06-1.06l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 1 1-1.06-1.06l1.97-1.97H5.75a.75.75 0 0 1 0-1.5Z"></path></svg>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5ZM2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm4.75 6.5h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Z"></path></svg>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path></svg>
              Sign Up
            </Link>       
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
