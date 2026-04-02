import React, { useState } from 'react';

const Network = () => {
  const [talents] = useState([
    { id: 1, name: 'Alice Hacker', role: 'Full Stack Engineer', status: 'Online', skills: ['React', 'Node.js', 'MongoDB'], xp: 12450 },
    { id: 2, name: 'Bob Cybersecurity', role: 'Security Analyst', status: 'In a Project', skills: ['Python', 'PenTesting', 'Linux'], xp: 8300 },
    { id: 3, name: 'Charlie Frontend', role: 'UI/UX Designer', status: 'Looking for Team', skills: ['Figma', 'CSS', 'React'], xp: 5420 },
    { id: 4, name: 'Dave Devops', role: 'DevOps Engineer', status: 'Offline', skills: ['Docker', 'AWS', 'Kubernetes'], xp: 11000 },
  ]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--neon-green)">
             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          [HACKER_NETWORK]
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
          Browse available talent across nodes. Add them to your crew for upcoming events.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {talents.map(profile => (
          <div key={profile.id} className="card glass" style={{ 
            padding: '24px', 
            borderRadius: '8px', 
            borderLeft: `4px solid ${profile.status === 'Online' ? 'var(--neon-green)' : profile.status === 'Looking for Team' ? '#58A6FF' : '#484f58'}`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
                {profile.name[0]}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#c9d1d9' }}>{profile.name}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{profile.role}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', 
                backgroundColor: profile.status === 'Online' ? 'var(--neon-green)' : profile.status === 'Looking for Team' ? '#58A6FF' : '#484f58'
              }}></span>
              {profile.status}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {profile.skills.map(s => (
                <span key={s} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(88,166,255,0.4)', color: 'var(--link-color)' }}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div className="mono" style={{ fontSize: '14px', color: 'var(--neon-green)' }}>
                {profile.xp.toLocaleString()} XP
              </div>
              <button className="btn btn-outline" style={{ fontSize: '12px', padding: '4px 12px' }}>
                Recruit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Network;