import { useState } from 'react';
import { Send, Globe, Terminal } from 'lucide-react';
import './App.css';

function App() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [requestBody, setRequestBody] = useState('');
  const [requestHeaders, setRequestHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('body');

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
        <div className="logo">POSTMAN</div>
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
            {response?.status && (
              <span className={`status-badge ${getStatusClass(response.status)}`}>
                {response.status}
              </span>
            )}
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
      </main>
    </div>
  );
}

export default App;
