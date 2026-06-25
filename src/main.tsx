import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import App from './App';
import WorkPage from './pages/WorkPage';
import StudioPage from './pages/StudioPage';
import ContactPage from './pages/ContactPage';
import './index.css';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: 20 }}><h1>Error</h1><pre>{String(this.state.error?.stack || this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><App /></Layout>} />
          <Route path="/work" element={<Layout><WorkPage /></Layout>} />
          <Route path="/studio" element={<Layout><StudioPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
