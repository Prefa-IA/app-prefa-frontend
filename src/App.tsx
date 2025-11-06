import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
import SubscriptionManager from './components/suscripcion/SubscriptionManager';
import FAQPage from './components/FAQPage';
import OveragesAdmin from './components/admin/OveragesAdmin';
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResendVerificationPage from './components/ResendVerificationPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Footer from './components/generales/Footer';
import { useTheme } from './contexts/ThemeContext';
import NotFound from './components/NotFound';

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
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden flex flex-col">
          <Navbar />
          <main className="flex-grow">
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
            <Route
              path="/suscripcion"
              element={
                <ProtectedRoute>
                  <SubscriptionManager />
                </ProtectedRoute>
              }
            />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/print/informe/:id" element={<PrintInforme />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/admin/facturacion/overages"
              element={<ProtectedRoute><OveragesAdmin /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </main>
          <Footer />
          <ThemedToast />
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Toast container that reads theme inside ThemeProvider context
const ThemedToast: React.FC = () => {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop
      closeOnClick
      rtl={false}
      limit={3}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === 'dark' ? 'dark' : 'light'}
    />
  );
};

export default App;
