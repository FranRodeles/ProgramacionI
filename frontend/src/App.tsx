import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import CreateQr from './views/CreateQr'
import ShortenUrl from './views/ShortenUrl'
import Features from './views/Features'
import MyLinks from './views/MyLinks'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/caracteristicas" element={<Features />} />
          <Route path="/mis-enlaces" element={
            <ProtectedRoute message="Para ver tus QR y enlaces necesitás iniciar sesión">
              <MyLinks />
            </ProtectedRoute>
          } />
          <Route path="/crear-qr" element={
            <ProtectedRoute message="Para crear un QR necesitás iniciar sesión o registrarte">
              <CreateQr />
            </ProtectedRoute>
          } />
          <Route path="/acortar-link" element={
            <ProtectedRoute message="Para acortar un enlace necesitás iniciar sesión o registrarte">
              <ShortenUrl />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
