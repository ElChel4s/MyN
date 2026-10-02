import React, { useState } from 'react';
import { UserCircle, KeyRound, Check, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { updateCouplePasswordInDB } from '../../lib/dataService';
import { GerberaFlower } from '../ui/GerberaFlower';

export const TabProfile = () => {
  const {
    currentUserSlot,
    user1Alias,
    user2Alias,
    setIsEditNicknamesOpen,
    logout,
    showToast
  } = useAppContext();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState('');

  const isMarcelo = currentUserSlot === 1;
  const currentAlias = isMarcelo ? user1Alias : user2Alias;
  const themeColor = isMarcelo ? 'teal' : 'purple';
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setPassError('Completa ambos campos de contraseña.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPassError('Las contraseñas no coinciden.');
      return;
    }

    setIsChangingPass(true);
    const success = await updateCouplePasswordInDB(currentUserSlot, newPassword);
    setIsChangingPass(false);

    if (success) {
      setNewPassword('');
      setConfirmPassword('');
      showToast('¡Contraseña actualizada con éxito!');
    } else {
      setPassError('Hubo un error al cambiar la contraseña. Intenta de nuevo.');
    }
  };

  return (
    <section className="animate-fadeIn pb-24 max-w-2xl mx-auto mt-6 space-y-6">
      
      {/* Tarjeta principal de perfil */}
      <div className={`bg-white/95 border-2 border-${themeColor}-800 sketch-box p-6 sm:p-8 shadow-sm pencil-shade-${isMarcelo ? 'teal' : 'purple'} relative overflow-hidden`}>
        <div className="absolute -right-4 -bottom-4 opacity-75 pointer-events-none">
          <GerberaFlower size={100} variant={isMarcelo ? 'teal' : 'purple'} />
        </div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className={`w-16 h-16 rounded-full bg-${themeColor}-100 border-2 border-${themeColor}-600 flex items-center justify-center shadow-inner shrink-0`}>
            <UserCircle className={`w-8 h-8 text-${themeColor}-700`} />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider text-${themeColor}-700`}>
              Sesión Iniciada
            </p>
            <h2 className={`font-hand text-3xl sm:text-4xl font-bold text-${themeColor}-950`}>
              {currentAlias}
            </h2>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={() => setIsEditNicknamesOpen(true)}
            className={`flex-1 px-4 py-2 bg-white border-2 border-${themeColor}-400 text-${themeColor}-900 font-sketch text-base sm:text-lg rounded-xl shadow-xs hover:bg-${themeColor}-50 transition-colors cursor-pointer`}
          >
            Modificar Apodos
          </button>
          
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-sketch text-base sm:text-lg sketch-pill shadow-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Cambiar Contraseña */}
      <div className="bg-white/95 border-2 border-slate-300 sketch-box-alt p-6 sm:p-8 shadow-sm pencil-shade-mixed">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dashed border-slate-300">
          <KeyRound className="w-5 h-5 text-slate-700" />
          <h3 className="font-hand text-2xl sm:text-3xl font-bold text-slate-900">
            Cambiar Contraseña
          </h3>
        </div>

        {passError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-lg flex items-center gap-2 text-rose-800 font-sketch text-base">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{passError}</p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              className="w-full px-4 py-2.5 bg-white/80 border-2 border-slate-300 rounded-xl font-sketch text-lg text-slate-900 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Vuelve a ingresar la contraseña"
              className="w-full px-4 py-2.5 bg-white/80 border-2 border-slate-300 rounded-xl font-sketch text-lg text-slate-900 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPass || !newPassword || !confirmPassword}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3 bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-sketch text-lg sketch-pill shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isChangingPass ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" /> Guardar Nueva Contraseña
              </>
            )}
          </button>
        </form>
      </div>

    </section>
  );
};
