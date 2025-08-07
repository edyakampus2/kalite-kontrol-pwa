// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// PWA'nın çevrimdışı işlevselliğini sağlamak için Service Worker'ı kaydedin.
// Daha hızlı yükleme ve çevrimdışı deneyim için Service Worker'ın kaydını silebilir
// veya değiştirebilirsiniz. Daha fazla bilgi için: https://cra.link/PWA
serviceWorkerRegistration.register();
