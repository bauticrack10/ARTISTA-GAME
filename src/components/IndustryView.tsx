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
  UserMinus,
  Check,
  Globe,
  Disc3,
  Crown
} from 'lucide-react';
import { IndustryEngine } from '../systems/IndustryEngine';
import { formatMoney, formatListeners, formatCompactNumber } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';

interface IndustryViewProps {
  player: Artist;
  world: WorldState;
  onSignContract: (contract: LabelContract) => void;
  onHireManager: (managerId: string) => void;
  onFireManager?: () => void;
}

export type IndustryTab = 'current' | 'distribution_labels' | 'radar' | 'managers' | 'own_label';
export type DistributionFilter = 'all' | 'distributor' | 'local' | 'indie' | 'major';

export interface DistributionOption {
  id: string;
  name: string;
  typeLabel: 'Distribuidora Digital' | 'Sello Local' | 'Indie' | 'Major';
  category: 'distributor' | 'local' | 'indie' | 'major';
  minListeners: number;
  annualFee: number;
  royaltyPct: number;
  advance: number;
  creativeControl: number;
  marketingPower: number;
  durationYears: number;
  albumsRequired: number;
  description: string;
  gradient: string;
  iconType: 'disc' | 'globe' | 'flame' | 'sparkles' | 'award' | 'building' | 'crown';
}

const DISTRIBUTION_OPTIONS: DistributionOption[] = [
  // 1. DISTRIBUIDORAS DIGITALES (0k+)
  {
    id: 'distro_sounddrop_free',
    name: 'SoundDrop Free',
    typeLabel: 'Distribuidora Digital',
    category: 'distributor',
    minListeners: 0,
    annualFee: 0,
    royaltyPct: 85,
    advance: 0,
    creativeControl: 100,
    marketingPower: 20,
    durationYears: 1,
    albumsRequired: 0,
    description: 'Sin costo fijo anual ($0). El artista retiene 85 puntos de regalía neta y el 100% de sus másters; la distribuidora descuenta el 15% sobre liquidaciones de streaming.',
    gradient: 'from-[#18181C] to-[#111114]',
    iconType: 'disc'
  },
  {
    id: 'distro_distrowave_pro',
    name: 'DistroWave Pro',
    typeLabel: 'Distribuidora Digital',
    category: 'distributor',
    minListeners: 0,
    annualFee: 20,
    royaltyPct: 100,
    advance: 0,
    creativeControl: 100,
    marketingPower: 35,
    durationYears: 1,
    albumsRequired: 0,
    description: 'Tarifa plana de $20 al año. Cobrás el 100% de las regalías mecánicas y de reproducción sin comisiones sobre el catálogo ni cesión de derechos fonográficos.',
    gradient: 'from-emerald-700 to-zinc-900',
    iconType: 'globe'
  },
  {
    id: 'distro_amusecloud_indie',
    name: 'AmuseCloud Indie',
    typeLabel: 'Distribuidora Digital',
    category: 'distributor',
    minListeners: 0,
    annualFee: 35,
    royaltyPct: 100,
    advance: 0,
    creativeControl: 100,
    marketingPower: 52,
    durationYears: 1,
    albumsRequired: 0,
    description: 'Suscripción anual de $35 con retención total del máster (100% royalties), split sheets automáticos para colaboradores y envío anticipado a curadores de listas.',
    gradient: 'from-teal-700 to-zinc-900',
    iconType: 'sparkles'
  },

  // 2. SELLOS LOCALES (5k+)
  {
    id: 'label_callejon_records',
    name: 'Callejón Records',
    typeLabel: 'Sello Local',
    category: 'local',
    minListeners: 5000,
    annualFee: 0,
    royaltyPct: 70,
    advance: 15000,
    creativeControl: 85,
    marketingPower: 58,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Sello independiente de circuito local. Ofrece anticipos recuperables ($15k a $45k+), horas de estudio pagas y 70 puntos de regalía tras amortizar el adelanto (recoupment).',
    gradient: 'from-amber-700 to-stone-900',
    iconType: 'flame'
  },
  {
    id: 'label_underground_syndicate',
    name: 'Underground Syndicate Collective',
    typeLabel: 'Sello Local',
    category: 'local',
    minListeners: 8000,
    annualFee: 0,
    royaltyPct: 80,
    advance: 30000,
    creativeControl: 98,
    marketingPower: 55,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Colectivo autogestionado con estructura de distribución física y digital: 80% de regalías, corte final sobre el máster y anticipos de $30k a $120k+.',
    gradient: 'from-stone-700 to-zinc-950',
    iconType: 'flame'
  },
  {
    id: 'label_bohemian_groove_local',
    name: 'Bohemian Groove Local',
    typeLabel: 'Sello Local',
    category: 'local',
    minListeners: 12000,
    annualFee: 0,
    royaltyPct: 65,
    advance: 25000,
    creativeControl: 80,
    marketingPower: 68,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Sello independiente con prensa especializada propia y circuito de salas medianas. Paga adelantos de $25k a $80k+ contra un split de 65/35 en regalías.',
    gradient: 'from-rose-700 to-zinc-900',
    iconType: 'sparkles'
  },

  // 3. INDIES CONSAGRADOS & BOUTIQUES (25k+)
  {
    id: 'label_xl_recordings',
    name: 'XL Recordings & Beggars Group',
    typeLabel: 'Indie',
    category: 'indie',
    minListeners: 30000,
    annualFee: 0,
    royaltyPct: 75,
    advance: 75000,
    creativeControl: 95,
    marketingPower: 78,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Casa discográfica independiente de alcance global. Invierte de $75k a $350k+ en mezcla, masterización y prensa internacional sin tocar el corte final del álbum.',
    gradient: 'from-emerald-700 to-zinc-900',
    iconType: 'award'
  },
  {
    id: 'label_dale_play',
    name: 'Dale Play Records',
    typeLabel: 'Indie',
    category: 'indie',
    minListeners: 50000,
    annualFee: 0,
    royaltyPct: 65,
    advance: 100000,
    creativeControl: 82,
    marketingPower: 88,
    durationYears: 3,
    albumsRequired: 2,
    description: 'Estructura líder del cono sur con fuerte rotación en listas urbanas y cierre de giras. Adelantos recuperables de $100k a $800k+ con 65 puntos para el artista.',
    gradient: 'from-amber-700 to-stone-900',
    iconType: 'building'
  },
  {
    id: 'label_rimas_music',
    name: 'Rimas Entertainment',
    typeLabel: 'Indie',
    category: 'indie',
    minListeners: 100000,
    annualFee: 0,
    royaltyPct: 70,
    advance: 250000,
    creativeControl: 78,
    marketingPower: 95,
    durationYears: 3,
    albumsRequired: 2,
    description: 'Distribución y músculo comercial de multinacional bajo esquema joint venture: anticipos de $250k a $2.5M+ y 70% de retorno sobre el catálogo.',
    gradient: 'from-rose-700 to-zinc-900',
    iconType: 'crown'
  },

  // 4. MAJORS (80k - 120k+)
  {
    id: 'label_warner_latam',
    name: 'Warner Music Latina',
    typeLabel: 'Major',
    category: 'major',
    minListeners: 80000,
    annualFee: 0,
    royaltyPct: 25,
    advance: 350000,
    creativeControl: 55,
    marketingPower: 90,
    durationYears: 4,
    albumsRequired: 3,
    description: 'Multinacional con pauta radial en toda Iberoamérica, presupuesto para videoclips de alto costo y adelantos de $350k a $2.5M+ sujetos a recoupment (25% royalties).',
    gradient: 'from-amber-700 to-stone-900',
    iconType: 'building'
  },
  {
    id: 'label_sony_columbia',
    name: 'Sony Music / Columbia Records',
    typeLabel: 'Major',
    category: 'major',
    minListeners: 100000,
    annualFee: 0,
    royaltyPct: 22,
    advance: 500000,
    creativeControl: 45,
    marketingPower: 96,
    durationYears: 4,
    albumsRequired: 3,
    description: 'Maquinaria corporativa global: anticipos de $500k a $4.5M+, sincronizaciones comerciales y rotación prioritaria a cambio de ceder el máster (22 puntos de regalía).',
    gradient: 'from-[#18181C] to-[#111114]',
    iconType: 'building'
  },
  {
    id: 'label_universal_interscope',
    name: 'Universal / Interscope Records',
    typeLabel: 'Major',
    category: 'major',
    minListeners: 120000,
    annualFee: 0,
    royaltyPct: 20,
    advance: 750000,
    creativeControl: 45,
    marketingPower: 98,
    durationYears: 4,
    albumsRequired: 3,
    description: 'El mayor conglomerado fonográfico del mercado. Adelantos de siete cifras ($750k a $6.0M+) y campañas mundiales 360, bajo exigencia de 3 LP y 20% de regalías.',
    gradient: 'from-rose-700 to-zinc-900',
    iconType: 'crown'
  }
];

