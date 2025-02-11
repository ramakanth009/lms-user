import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login_page/Login';
import LandingPage from "./components/landing_page/landing_page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Landingpage" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;