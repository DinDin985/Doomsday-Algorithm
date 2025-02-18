import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {ContextProvider} from './Context';
import App from "../src/App";

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextProvider>
      <App />
    </ContextProvider>
);
