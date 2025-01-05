
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import UserLogin from './Pages/UserLogin';
import UserSignUp from './Pages/UserSignUp';
import CaptainLogin from './Pages/CaptainLogin';
import CaptainSignup from './Pages/CaptainSignup';

import Navbar from './Components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/SignUp" element={<UserSignUp />} />
        <Route path="/CaptainLogin" element={<CaptainLogin />} />
        <Route path="/CaptainSignup" element={<CaptainSignup />} />
      </Routes>
    </div>
  );
}

export default App;
