// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import './styles.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Use createRoot instead of ReactDOM.render
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
