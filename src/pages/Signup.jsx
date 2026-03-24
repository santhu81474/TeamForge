import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await signup(name, email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Failed to create account');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h2 className="page-title text-center" style={{ marginBottom: '1rem' }}>Create Account</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            className="form-input" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-input" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Sign Up
        </button>
      </form>
      <div className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Login</Link>
      </div>
    </div>
  );
};

export default Signup;
