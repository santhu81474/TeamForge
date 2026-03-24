import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  
  // Year Selection State
  const currentYear = new Date().getFullYear();
  // We include 2026 and a few past years to prove the switching logic works completely.
  const availableYears = [currentYear, currentYear - 1, currentYear - 2].filter((v, i, a) => a.indexOf(v) === i);
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);
  
  // Mocking profile extra details
  const profileDetails = {
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    rating: 4.8,
    completedProjects: [
      { id: 101, title: 'CRM Dashboard' },
      { id: 102, title: 'Inventory API' }
    ]
  };

  // Discrete Mathematics: 1 Box = 1 Day mapped per month
  const monthlyActivity = [
    { label: 'Jan', days: 31, intensity: 0.3 },
    { label: 'Feb', days: 28, intensity: 0.5 },
    { label: 'Mar', days: 31, intensity: 0.2 },
    { label: 'Apr', days: 30, intensity: 0.7 },
    { label: 'May', days: 31, intensity: 0.4 },
    { label: 'Jun', days: 30, intensity: 0.8 },
    { label: 'Jul', days: 31, intensity: 0.5 },
    { label: 'Aug', days: 31, intensity: 0.9 }, // Peak
    { label: 'Sep', days: 30, intensity: 0.6 },
    { label: 'Oct', days: 31, intensity: 0.7 },
    { label: 'Nov', days: 30, intensity: 0.3 },
    { label: 'Dec', days: 31, intensity: 0.8 }
  ];

  const calendarData = useMemo(() => {
    // We adjust the random intensity based on the selected year to prove the graph updates!
    const yearIntensityModifier = selectedYear === currentYear ? 1 : 0.4;

    return monthlyActivity.map(month => {
      const dayBoxes = [];
      for (let i = 0; i < month.days; i++) {
        // Randomly assign discrete activity level based on month's intensity
        const isActive = Math.random() < (month.intensity * yearIntensityModifier);
        const level = isActive ? Math.floor(Math.random() * 3) + 1 : 0; 
        dayBoxes.push(level);
      }
      return { ...month, dayBoxes };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const getBoxColor = (level) => {
    switch(level) {
      case 1: return '#0e4429';
      case 2: return '#006d32';
      case 3: return 'var(--primary)'; // #238636
      case 4: return '#39d353';
      default: return 'rgba(255, 255, 255, 0.03)'; // Empty dark box
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="page-title">My Profile</h1>
      
      <div className="grid grid-cols-2">
        {/* User Info Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              boxShadow: '0 0 15px var(--primary-glow)'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="card-title" style={{ marginBottom: 0 }}>{user?.name || 'User'}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="https://github.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                  GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.002-2.753 1.377 1.377 0 01-.002 2.753zm10.07 8.684h-2.368V9.936c0-.883-.014-2.018-1.23-2.018-1.231 0-1.42 .961-1.42 1.956v3.766H6.25V5.996h2.273v1.045h.032c.316-.6 1.09-1.23 2.242-1.23 2.398 0 2.841 1.578 2.841 3.63v4.2z"></path></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 500 }}>Overall Rating</span>
              <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>★ {profileDetails.rating}</span>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
             <Link to="/skill-test" className="btn btn-primary" style={{width: '100%'}}>Take a Skill Test</Link>
          </div>
        </div>

        {/* Skills Card */}
        <div className="card">
          <h3 className="card-title">Verified Skills</h3>
          <div style={{ marginTop: '1rem' }}>
            {profileDetails.skills.map(skill => (
              <span key={skill} className="badge">{skill}</span>
            ))}
          </div>
          
          <h3 className="card-title" style={{ marginTop: '2rem' }}>Completed Projects ({profileDetails.completedProjects.length})</h3>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
            {profileDetails.completedProjects.map(proj => (
              <li key={proj.id} style={{ 
                padding: '0.75rem', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                borderRadius: '6px',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{proj.title}</span>
                <Link to={`/projects/${proj.id}/review`} style={{ color: 'var(--link-color)', fontSize: '0.875rem' }}>Review</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Discrete Mathematics: Box-Per-Day Punchcard equalizer */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 className="card-title" style={{ marginBottom: '4px' }}>{selectedYear} Activity Punchcard</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              Exactly 1 block = 1 day. Data changes historically per year.
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Main Visual Graph */}
          <div style={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between', 
            height: '240px', 
            padding: '0 10px 10px',
            borderBottom: '1px solid var(--border-color)',
          }}>
            {calendarData.map((month, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '8%', height: '100%' }}>
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column-reverse', /* Days build from bottom up */
                  gap: '2px', 
                  width: '100%', 
                  alignItems: 'center', 
                  overflow: 'hidden' 
                }}>
                  {month.dayBoxes.map((level, dayIdx) => (
                    <div 
                       key={dayIdx}
                       style={{
                         width: '18px',
                         height: '5px', /* Small discrete box */
                         backgroundColor: getBoxColor(level),
                         borderRadius: '1px',
                         transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                         boxShadow: level > 0 ? '0 0 5px rgba(35, 134, 54, 0.15)' : 'none',
                         cursor: 'pointer'
                       }}
                       title={`Day ${dayIdx + 1} ${month.label} ${selectedYear}: Level ${level} Activity`}
                       onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.5)';
                          e.target.style.backgroundColor = level > 0 ? '#58a6ff' : 'rgba(255,255,255,0.2)';
                          if(level > 0) e.target.style.boxShadow = '0 0 10px var(--link-glow)';
                       }}
                       onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.backgroundColor = getBoxColor(level);
                          if(level > 0) e.target.style.boxShadow = '0 0 5px rgba(35, 134, 54, 0.15)';
                          else e.target.style.boxShadow = 'none';
                       }}
                    />
                  ))}
                </div>
                <span style={{ 
                  marginTop: '16px', 
                  fontSize: '13px', 
                  color: 'var(--text-muted)', 
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>{month.label}</span>
              </div>
            ))}
          </div>

          {/* Right Sidebar: Year Selector */}
          <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableYears.map(year => (
              <button 
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedYear === year ? 'var(--primary)' : 'transparent',
                  color: selectedYear === year ? '#ffffff' : 'var(--text-main)',
                  fontWeight: selectedYear === year ? '600' : '500',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  fontSize: '13px'
                }}
                onMouseOver={(e) => {
                  if(selectedYear !== year) e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseOut={(e) => {
                  if(selectedYear !== year) e.target.style.backgroundColor = 'transparent';
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
