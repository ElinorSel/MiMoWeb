import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlaceholderPage from './components/PlaceholderPage.jsx';
import SiteSoundtrack from './components/SiteSoundtrack.jsx';
import { MediaPlaybackProvider } from './context/MediaPlaybackContext.jsx';

export default function App() {
  return (
    <MediaPlaybackProvider>
      <SiteSoundtrack />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/devlog" element={<PlaceholderPage title="Dev Log" />} />
        <Route path="/gdd" element={<PlaceholderPage title="GDD" />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </MediaPlaybackProvider>
  );
}
