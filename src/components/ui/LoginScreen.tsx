import React, { useState } from 'react';
import { KeyRound, Loader2, UserCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { BotanicalBg } from './BotanicalBg';
import { GerberaFlower } from './GerberaFlower';
import { WashiTape } from './WashiTape';
import { PwaInstallButton } from './PwaInstallButton';

export const LoginScreen = () => {
  const { login } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Por favor completa ambos campos.');
      setIsLoading(false);
      return;
    }

    const success = await login(username, password);
    if (!success) {
      setError('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <BotanicalBg animate={true} />
      
      <div className="absolute top-1/4 left-10 md:left-24 opacity-60 pointer-events-none rotate-12">
        <GerberaFlower size={64} variant="purple" withStem />
      </div>
      <div className="absolute bottom-1/4 right-10 md:right-24 opacity-60 pointer-events-none -rotate-12">
        <GerberaFlower size={64} variant="teal" withStem />
      </div>

      <div className="bg-[#FCFBF7] border-4 border-slate-800 sketch-box w-full max-w-md p-6 sm:p-8 relative shadow-2xl z-10 pencil-shade-mixed">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <WashiTape color="floral" rotate="-2deg" />
        </div>

        <div className="text-center mb-6 mt-2">
          <div className="flex justify-center mb-2">
            <GerberaFlower size={56} variant="mixed" className="drop-shadow-sm hover:rotate-12 transition-transform cursor-pointer" />
          </div>
          <h1 className="font-hand text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Bitácora de Recuerdos
          </h1>
          <p className="font-sketch text-lg text-slate-600 mt-1">
            Un lugar donde guardaremos nuestros recuerdos
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-800 text-sm font-bold px-4 py-2 rounded-xl mb-4 text-center font-sketch">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
              <UserCircle className="w-4 h-4 text-slate-500" />
              Usuario o Nombre
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. marcelo o nicole"
              className="w-full px-4 py-2.5 bg-white/80 border-2 border-slate-300 rounded-xl font-sketch text-lg text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-slate-500" />
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña secreta"
              className="w-full px-4 py-2.5 bg-white/80 border-2 border-slate-300 rounded-xl font-sketch text-lg text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-sketch text-xl sketch-pill shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Entrar a la Bitácora
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex items-center justify-center">
          <PwaInstallButton />
        </div>
      </div>
    </div>
  );
};
