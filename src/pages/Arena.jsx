import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Skeleton from '../components/Skeleton';

const Arena = () => {
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const { data } = await api.get('/challenges/daily');
        setChallenge(data);
        setCode('// Implement your solution here\nfunction solve() {\n  \n}');
      } catch (error) {
        console.error('Failed to fetch daily challenge', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const { data } = await api.post('/challenges/submit', {
        challengeId: challenge._id,
        code,
        language: 'javascript'
      });
      setResult(data);
    } catch (error) {
      console.error('Submission failed', error);
      alert('Transmission Error: Signal Lost.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <Skeleton width="300px" height="40px" className="mb-1" />
        <Skeleton width="100%" height="200px" className="mb-2" />
        <Skeleton width="100%" height="400px" className="mb-2" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Daily Algorithmic Arena</h1>
          <p className="text-muted mono" style={{ fontSize: '13px' }}>
            STATUS: ACTIVE | CONNECTED TO DRAFT_NODE_01
          </p>
        </div>
        <div className="card glass mono" style={{ padding: '10px 20px', textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--neon-green)' }}>POTENTIAL GAIN</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>+{challenge.points} XP</div>
        </div>
      </div>

      <div className="grid grid-cols-1" style={{ gap: '24px' }}>
        {/* Problem Statement */}
        <div className="card neon-hover" style={{ borderLeft: '4px solid var(--neon-green)' }}>
          <h2 className="mono" style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--neon-green)' }}>
            {'>'} {challenge.title}
          </h2>
          <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
            {challenge.problemStatement}
          </div>
          <div className="flex gap-1">
            <span className="badge">Difficulty: {challenge.difficulty}</span>
            <span className="badge">Category: {challenge.category}</span>
          </div>
        </div>

        {/* Editor Area */}
        <div className="card glass" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ 
            backgroundColor: '#161b22', 
            padding: '10px 16px', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>editor.js</span>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--neon-green)' }}>Node.js / JS</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mono"
            spellCheck="false"
            style={{
              width: '100%',
              height: '400px',
              backgroundColor: 'transparent',
              color: '#d1d5db',
              border: 'none',
              padding: '20px',
              fontSize: '14px',
              lineHeight: '1.6',
              outline: 'none',
              resize: 'none'
            }}
          />
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'right' }}>
            <button 
              className="btn btn-primary neon-hover" 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ padding: '10px 32px' }}
            >
              {submitting ? 'EXECUTING...' : 'RUN ALGORITHM'}
            </button>
          </div>
        </div>

        {/* Results Window */}
        {result && (
          <div className="card glass" style={{ border: '1px solid var(--neon-green)', animation: 'fadeIn 0.5s ease' }}>
            <h3 className="mono" style={{ color: 'var(--neon-green)', marginBottom: '12px' }}>[EXECUTION_LOG]</h3>
            <div className="mono" style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>Status: <span style={{ color: 'var(--neon-green)' }}>{result.submission.status}</span></div>
              <div style={{ marginBottom: '8px' }}>Time: {result.submission.executionTime}ms</div>
              <div style={{ marginBottom: '8px' }}>Memory: {result.submission.memoryUsage}KB</div>
              <div style={{ marginTop: '16px', fontSize: '18px', color: 'var(--neon-green)' }}>
                GAINED: +{result.pointsEarned} XP
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Arena;
