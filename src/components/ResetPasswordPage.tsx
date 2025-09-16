import React, { useState,useEffect } from 'react';
import { useSearchParams,useNavigate } from 'react-router-dom';
import { auth as authService } from '../services/api';
import { toast } from 'react-toastify';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import stylesBtn from '../styles/LoginForm.module.css';
import stylesCont from '../styles/LoginForm.module.css';
import Logo from './generales/Logo';

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [password,setPassword]=useState('');
  const [repeat,setRepeat]=useState('');
  const [showPass,setShowPass]=useState(false);
  const [loading,setLoading]=useState(false);
  const [showRepeat,setShowRepeat]=useState(false);

  useEffect(()=>{if(!token){toast.error('Token inválido');navigate('/login');}},[token,navigate]);

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(password!==repeat){toast.error('Las contraseñas no coinciden');return;}
    const strong=/^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if(!strong.test(password)){toast.error('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');return;}
    setLoading(true);
    try{
      await authService.resetPassword({token,password});
      toast.success('Contraseña actualizada');
      navigate('/login');
    }catch(error){console.error(error);toast.error('No se pudo actualizar la contraseña');}
    setLoading(false);
  };

  return(
    <div className={stylesCont.container}>
      <div className={`${stylesCont.formContainer} bg-white p-8 rounded shadow`}>
        <div className="flex justify-center mb-2"><Logo width={150} height={40} /></div>
        <h2 className="text-xl font-medium text-gray-600 text-center mb-6">Nueva contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input type={showPass? 'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={()=>setShowPass(!showPass)}>
                {showPass?<EyeOffIcon className="w-5 h-5 text-gray-500"/>:<EyeIcon className="w-5 h-5 text-gray-500"/>}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Repetir Contraseña</label>
            <div className="relative">
              <input type={showRepeat? 'text':'password'} value={repeat} onChange={e=>setRepeat(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={()=>setShowRepeat(!showRepeat)}>
                {showRepeat?<EyeOffIcon className="w-5 h-5 text-gray-500"/>:<EyeIcon className="w-5 h-5 text-gray-500"/>}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className={`${stylesBtn.submitButton} disabled:opacity-50`}>
            {loading?'Actualizando...':'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPasswordPage; 