export const IndustryView: React.FC<IndustryViewProps> = ({
  player,
  world,
  onSignContract,
  onHireManager,
  onFireManager
}) => {
  const [activeTab, setActiveTab] = useState<IndustryTab>('current');
  const [distFilter, setDistFilter] = useState<DistributionFilter>('all');
  const [managerTierFilter, setManagerTierFilter] = useState<ManagerTier | 'all'>('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [newLabelName, setNewLabelName] = useState<string>('');

  const currentLabel = player?.labelId && world?.labels ? world.labels[player.labelId] : null;
  const currentManager = player?.managerId && world?.managers ? world.managers[player.managerId] : null;
  const activeContract = player?.activeContract;
  const scoutRadar = IndustryEngine.evaluateScoutRadar(player, world);

  const isCurrentDistributor = player.labelId?.startsWith('distro_') || player.labelId?.startsWith('dist_') || Boolean(activeContract?.isDistributor) || currentLabel?.type === 'distributor';
  const isCurrentArtistOwned = currentLabel?.type === 'artist_owned' || player.labelId?.startsWith('label_artist_');

  const handleTabSwitch = (tab: IndustryTab) => {
    playSound('click');
    setActiveTab(tab);
  };

  const handleSignOption = (option: DistributionOption) => {
    playSound('click');
    if (player.stats.monthlyListeners < option.minListeners) {
      setNotification(`Requisitos no cumplidos: Necesitás al menos ${option.minListeners.toLocaleString()} oyentes mensuales.`);
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    if (option.annualFee > 0 && player.stats.funds < option.annualFee) {
      setNotification(`Fondos insuficientes: La cuota anual de ${option.name} es de $${option.annualFee}.`);
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Ensure label entity exists in world.labels
    if (!world.labels[option.id]) {
      world.labels[option.id] = {
        id: option.id,
        name: option.name,
        type: option.category === 'distributor' ? 'distributor' : (option.category === 'local' ? 'local_indie' : option.category === 'indie' ? 'indie' : 'major'),
        country: option.category === 'distributor' ? 'Global' : 'Argentina',
        prestige: option.marketingPower,
        budget: option.advance > 0 ? option.advance * 4 : 50000,
        marketingPower: option.marketingPower,
        creativeFreedomAllowed: option.creativeControl,
        rosterArtistIds: [player.id],
        favoredGenreIds: [player.mainGenreId],
        annualFee: option.annualFee,
        commissionPct: 100 - option.royaltyPct,
        advancePayment: option.advance,
        minMonthlyListeners: option.minListeners,
        scoutingCriteria: option.description
      };
    }

    const targetLabel = world.labels[option.id];
    const contract = IndustryEngine.generateDynamicLabelOffer(player, targetLabel, world.currentYear, world);

    onSignContract(contract);
    playSound('money');
    setNotification(
      option.category === 'distributor'
        ? `¡Distribución configurada! Tu música ahora se distribuye globalmente con ${option.name}.`
        : `¡Contrato discográfico firmado con éxito con ${option.name}! Anticipo cobrado: ${formatMoney(contract.signingBonus)}.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleHireManager = (m: Manager) => {
    playSound('click');
    const check = IndustryEngine.canHireManager(player, m);
    if (!check.canHire) {
      setNotification(`Requisitos no cumplidos: ${check.missingReasons.join(' • ')}`);
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    onHireManager(m.id);
    playSound('money');
    setNotification(`¡${m.name} es ahora tu nuevo representante oficial!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFireManager = () => {
    playSound('click');
    if (onFireManager) {
      onFireManager();
    } else {
      IndustryEngine.fireManager(player, world);
    }
    setNotification('Has finalizado el contrato con tu representante.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOwnLabel = () => {
    playSound('click');
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
    if (player.stats.popularity < 40 || player.stats.reputation < 40) {
      setNotification('Necesitás al menos 40% de Popularidad y 40% de Reputación en la escena.');
      setTimeout(() => setNotification(null), 4000);
      return;
    }
    const created = IndustryEngine.createArtistOwnedLabel(player, newLabelName.trim(), world);
    onSignContract(player.activeContract!);
    playSound('award');
    setNotification(`¡Felicitaciones! Has fundado el sello discográfico "${created.name}".`);
    setNewLabelName('');
    setActiveTab('current');
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

  const filteredDistOptions = distFilter === 'all'
    ? DISTRIBUTION_OPTIONS
    : DISTRIBUTION_OPTIONS.filter(opt => opt.category === distFilter);

  const renderOptionIcon = (iconType: DistributionOption['iconType']) => {
    switch (iconType) {
      case 'disc':
        return <Disc3 className="w-5 h-5" />;
      case 'globe':
        return <Globe className="w-5 h-5" />;
      case 'flame':
        return <Flame className="w-5 h-5" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'award':
        return <Award className="w-5 h-5" />;
      case 'crown':
        return <Crown className="w-5 h-5" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 text-[#F4F4F6]">
      {/* Consolidated Header Banner & Navigation */}
      <div className="bg-[#111114] p-6 sm:p-8 rounded-[6px] border border-[#242429] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs uppercase tracking-wider font-sans font-bold text-[#8E8E99] px-2.5 py-0.5 rounded-[2px] bg-[#18181C] border border-[#242429]">
              Industria Musical
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F4F6] tracking-tight mt-1.5">
            Representación, Sellos & Mercado de Fichajes
          </h1>
          <p className="text-sm text-[#8E8E99] mt-1 max-w-2xl leading-relaxed">
            Negociá puntos de regalía, cesión o retención de másters, adelantos recuperables (recoupment) con discográficas y comisiones de representación.
          </p>
        </div>

        {/* Unified Top Tabs Navigation */}
        <div className="flex flex-wrap gap-1.5 pt-2 xl:pt-0 shrink-0">
          <button
            id="tab-btn-current"
            onClick={() => handleTabSwitch('current')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'current'
                ? 'bg-[#FF4F00] text-white'
                : 'bg-[#18181C] text-[#8E8E99] border border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
            }`}
          >
            Situación Actual
          </button>
          <button
            id="tab-btn-distribution"
            onClick={() => handleTabSwitch('distribution_labels')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'distribution_labels'
                ? 'bg-[#FF4F00] text-white'
                : 'bg-[#18181C] text-[#8E8E99] border border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
            }`}
          >
            Distribución & Sellos
          </button>
          <button
            id="tab-btn-radar"
            onClick={() => handleTabSwitch('radar')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#FF4F00] text-white'
                : 'bg-[#18181C] text-[#8E8E99] border border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
            }`}
          >
            Radar de A&R
          </button>
          <button
            id="tab-btn-managers"
            onClick={() => handleTabSwitch('managers')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'managers'
                ? 'bg-[#FF4F00] text-white'
                : 'bg-[#18181C] text-[#8E8E99] border border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
            }`}
          >
            Mercado de Managers
          </button>
          <button
            id="tab-btn-own-label"
            onClick={() => handleTabSwitch('own_label')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'own_label'
                ? 'bg-[#FF4F00] text-white'
                : 'bg-[#18181C] text-[#8E8E99] border border-[#242429] hover:text-[#F4F4F6] hover:border-[#3F3F46]'
            }`}
          >
            Sello Propio
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="bg-[#111114] border border-[#FF4F00]/40 text-[#F4F4F6] px-4 py-3 rounded-[4px] flex items-center gap-2 text-xs font-sans font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#00E599] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TAB 1: SITUACIÓN ACTUAL */}
      {activeTab === 'current' && (
        <div className="space-y-6">
          {/* Card 1: Contrato Activo o Estado de Distribución */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#242429] pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF4F00]" />
                <h2 className="text-lg font-bold text-[#F4F4F6] tracking-tight">
                  Contrato / Distribución Actual
                </h2>
              </div>
              {currentLabel && activeContract ? (
                <span className="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599]">
                  {isCurrentArtistOwned ? 'Sello Propio' : isCurrentDistributor ? 'Distribución Activa' : 'Contrato Vigente'}
                </span>
              ) : (
                <span className="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#8E8E99]">
                  Agente Libre / Independiente
                </span>
              )}
            </div>

            {currentLabel && activeContract ? (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09090B] p-5 rounded-[4px] border border-[#242429]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl font-bold text-[#F4F4F6]">
                        {currentLabel.name}
                      </h3>
                      <span className="text-xs font-sans uppercase font-bold px-2.5 py-0.5 rounded-[2px] bg-[#18181C] border border-[#242429] text-[#F4F4F6]">
                        {isCurrentArtistOwned ? 'Sello Propio' : isCurrentDistributor ? 'Distribuidora Digital' : currentLabel.type === 'major' ? 'Major Label' : currentLabel.type === 'indie' ? 'Sello Indie' : 'Sello Local / Boutique'}
                      </span>
                    </div>
                    <p className="text-xs text-[#8E8E99] mt-1.5 font-sans">
                      {currentLabel.country} • Roster de artistas: {currentLabel.rosterArtistIds.length} integrantes
                    </p>
                  </div>

                  <div className="text-left md:text-right text-xs text-[#8E8E99] font-sans shrink-0">
                    <span className="block font-bold text-[#F4F4F6]">Firmado en {activeContract.signedYear}</span>
                    <span>Duración: {activeContract.durationYears} {activeContract.durationYears === 1 ? 'año' : 'años'}</span>
                  </div>
                </div>

                {/* Progress bar of Albums (if applicable) */}
                {activeContract.albumsRequired > 0 && (
                  <div className="bg-[#09090B] border border-[#242429] p-4 rounded-[4px] space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="font-bold text-[#F4F4F6]">Compromiso de Álbumes de Estudio:</span>
                      <span className="font-bold text-[#FF4F00] tabular-nums">
                        {activeContract.albumsDelivered} de {activeContract.albumsRequired} Entregados • {Math.min(100, Math.floor((activeContract.albumsDelivered / activeContract.albumsRequired) * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-[#18181C] h-2 rounded-[2px] overflow-hidden">
                      <div
                        className="bg-[#FF4F00] h-full rounded-[2px] transition-all duration-300"
                        role="progressbar"
                        aria-label="Álbumes entregados del contrato"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(Number(Math.min(100, (activeContract.albumsDelivered / activeContract.albumsRequired) * 100)))}
                        style={{ width: `${Math.min(100, (activeContract.albumsDelivered / activeContract.albumsRequired) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#8E8E99] leading-relaxed">
                      Cada LP de estudio entregado descuenta tu compromiso discográfico. Una vez completado el cupo de discos, quedás libre de exclusividad para renegociar puntos o distribuir por tu cuenta.
                    </p>
                  </div>
                )}

                {/* Terms Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#09090B] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] font-sans block">Regalías Artista</span>
                    <span className="text-lg font-bold font-sans tabular-nums text-[#00E599]">{activeContract.royaltyPercentage}%</span>
                    <span className="text-2xs text-[#8E8E99] font-sans block">{100 - activeContract.royaltyPercentage}% para la entidad</span>
                  </div>

                  <div className="bg-[#09090B] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] font-sans block">Anticipo Cobrado</span>
                    <span className="text-lg font-bold font-sans tabular-nums text-[#F4F4F6]">{formatMoney(activeContract.signingBonus)}</span>
                    <span className="text-2xs text-[#8E8E99] font-sans block">Firma inicial</span>
                  </div>

                  <div className="bg-[#09090B] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] font-sans block">Músculo Marketing</span>
                    <span className="text-lg font-bold font-sans tabular-nums text-[#F4F4F6]">{activeContract.marketingPower}%</span>
                    <span className="text-2xs text-[#8E8E99] font-sans block">Potencia promocional</span>
                  </div>

                  <div className="bg-[#09090B] border border-[#242429] p-3.5 rounded-[4px] space-y-1">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] font-sans block">Control Creativo</span>
                    <span className="text-lg font-bold font-sans tabular-nums text-[#F4F4F6]">{activeContract.creativeControl}%</span>
                    <span className="text-2xs text-[#8E8E99] font-sans block">Libertad de dirección</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#09090B] border border-[#242429] p-5 rounded-[4px] space-y-2">
                  <h3 className="text-base font-bold text-[#F4F4F6]">
                    Artista 100% Independiente
                  </h3>
                  <p className="text-xs text-[#8E8E99] leading-relaxed">
                    Retenés el <strong className="text-[#00E599]">100% de tus regalías de reproducción</strong> y la titularidad de tus másters sin adelantos que amortizar (recoupment). Cada sesión de grabación, mezcla, masterización y campaña sale de tu propio bolsillo.
                  </p>
                </div>

                <div className="p-4 bg-[#09090B] border border-[#242429] rounded-[4px] text-xs text-[#8E8E99] space-y-1">
                  <span className="font-bold text-[#F4F4F6] block">Opciones en la Industria:</span>
                  <p>
                    Podés elegir una distribuidora digital abierta desde la pestaña <strong className="text-[#FF4F00]">Distribución & Sellos</strong> en la barra superior o esperar a recibir ofertas exclusivas mediante el <strong className="text-[#FF4F00]">Radar de A&R</strong> al superar los 100.000 oyentes mensuales.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Representación Oficial (Manager) */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#242429] pb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#FF4F00]" />
                <h2 className="text-lg font-bold text-[#F4F4F6] tracking-tight">
                  Representación Oficial (Manager)
                </h2>
              </div>
              {currentManager && (
                <span className="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] bg-[#FF4F00]/10 border border-[#FF4F00]/30 text-[#FF4F00]">
                  {tierNames[currentManager.tier]}
                </span>
              )}
            </div>

            {currentManager ? (
              <div className="bg-[#09090B] p-5 rounded-[4px] border border-[#242429] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#F4F4F6]">{currentManager.name}</h3>
                    <span className="text-2xs font-sans uppercase font-bold px-2 py-0.5 rounded-[2px] bg-[#18181C] border border-[#242429] text-[#F4F4F6]">
                      {currentManager.commissionFeePct}% Comisión
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E99] max-w-xl leading-relaxed">
                    {currentManager.bio}
                  </p>
                  <p className="text-xs text-[#8E8E99] pt-1">
                    <strong className="text-[#F4F4F6]">Especialidades:</strong> {currentManager.specialties.join(' • ')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="text-left md:text-right text-xs font-sans">
                    <span className="font-bold text-[#00E599] block">{currentManager.commissionFeePct}% Comisión</span>
                    <span className="text-[#8E8E99]">Negociación: {currentManager.negotiationSkill}% • Contactos: {currentManager.industryNetwork}%</span>
                  </div>
                  <button
                    onClick={handleFireManager}
                    className="text-xs font-sans text-[#EF4444] hover:text-white font-medium px-3.5 py-2 rounded-[4px] border border-[#EF4444]/30 hover:bg-[#EF4444]/20 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    Finalizar Vínculo
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#09090B] p-5 rounded-[4px] border border-[#242429] text-xs text-[#8E8E99] space-y-1">
                <p className="font-bold text-[#F4F4F6] text-sm">Sin Representación Oficial</p>
                <p>
                  Actualmente gestionás tus propios contactos y fechas sin pagar comisiones de management. Podés contratar un representante calificado desde la pestaña <strong className="text-[#FF4F00]">Mercado de Managers</strong> en la barra superior.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISTRIBUCIÓN & SELLOS (LA ESCALERA COMPLETA) */}
      {activeTab === 'distribution_labels' && (
        <div className="space-y-6">
          {/* Market Valuation Summary Card */}
          {(() => {
            const valuation = IndustryEngine.calculateArtistValuation(player, world);
            return (
              <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242429] pb-3">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-5 h-5 text-[#00E599]" />
                    <div>
                      <h2 className="text-base font-bold text-[#F4F4F6] tracking-tight">
                        Valoración Comercial & Poder de Fichaje
                      </h2>
                      <p className="text-xs text-[#8E8E99]">
                        Auditoría de catálogo, facturación anual de streaming y venta de tickets que usan los departamentos de A&R para tasar tu adelanto recuperable.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-[4px] bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599] self-start sm:self-auto">
                    Facturación Anual Proyectada: {formatMoney(valuation.projectedGrossAnnual)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans tabular-nums">
                  <div className="bg-[#09090B] p-3 rounded-[4px] border border-[#242429]">
                    <span className="text-2xs uppercase text-[#52525B] block">Run-Rate Streaming:</span>
                    <span className="font-bold text-[#F4F4F6] text-sm">{formatMoney(valuation.projectedStreamingGross)}/año</span>
                    <span className="text-2xs text-[#8E8E99] block">~{formatCompactNumber(valuation.projectedAnnualStreams)} streams/año</span>
                  </div>
                  <div className="bg-[#09090B] p-3 rounded-[4px] border border-[#242429]">
                    <span className="text-2xs uppercase text-[#52525B] block">Merchandise Anual:</span>
                    <span className="font-bold text-[#F4F4F6] text-sm">{formatMoney(valuation.projectedMerchGross)}/año</span>
                    <span className="text-2xs text-[#8E8E99] block">{formatCompactNumber(player.stats.fansCount || 0)} fans fidelizados</span>
                  </div>
                  <div className="bg-[#09090B] p-3 rounded-[4px] border border-[#242429]">
                    <span className="text-2xs uppercase text-[#52525B] block">Valor de Catálogo:</span>
                    <span className="font-bold text-[#F4F4F6] text-sm">{formatMoney(valuation.catalogValuation)}</span>
                    <span className="text-2xs text-[#8E8E99] block">{valuation.catalogSongCount} temas • {valuation.catalogHitCount} hits</span>
                  </div>
                  <div className="bg-[#09090B] p-3 rounded-[4px] border border-[#242429]">
                    <span className="text-2xs uppercase text-[#52525B] block">Multiplicador de Firma:</span>
                    <span className="font-bold text-[#FF4F00] text-sm">
                      {currentManager ? `Manager: +${Math.round((currentManager.negotiationSkill / 100) * 25)}%` : 'Base • Sin Manager'}
                    </span>
                    <span className="text-2xs text-[#8E8E99] block">
                      {player.isProdigy ? 'Prodigio • +20%' : 'Estándar de Industria'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Filters Bar */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#F4F4F6] tracking-tight">
                Escalera de Distribución & Sellos Discográficos
              </h2>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                Elegí el modelo de distribución adecuado según tu tracción de oyentes mensuales, objetivos de regalías y respaldo promocional.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1 font-sans">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'distributor', label: 'Distribuidoras' },
                { id: 'local', label: 'Sellos Locales' },
                { id: 'indie', label: 'Indies' },
                { id: 'major', label: 'Majors' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    playSound('click');
                    setDistFilter(f.id as DistributionFilter);
                  }}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer ${
                    distFilter === f.id
                      ? 'bg-[#F4F4F6] text-[#09090B]'
                      : 'bg-[#09090B] text-[#8E8E99] border border-[#242429] hover:border-[#3F3F46] hover:text-[#F4F4F6]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistOptions.map((opt) => {
                const isUnlocked = player.stats.monthlyListeners >= opt.minListeners;
                const isCurrent = player.labelId === opt.id;
                const hasListeners = player.stats.monthlyListeners >= opt.minListeners;

                // Calcular oferta dinámica personalizada según las métricas y facturación del artista
                const targetLabel = world.labels[opt.id] || {
                  id: opt.id,
                  name: opt.name,
                  type: opt.category === 'distributor' ? 'distributor' : (opt.category === 'local' ? 'local_indie' : opt.category === 'indie' ? 'indie' : 'major'),
                  country: opt.category === 'distributor' ? 'Global' : 'Argentina',
                  prestige: opt.marketingPower,
                  budget: opt.advance > 0 ? opt.advance * 4 : 50000,
                  marketingPower: opt.marketingPower,
                  creativeFreedomAllowed: opt.creativeControl,
                  rosterArtistIds: [],
                  favoredGenreIds: [player.mainGenreId],
                  annualFee: opt.annualFee,
                  commissionPct: 100 - opt.royaltyPct,
                  advancePayment: opt.advance,
                  minMonthlyListeners: opt.minListeners,
                  scoutingCriteria: opt.description
                };
                const dynamicOffer = IndustryEngine.generateDynamicLabelOffer(player, targetLabel, world.currentYear, world);
                const displayAdvance = dynamicOffer.signingBonus;

                return (
                  <div
                    key={opt.id}
                    className={`bg-[#111114] rounded-[6px] p-5 border transition-all space-y-4 flex flex-col justify-between ${
                      isCurrent
                        ? 'border-[#00E599]'
                        : isUnlocked
                        ? 'border-[#242429] hover:border-[#3F3F46]'
                        : 'border-[#242429] opacity-75'
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F4F4F6] flex items-center justify-center shrink-0"
                          >
                            {renderOptionIcon(opt.iconType)}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-[#F4F4F6] leading-snug">
                              {opt.name}
                            </h3>
                            <span className="text-2xs uppercase font-sans font-bold text-[#8E8E99] block">
                              {opt.typeLabel}
                            </span>
                          </div>
                        </div>

                        {/* Requirement badge */}
                        {hasListeners ? (
                          <span className="flex items-center gap-1 text-xs font-sans font-bold text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded-[4px] border border-[#00E599]/30 shrink-0">
                            <Check className="w-3 h-3 text-[#00E599]" />
                            {opt.minListeners === 0 ? 'Abierto' : `${formatCompactNumber(opt.minListeners)}`}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-sans font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-[4px] border border-[#F59E0B]/30 shrink-0">
                            <Lock className="w-3 h-3 text-[#F59E0B]" />
                            {formatCompactNumber(opt.minListeners)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#8E8E99] leading-relaxed min-h-[36px]">
                        {opt.description}
                      </p>

                      {/* Key Terms Grid */}
                      <div className="bg-[#09090B] p-3 rounded-[4px] border border-[#242429] grid grid-cols-2 gap-2 text-xs font-sans tabular-nums">
                        <div>
                          <span className="text-2xs uppercase text-[#52525B] block">Regalías Artista:</span>
                          <span className="font-bold text-[#00E599]">{dynamicOffer.royaltyPercentage}%</span>
                        </div>
                        <div>
                          <span className="text-2xs uppercase text-[#52525B] block">Anticipo Dinámico:</span>
                          <span className={`font-bold ${displayAdvance > 0 ? 'text-[#00E599]' : 'text-[#F4F4F6]'}`}>
                            {displayAdvance > 0 ? formatMoney(displayAdvance) : '$0'}
                          </span>
                        </div>
                        <div>
                          <span className="text-2xs uppercase text-[#52525B] block">Presupuesto Mkt:</span>
                          <span className="font-bold text-[#F4F4F6]">
                            {dynamicOffer.marketingBudgetPerRelease && dynamicOffer.marketingBudgetPerRelease > 0 ? `${formatMoney(dynamicOffer.marketingBudgetPerRelease)}/lanz.` : (opt.annualFee > 0 ? `$${opt.annualFee}/año` : 'Sin cuota')}
                          </span>
                        </div>
                        <div>
                          <span className="text-2xs uppercase text-[#52525B] block">Control Creativo:</span>
                          <span className="font-bold text-[#F4F4F6]">{dynamicOffer.creativeControl}%</span>
                        </div>
                        <div>
                          <span className="text-2xs uppercase text-[#52525B] block">Marketing Power:</span>
                          <span className="font-bold text-[#F4F4F6]">{opt.marketingPower}%</span>
                        </div>
                        <div>
                          <span className="text-2xs uppercase text-[#52525B] block">Compromiso:</span>
                          <span className="font-bold text-[#F4F4F6]">
                            {dynamicOffer.albumsRequired > 0 ? `${dynamicOffer.albumsRequired} Álbumes` : 'Sin entregas'}
                          </span>
                        </div>
                      </div>
                    </div>

                  {/* Actions */}
                  <div>
                    {isCurrent ? (
                      <div className="w-full text-center py-2.5 bg-[#00E599]/10 text-[#00E599] font-sans font-bold text-xs rounded-[4px] border border-[#00E599]/30">
                        Contrato Actual
                      </div>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleSignOption(opt)}
                        className="w-full bg-[#FF4F00] hover:bg-[#E04500] text-white font-sans font-bold text-xs py-2.5 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer"
                      >
                        {opt.category === 'distributor' ? 'Distribuir Aquí' : 'Firmar Contrato'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#09090B] text-[#52525B] font-sans font-medium text-xs py-2.5 rounded-[4px] border border-[#242429] cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Bloqueado • Faltan {(opt.minListeners - player.stats.monthlyListeners).toLocaleString()} oyentes
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RADAR DE A&R (CAZATALENTOS) */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          {/* Scout Radar Progress */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#242429] pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#FF4F00]" />
                <div>
                  <h2 className="text-lg font-bold text-[#F4F4F6] tracking-tight">
                    Radar de Cazatalentos & Scouting A&R
                  </h2>
                  <p className="text-xs text-[#8E8E99]">
                    Monitoreo en tiempo real del interés de directivos discográficos nacionales e internacionales.
                  </p>
                </div>
              </div>

              <span className="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] bg-[#FF4F00]/10 border border-[#FF4F00]/30 text-[#FF4F00]">
                {scoutRadar.scoutInterestLevel === 'bidding_war_target'
                  ? '¡Guerra de Fichajes!'
                  : scoutRadar.scoutInterestLevel === 'high_priority'
                  ? 'Interés Alto'
                  : scoutRadar.scoutInterestLevel === 'emerging_scouting'
                  ? 'En Seguimiento'
                  : 'Sin Interés Comercial'}
              </span>
            </div>

            {/* Threshold Progress Box */}
            <div className="bg-[#09090B] p-5 rounded-[4px] border border-[#242429] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-sans tabular-nums">
                <span className="font-bold text-[#F4F4F6]">
                  Umbral de Fichaje Profesional • Mínimo 100.000 Oyentes Mensuales:
                </span>
                <span className="font-bold text-[#FF4F00]">
                  {scoutRadar.monthlyListeners.toLocaleString()} / {scoutRadar.thresholdListeners.toLocaleString()} • {scoutRadar.progressPercentage}%
                </span>
              </div>

              <div className="w-full bg-[#18181C] h-2.5 rounded-[2px] overflow-hidden">
                <div
                  className="bg-[#FF4F00] h-full rounded-[2px] transition-all duration-300"
                  role="progressbar"
                  aria-label="Progreso hacia el umbral de scouting"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(Number(scoutRadar.progressPercentage))}
                  style={{ width: `${scoutRadar.progressPercentage}%` }}
                />
              </div>

              <p className="text-xs text-[#8E8E99] leading-relaxed">
                {scoutRadar.statusMessage}
              </p>
            </div>

            {/* Rules explanation */}
            <div className="p-4 bg-[#09090B] border border-[#242429] rounded-[4px] text-xs text-[#8E8E99] space-y-1.5">
              <p className="font-bold text-[#F4F4F6] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#FF4F00]" /> Dinámica del Mercado de Fichajes
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong className="text-[#F4F4F6]">Monitoreo Automático:</strong> Los directivos de A&R evalúan tu crecimiento orgánico y repercusión en charts.</li>
                <li><strong className="text-[#F4F4F6]">Eventos Emergentes:</strong> Al alcanzar el umbral de oyentes, se dispararán eventos narrativos competitivos con ofertas millonarias contrastadas.</li>
                <li><strong className="text-[#F4F4F6]">Autonomía:</strong> Siempre podés rechazar ofertas para mantener tu sello independiente o distribución abierta.</li>
              </ul>
            </div>
          </div>

          {/* Active Scouting Labels List */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F4F4F6] border-b border-[#242429] pb-3">
              Sellos Discográficos en Seguimiento • {scoutRadar.scoutingLabels.length}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoutRadar.scoutingLabels.map(label => (
                <div key={label.id} className="bg-[#09090B] p-4 rounded-[4px] border border-[#242429] space-y-2 flex flex-col justify-between hover:border-[#3F3F46] transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#F4F4F6]">{label.name}</h4>
                      <span className="text-2xs uppercase font-sans font-bold px-2 py-0.5 rounded-[2px] bg-[#18181C] border border-[#242429] text-[#F4F4F6]">
                        {label.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#8E8E99] mt-1 font-sans">
                      {label.country} • Prestigio: {label.prestige}% • Músculo Mkt: {label.marketingPower}%
                    </p>
                    <p className="text-xs text-[#8E8E99] mt-2 leading-relaxed">
                      {label.scoutingCriteria || 'Busca talentos con fuerte identidad sonora e impacto en la audiencia.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#242429] flex items-center justify-between text-xs text-[#8E8E99] font-sans">
                    <span>Libertad Creativa: {label.creativeFreedomAllowed}%</span>
                    <span className="font-bold text-[#F4F4F6]">
                      {label.type === 'major' ? 'Requiere 100k+ oyentes' : label.type === 'indie' ? 'Requiere 25k+ oyentes' : 'Enfoque Underground'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MERCADO DE MANAGERS */}
      {activeTab === 'managers' && (
        <div className="space-y-6">
          {/* Tier Filter Pills */}
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#F4F4F6] tracking-tight">
                Mercado de Managers & Representación
              </h2>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                Contratá al representante ideal según tu etapa de carrera. Cada nivel exige requisitos previos de audiencia, reputación y capital.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 pt-1 font-sans">
              <button
                onClick={() => {
                  playSound('click');
                  setManagerTierFilter('all');
                }}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer ${
                  managerTierFilter === 'all'
                    ? 'bg-[#F4F4F6] text-[#09090B]'
                    : 'bg-[#09090B] text-[#8E8E99] border border-[#242429] hover:border-[#3F3F46] hover:text-[#F4F4F6]'
                }`}
              >
                Todos los Tiers
              </button>
              {(['underground', 'regional', 'national', 'elite_global'] as ManagerTier[]).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    playSound('click');
                    setManagerTierFilter(t);
                  }}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer ${
                    managerTierFilter === t
                      ? 'bg-[#F4F4F6] text-[#09090B]'
                      : 'bg-[#09090B] text-[#8E8E99] border border-[#242429] hover:border-[#3F3F46] hover:text-[#F4F4F6]'
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
                  className={`bg-[#111114] rounded-[6px] p-5 border transition-all space-y-4 flex flex-col justify-between ${
                    isHired
                      ? 'border-[#00E599]'
                      : check.canHire
                      ? 'border-[#242429] hover:border-[#3F3F46]'
                      : 'border-[#242429] opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[4px] bg-[#18181C] border border-[#242429] text-[#F4F4F6] font-sans font-bold text-sm flex items-center justify-center">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#F4F4F6]">{m.name}</h3>
                          <span className="text-2xs uppercase font-sans font-bold text-[#8E8E99]">
                            {tierNames[m.tier]}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-[2px] bg-[#18181C] border border-[#242429] text-[#F4F4F6]">
                        {m.commissionFeePct}% Comisión
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#8E8E99] leading-relaxed">
                      {m.bio}
                    </p>

                    {/* Stats & Network */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#242429] text-center text-xs font-sans tabular-nums">
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Reputación</span>
                        <span className="font-bold text-[#F4F4F6]">{m.reputation}%</span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Negociación</span>
                        <span className="font-bold text-[#F4F4F6]">{m.negotiationSkill}%</span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Contactos</span>
                        <span className="font-bold text-[#F4F4F6]">{m.industryNetwork}%</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="text-xs text-[#8E8E99]">
                      <span className="font-bold text-[#F4F4F6]">Especialidades: </span>
                      {m.specialties.join(' • ')}
                    </div>

                    {/* Requirements Checklist */}
                    <div className="bg-[#09090B] p-3 rounded-[4px] border border-[#242429] space-y-1.5 text-xs font-sans tabular-nums">
                      <span className="text-2xs uppercase text-[#52525B] font-bold block">Requisitos Previos:</span>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8E8E99]">Oyentes Mensuales:</span>
                        <span className={`font-bold flex items-center gap-1 ${hasListeners ? 'text-[#00E599]' : 'text-[#F59E0B]'}`}>
                          {hasListeners ? <Check className="w-3 h-3 text-[#00E599]" /> : <Lock className="w-3 h-3 text-[#F59E0B]" />}
                          {m.requirements.minMonthlyListeners.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8E8E99]">Reputación Mínima:</span>
                        <span className={`font-bold flex items-center gap-1 ${hasRep ? 'text-[#00E599]' : 'text-[#F59E0B]'}`}>
                          {hasRep ? <Check className="w-3 h-3 text-[#00E599]" /> : <Lock className="w-3 h-3 text-[#F59E0B]" />}
                          {m.requirements.minReputation}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8E8E99]">Tarifa Contratación:</span>
                        <span className={`font-bold flex items-center gap-1 ${hasFunds ? 'text-[#00E599]' : 'text-[#F59E0B]'}`}>
                          {hasFunds ? <Check className="w-3 h-3 text-[#00E599]" /> : <Lock className="w-3 h-3 text-[#F59E0B]" />}
                          {formatMoney(m.requirements.hiringFee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {isHired ? (
                      <div className="w-full text-center py-2.5 bg-[#00E599]/10 text-[#00E599] font-sans font-bold text-xs rounded-[4px] border border-[#00E599]/30">
                        Representante Actual
                      </div>
                    ) : check.canHire ? (
                      <button
                        onClick={() => handleHireManager(m)}
                        className="w-full bg-[#FF4F00] hover:bg-[#E04500] text-white font-sans font-bold text-xs py-2.5 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer"
                      >
                        Contratar Representante • {formatMoney(m.requirements.hiringFee)}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#09090B] text-[#52525B] font-sans font-medium text-xs py-2.5 rounded-[4px] border border-[#242429] cursor-not-allowed flex items-center justify-center gap-1.5"
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

      {/* TAB 5: SELLO PROPIO */}
      {activeTab === 'own_label' && (
        <div className="space-y-6">
          <div className="bg-[#111114] border border-[#242429] rounded-[6px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#F4F4F6] tracking-tight">
                Fundar tu Propio Sello Discográfico
              </h2>
              <p className="text-xs text-[#8E8E99] leading-relaxed max-w-xl">
                Constituir tu propia estructura fonográfica exige $25.000 de capital operativo, pero te asegura el 95% de las regalías netas, la titularidad perpetua de los másters y cero deuda por adelantos recuperables.
              </p>
            </div>

            <div className="bg-[#09090B] p-5 rounded-[4px] border border-[#242429] space-y-4">
              <h3 className="text-xs font-sans uppercase font-bold text-[#8E8E99]">Requisitos de Fundación:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans tabular-nums">
                <div className="p-3 bg-[#18181C] rounded-[4px] border border-[#242429]">
                  <span className="text-2xs uppercase text-[#52525B] block">Inversión Inicial:</span>
                  <span className={`font-bold text-sm flex items-center gap-1 mt-0.5 ${player.stats.funds >= 25000 ? 'text-[#00E599]' : 'text-[#F59E0B]'}`}>
                    {player.stats.funds >= 25000 ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    $25,000 • Saldo: {formatMoney(player.stats.funds)}
                  </span>
                </div>
                <div className="p-3 bg-[#18181C] rounded-[4px] border border-[#242429]">
                  <span className="text-2xs uppercase text-[#52525B] block">Popularidad Mínima:</span>
                  <span className={`font-bold text-sm flex items-center gap-1 mt-0.5 ${player.stats.popularity >= 40 ? 'text-[#00E599]' : 'text-[#F59E0B]'}`}>
                    {player.stats.popularity >= 40 ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    40/100 • Actual: {player.stats.popularity}/100
                  </span>
                </div>
                <div className="p-3 bg-[#18181C] rounded-[4px] border border-[#242429]">
                  <span className="text-2xs uppercase text-[#52525B] block">Reputación en Escena:</span>
                  <span className={`font-bold text-sm flex items-center gap-1 mt-0.5 ${player.stats.reputation >= 40 ? 'text-[#00E599]' : 'text-[#F59E0B]'}`}>
                    {player.stats.reputation >= 40 ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    40/100 • Actual: {player.stats.reputation}/100
                  </span>
                </div>
              </div>

              {/* Input for name */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-sans font-bold uppercase text-[#8E8E99]">
                  Nombre del Sello Discográfico:
                </label>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Ej: Mansión Records, La Cueva Discos..."
                  className="w-full max-w-md bg-[#18181C] border border-[#242429] text-[#F4F4F6] placeholder-[#52525B] font-sans text-sm px-3.5 py-2.5 rounded-[4px] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <button
                onClick={handleCreateOwnLabel}
                disabled={player.stats.funds < 25000 || player.stats.popularity < 40 || player.stats.reputation < 40}
                className={`px-5 py-2.5 rounded-[4px] text-xs font-sans font-bold transition-all ${
                  player.stats.funds >= 25000 && player.stats.popularity >= 40 && player.stats.reputation >= 40
                    ? 'bg-[#FF4F00] hover:bg-[#E04500] text-white active:translate-y-[1px] cursor-pointer'
                    : 'bg-[#18181C] text-[#52525B] border border-[#242429] cursor-not-allowed'
                }`}
              >
                Constituir Sello Discográfico • $25,000
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

