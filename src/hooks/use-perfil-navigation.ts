import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UsePerfilNavigationProps {
  getTempLogo: () => string | null;
  setLogoUrl: (url: string | null) => void;
  setShowModal: (show: boolean) => void;
}

export const usePerfilNavigation = ({
  getTempLogo,
  setLogoUrl,
  setShowModal,
}: UsePerfilNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const billingToastRef = useRef(false);

  useEffect(() => {
    const logoPersonalizado = getTempLogo();
    if (logoPersonalizado) {
      setLogoUrl(logoPersonalizado);
    }

    const params = new URLSearchParams(location.search);
    if (params.get('subscription') === '1') {
      navigate('/suscripciones');
    }
    if (params.get('billing') === '1' && !billingToastRef.current) {
      billingToastRef.current = true;
      toast.info('Completá tus datos de facturación para poder comprar un plan');
      setShowModal(true);
    }
  }, [location, navigate, getTempLogo, setLogoUrl, setShowModal]);

  return { navigate };
};
