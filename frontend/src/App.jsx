
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import UserLogin from './Pages/UserLogin';
import UserSignUp from './Pages/UserSignUp';
import CaptainLogin from './Pages/CaptainLogin';
import CaptainSignup from './Pages/CaptainSignup';
import Start from './Pages/Start';
import UserProtectedWrapper from './Pages/UserProctectedWrapper';
import Navbar from './Components/Navbar';

import CaptainProctectWrapper from './Pages/CaptainProtectWrapper';
import WaitingDriver from './Components/WaitingForDriver';
import CaptainHome from './Pages/CaptainHome';
function App() {
  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path='/start' element={<UserProtectedWrapper><Start/> </UserProtectedWrapper>}></Route>
       
        <Route path="/login" element={<UserLogin />} />
        <Route path="/SignUp" element={<UserSignUp />} />
        <Route path="/CaptainLogin" element={<CaptainLogin />} />
        <Route path="/CaptainSignup" element={<CaptainSignup />} />

        <Route path="/CaptainHome" element={<CaptainProctectWrapper><CaptainHome/></CaptainProctectWrapper>}/>
      </Routes>
    </div>
  );
}

export default App;
