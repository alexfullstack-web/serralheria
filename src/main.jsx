import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fontes hospedadas no próprio site (mais rápido e sem depender do Google Fonts)
import '@fontsource/saira/latin-700.css';
import '@fontsource/saira/latin-800.css';
import '@fontsource/saira/latin-700-italic.css';
import '@fontsource/saira/latin-800-italic.css';
import '@fontsource/saira/latin-900-italic.css';
import '@fontsource/barlow/latin-400.css';
import '@fontsource/barlow/latin-500.css';
import '@fontsource/barlow/latin-600.css';
import '@fontsource/barlow/latin-700.css';
import '@fontsource/kaushan-script/latin-400.css';

import './index.css';
import './styles/components.css';
import './styles/sections.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
