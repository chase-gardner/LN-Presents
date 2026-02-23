import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BuilderRoute from './pages/BuilderRoute';
import PresenterRoute from './pages/PresenterRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/builder" element={<BuilderRoute />} />
        <Route path="/presenter" element={<PresenterRoute />} />
        <Route path="*" element={<Navigate to="/builder" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
