import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchProjects, applyToProject } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Handling Global Search System Queries
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  useEffect(() => {
    const loadRealProjects = async () => {
      try {
        const { data } = await fetchProjects();
        setProjects(data);
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

  // Live filter mapped to frontend cache mapped iteratively
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.ownerId?.name && p.ownerId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving live database connection...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Project Network</h1>
        {searchQuery && (
          <span style={{color: 'var(--link-color)', fontSize: '14px', backgroundColor: 'rgba(88, 166, 255, 0.1)', padding: '6px 14px', borderRadius: '16px', border: '1px solid rgba(88, 166, 255, 0.2)'}}>
            Showing global search for: "{searchQuery}"
          </span>
        )}
      </div>

      <div className="grid grid-cols-2" style={{ gap: '16px' }}>
        {filteredProjects.map(project => {
          const hasApplied = project.applicants?.includes(user?.id);
          const isOwner = project.ownerId?._id === user?.id;
          
          return (
            <div key={project._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 className="card-title" style={{ marginBottom: 0, fontSize: '1.2rem' }}>{project.title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(project.timestamp).toLocaleDateString()}</span>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                  Managed by <span style={{ color: 'var(--link-color)', fontWeight: '500' }}>{project.ownerId?.name || 'Unknown User'}</span>
                </p>
                
                <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.5' }}>
                  {project.description}
                </p>
                
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>Required Technical Alignments</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.requiredSkills.map(skill => (
                      <span key={skill} className="badge">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}>
                    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
                  </svg>
                  {project.applicants?.length || 0} applications active
                </span>
                
                {isOwner ? (
                  <span style={{ fontSize: '12px', color: '#39d353', fontWeight: '500', padding: '4px 12px', backgroundColor: 'rgba(57, 211, 83, 0.1)', borderRadius: '12px', border: '1px solid rgba(57, 211, 83, 0.3)' }}>Your Asset</span>
                ) : hasApplied ? (
                  <button className="btn btn-outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed', padding: '6px 16px', fontSize: '13px' }}>Enrolled</button>
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
