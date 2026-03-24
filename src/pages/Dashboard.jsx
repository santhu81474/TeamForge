import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const mockProjects = [
  { id: 1, title: 'E-commerce Redesign', author: 'Alice Smith', description: 'Redesigning the shopping cart experience for a better conversion rate.', requiredSkills: ['React', 'UI/UX'] },
  { id: 2, title: 'AI Recommendation Engine', author: 'John Doe', description: 'Building a Python-based collaborative filtering engine.', requiredSkills: ['Python', 'Machine Learning'] },
  { id: 3, title: 'Blockchain Smart Contract', author: 'Bob Johnson', description: 'Developing an Ethereum smart contract for a decentralized voting app.', requiredSkills: ['Solidity', 'Web3'] },
  { id: 4, title: 'Mobile App for Fitness', author: 'Emma Davis', description: 'React Native application for tracking daily workouts.', requiredSkills: ['React Native', 'Firebase'] }
];

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState({});
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    // Parse search from URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q')?.toLowerCase() || '';

    setTimeout(() => {
      if (query) {
        const filtered = mockProjects.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.author.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
        setProjects(filtered);
      } else {
        setProjects(mockProjects);
      }
      setLoading(false);
    }, 400);
  }, [location.search]);

  const handleApply = async (projectId) => {
    try {
      setApplied(prev => ({ ...prev, [projectId]: true }));
      alert('Successfully applied to project!');
    } catch (err) {
      alert('Failed to apply. Please try again.');
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          {query ? `Search Results for "${query}"` : 'Discover Projects'}
        </h1>
      </div>
      
      {loading ? (
        <div className="text-center mt-2" style={{ color: 'var(--text-muted)' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <p className="text-muted" style={{ fontSize: '16px', marginTop: '20px' }}>No projects found matching your search. Try adjusting your query!</p>
      ) : (
        <div className="grid grid-cols-2">
          {projects.map(project => (
            <div key={project.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 className="card-title" style={{ marginBottom: 0 }}>{project.title}</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{project.author}</span>
              </div>
              <p className="card-description">{project.description}</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Required Skills:</span>
                <div>
                  {project.requiredSkills.map(skill => (
                    <span key={skill} className="badge">{skill}</span>
                  ))}
                </div>
              </div>
              <button 
                className={`btn ${applied[project.id] ? 'btn-outline' : 'btn-primary'}`} 
                onClick={() => handleApply(project.id)}
                disabled={applied[project.id]}
                style={{ width: '100%' }}
              >
                {applied[project.id] ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
