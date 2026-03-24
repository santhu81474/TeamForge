import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock API call to create project
      // await api.post('/projects', { title, description, skills: skills.split(',').map(s => s.trim()) });
      setTimeout(() => {
        setLoading(false);
        alert('Project created successfully!');
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      setLoading(false);
      setError('Failed to create project');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-2">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Create a Project</h1>
      </div>

      <div className="card">
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Next.js Landing Page" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Describe what the project is about and what you are building..." 
              rows="5"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Required Skills (Comma separated)</label>
            <input 
              type="text" 
              className="form-input" 
              value={skills} 
              onChange={e => setSkills(e.target.value)} 
              placeholder="React, Node.js, Graphic Design" 
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
