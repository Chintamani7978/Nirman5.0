import { Routes, Route, Navigate } from 'react-router-dom';
import MapPage from './pages/MapPage';

function App() {
    return (
        <Routes>
            <Route path="/map" element={<MapPage />} />
            <Route path="/" element={<Navigate to="/map" replace />} />
        </Routes>
    );
}

export default App;
