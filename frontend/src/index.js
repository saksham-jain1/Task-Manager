import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import PageNotFound from './Pages/ErrorPage/PageNotFound';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/error" element={<ErrorPage />} />
        <Route exact path="/pagenotfound" element={<PageNotFound />} />
        <Route exact path="/pages/:id/*" element={<App />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
