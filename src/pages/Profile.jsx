import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SkillBadges from '../components/SkillBadges';
import Chart from 'react-apexcharts';
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
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
      {/* Sidebar (30%) */}
      <aside style={{ flex: 3, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {/* User Identity */}
        <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ width: '70px', height: '70px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', boxShadow: '0 0 18px var(--primary-glow)' }}>{user?.name?.charAt(0) || 'U'}</div>
            <div style={{ flex: 1 }}>
              <h2 className="card-title mono" style={{ marginBottom: 0, fontSize: 24 }}>{user?.name || 'User'}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: 14 }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', marginBottom: 0 }}>
            <a href={user?.githubUrl || 'https://github.com'} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
              {user?.githubUrl ? 'My GitHub' : 'GitHub'}
            </a>
            <a href={user?.linkedinUrl || 'https://linkedin.com'} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.002-2.753 1.377 1.377 0 01-.002 2.753zm10.07 8.684h-2.368V9.936c0-.883-.014-2.018-1.23-2.018-1.231 0-1.42 .961-1.42 1.956v3.766H6.25V5.996h2.273v1.045h.032c.316-.6 1.09-1.23 2.242-1.23 2.398 0 2.841 1.578 2.841 3.63v4.2z"></path></svg>
              {user?.linkedinUrl ? 'My LinkedIn' : 'LinkedIn'}
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Edit social links</div>
              <input type="url" placeholder="https://github.com/yourusername" value={githubEdit} onChange={(e) => setGithubEdit(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '6px 10px' }} />
              <input type="url" placeholder="https://linkedin.com/in/yourusername" value={linkedinEdit} onChange={(e) => setLinkedinEdit(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '6px 10px' }} />
            </div>
            <button type="button" onClick={handleSaveSocial} disabled={savingSocial} className="btn btn-outline" style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 2A1.75 1.75 0 000 3.75v8.5C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zm1.5 2.5a.75.75 0 011.5 0v5.19l1.72-1.72a.75.75 0 011.06 0L10.75 10.69V7.5a.75.75 0 011.5 0v3.75a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5h1.69L8 8.56l-2.19 2.19H4.75a.75.75 0 01-.75-.75V4.5z"/></svg>
              {savingSocial ? 'Saving...' : 'Save links'}
            </button>
            {socialMessage && (<div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{socialMessage}</div>)}
          </div>
        </section>
        {/* Quick Stats */}
        <section className="glass-panel" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
            <span style={{ fontWeight: 500, fontSize: 15 }}>Overall Rating</span>
            <span style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: 17 }}>★ {user?.rating || 0}</span>
          </div>
          <SkillBadges skills={user?.skills || []} rating={user?.rating || 0} />
          <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
            <div className="card neon-hover" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(88,166,255,0.12)', color: '#58A6FF' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7.75 1.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5H8.5v1.5a.75.75 0 01-1.5 0V6.75H5.5a.75.75 0 010-1.5h1.5V2.25a.75.75 0 01.75-.75z"/><path d="M3.75 2A1.75 1.75 0 002 3.75v8.5C2 13.216 2.784 14 3.75 14h8.5A1.75 1.75 0 0014 12.25v-8.5A1.75 1.75 0 0012.25 2h-8.5zm0 1.5h8.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25z"/></svg>
              </span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Projects created</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{ownedProjects.length}</div>
              </div>
            </div>
            <div className="card neon-hover" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(63,185,80,0.12)', color: '#3FB950' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 2A1.75 1.75 0 000 3.75v8.5C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zm0 1.5h12.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25z"/></svg>
              </span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Applications sent</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{applications.length}</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1.2rem' }}>
            <Link to="/skill-test" className="btn btn-primary" style={{width: '100%'}}>Take a Skill Test</Link>
          </div>
        </section>
      </aside>
      {/* Main Area (70%) */}
      <main style={{ flex: 7, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {/* Skill Node (Skills + Radar) */}
        <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 className="card-title mono" style={{ marginBottom: 0, color: 'var(--neon-green)', fontSize: 20, letterSpacing: 1 }}>Skill Node</h3>
          <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 180 }}>
              <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(user?.skills || profileDetails.skills).map(skill => (
                  <span key={skill} className="badge mono">{skill}</span>
                ))}
              </div>
              <p className="mono" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Verified & Endorsed</p>
            </div>
            <div style={{ flex: 1, minWidth: 220, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px', border: '1px solid var(--border-color)' }}>
              <Chart
                options={{
                  chart: { id: 'skill-radar', toolbar: { show: false }, background: 'transparent' },
                  xaxis: { categories: ['Frontend', 'Backend', 'DevOps', 'DSA', 'System Design'], labels: { style: { colors: '#8b949e', fontFamily: 'var(--font-mono)' } } },
                  yaxis: { show: false },
                  fill: { opacity: 0.4, colors: ['#2ecc71'] },
                  stroke: { show: true, width: 2, colors: ['#2ecc71'] },
                  markers: { size: 4, colors: ['#2ecc71'] },
                  grid: { show: false },
                  theme: { mode: 'dark' }
                }}
                series={[{ name: 'Skill Level', data: [80, 70, 45, 90, 60] }]}
                type="radar"
                height="250"
              />
            </div>
          </div>
        </section>
        {/* Proof-of-Work Heatmap */}
        <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 className="card-title mono" style={{ color: '#58A6FF', marginBottom: 0, fontSize: 20, letterSpacing: 1 }}>Proof-of-Work Heatmap</h3>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '12px', marginBottom: '8px' }}>
            {Array.from({ length: 52 }).map((_, i) => (
              <div key={i} style={{ width: '12px', height: '12px', backgroundColor: i % 7 === 0 ? 'var(--neon-green)' : i % 3 === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '2px', opacity: i % 5 === 0 ? 0.3 : 1 }} title={`Week ${i}: ${i % 3} Contributions`} />
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            DAILY_UPLOAD_LOG: {new Date().toLocaleDateString()} | STATUS: NO_LATENCY
          </p>
        </section>
        {/* Completed Projects */}
        <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 className="card-title mono" style={{ color: '#3FB950', marginBottom: 0, fontSize: 20, letterSpacing: 1 }}>Completed Projects ({user?.projectsCompleted || 0})</h3>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profileDetails.completedProjects.map(proj => (
              <li key={proj.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{proj.title}</span>
                <Link to={`/projects/${proj.id}/review`} style={{ color: 'var(--link-color)', fontSize: '0.875rem' }}>Review</Link>
              </li>
            ))}
          </ul>
        </section>
        {/* My Projects */}
        <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 className="card-title mono" style={{ color: 'var(--neon-green)', marginBottom: 0, fontSize: 20, letterSpacing: 1 }}>My Projects</h3>
          {ownedProjects.length === 0 ? (
            <div className="empty-state" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              <svg width="60" height="60" fill="none" viewBox="0 0 60 60"><rect x="8" y="20" width="44" height="20" rx="5" fill="#181c20" stroke="#22c55e" strokeWidth="2"/><rect x="18" y="32" width="24" height="6" rx="2" fill="#23272e"/><rect x="25" y="35" width="10" height="3" rx="1" fill="#181c20"/></svg>
              <div>You haven't created any projects yet.</div>
              <Link to="/create" className="btn btn-primary neon-hover" style={{ marginTop: 8 }}>Create your first project</Link>
            </div>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {ownedProjects.slice(0, 4).map(p => (
                <li key={p._id} className="neon-hover" style={{ padding: '0.6rem 0.7rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6.906.664a1.749 1.749 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2z"/></svg>
                    <span className="mono" style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-main)' }}>{p.title}</span>
                  </div>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.applicants?.length || 0} applicants</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* Activity Insights */}
        <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
            <div>
              <h3 className="card-title mono" style={{ marginBottom: '4px', fontSize: 20, letterSpacing: 1 }}>Activity Insights</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 0 }}>Projects you created vs applications you sent by month.</p>
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
            <div style={{ padding: '16px 0', color: 'var(--text-muted)', fontSize: '13px' }}>We don't have enough data yet. Create a project or apply to one to see your activity timeline.</div>
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
                      <div style={{ height: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: createdWidth, background: 'linear-gradient(90deg, #58A6FF, #1F6FEB)' }} />
                        <div style={{ width: appliedWidth, background: 'linear-gradient(90deg, #3FB950, #1A7F37)' }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
