import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserApplications } from '../services/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const { data } = await fetchUserApplications();
        setApplications(data);
      } catch (err) {
        console.error("Applications fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getApplications();
  }, []);

  if (loading) return <div className="text-center mt-2">Loading applications...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-muted">You have not applied to any projects yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map(app => (
            <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>{app.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Applied on: {app.appliedDate}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge" style={{ 
                  backgroundColor: app.status === 'Accepted' ? '#D1FAE5' : '#FEF3C7',
                  color: app.status === 'Accepted' ? '#065F46' : '#92400E',
                  marginBottom: 0
                }}>
                  {app.status}
                </span>
                {app.status === 'Accepted' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <Link to={`/projects/${app.id}/review`} style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                      Leave a Review
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
