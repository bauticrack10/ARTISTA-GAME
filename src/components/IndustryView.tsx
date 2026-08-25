import React, { useState } from 'react';
import { Artist, WorldState, RecordLabel, LabelContract, Manager, ManagerTier } from '../types';
import {
  Building2,
  Briefcase,
  DollarSign,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  UserCheck,
  Radio,
  FileText,
  AlertCircle,
  TrendingUp,
  Flame,
  ShieldCheck,
  ChevronRight,
  UserMinus,
  Check
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'contract' | 'radar' | 'managers' | 'own_label'>('contract');
  const [managerTierFilter, setManagerTierFilter] = useState<ManagerTier | 'all'>('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [newLabelName, setNewLabelName] = useState<string>('');

  const currentLabel = player.labelId ? world.labels[player.labelId] : null;
  const currentManager = player.managerId ? world.managers[player.managerId] : null;
  const activeContract = player.activeContract;
  const scoutRadar = IndustryEngine.evaluateScoutRadar(player, world);

  const handleHireManager = (m: Manager) => {
    const check = IndustryEngine.canHireManager(player, m);
    if (!check.canHire) {
      setNotification(`Requisitos no cumplidos: ${check.missingReasons.join(' • ')}`);
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    onHireManager(m.id);
    setNotification(`¡${m.name} es ahora tu nuevo representante oficial!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFireManager = () => {
    IndustryEngine.fireManager(player, world);
    setNotification('Has finalizado el contrato con tu representante.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOwnLabel = () => {
    if (!newLabelName.trim()) {
      setNotification('Ingresá un nombre para tu sello discográfico.');
      setTimeout(() => setNotification(null), 4000);
      return;
    }
    if (player.stats.funds < 25000) {
      setNotification('Necesitás al menos $25,000 para constituir legalmente tu sello discográfico.');
      setTimeout(() => setNotification(null), 4000);
      return;
    }
    const created = IndustryEngine.createArtistOwnedLabel(player, newLabelName.trim(), world);
    onSignContract(player.activeContract!);
    setNotification(`¡Felicitaciones! Has fundado el sello discográfico "${created.name}".`);
    setNewLabelName('');
    setActiveTab('contract');
    setTimeout(() => setNotification(null), 5000);
  };

  const allManagers = Object.values(world.managers) as Manager[];
  const filteredManagers = managerTierFilter === 'all'
    ? allManagers
    : allManagers.filter(m => m.tier === managerTierFilter);

  const tierNames: Record<ManagerTier, string> = {
    underground: 'Tier 1: Barrio / Underground',
    regional: 'Tier 2: Regional & Vanguardia',
    national: 'Tier 3: Consagrado / Nacional',
    elite_global: 'Tier 4: Élite / Global Visionary'
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#1c1c1c]">
      {/* Header Banner */}
      <div className="bg-[#f7f4ed] p-6 sm:p-8 rounded-[12px] border border-[#eceae4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#5f5f5d] px-2 py-0.5 rounded-[9999px] bg-[rgba(28,28,28,0.04)] border border-[#eceae4]">
              Industria Musical
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1c1c1c] tracking-tight mt-1.5">
            Representación, Sellos & Mercado de Fichajes
          </h1>
          <p className="text-sm text-[#5f5f5d] mt-1 max-w-2xl">
            Gestioná tus acuerdos discográficos, seguí el radar de cazatalentos (A&R) para recibir ofertas millonarias en eventos emergentes y contratá a los mejores managers por tiers de requisitos.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'contract'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'bg-[#f7f4ed] text-[#5f5f5d] border border-[#eceae4] hover:text-[#1c1c1c] hover:bg-[rgba(28,28,28,0.03)]'
            }`}
          >
            Situación Contractual
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'bg-[#f7f4ed] text-[#5f5f5d] border border-[#eceae4] hover:text-[#1c1c1c] hover:bg-[rgba(28,28,28,0.03)]'
            }`}
          >
            Radar de Fichajes (A&R)
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'managers'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'bg-[#f7f4ed] text-[#5f5f5d] border border-[#eceae4] hover:text-[#1c1c1c] hover:bg-[rgba(28,28,28,0.03)]'
            }`}
          >
            Mercado de Managers
          </button>
          <button
            onClick={() => setActiveTab('own_label')}
            className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'own_label'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'bg-[#f7f4ed] text-[#5f5f5d] border border-[#eceae4] hover:text-[#1c1c1c] hover:bg-[rgba(28,28,28,0.03)]'
            }`}
          >
            Sello Propio
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="bg-[#f7f4ed] border border-[rgba(28,28,28,0.4)] text-[#1c1c1c] px-4 py-3 rounded-[8px] flex items-center gap-2 text-xs font-medium shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#1c1c1c] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TAB 1: SITUACIÓN CONTRACTUAL ACTUAL */}
      {activeTab === 'contract' && (
        <div className="space-y-6">
          {/* Label Contract Section */}
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#eceae4] pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#1c1c1c]" />
                <h2 className="text-lg font-semibold text-[#1c1c1c]">
                  Contrato Discográfico
                </h2>
              </div>
              {currentLabel ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-[9999px] bg-[rgba(28,28,28,0.04)] border border-[#eceae4] text-[#1c1c1c]">
                  Contrato Vigente
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-[9999px] bg-[rgba(28,28,28,0.04)] border border-[#eceae4] text-[#5f5f5d]">
                  Agente Libre / Independiente
                </span>
              )}
            </div>

            {currentLabel && activeContract ? (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[rgba(28,28,28,0.02)] p-4 rounded-[8px] border border-[#eceae4]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-[#1c1c1c]">
                        {currentLabel.name}
                      </h3>
                      <span className="text-[11px] uppercase font-semibold px-2 py-0.5 rounded-[4px] bg-[rgba(28,28,28,0.06)] text-[#1c1c1c]">
                        {currentLabel.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#5f5f5d] mt-1">
                      {currentLabel.country} • Roster de artistas: {currentLabel.rosterArtistIds.length} integrantes
                    </p>
                  </div>

                  <div className="text-left md:text-right text-xs text-[#5f5f5d]">
                    <span className="block font-medium text-[#1c1c1c]">Firmado en {activeContract.signedYear}</span>
                    <span>Duración acordada: {activeContract.durationYears} años</span>
                  </div>
                </div>

                {/* Progress bar of Albums */}
                <div className="bg-[#f7f4ed] border border-[#eceae4] p-4 rounded-[8px] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1c1c1c]">Compromiso de Álbumes de Estudio:</span>
                    <span className="font-semibold text-[#1c1c1c]">
                      {activeContract.albumsDelivered} de {activeContract.albumsRequired} Entregados ({Math.min(100, Math.floor((activeContract.albumsDelivered / activeContract.albumsRequired) * 100))}%)
                    </span>
                  </div>
                  <div className="w-full bg-[rgba(28,28,28,0.06)] h-2 rounded-[9999px] overflow-hidden">
                    <div
                      className="bg-[#1c1c1c] h-full rounded-[9999px] transition-all duration-500"
                      style={{ width: `${Math.min(100, (activeContract.albumsDelivered / activeContract.albumsRequired) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#5f5f5d]">
                    Al completar todos los álbumes exigidos, el contrato se considerará cumplido y pasarás a ser Agente Libre en el mercado de fichajes.
                  </p>
                </div>

                {/* Transparent Contract Terms Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[rgba(28,28,28,0.02)] border border-[#eceae4] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#5f5f5d] block">Regalías Artista</span>
                    <span className="text-lg font-semibold text-[#1c1c1c]">{activeContract.royaltyPercentage}%</span>
                    <span className="text-[10px] text-[#5f5f5d] block">({100 - activeContract.royaltyPercentage}% para el sello)</span>
                  </div>

                  <div className="bg-[rgba(28,28,28,0.02)] border border-[#eceae4] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#5f5f5d] block">Anticipo Cobrado</span>
                    <span className="text-lg font-semibold text-[#1c1c1c]">${activeContract.signingBonus.toLocaleString()}</span>
                    <span className="text-[10px] text-[#5f5f5d] block">Firma inicial</span>
                  </div>

                  <div className="bg-[rgba(28,28,28,0.02)] border border-[#eceae4] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#5f5f5d] block">Músculo de Marketing</span>
                    <span className="text-lg font-semibold text-[#1c1c1c]">{activeContract.marketingPower}%</span>
                    <span className="text-[10px] text-[#5f5f5d] block">Potencia promocional</span>
                  </div>

                  <div className="bg-[rgba(28,28,28,0.02)] border border-[#eceae4] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#5f5f5d] block">Control Creativo</span>
                    <span className="text-lg font-semibold text-[#1c1c1c]">{activeContract.creativeControl}%</span>
                    <span className="text-[10px] text-[#5f5f5d] block">Libertad de dirección</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[rgba(28,28,28,0.02)] border border-[#eceae4] p-5 rounded-[8px] space-y-2">
                  <h3 className="text-base font-semibold text-[#1c1c1c]">
                    Artista 100% Independiente (Agente Libre)
                  </h3>
                  <p className="text-xs text-[#5f5f5d] leading-relaxed">
                    Conservás el <strong>100% de tus regalías de streaming</strong> y la propiedad absoluta de todos tus másters. Los costos de producción y marketing dependen de tus propios fondos.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-[rgba(28,28,28,0.03)] border border-[#eceae4] rounded-[8px]">
                  <div>
                    <h4 className="text-xs font-semibold text-[#1c1c1c]">¿Cómo recibir ofertas de sellos discográficos?</h4>
                    <p className="text-[11px] text-[#5f5f5d]">
                      Los directivos de A&R no ofrecen contratos a demanda. Monitorean tu audiencia y te presentarán ofertas competitivas en eventos emergentes una vez alcances el umbral de 100.000 oyentes mensuales.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('radar')}
                    className="shrink-0 bg-[#1c1c1c] text-[#fcfbf8] px-3.5 py-1.5 rounded-[6px] text-xs font-medium shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 active:opacity-80 transition-all cursor-pointer"
                  >
                    Ver Radar de A&R
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current Manager Section */}
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#eceae4] pb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#1c1c1c]" />
                <h2 className="text-lg font-semibold text-[#1c1c1c]">
                  Representación Oficial (Manager)
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('managers')}
                className="text-xs font-medium text-[#1c1c1c] hover:underline cursor-pointer"
              >
                Explorar Mercado de Managers
              </button>
            </div>

            {currentManager ? (
              <div className="bg-[rgba(28,28,28,0.02)] p-5 rounded-[8px] border border-[#eceae4] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[#1c1c1c]">{currentManager.name}</h3>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[9999px] bg-[rgba(28,28,28,0.06)] text-[#1c1c1c]">
                      {tierNames[currentManager.tier]}
                    </span>
                  </div>
                  <p className="text-xs text-[#5f5f5d]">
                    {currentManager.bio}
                  </p>
                  <p className="text-[11px] text-[#5f5f5d] pt-1">
                    <strong>Especialidades:</strong> {currentManager.specialties.join(' • ')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="text-left md:text-right text-xs">
                    <span className="font-semibold text-[#1c1c1c] block">{currentManager.commissionFeePct}% Comisión</span>
                    <span className="text-[#5f5f5d]">Negociación: {currentManager.negotiationSkill}% • Contactos: {currentManager.industryNetwork}%</span>
                  </div>
                  <button
                    onClick={handleFireManager}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-[6px] border border-red-200 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    Finalizar Vínculo
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[rgba(28,28,28,0.02)] p-5 rounded-[8px] border border-[#eceae4] text-xs text-[#5f5f5d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1c1c1c] text-sm">Sin Representación Oficial</p>
                  <p className="mt-0.5">
                    Actualmente gestionás tus propios contactos y fechas sin pagar comisiones de management.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('managers')}
                  className="bg-[#1c1c1c] text-[#fcfbf8] px-3.5 py-1.5 rounded-[6px] font-medium shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
                >
                  Contratar Manager
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RADAR DE FICHAJES (A&R) */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          {/* Scout Radar Progress */}
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#eceae4] pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#1c1c1c]" />
                <div>
                  <h2 className="text-lg font-semibold text-[#1c1c1c]">
                    Radar de Cazatalentos & Scouting (A&R)
                  </h2>
                  <p className="text-xs text-[#5f5f5d]">
                    Monitoreo en tiempo real del interés de sellos discográficos nacionales e internacionales.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-[9999px] bg-[rgba(28,28,28,0.04)] border border-[#eceae4] text-[#1c1c1c]">
                {scoutRadar.scoutInterestLevel === 'bidding_war_target' ? '¡Guerra de Fichajes!' : scoutRadar.scoutInterestLevel === 'high_priority' ? 'Interés Alto' : scoutRadar.scoutInterestLevel === 'emerging_scouting' ? 'En Seguimiento' : 'Sin Interés Comercial'}
              </span>
            </div>

            {/* Threshold Progress Box */}
            <div className="bg-[rgba(28,28,28,0.02)] p-5 rounded-[8px] border border-[#eceae4] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-semibold text-[#1c1c1c]">
                  Umbral de Fichaje Profesional (Mínimo 100.000 Oyentes Mensuales):
                </span>
                <span className="font-semibold text-[#1c1c1c]">
                  {scoutRadar.monthlyListeners.toLocaleString()} / {scoutRadar.thresholdListeners.toLocaleString()} ({scoutRadar.progressPercentage}%)
                </span>
              </div>

              <div className="w-full bg-[rgba(28,28,28,0.06)] h-3 rounded-[9999px] overflow-hidden">
                <div
                  className="bg-[#1c1c1c] h-full rounded-[9999px] transition-all duration-500"
                  style={{ width: `${scoutRadar.progressPercentage}%` }}
                />
              </div>

              <p className="text-xs text-[#5f5f5d] leading-relaxed">
                {scoutRadar.statusMessage}
              </p>
            </div>

            {/* Rules explanation */}
            <div className="p-4 bg-[rgba(28,28,28,0.03)] border border-[#eceae4] rounded-[8px] text-xs text-[#5f5f5d] space-y-1.5">
              <p className="font-semibold text-[#1c1c1c] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Dinámica del Mercado de Fichajes
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li><strong>No hay catálogo estático a demanda:</strong> Los contratos se negocian cuando los directivos de los sellos detectan tu tracción orgánica.</li>
                <li><strong>Eventos Emergentes (Pop-ups):</strong> Al superar los 100.000 oyentes (o con sellos boutique underground si tenés alta credibilidad), se dispararán eventos narrativos competitivos con ofertas contrastadas para elegir o rechazar.</li>
                <li><strong>Autonomía Artística:</strong> Siempre tenés la opción de rechazar las propuestas para mantenerte como artista 100% independiente.</li>
              </ul>
            </div>
          </div>

          {/* Active Scouting Labels List */}
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#1c1c1c] border-b border-[#eceae4] pb-3">
              Sellos Discográficos en la Escena ({scoutRadar.scoutingLabels.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoutRadar.scoutingLabels.map(label => (
                <div key={label.id} className="bg-[rgba(28,28,28,0.02)] p-4 rounded-[8px] border border-[#eceae4] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#1c1c1c]">{label.name}</h4>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[4px] bg-[rgba(28,28,28,0.06)] text-[#1c1c1c]">
                        {label.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5f5f5d] mt-1">
                      {label.country} • Prestigio: {label.prestige}% • Músculo de Marketing: {label.marketingPower}%
                    </p>
                    <p className="text-xs text-[#1c1c1c] mt-2 leading-relaxed">
                      {label.scoutingCriteria || 'Busca talentos con fuerte identidad sonora e impacto en la audiencia.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#eceae4] flex items-center justify-between text-[11px] text-[#5f5f5d]">
                    <span>Libertad Creativa: {label.creativeFreedomAllowed}%</span>
                    <span className="font-medium text-[#1c1c1c]">
                      {label.type === 'major' ? 'Requiere 100k+ oyentes' : label.type === 'indie' ? 'Requiere 50k+ oyentes' : 'Enfoque Underground'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MERCADO DE MANAGERS */}
      {activeTab === 'managers' && (
        <div className="space-y-6">
          {/* Tier Filter Pills */}
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eceae4] pb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1c1c1c]">
                  Mercado de Managers & Representación
                </h2>
                <p className="text-xs text-[#5f5f5d]">
                  Contratá al representante ideal según tu etapa de carrera. Cada nivel exige requisitos previos de audiencia, reputación y capital.
                </p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setManagerTierFilter('all')}
                className={`px-3 py-1.5 rounded-[9999px] text-xs font-medium transition-all cursor-pointer ${
                  managerTierFilter === 'all'
                    ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                    : 'bg-[#f7f4ed] text-[#5f5f5d] border border-[#eceae4] hover:text-[#1c1c1c]'
                }`}
              >
                Todos los Tiers
              </button>
              {(['underground', 'regional', 'national', 'elite_global'] as ManagerTier[]).map(t => (
                <button
                  key={t}
                  onClick={() => setManagerTierFilter(t)}
                  className={`px-3 py-1.5 rounded-[9999px] text-xs font-medium transition-all cursor-pointer ${
                    managerTierFilter === t
                      ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                      : 'bg-[#f7f4ed] text-[#5f5f5d] border border-[#eceae4] hover:text-[#1c1c1c]'
                  }`}
                >
                  {tierNames[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Managers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredManagers.map(m => {
              const isHired = player.managerId === m.id;
              const check = IndustryEngine.canHireManager(player, m);
              const hasListeners = player.stats.monthlyListeners >= m.requirements.minMonthlyListeners;
              const hasRep = player.stats.reputation >= m.requirements.minReputation;
              const hasFunds = player.stats.funds >= m.requirements.hiringFee;

              return (
                <div
                  key={m.id}
                  className={`bg-[#f7f4ed] rounded-[12px] p-5 border transition-all space-y-4 flex flex-col justify-between ${
                    isHired
                      ? 'border-[#1c1c1c] bg-[rgba(28,28,28,0.03)]'
                      : check.canHire
                      ? 'border-[#eceae4] hover:border-[rgba(28,28,28,0.4)]'
                      : 'border-[#eceae4] opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-[8px] bg-gradient-to-tr ${m.avatarGradient || 'from-stone-700 to-zinc-900'} text-[#fcfbf8] font-semibold text-sm flex items-center justify-center`}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[#1c1c1c]">{m.name}</h3>
                          <span className="text-[10px] uppercase font-semibold text-[#5f5f5d]">
                            {tierNames[m.tier]}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded-[9999px] bg-[rgba(28,28,28,0.06)] text-[#1c1c1c]">
                        {m.commissionFeePct}% Comisión
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#5f5f5d] leading-relaxed">
                      {m.bio}
                    </p>

                    {/* Stats & Network */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#eceae4] text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#5f5f5d] block">Reputación</span>
                        <span className="font-semibold text-[#1c1c1c]">{m.reputation}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5f5f5d] block">Negociación</span>
                        <span className="font-semibold text-[#1c1c1c]">{m.negotiationSkill}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5f5f5d] block">Contactos</span>
                        <span className="font-semibold text-[#1c1c1c]">{m.industryNetwork}%</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="text-[11px] text-[#5f5f5d]">
                      <span className="font-medium text-[#1c1c1c]">Especialidades: </span>
                      {m.specialties.join(' • ')}
                    </div>

                    {/* Requirements Checklist */}
                    <div className="bg-[rgba(28,28,28,0.02)] p-3 rounded-[8px] border border-[#eceae4] space-y-1.5 text-xs">
                      <span className="text-[11px] font-semibold text-[#1c1c1c] block">Requisitos Previos:</span>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#5f5f5d]">Oyentes Mensuales:</span>
                        <span className={`font-medium flex items-center gap-1 ${hasListeners ? 'text-[#1c1c1c]' : 'text-amber-700'}`}>
                          {hasListeners ? <Check className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
                          {m.requirements.minMonthlyListeners.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#5f5f5d]">Reputación Mínima:</span>
                        <span className={`font-medium flex items-center gap-1 ${hasRep ? 'text-[#1c1c1c]' : 'text-amber-700'}`}>
                          {hasRep ? <Check className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
                          {m.requirements.minReputation}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#5f5f5d]">Tarifa de Contratación:</span>
                        <span className={`font-medium flex items-center gap-1 ${hasFunds ? 'text-[#1c1c1c]' : 'text-amber-700'}`}>
                          {hasFunds ? <Check className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
                          ${m.requirements.hiringFee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {isHired ? (
                      <div className="w-full text-center py-2 bg-[rgba(28,28,28,0.06)] text-[#1c1c1c] font-semibold text-xs rounded-[6px] border border-[#eceae4]">
                        Representante Actual
                      </div>
                    ) : check.canHire ? (
                      <button
                        onClick={() => handleHireManager(m)}
                        className="w-full bg-[#1c1c1c] text-[#fcfbf8] font-medium text-xs py-2 rounded-[6px] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 active:opacity-80 transition-all cursor-pointer"
                      >
                        Contratar Representante (${m.requirements.hiringFee.toLocaleString()})
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[rgba(28,28,28,0.04)] text-[#5f5f5d] font-medium text-xs py-2 rounded-[6px] border border-[#eceae4] cursor-not-allowed opacity-60 flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" /> Requisitos Bloqueados
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SELLO PROPIO */}
      {activeTab === 'own_label' && (
        <div className="space-y-6">
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#1c1c1c]">
                Fundar tu Propio Sello Discográfico
              </h2>
              <p className="text-xs text-[#5f5f5d] leading-relaxed max-w-xl">
                Llegó el momento de tomar el control total de la cadena de valor musical. Fundar tu propio sello te permite retener el 95% de las regalías de streaming, autogestionar tus contratos y reclutar futuros artistas.
              </p>
            </div>

            <div className="bg-[rgba(28,28,28,0.02)] p-5 rounded-[8px] border border-[#eceae4] space-y-4">
              <h3 className="text-xs font-semibold text-[#1c1c1c]">Requisitos de Fundación:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#f7f4ed] rounded-[6px] border border-[#eceae4]">
                  <span className="text-[#5f5f5d] block">Inversión Legal Inicial:</span>
                  <span className={`font-semibold text-sm ${player.stats.funds >= 25000 ? 'text-[#1c1c1c]' : 'text-amber-700'}`}>
                    $25,000 (Tenés ${player.stats.funds.toLocaleString()})
                  </span>
                </div>
                <div className="p-3 bg-[#f7f4ed] rounded-[6px] border border-[#eceae4]">
                  <span className="text-[#5f5f5d] block">Popularidad Mínima:</span>
                  <span className={`font-semibold text-sm ${player.stats.popularity >= 40 ? 'text-[#1c1c1c]' : 'text-amber-700'}`}>
                    40% (Tenés {player.stats.popularity}%)
                  </span>
                </div>
                <div className="p-3 bg-[#f7f4ed] rounded-[6px] border border-[#eceae4]">
                  <span className="text-[#5f5f5d] block">Reputación en la Escena:</span>
                  <span className={`font-semibold text-sm ${player.stats.reputation >= 40 ? 'text-[#1c1c1c]' : 'text-amber-700'}`}>
                    40% (Tenés {player.stats.reputation}%)
                  </span>
                </div>
              </div>

              {/* Input for name */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-[#1c1c1c]">
                  Nombre del Sello Discográfico:
                </label>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Ej: Mansión Records, La Cueva Discos..."
                  className="w-full max-w-md bg-[#f7f4ed] border border-[#eceae4] text-[#1c1c1c] text-sm px-3.5 py-2 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <button
                onClick={handleCreateOwnLabel}
                disabled={player.stats.funds < 25000 || player.stats.popularity < 40}
                className={`px-5 py-2.5 rounded-[6px] text-xs font-medium transition-all ${
                  player.stats.funds >= 25000 && player.stats.popularity >= 40
                    ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 active:opacity-80 cursor-pointer'
                    : 'bg-[rgba(28,28,28,0.04)] text-[#5f5f5d] border border-[#eceae4] cursor-not-allowed opacity-60'
                }`}
              >
                Constituir Sello Discográfico ($25,000)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

