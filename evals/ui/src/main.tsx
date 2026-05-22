import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EvalsPage } from './pages/EvalsPage';

const globalStyles = `
  :root {
    --pass: #16a34a;
    --fail: #dc2626;
    --warn: #d97706;
    --border: #e5e7eb;
    --muted: #6b7280;
    --bg: #f9fafb;
    --mono: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    color: #111;
    margin: 0;
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
  }
  details > summary { list-style: none; }
  details > summary::-webkit-details-marker { display: none; }
  details[open] > summary::before { content: '▾ '; }
  details:not([open]) > summary::before { content: '▸ '; }
  a { color: inherit; }
`;

const styleEl = document.createElement('style');
styleEl.textContent = globalStyles;
document.head.appendChild(styleEl);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<EvalsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('No #root element');
createRoot(root).render(<StrictMode><App /></StrictMode>);
