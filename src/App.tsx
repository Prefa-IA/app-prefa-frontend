import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import OveragesAdmin from './components/admin/OveragesAdmin';
import BuscarDireccionPage from './components/BuscarDireccionPage';
import CompartirInforme from './components/CompartirInforme';
import ConsultaDireccion from './components/ConsultaDireccion';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Chatbot from './components/generales/Chatbot';
import Footer from './components/generales/Footer';
import GlobalConfirmModal from './components/generales/GlobalConfirmModal';
import Navbar from './components/generales/Navbar';
import Home from './components/Home';
import ListaInformes from './components/ListaInformes';
import NotFound from './components/NotFound';
import PrintInforme from './components/PrintInforme';
import ResendVerificationPage from './components/ResendVerificationPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import SubscriptionPage from './components/SubscriptionPage';
import SubscriptionManager from './components/suscripcion/SubscriptionManager';
import { TutorialOnboarding } from './components/tutorial/TutorialOnboarding';
import LoginForm from './components/usuario/LoginForm';
import PerfilUsuario from './components/usuario/PerfilUsuario';
import RegistroForm from './components/usuario/RegistroForm';
import VerifyEmailPage from './components/VerifyEmailPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalLoadingProvider } from './contexts/ModalLoadingContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import 'react-toastify/dist/ReactToastify.css';

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

const AppRoutes: React.FC = () => {
  return (
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
        path="/buscar"
        element={
          <ProtectedRoute>
            <BuscarDireccionPage />
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
      <Route path="/print/informe/:id" element={<PrintInforme />} />
      <Route path="/compartir/:token" element={<CompartirInforme />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/resend-verification" element={<ResendVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/admin/facturacion/overages"
        element={
          <ProtectedRoute>
            <OveragesAdmin />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ModalLoadingProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
                <Chatbot />
                <ThemedToast />
                <GlobalConfirmModal />
                <TutorialOnboarding />
              </div>
            </Router>
          </ModalLoadingProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

// Hook para detectar si es mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

// Toast container that reads theme inside ThemeProvider context
const ThemedToast: React.FC = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <ToastContainer
      position={isMobile ? 'bottom-center' : 'top-right'}
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
      className="mobile-toast-container"
    />
  );
};

export default App;
