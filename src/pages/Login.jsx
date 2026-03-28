import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard'); // Proceed to Dashboard upon 200 OK from server
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid environment or connection refused.');
    }
  };


  return (
    <div className="card" style={{ maxWidth: '400px', margin: '60px auto', padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <svg width="48" height="48" viewBox="0 0 16 16" fill="var(--text-main)" style={{ margin: '0 auto 16px' }}>
          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <h2 style={{ fontSize: '24px', fontWeight: '300', marginBottom: 0 }}>Establish Network Authentication</h2>
      </div>

      {error && <div style={{ backgroundColor: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.4)', color: '#ff7b72', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="block font-medium mb-2" style={{ color: 'var(--text-main)', fontSize: '14px' }}>Email access token</label>
          <input 
            type="email" 
            className="form-input w-full" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ padding: '8px 12px' }}
          />
        </div>
        <div>
          <label className="block font-medium mb-2" style={{ color: 'var(--text-main)', fontSize: '14px' }}>Decryption string (Password)</label>
          <input 
            type="password" 
            className="form-input w-full" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ padding: '8px 12px' }} 
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%', padding: '10px' }}>Authorize Signature</button>
      </form>

      <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
        No presence node found? <Link to="/signup" style={{ color: 'var(--link-color)' }}>Construct a footprint.</Link>
      </div>
    </div>
  );
};

export default Login;
