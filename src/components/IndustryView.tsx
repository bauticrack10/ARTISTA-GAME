import React, { useState } from 'react';
import { Artist, WorldState, RecordLabel, LabelContract, Manager } from '../types';
import { Building2, Briefcase, DollarSign, Award, CheckCircle2, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { IndustryEngine } from '../systems/IndustryEngine';

interface IndustryViewProps {
  player: Artist;
  world: WorldState;
  onSignContract: (contract: LabelContract) => void;
  onHireManager: (managerId: string) => void;
}

export const IndustryView: React.FC<IndustryViewProps> = ({
  player,
  world,
  onSignContract,
  onHireManager
}) => {
  const [notification, setNotification] = useState<string | null>(null);
  const eligibleOffers = IndustryEngine.evaluateLabelOffers(player, world);
  const currentLabel = player.labelId ? world.labels[player.labelId] : null;
  const currentManager = player.managerId ? world.managers[player.managerId] : null;

  const handleSign = (contract: LabelContract, labelName: string) => {
    onSignContract(contract);
    setNotification(`¡Has firmado exitosamente tu contrato con ${labelName}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleHireManager = (m: Manager) => {
    onHireManager(m.id);
    setNotification(`¡${m.name} es ahora tu nuevo representante oficial!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400" />
            Sellos Discográficos, Contratos & Managers
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gestioná tus alianzas con discográficas Multinacionales e Independientes y contratá a los mejores managers de la industria.
          </p>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Current Contract Status */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Briefcase className="w-4 h-4 text-rose-400" />
          Situación Contractual Actual
        </h2>

        {currentLabel ? (
          <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{currentLabel.name}</h3>
                <span className="text-[10px] uppercase font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                  {currentLabel.type}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Prestigio: {currentLabel.prestige}% • Poder de Marketing: {currentLabel.marketingPower}% • Libertad Creativa: {currentLabel.creativeFreedomAllowed}%
              </p>
            </div>

            <div className="text-right text-xs text-zinc-400 font-mono">
              <span className="text-emerald-400 font-bold block">Contrato Vigente</span>
              <span>Roster de Artistas: {currentLabel.rosterArtistIds.length}</span>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-sm">Artista 100% Independiente</p>
              <p className="text-zinc-400 text-xs mt-0.5">
                Conservás el 100% de tus regalías y másters, aunque tus presupuestos promocionales dependen exclusivamente de tus propios fondos.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Offers Available */}
      {!player.labelId && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Ofertas de Sellos Disponibles ({eligibleOffers.length})
          </h2>

          {eligibleOffers.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Aún no tenés ofertas formales. Aumentá tu popularidad lanzando música para llamar la atención de los A&R.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibleOffers.map(({ label, contract }) => (
                <div key={label.id} className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white">{label.name}</h3>
                      <span className="text-[10px] uppercase font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                        {label.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Prestigio: {label.prestige}% • Marketing: {contract.marketingPower}%
                    </p>
                  </div>

                  <div className="bg-zinc-900/80 p-3 rounded-lg text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Adelanto Inicial:</span>
                      <span className="font-bold text-emerald-400">${contract.signingBonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Regalías Artista:</span>
                      <span className="font-bold text-white">{contract.royaltyPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Libertad Creativa:</span>
                      <span className="font-bold text-indigo-300">{contract.creativeControl}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Álbumes Requeridos:</span>
                      <span className="font-bold text-zinc-300">{contract.albumsRequired}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSign(contract, label.name)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Aceptar Contrato & Cobrar Adelanto
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Managers Marketplace */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          Representación & Managers de la Industria
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.values(world.managers) as Manager[]).map(m => {
            const isHired = player.managerId === m.id;
            return (
              <div key={m.id} className={`bg-zinc-950 p-5 rounded-xl border transition-colors space-y-3 flex flex-col justify-between ${
                isHired ? 'border-cyan-500/50 bg-cyan-950/10' : 'border-zinc-800'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">{m.name}</h3>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {m.commissionFeePct}% Comisión
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Reputación: {m.reputation}% • Habilidad de Negociación: {m.negotiationSkill}% • Contactos: {m.industryNetwork}%
                  </p>
                  <p className="text-[11px] text-zinc-500 italic">
                    Especialidad: {m.specialties.join(', ')}
                  </p>
                </div>

                {isHired ? (
                  <div className="text-center py-2 bg-cyan-500/20 text-cyan-300 font-bold text-xs rounded-lg border border-cyan-500/30">
                    Manager Actual
                  </div>
                ) : (
                  <button
                    onClick={() => handleHireManager(m)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Contratar Representante
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
