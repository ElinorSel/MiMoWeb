import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MusicPlayer from './components/MusicPlayer.jsx';
import HomePage from './pages/HomePage.jsx';
import PlaceholderPage from './components/PlaceholderPage.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/devlog" element={<PlaceholderPage title="Dev Log" />} />
      <Route path="/gdd" element={<PlaceholderPage title="GDD" />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  const location = useLocation();
  const showMusicPlayer = location.pathname !== '/play';

  return (
    <>
      <AppRoutes />
      {showMusicPlayer && <MusicPlayer />}
    </>
  );
}
