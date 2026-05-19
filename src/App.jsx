import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Premium from './pages/Premium';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/premium/:contentId"
          element={
            <ProtectedRoute>
              <Premium />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-center px-4">
              <div>
                <p className="text-8xl font-bold text-dark-4 mb-4">404</p>
                <p className="text-gray-500 mb-6">This page doesn't exist.</p>
                <a href="/" className="btn-primary px-6 py-3">
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
