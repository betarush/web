import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// pages
import Register from './pages/register'
import Login from './pages/login'
import Main from './pages/main'
import Listproduct from './pages/listproduct'

function App() {
  const [userId, setUserid] = useState('')

  useEffect(() => {
    const id = localStorage.getItem("id")

    setUserid(id)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userId ? <Main/> : <Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/listproduct" element={<Listproduct/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
