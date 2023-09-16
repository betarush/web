import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// pages
import Landing from './pages/landing'
import Register from './pages/register'
import Login from './pages/login'
import Main from './pages/main'
import Feedback from './pages/feedback'
import Rejections from './pages/rejections'
import Earnings from './pages/earnings'
import Seefeedbacks from './pages/seefeedbacks';
import Listproduct from './pages/listproduct'
//import Payment from './pages/payment'

function App() {
  const [userId, setUserid] = useState('')

  useEffect(() => {
    const id = localStorage.getItem("id")

    setUserid(id)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userId ? <Main/> : <Landing/>}/>
        <Route path="/landing" element={<Landing/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/feedback/:id" element={<Feedback/>}/>
        <Route path="/rejections" element={<Rejections/>}/>
        <Route path="/earnings" element={<Earnings/>}/>
        <Route path="/seefeedbacks" element={<Seefeedbacks/>}/>
        <Route path="/listproduct" element={<Listproduct/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
