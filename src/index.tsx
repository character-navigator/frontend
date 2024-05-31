import ReactDOM from 'react-dom/client';
import React from 'react'
import './index.css';
import Home from './pages/Login/Login';
import BookSelector from './pages/BookSelector/BookSelectorView';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import About from './pages/About/AboutView';
import Reader from './pages/Reader/Reader';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/book-selector",
    element: <BookSelector/>
  },
  {
    path: "/about",
    element: <About/>
  },
  {
    path: "/reader/:bookTitle",
    element: <Reader/>
  }
])

root.render(
  <React.StrictMode>
    <div className="app-wrapper">
    <div className="app-content">
    <RecoilRoot>
      <RouterProvider router={router}/>
    </RecoilRoot>
    </div>
    </div>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
