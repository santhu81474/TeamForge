import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SkillBadges from '../components/SkillBadges';
import { updateProfile, fetchProjects, fetchUserApplications } from '../services/api';

const Profile = () => {
  const { user, setUserFromProfile } = useAuth();

  const [githubEdit, setGithubEdit] = useState(user?.githubUrl || '');
  const [linkedinEdit, setLinkedinEdit] = useState(user?.linkedinUrl || '');
  const [savingSocial, setSavingSocial] = useState(false);
  const [socialMessage, setSocialMessage] = useState('');
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  
  // Mocking profile extra details (used as fallback only)
  const profileDetails = {
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    rating: 4.8,
    completedProjects: [
      { id: 101, title: 'CRM Dashboard' },
      { id: 102, title: 'Inventory API' }
    ]
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setLoadingActivity(false);
        return;
      }
      try {
        const [projectsRes, appsRes] = await Promise.all([
          fetchProjects(),
          fetchUserApplications()
        ]);
        const allProjects = projectsRes.data || [];
        const myOwned = allProjects.filter(p => p.ownerId?._id === user.id);
        setOwnedProjects(myOwned);

        const apps = appsRes.data || [];
        setApplications(apps);

        const monthMap = new Map();

        const addEvent = (dateString, type) => {
          if (!dateString) return;
          const d = new Date(dateString);
          if (Number.isNaN(d.getTime())) return;
          const y = d.getFullYear();
          const m = d.getMonth();
          const key = `${y}-${m}`;
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          if (!monthMap.has(key)) {
            monthMap.set(key, { year: y, month: m, label: `${monthNames[m]} ${y}`, created: 0, applied: 0 });
          }
          const entry = monthMap.get(key);
          if (type === 'created') entry.created += 1;
          if (type === 'applied') entry.applied += 1;
        };

        myOwned.forEach(p => addEvent(p.createdAt || p.timestamp, 'created'));
        apps.forEach(a => addEvent(a.appliedDate, 'applied'));

        const activityArray = Array.from(monthMap.values()).sort((a, b) => (
          a.year === b.year ? a.month - b.month : a.year - b.year
        ));

        setActivity(activityArray);
      } catch (err) {
        console.error('Error loading profile activity', err);
      } finally {
        setLoadingActivity(false);
      }
    };

    load();
  }, [user?.id]);

  const handleSaveSocial = async () => {
    try {
      setSavingSocial(true);
      setSocialMessage('');
      const { data } = await updateProfile({ githubUrl: githubEdit, linkedinUrl: linkedinEdit });
      setUserFromProfile(data);
      setSocialMessage('Links updated successfully.');
    } catch (err) {
      console.error('Error updating social links', err);
      setSocialMessage('Could not update links. Please try again.');
    } finally {
      setSavingSocial(false);
      setTimeout(() => setSocialMessage(''), 3000);
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
              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                <a href={user?.githubUrl || 'https://github.com'} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                  {user?.githubUrl ? 'My GitHub' : 'GitHub'}
                </a>
                <a href={user?.linkedinUrl || 'https://linkedin.com'} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.002-2.753 1.377 1.377 0 01-.002 2.753zm10.07 8.684h-2.368V9.936c0-.883-.014-2.018-1.23-2.018-1.231 0-1.42 .961-1.42 1.956v3.766H6.25V5.996h2.273v1.045h.032c.316-.6 1.09-1.23 2.242-1.23 2.398 0 2.841 1.578 2.841 3.63v4.2z"></path></svg>
                  {user?.linkedinUrl ? 'My LinkedIn' : 'LinkedIn'}
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Edit social links</div>
                  <input
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={githubEdit}
                    onChange={(e) => setGithubEdit(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                  />
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={linkedinEdit}
                    onChange={(e) => setLinkedinEdit(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveSocial}
                  disabled={savingSocial}
                  className="btn btn-outline"
                  style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 2A1.75 1.75 0 000 3.75v8.5C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zm1.5 2.5a.75.75 0 011.5 0v5.19l1.72-1.72a.75.75 0 011.06 0L10.75 10.69V7.5a.75.75 0 011.5 0v3.75a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5h1.69L8 8.56l-2.19 2.19H4.75a.75.75 0 01-.75-.75V4.5z"/></svg>
                  {savingSocial ? 'Saving...' : 'Save links'}
                </button>
                {socialMessage && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{socialMessage}</div>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 500 }}>Overall Rating</span>
              <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>★ {user?.rating || 0}</span>
            </div>
            <SkillBadges skills={user?.skills || []} rating={user?.rating || 0} />
          </div>
          {/** Small stats strip using backend data */}
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
            <div className="card neon-hover" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(88,166,255,0.12)',
                color: '#58A6FF'
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7.75 1.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5H8.5v1.5a.75.75 0 01-1.5 0V6.75H5.5a.75.75 0 010-1.5h1.5V2.25a.75.75 0 01.75-.75z"/><path d="M3.75 2A1.75 1.75 0 002 3.75v8.5C2 13.216 2.784 14 3.75 14h8.5A1.75 1.75 0 0014 12.25v-8.5A1.75 1.75 0 0012.25 2h-8.5zm0 1.5h8.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25z"/></svg>
              </span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Projects created</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{ownedProjects.length}</div>
              </div>
            </div>
            <div className="card neon-hover" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(63,185,80,0.12)',
                color: '#3FB950'
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 2A1.75 1.75 0 000 3.75v8.5C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zm0 1.5h12.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25z"/></svg>
              </span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Applications sent</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{applications.length}</div>
              </div>
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
            {(user?.skills || profileDetails.skills).map(skill => (
              <span key={skill} className="badge">{skill}</span>
            ))}
          </div>
          
          <h3 className="card-title" style={{ marginTop: '2rem' }}>Skill Achievements</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Verified via TeamForge Skill Testing System (ADA Math Baseline).
          </p>
          <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span>React Core Performance</span>
              <span style={{ color: '#39d353' }}>PASSED</span>
            </div>
            <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: '100%', backgroundColor: '#39d353', borderRadius: '2px' }}></div>
            </div>
          </div>

          <h3 className="card-title" style={{ marginTop: '2rem' }}>Completed Projects ({user?.projectsCompleted || 0})</h3>
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

          <h3 className="card-title" style={{ marginTop: '2rem' }}>My Projects</h3>
          {ownedProjects.length === 0 ? (
            <div className="empty-state" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              <svg width="60" height="60" fill="none" viewBox="0 0 60 60"><rect x="8" y="20" width="44" height="20" rx="5" fill="#181c20" stroke="#22c55e" strokeWidth="2"/><rect x="18" y="32" width="24" height="6" rx="2" fill="#23272e"/><rect x="25" y="35" width="10" height="3" rx="1" fill="#181c20"/></svg>
              <div>You haven't created any projects yet.</div>
              <Link to="/create" className="btn btn-primary neon-hover" style={{ marginTop: 8 }}>Create your first project</Link>
            </div>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.75rem' }}>
              {ownedProjects.slice(0, 4).map(p => (
                <li key={p._id} className="neon-hover" style={{
                  padding: '0.6rem 0.7rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6.906.664a1.749 1.749 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2z"/></svg>
                    <span className="mono" style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-main)' }}>{p.title}</span>
                  </div>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.applicants?.length || 0} applicants</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Activity chart driven by real backend data */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 className="card-title" style={{ marginBottom: '4px' }}>Activity Insights</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 0 }}>
              Projects you created vs applications you sent by month.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 4, borderRadius: 999, background: '#58A6FF' }} />
              <span>Created</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 4, borderRadius: 999, background: '#3FB950' }} />
              <span>Applied</span>
            </span>
          </div>
        </div>

        {loadingActivity ? (
          <div style={{ padding: '16px 0', color: 'var(--text-muted)', fontSize: '13px' }}>Loading activity...</div>
        ) : activity.length === 0 ? (
          <div style={{ padding: '16px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            We don't have enough data yet. Create a project or apply to one to see your activity timeline.
          </div>
        ) : (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(() => {
              const maxVal = Math.max(...activity.map(a => a.created + a.applied), 1);
              return activity.map((a) => {
                const createdWidth = `${(a.created / maxVal) * 100}%`;
                const appliedWidth = `${(a.applied / maxVal) * 100}%`;
                return (
                  <div key={`${a.year}-${a.month}`} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>{a.label}</span>
                      <span>{a.created} created · {a.applied} applied</span>
                    </div>
                    <div style={{
                      height: 14,
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 999,
                      overflow: 'hidden',
                      display: 'flex'
                    }}>
                      <div style={{ width: createdWidth, background: 'linear-gradient(90deg, #58A6FF, #1F6FEB)' }} />
                      <div style={{ width: appliedWidth, background: 'linear-gradient(90deg, #3FB950, #1A7F37)' }} />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
