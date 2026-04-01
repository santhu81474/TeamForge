import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Skeleton from '../components/Skeleton';

const Arena = () => {
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // AI Assistant State
  const [showAssistant, setShowAssistant] = useState(true); // Default to true for premium feel
  const [aiMode, setAiMode] = useState('mentor'); // Modes: mentor, generator, debugger, interviewer, comedian
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI', text: 'Tactical Assistant active. How can I help with this algorithm?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const templates = {
    javascript: '// Implement your solution here\nfunction solve() {\n  \n}',
    python: '# Implement your solution here\ndef solve():\n    pass',
    cpp: '// Implement your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}',
    java: '// Implement your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}'
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const { data } = await api.get('/challenges/daily');
        setChallenge(data);
        setCode(templates.javascript);
      } catch (error) {
        console.error('Failed to fetch daily challenge', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, []);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(templates[newLang]);
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    
    const inputMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'YOU', text: inputMsg }]);
    setChatLoading(true);
    setChatInput('');
    
    try {
      const modeInstructions = {
        mentor: "Act as a helpful Mentor. Focus on explaining concepts clearly and provide hints rather than immediate full code solutions unless explicitly requested.",
        generator: "Act as a pure Code Generator. Provide the exact code requested immediately with minimal explanation. Optimize for speed and directness.",
        debugger: "Act as a strict Code Debugger. Focus entirely on finding edge cases, potential bugs, time/space complexity flaws, and security vulnerabilities in the user's code.",
        interviewer: "Act as a FAANG Technical Interviewer. Ask follow-up questions about algorithmic complexity, alternative approaches, and trade-ops instead of just giving away the answer directly.",
        comedian: "Act as a cynical but helpful Hacker Comedian. Use sarcasm, software engineering tropes, and memes in your responses. Make it extremely dramatic like an 80s movie hacker."
      };

      const promptData = {
        prompt: `You are an AI assistant in a hacker-themed coding arena.

Current Challenge context:
Title: ${challenge.title}
Problem: ${challenge.problemStatement}

INSTRUCTIONS FOR YOU:
- MODE: ${modeInstructions[aiMode]}
- Act as a chatbot. If the user greets you, greet back warmly and offer assistance.
- If the user asks for code, even if it is unrelated to the current challenge (e.g., "simple sum of numbers code"), provide the code they asked for.
- If the user asks for an explanation, explain the concepts clearly along with the code.
- IMPORTANT: When you DO provide code, ALWAYS wrap it in TRIPLE BACKTICKS (\`\`\`).

Chat History:
${chatMessages.map(m => `${m.sender}: ${m.text}`).join('\n')}
YOU: ${inputMsg}
AI:`
      };
      const res = await api.post('/gemini/chat', promptData);
      setChatMessages(prev => [...prev, { sender: 'AI', text: res.data.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { sender: 'AI', text: 'LINK_ERROR: Neural response failed. Check connectivity or API quota.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const applySuggestedCode = (text) => {
    const codeMatch = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (codeMatch && codeMatch[1]) {
      setCode(codeMatch[1].trim());
      alert('SYNCHRONIZATION_COMPLETE: Code updated in editor.');
    } else {
      alert('SYNCHRONIZATION_FAILED: No valid code block found in response.');
    }
  };

  const handleSubmit = async () => {
    if (!code || code.trim().length < 10) {
      alert('CRITICAL_ERROR: Transmission too small. Please implement the algorithm.');
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const { data } = await api.post('/challenges/submit', {
        challengeId: challenge._id,
        code,
        language
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        <Skeleton width="300px" height="40px" className="mb-2" />
        <Skeleton width="100%" height="200px" className="mb-4" />
        <Skeleton width="100%" height="500px" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      {/* Header Info - Less Congested */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="mono" style={{ color: 'var(--neon-green)', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>
            DAILY_MISSION_LOG // {new Date().toLocaleDateString()}
          </div>
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '4px' }}>{challenge.title}</h1>
          <div className="flex gap-2 mono" style={{ fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)' }}>DIFFICULTY:</span> <span style={{ color: '#F59E0B' }}>{challenge.difficulty.toUpperCase()}</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: 12 }}>REWARD:</span> <span style={{ color: 'var(--neon-green)' }}>+{challenge.points} XP</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAssistant(!showAssistant)}
            className="btn btn-outline mono" 
            style={{ fontSize: 11, padding: '8px 20px' }}
          >
            {showAssistant ? '[DISABLE_CO_PILOT]' : '[ENABLE_CO_PILOT]'}
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: showAssistant ? '1fr 360px' : '1fr', 
        gap: '32px', 
        transition: 'all 0.3s ease' 
      }}>
        
        {/* Workspace: Problem + Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Problem Card - Redesigned to be less bulky */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--neon-green)' }}>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
              MISSION_OBJECTIVE
            </div>
            <div style={{ lineHeight: 1.7, fontSize: '15px', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>
              {challenge.problemStatement}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ 
              backgroundColor: '#161b22', 
              padding: '12px 20px', 
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.7 }}>
                  transmission.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
                </span>
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  className="mono"
                  style={{ background: 'transparent', color: 'var(--neon-green)', border: '1px solid rgba(46,204,113,0.3)', borderRadius: '4px', fontSize: '11px', padding: '2px 10px', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="javascript">Javascript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="pulse-dot" style={{ width: 6, height: 6, backgroundColor: 'var(--neon-green)', borderRadius: '50%' }}></div>
                UPLINK_STABLE
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mono"
              spellCheck="false"
              style={{
                width: '100%',
                height: '500px',
                backgroundColor: 'rgba(13, 17, 23, 0.4)',
                color: '#e6edf3',
                border: 'none',
                padding: '24px',
                fontSize: '15px',
                lineHeight: '1.7',
                outline: 'none',
                resize: 'none',
                fontFamily: '"JetBrains Mono", monospace'
              }}
            />
            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)', textAlign: 'right' }}>
              <button 
                className="btn btn-primary neon-hover mono" 
                onClick={handleSubmit} 
                disabled={submitting}
                style={{ padding: '12px 48px', letterSpacing: 1 }}
              >
                {submitting ? 'EXECUTING_PAYLOAD...' : 'TRANSMIT_ALGORITHM'}
              </button>
            </div>
          </div>

          {result && (
            <div className="glass-panel" style={{ 
              padding: '24px', 
              borderLeft: `4px solid ${result.submission.status === 'Accepted' ? 'var(--neon-green)' : '#f85149'}`,
              animation: 'fadeIn 0.4s ease'
            }}>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '16px' }}>EXECUTION_RESULTS</div>
              <h3 className="mono" style={{ color: result.submission.status === 'Accepted' ? 'var(--neon-green)' : '#f85149', marginBottom: '12px', fontSize: '18px' }}>
                {result.submission.status === 'Accepted' ? '[COMPILATION_SUCCESS]' : '[COMPILATION_FAILURE]'}
              </h3>
              <div className="mono" style={{ fontSize: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>Status: <span style={{ color: result.submission.status === 'Accepted' ? 'var(--neon-green)' : '#f85149' }}>{result.submission.status}</span></div>
                {result.pointsEarned > 0 && <div style={{ color: 'var(--neon-green)' }}>XP_GAIN: +{result.pointsEarned}</div>}
              </div>
              {result.feedback && (
                <div className="mono" style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)', fontSize: 13, border: '1px solid rgba(255,255,255,0.05)' }}>
                  {'>'} {result.feedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Sidebar - Integrated but distinct */}
        {showAssistant && (
          <aside className="glass-panel scan-line" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '840px', 
            position: 'sticky', 
            top: '20px',
            border: '1px solid rgba(46, 204, 113, 0.15)'
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(22, 27, 34, 0.8)', display: 'flex', justifyContent: 'space-between' }}>
              <div className="mono" style={{ fontSize: 12, color: 'var(--neon-green)', fontWeight: 800 }}>[TACTICAL_AI]</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--text-muted)' }}>M_MODEL: GEMINI_PRO</div>
            </div>

            {/* Mode Selector */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(13, 17, 23, 0.6)' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: '10px' }}>AI_PROTOCOL_OVERRIDE:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'mentor', label: 'Mentor', desc: 'Focus on concepts & hints' },
                  { id: 'generator', label: 'Generator', desc: 'Direct code output' },
                  { id: 'debugger', label: 'Debugger', desc: 'Find bugs & edge cases' },
                  { id: 'interviewer', label: 'Interviewer', desc: 'Ask complexity queries' },
                  { id: 'comedian', label: 'Cynic Hacker', desc: 'Sarcastic & dramatic' }
                ].map(mode => (
                  <label key={mode.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="aiMode" 
                      value={mode.id} 
                      checked={aiMode === mode.id} 
                      onChange={(e) => setAiMode(e.target.value)} 
                      style={{ accentColor: 'var(--neon-green)', width: '14px', height: '14px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="mono" style={{ fontSize: 11, color: aiMode === mode.id ? 'var(--neon-green)' : 'var(--text-main)' }}>{mode.label.toUpperCase()}</span>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--text-muted)' }}>{mode.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{
              flex: 1, 
              padding: '20px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px',
              backgroundColor: 'rgba(0,0,0,0.2)'
            }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ 
                  backgroundColor: m.sender === 'AI' ? 'rgba(46, 204, 113, 0.03)' : 'rgba(88, 166, 255, 0.03)', 
                  padding: '12px 16px', 
                  borderRadius: '2px',
                  borderLeft: m.sender === 'AI' ? '3px solid var(--neon-green)' : '3px solid var(--link-color)',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 6, opacity: 0.6 }}>- {m.sender} // {new Date().toLocaleTimeString()}</div>
                  <div className="mono" style={{ color: 'var(--text-main)', lineHeight: 1.5, fontSize: 13, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  
                  {m.sender === 'AI' && m.text.includes('```') && (
                    <button 
                      onClick={() => applySuggestedCode(m.text)}
                      className="btn btn-primary mono" 
                      style={{ marginTop: 12, fontSize: 10, padding: '4px 12px', width: '100%' }}
                    >
                      [SYNCHRONIZE_PROTOCOL]
                    </button>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="mono" style={{ fontSize: 11, color: 'var(--neon-green)', animation: 'pulse 1s infinite' }}>
                  {'>'} CALCULATING_HINT...
                </div>
              )}
            </div>

            <form onSubmit={handleSendChatMessage} style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(22, 27, 34, 0.8)' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Query Assistant..." 
                className="form-input mono"
                style={{ fontSize: 13, width: '100%', padding: '12px' }}
                disabled={chatLoading}
              />
            </form>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Arena;
