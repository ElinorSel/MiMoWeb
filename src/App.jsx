import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlaceholderPage from './components/PlaceholderPage.jsx';

export default function App() {
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
