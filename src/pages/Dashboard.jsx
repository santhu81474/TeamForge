import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchProjects, applyToProject } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>You are not logged in. Please log in again.</div>;
  }
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProjects: 0, myApplications: 0, myOwned: 0 });
  
  // Handling Global Search System Queries
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  useEffect(() => {
    const loadRealProjects = async () => {
      try {
        const { data } = await fetchProjects();
        setProjects(data);
        const mine = (data || []).filter(p => p.applicants?.includes(user?.id));
        const owned = (data || []).filter(p => p.ownerId?._id === user?.id);
        setStats({
          totalProjects: data?.length || 0,
          myApplications: mine.length,
          myOwned: owned.length
        });
      } catch (error) {
        console.error("Error fetching live projects dataset:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRealProjects();
  }, []);

  const handleApply = async (projectId) => {
    try {
      const { data } = await applyToProject(projectId, user?.skills || []);
      alert(`Success: ${data.message} (Match Score: ${data.matchScore}%)`);
      
      // Mutate local state optimally to reflect database changes visually
      setProjects(prev => prev.map(p => {
        if (p._id === projectId) {
          return { ...p, applicants: [...(p.applicants || []), user?.id] };
        }
        return p;
      }));
    } catch (error) {
      alert(`Application Failed: ${error.response?.data?.message || 'Score match too low or invalid request'}`);
    }
  };

  // ADA Concept: Optimized Search via Inverted Index (O(k * m) pre-processing, O(1) or O(terms) lookup)
  const [invertedIndex, setInvertedIndex] = useState({});

  useEffect(() => {
    if (projects.length > 0) {
      const index = {};
      projects.forEach(p => {
        const keywords = `${p.title} ${p.description} ${p.ownerId?.name || ''}`.toLowerCase().split(/\W+/).filter(w => w.length > 2);
        keywords.forEach(word => {
          if (!index[word]) index[word] = new Set();
          index[word].add(p._id);
        });
      });
      setInvertedIndex(index);
    }
  }, [projects]);

  // Optimized lookup using the index
  const getFilteredProjects = () => {
    if (!searchQuery.trim()) return projects;
    
    const searchTerms = searchQuery.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    if (searchTerms.length === 0) return projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Intersection of sets for term search
    let matchingIds = null;
    searchTerms.forEach(term => {
      const idsForTerm = invertedIndex[term] || new Set();
      if (matchingIds === null) {
        matchingIds = new Set(idsForTerm);
      } else {
        // Intersection
        matchingIds = new Set([...matchingIds].filter(id => idsForTerm.has(id)));
      }
    });

    return projects.filter(p => matchingIds?.has(p._id));
  };

  const filteredProjects = getFilteredProjects();

  if (loading) return (
    <div style={{ padding: '2rem' }}>
      <div className="skeleton" style={{ height: 40, width: 320, margin: '0 auto 24px', borderRadius: 8 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
      </div>
      <div className="skeleton" style={{ height: 220, borderRadius: 12 }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="card neon-hover" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(88,166,255,0.12)',
            color: '#58A6FF'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 2A1.75 1.75 0 000 3.75v8.5C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zm0 1.5h12.5a.25.25 0 01.25.25v.56L8 7.5 1.5 4.31v-.56a.25.25 0 01.25-.25zm12.75 3.109L8.3 9.36a.75.75 0 01-.6 0L1.5 6.61v5.64a.25.25 0 00.25.25h12.5a.25.25 0 00.25-.25V6.61z"/></svg>
          </span>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Projects</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{stats.totalProjects}</div>
          </div>
        </div>
        <div className="card neon-hover" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(63,185,80,0.12)',
            color: '#3FB950'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 010 1.06l-6 6a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06L7 9.69l5.47-5.47a.75.75 0 011.06 0z"/></svg>
          </span>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>My Applications</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{stats.myApplications}</div>
          </div>
        </div>
        <div className="card neon-hover" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(242,204,96,0.12)',
            color: '#F2CC60'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 2.75A.75.75 0 013.25 2h9.5a.75.75 0 01.75.75v8.5a.75.75 0 01-.75.75h-4.5l-1.72 2.293A.75.75 0 015.5 14.75V12h-2.25a.75.75 0 01-.75-.75v-8.5z"/></svg>
          </span>
          <div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Projects I Own</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{stats.myOwned}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Project Network</h1>
        {searchQuery && (
          <span style={{color: 'var(--link-color)', fontSize: '14px', backgroundColor: 'rgba(88, 166, 255, 0.1)', padding: '6px 14px', borderRadius: '16px', border: '1px solid rgba(88, 166, 255, 0.2)'}}>
            Showing global search for: "{searchQuery}"
          </span>
        )}
      </div>

      <div className="grid grid-cols-2" style={{ gap: '16px' }}>
        {filteredProjects.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><rect x="10" y="30" width="60" height="30" rx="6" fill="#181c20" stroke="#22c55e" strokeWidth="2"/><rect x="25" y="45" width="30" height="10" rx="2" fill="#23272e"/><rect x="35" y="50" width="10" height="5" rx="1" fill="#181c20"/></svg>
            <div>No projects match your filters.</div>
            <Link to="/create" className="btn btn-primary neon-hover" style={{ marginTop: 8 }}>Create a Project</Link>
          </div>
        ) : filteredProjects.map(project => {
          const hasApplied = project.applicants?.includes(user?.id);
          const isOwner = project.ownerId?._id === user?.id;
          
          return (
            <div key={project._id} className="card neon-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 className="card-title" style={{ marginBottom: 0, fontSize: '1.2rem' }}>{project.title}</h3>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(project.timestamp).toLocaleDateString()}</span>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                  Managed by <span style={{ color: 'var(--link-color)', fontWeight: '500' }}>{project.ownerId?.name || 'Unknown User'}</span>
                </p>
                
                <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.5' }}>
                  {project.description}
                </p>
                
                <div style={{ marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>Required Technical Alignments</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.requiredSkills.map(skill => (
                      <span key={skill} className="badge">{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {project.roleType && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a2.5 2.5 0 00-1.985 4.028A3.501 3.501 0 004.5 8.5v.75a.75.75 0 01-1.5 0V8.5a5 5 0 019.986 0v.75a.75.75 0 01-1.5 0V8.5a3.501 3.501 0 00-1.515-2.972A2.5 2.5 0 008 1.5z"/></svg>
                      {project.roleType}
                    </span>
                  )}
                  {project.seniority && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2.75A.75.75 0 013.75 2h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 2.75zM3 5.75A.75.75 0 013.75 5h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 013 5.75zM3 8.75A.75.75 0 013.75 8h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 013 8.75z"/></svg>
                      {project.seniority}
                    </span>
                  )}
                  {project.workMode && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 2A1.75 1.75 0 000 3.75v8.5C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zm0 1.5h12.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25z"/></svg>
                      {project.workMode}
                    </span>
                  )}
                  {project.duration && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.75a.75.75 0 01.75.75v4.19l2.22 2.22a.75.75 0 11-1.06 1.06L7.47 7.53A.75.75 0 017.25 7V2.5A.75.75 0 018 1.75z"/></svg>
                      {project.duration}
                    </span>
                  )}
                  {typeof project.openings === 'number' && project.openings > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M10.561 8.073a6.005 6.005 0 013.432 5.142.75.75 0 11-1.498.07 4.5 4.5 0 00-8.99 0 .75.75 0 11-1.498-.07 6.004 6.004 0 013.431-5.142 3.999 3.999 0 115.123 0zM10.5 5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z"/></svg>
                      {project.openings} opening{project.openings > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

              </div>
              
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}>
                    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
                  </svg>
                  {project.applicants?.length || 0} nodes active
                </span>
                
                {isOwner ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#39d353', fontWeight: '500', padding: '4px 12px', backgroundColor: 'rgba(57, 211, 83, 0.1)', borderRadius: '12px', border: '1px solid rgba(57, 211, 83, 0.3)' }}>Your Asset</span>
                    <Link to={`/projects/${project._id}/chat`} className="btn btn-outline mono" style={{ padding: '4px 12px', fontSize: '12px' }}>TERMINAL_CHAT</Link>
                  </div>
                ) : hasApplied ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed', padding: '6px 16px', fontSize: '13px' }}>Enrolled</button>
                    <Link to={`/projects/${project._id}/chat`} className="btn btn-outline mono" style={{ padding: '4px 12px', fontSize: '12px' }}>TERMINAL_CHAT</Link>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={() => handleApply(project._id)} style={{ padding: '6px 16px', fontSize: '13px' }}>Submit Request to Join</button>
                )}
              </div>
            </div>
          );
        })}
        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
            No live data found tracking to this server query. <Link to="/projects/create" style={{ color: 'var(--link-color)' }}>Deploy one to the network!</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
