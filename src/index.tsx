import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './app/store'
import { HashRouter } from 'react-router-dom'

/**
 * Emails historically linked to /setpassword?token=... (no hash). With HashRouter the real route is
 * in the fragment (#/setPassword). Without this, the app loads with an empty hash and shows "/" (login).
 */
function redirectLegacySetPasswordUrlToHash(): void {
  const { pathname, search, hash, origin } = window.location;
  if (/#\/setPassword/i.test(hash)) {
    return;
  }
  if (/^\/setpassword\/?$/i.test(pathname)) {
    window.location.replace(`${origin}/#/setPassword${search}`);
    return;
  }
  const nested = pathname.match(/^(.*)\/setpassword\/?$/i);
  if (nested) {
    window.location.replace(`${origin}${nested[1]}/#/setPassword${search}`);
  }
}

redirectLegacySetPasswordUrlToHash();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter> 
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
