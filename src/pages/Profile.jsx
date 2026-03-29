import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SkillBadges from '../components/SkillBadges';
import Chart from 'react-apexcharts';
import { updateProfile, fetchProjects, fetchUserApplications } from '../services/api';

const Profile = () => {
    // Tab constants for Project Terminal
    const TAB_COMPLETED = 'Completed';
    const TAB_MY = 'My Projects';
    const TAB_APPS = 'Applications';
    const [activeTab, setActiveTab] = useState(TAB_COMPLETED);
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
              // ...existing code continues...
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          {/* Skill Node */}
                          <div>
                            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon-green)', fontSize: 13, letterSpacing: 1, marginBottom: 8 }}>[SKILL_NODE]</div>
                            <h3 className="card-title mono" style={{ marginBottom: 0, color: 'var(--neon-green)', fontSize: 20, letterSpacing: 1 }}>Skill Node</h3>
                            <div style={{ margin: '18px 0 0 0', display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                              {(user?.skills || profileDetails.skills).map(skill => (
                                <span key={skill} className="badge mono">{skill}</span>
                              ))}
                            </div>
                            <p className="mono" style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10 }}>Verified & Endorsed</p>
                            <div style={{ marginTop: 18, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px', border: '1px solid var(--border-color)' }}>
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
                          {/* Proof-of-Work Heatmap */}
                          <div>
                            <div style={{ fontFamily: 'var(--font-mono)', color: '#58A6FF', fontSize: 13, letterSpacing: 1, marginBottom: 8 }}>[PROOF_OF_WORK]</div>
                            <h3 className="card-title mono" style={{ color: '#58A6FF', marginBottom: 0, fontSize: 20, letterSpacing: 1 }}>Proof-of-Work Heatmap</h3>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '18px', marginBottom: '8px' }}>
                              {Array.from({ length: 52 }).map((_, i) => (
                                <div key={i} style={{ width: '12px', height: '12px', backgroundColor: i % 7 === 0 ? 'var(--neon-green)' : i % 3 === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '2px', opacity: i % 5 === 0 ? 0.3 : 1 }} title={`Week ${i}: ${i % 3} Contributions`} />
                              ))}
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                              DAILY_UPLOAD_LOG: {new Date().toLocaleDateString()} | STATUS: NO_LATENCY
                            </p>
                          </div>
                        </div>
                      </section>
                      {/* Project Terminal (Tabbed) */}
                      <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, marginTop: 0 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', color: '#F59E0B', fontSize: 13, letterSpacing: 1, marginBottom: 8 }}>[PROJECT_TERMINAL]</div>
                        <div style={{ display: 'flex', gap: '18px', marginBottom: 18 }}>
                          {[TAB_COMPLETED, TAB_MY, TAB_APPS].map(tab => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={activeTab === tab ? 'btn btn-primary neon-hover' : 'btn btn-outline'}
                              style={{ fontFamily: 'var(--font-mono)', fontSize: 13, padding: '6px 18px', borderRadius: 6, boxShadow: activeTab === tab ? '0 0 8px var(--primary-glow)' : 'none', background: activeTab === tab ? 'var(--primary)' : 'rgba(0,0,0,0.15)', color: activeTab === tab ? '#fff' : 'var(--text-muted)', border: 'none', transition: 'all 0.15s' }}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                        <div style={{ minHeight: 120 }}>
                          {activeTab === TAB_COMPLETED && (
                            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {profileDetails.completedProjects.length === 0 ? (
                                <li style={{ color: 'var(--text-muted)', fontSize: 13 }}>No completed projects yet.</li>
                              ) : profileDetails.completedProjects.map(proj => (
                                <li key={proj.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{proj.title}</span>
                                  <Link to={`/projects/${proj.id}/review`} style={{ color: 'var(--link-color)', fontSize: '0.875rem' }}>Review</Link>
                                </li>
                              ))}
                            </ul>
                          )}
                          {activeTab === TAB_MY && (
                            ownedProjects.length === 0 ? (
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
                            )
                          )}
                          {activeTab === TAB_APPS && (
                            applications.length === 0 ? (
                              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>No applications sent yet.</div>
                            ) : (
                              <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {applications.slice(0, 4).map(app => (
                                  <li key={app._id} className="neon-hover" style={{ padding: '0.6rem 0.7rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6.906.664a1.749 1.749 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2z"/></svg>
                                      <span className="mono" style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-main)' }}>{app.projectTitle || 'Project'}</span>
                                    </div>
                                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.status || 'Pending'}</span>
                                  </li>
                                ))}
                              </ul>
                            )
                          )}
                        </div>
                      </section>
                      {/* Activity Insights */}
                      <section className="glass-panel" style={{ padding: '32px 24px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', color: '#F59E0B', fontSize: 13, letterSpacing: 1, marginBottom: 8 }}>[ACTIVITY_INSIGHTS]</div>
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
}

export default Profile;
