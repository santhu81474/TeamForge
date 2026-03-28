import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const mockQuestions = [
  { id: 1, text: 'What does React use to increase performance?', options: ['Virtual DOM', 'Real DOM', 'Shadow DOM', 'None of the above'], answer: 'Virtual DOM', optionLetter: 'A' },
  { id: 2, text: 'How do you pass data to a child component?', options: ['Using state', 'Using context', 'Using props', 'Using Redux'], answer: 'Using props', optionLetter: 'C' },
  { id: 3, text: 'Which hook is used for handling side effects?', options: ['useState', 'useContext', 'useReducer', 'useEffect'], answer: 'useEffect', optionLetter: 'D' },
  { id: 4, text: 'Which hook is used to manage state in a functional component?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], answer: 'useState', optionLetter: 'B' },
  { id: 5, text: 'What is the syntax extension for JavaScript used in React?', options: ['JSX', 'JSON', 'JSP', 'JS+'], answer: 'JSX', optionLetter: 'A' }
];

const SkillTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (idx) => {
    const letters = ['A', 'B', 'C', 'D'];
    setAnswers({ ...answers, [currentQuestion]: letters[idx] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Prepare answers for backend (array of letters)
    const userAnswers = Object.keys(answers)
      .sort((a, b) => a - b)
      .map(key => answers[key]);

    try {
      const response = await api.post('/tests/submit', { 
        testId: 'react-basic-01', 
        userAnswers 
      });
      
      setScore(response.data.score);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Test submission error:', err);
      alert(err.response?.data?.message || 'Failed to submit test');
    }
  };

  if (score !== null) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }} className="card">
        <h2 className="page-title">Test Completed!</h2>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', margin: '2rem 0' }}>
          {score} / {mockQuestions.length}
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Your score has been updated in your profile.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const question = mockQuestions[currentQuestion];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-2">
        <h1 className="page-title" style={{ marginBottom: 0 }}>React Skill Test</h1>
        <span className="badge">Question {currentQuestion + 1} of {mockQuestions.length}</span>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{question.text}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {question.options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = answers[currentQuestion] === letter;
            
            return (
              <label key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--card-bg)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'none'
              }}>
                <input 
                  type="radio" 
                  name={`question-${currentQuestion}`} 
                  value={letter} 
                  checked={isSelected}
                  onChange={() => handleSelect(idx)}
                  style={{ marginRight: '1rem', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                  <strong style={{ marginRight: '0.5rem' }}>{letter}.</strong> {option}
                </span>
              </label>
            );
          })}
        </div>

        <div className="flex justify-between">
          <button 
            className="btn btn-outline" 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          {currentQuestion === mockQuestions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={loading || !answers[currentQuestion]}
            >
              {loading ? 'Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentQuestion(prev => Math.min(mockQuestions.length - 1, prev + 1))}
              disabled={!answers[currentQuestion]}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillTest;
