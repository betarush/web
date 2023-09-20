import './App.scss';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

// pages
import Landing from './pages/landing'
import Register from './pages/register'
import Login from './pages/login'
import Intro from './pages/intro'
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
    !isMobile ? 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={userId ? <Main/> : <Landing/>}/>
          <Route path="/landing" element={<Landing/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/intro" element={<Intro/>}/>
          <Route path="/main" element={<Main/>}/>
          <Route path="/feedback/:id" element={<Feedback/>}/>
          <Route path="/rejections" element={<Rejections/>}/>
          <Route path="/earnings" element={<Earnings/>}/>
          <Route path="/seefeedbacks" element={<Seefeedbacks/>}/>
          <Route path="/listproduct" element={<Listproduct/>}/>
        </Routes>
      </BrowserRouter>
      :
      <div id="mobile">
        <div className="header">
          GetProductFeedback is currently only available on the desktop
        </div>

        <div className="header">
          We are working our best to make it work on the mobile
        </div>

        <div className="header">
          We truly appreciate your patience
        </div>
      </div>
  );
}

export default App;
