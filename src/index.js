import React from 'react';
import ReactDOM from 'react-dom';

import '@tradeshift/tradeshift-ui';
import '@tradeshift/tradeshift-ui/ts.css';

import App from './client/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
