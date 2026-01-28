import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('[ErrorBoundary] Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error Details:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#fff',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            backgroundColor: '#1e293b',
            padding: '40px',
            borderRadius: '16px',
            border: '1px solid rgba(255,0,0,0.2)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#ff6b6b' }}>
              Application Error
            </h1>
            <p style={{ color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.6' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <details style={{
              backgroundColor: '#0f172a',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '20px',
              textAlign: 'left',
              color: '#94a3b8',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px', color: '#cbd5e1' }}>
                Stack Trace
              </summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                {this.state.error?.stack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#f59e0b',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
