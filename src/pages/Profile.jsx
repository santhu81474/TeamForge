import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  
  // Mocking profile extra details
  const profileDetails = {
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    rating: 4.8,
    completedProjects: [
      { id: 101, title: 'CRM Dashboard' },
      { id: 102, title: 'Inventory API' }
    ]
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="card-title" style={{ marginBottom: 0 }}>{user?.name || 'User'}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 500 }}>Overall Rating</span>
              <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>★ {profileDetails.rating}</span>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
             <Link to="/skill-test" className="btn btn-outline" style={{width: '100%'}}>Take a Skill Test</Link>
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
                backgroundColor: 'var(--bg-color)', 
                borderRadius: '6px',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontWeight: 500 }}>{proj.title}</span>
                <Link to={`/projects/${proj.id}/review`} style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>Review</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
