import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { EvalsPage } from './pages/EvalsPage';

function BlogPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Blog Manager</h1>
      <p>
        Open <a href="/blog" target="_blank" rel="noreferrer">Blog Post Editor</a> directly.
      </p>
    </div>
  );
}

function App() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    marginRight: '1rem',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
    color: isActive ? '#0070f3' : '#333',
  });

  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid #eee', background: '#fafafa' }}>
        <NavLink to="/" style={linkStyle} end>Blog</NavLink>
        <NavLink to="/evals" style={linkStyle}>Evals</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/evals" element={<EvalsPage />} />
        <Route path="/evals/:date/:runId" element={<EvalsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('No #root element');
createRoot(root).render(<StrictMode><App /></StrictMode>);
