import { useState } from 'react';
import { Send, Globe, Terminal, Sparkles, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [requestBody, setRequestBody] = useState('');
  const [requestHeaders, setRequestHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('body');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      let headers = {};
      try {
        headers = JSON.parse(requestHeaders);
      } catch (e) {
        alert('Invalid Request Headers JSON');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:8001/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          url,
          headers,
          body: requestBody,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!response && !url) return;
    setAiLoading(true);
    try {
      let headers = {};
      try {
        headers = JSON.parse(requestHeaders);
      } catch (e) {
        headers = {};
      }

      const res = await fetch('http://localhost:8001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: {
            method,
            url,
            headers,
            body: requestBody
          },
          response: response || { error: "No response yet" }
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      } else if (data.error) {
        setAiAnalysis(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setAiAnalysis(`Failed to connect to AI: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const formatResponse = (data: any) => {
    if (data.error) return <span style={{color: '#ef4444'}}>{data.error}</span>;
    if (data.is_json) {
      try {
        return JSON.stringify(JSON.parse(data.data), null, 2);
      } catch (e) {
        return data.data;
      }
    }
    return data.data;
  };

  const getStatusClass = (status: number) => {
    if (status >= 200 && status < 300) return 'status-2xx';
    return 'status-4xx';
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">POSTMANX</div>
        <div className="url-bar">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
          <input 
            type="text" 
            placeholder="https://api.example.com/v1/resource" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="send-btn" onClick={handleSend} disabled={loading}>
            {loading ? 'SENDING' : <><Send size={16} strokeWidth={2.5} /> SEND</>}
          </button>
        </div>
      </header>

      <main>
        <div className="pane">
          <div className="pane-header">
            <h3>REQUEST</h3>
            <Terminal size={16} color="var(--text-secondary)" />
          </div>
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'body' ? 'active' : ''}`} 
              onClick={() => setActiveTab('body')}
            >Body</div>
            <div 
              className={`tab ${activeTab === 'headers' ? 'active' : ''}`} 
              onClick={() => setActiveTab('headers')}
            >Headers</div>
          </div>
          
          <div className="pane-content">
            {activeTab === 'body' ? (
              <textarea 
                placeholder='{ "key": "value" }'
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
              />
            ) : (
              <textarea 
                placeholder='{ "Authorization": "Bearer ..." }'
                value={requestHeaders}
                onChange={(e) => setRequestHeaders(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <h3>RESPONSE</h3>
            <div className="response-actions">
              {response && (
                <button className="analyze-btn" onClick={handleAnalyze} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  AI Analyze
                </button>
              )}
              {response?.status && (
                <span className={`status-badge ${getStatusClass(response.status)}`}>
                  {response.status}
                </span>
              )}
            </div>
          </div>
          
          <div className="pane-content">
            {response ? (
              <pre>{formatResponse(response)}</pre>
            ) : (
              <div className="empty-state">
                <Globe size={64} strokeWidth={1} />
                <p>Send a request to see the magic happen</p>
              </div>
            )}
          </div>
        </div>

        <div className="pane ai-pane">
          <div className="pane-header">
            <h3>AI ASSISTANT</h3>
            <Bot size={16} color="var(--accent-color)" />
          </div>
          <div className="pane-content ai-content">
            {aiAnalysis ? (
              <div className="markdown-body">
                <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="empty-state">
                <Bot size={64} strokeWidth={1} color="var(--accent-color)" />
                <p>Click "AI Analyze" to get help with your request</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
