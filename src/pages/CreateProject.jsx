import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/api';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsConfig, setSkillsConfig] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Formatting CSV inputs uniformly for DB
    const requiredSkills = skillsConfig.split(',').map(s => s.trim()).filter(s => s);
    
    try {
      await createProject({ title, description, requiredSkills });
      alert('Production successfully committed to MongoDB collection!');
      navigate('/dashboard');
    } catch (error) {
      alert(`Server Deploy Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '40px auto', padding: '32px' }}>
      <h1 className="page-title" style={{ marginBottom: '24px' }}>Draft Network Project</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Project Key Identifier (Title)</label>
          <input 
            type="text" 
            className="form-input w-full"
            placeholder="e.g. Next.js Enterprise Node Controller"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Extensive Documentation (Description)</label>
          <textarea 
            className="form-input w-full"
            style={{ minHeight: '120px', resize: 'vertical' }}
            placeholder="Deploy the scope, runtime timelines, and discrete goals..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Target Alignments (Skills - CSV format)</label>
          <input 
            type="text" 
            className="form-input w-full"
            placeholder="React, Node.js, Graph Theory"
            value={skillsConfig}
            onChange={e => setSkillsConfig(e.target.value)}
            required
          />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"></path></svg>
            This array will be mathematically calculated via Intersection logic against users trying to accept requirements.
          </p>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-4" 
          disabled={loading}
          style={{ padding: '12px 24px', fontSize: '16px', marginTop: '10px' }}
        >
          {loading ? 'Transmitting to Server...' : 'Commit Source & Publish Payload'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
