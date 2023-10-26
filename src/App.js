import './App.scss';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

// pages
// web
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

// mobile
import MobileRegister from './pages/mobile/register'
import MobileLogin from './pages/mobile/login'
import MobileIntro from './pages/mobile/intro'
import MobileMain from './pages/mobile/main'
import MobileFeedback from './pages/mobile/feedback'
import MobileEarnings from './pages/mobile/earnings'
import MobileRejections from './pages/mobile/rejections'
import MobileSeefeedbacks from './pages/mobile/seefeedbacks'
import MobileListproduct from './pages/mobile/listproduct'

function App() {
  const [userId, setUserid] = useState('')

  useEffect(() => {
    const id = localStorage.getItem("id")

    setUserid(id)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {!isMobile ? 
          <>
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
          </>
          :
          <>
            <Route path="/" element={userId ? <MobileMain/> : <Landing/>}/>
            <Route path="/landing" element={<Landing/>}/>
            <Route path="/register" element={<MobileRegister/>}/>
            <Route path="/login" element={<MobileLogin/>}/>
            <Route path="/intro" element={<MobileIntro/>}/>
            <Route path="/main" element={<MobileMain/>}/>
            <Route path="/feedback/:id" element={<MobileFeedback/>}/>
            <Route path="/rejections" element={<MobileRejections/>}/>
            <Route path="/earnings" element={<MobileEarnings/>}/>
            <Route path="/seefeedbacks" element={<MobileSeefeedbacks/>}/>
            <Route path="/listproduct" element={<MobileListproduct/>}/>
          </>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
