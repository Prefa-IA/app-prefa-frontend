import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/generales/Navbar';
import Home from './components/Home';
import LoginForm from './components/usuario/LoginForm';
import RegistroForm from './components/usuario/RegistroForm';
import ConsultaDireccion from './components/ConsultaDireccion';
import ListaInformes from './components/ListaInformes';
import PerfilUsuario from './components/usuario/PerfilUsuario';
import { useAuth } from './contexts/AuthContext';
import PrintInforme from './components/PrintInforme';
import SubscriptionPage from './components/SubscriptionPage';
import FAQPage from './components/FAQPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResendVerificationPage from './components/ResendVerificationPage';
import ResetPasswordPage from './components/ResetPasswordPage';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/registro" element={<RegistroForm />} />
            <Route
              path="/consultar"
              element={
                <ProtectedRoute>
                  <ConsultaDireccion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/informes"
              element={
                <ProtectedRoute>
                  <ListaInformes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <PerfilUsuario />
                </ProtectedRoute>
              }
            />

            <Route
              path="/suscripciones"
              element={
                <ProtectedRoute>
                  <SubscriptionPage />
                </ProtectedRoute>
              }
            />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/print/informe/:id" element={<PrintInforme />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
