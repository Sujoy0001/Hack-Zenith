import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App';
import Layout01 from './layout/Layout1';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout01 />,
    children: [
      { index: true, element: <App /> },
      { path: 'auth/login', element: <Login /> },
      { path: 'auth/register', element: <Register /> }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);