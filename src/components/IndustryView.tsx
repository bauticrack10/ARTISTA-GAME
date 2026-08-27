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
    description: 'Cuota anual gratuita ($0). 85% de regalías directas para el artista y 15% de comisión por streaming. 100% de propiedad de másters.',
    gradient: 'from-blue-600 to-indigo-900',
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
    description: 'Cuota anual plana de $20. 100% de regalías discográficas para el artista y 0% de comisión. Lanzamientos ilimitados en todas las plataformas.',
    gradient: 'from-cyan-600 to-blue-900',
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
    description: 'Cuota anual de $35. 100% de regalías, herramientas avanzadas de pre-save y pitch directo a curadores editoriales de playlists.',
    gradient: 'from-emerald-600 to-teal-900',
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
    advance: 2000,
    creativeControl: 85,
    marketingPower: 58,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Sello independiente barrial que impulsa talentos emergentes desde 5k oyentes con apoyo de producción local y $2.000 de anticipo.',
    gradient: 'from-amber-600 to-stone-900',
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
    advance: 8000,
    creativeControl: 98,
    marketingPower: 48,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Colectivo subterráneo de culto enfocado en trap, rap y drill con máxima libertad artística (98%) y anticipo de $8.000.',
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
    advance: 5000,
    creativeControl: 80,
    marketingPower: 68,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Sello indie consolidado en la escena local con anticipo de $5.000, conexión con festivales locales y prensa especializada.',
    gradient: 'from-purple-600 to-rose-900',
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
    advance: 30000,
    creativeControl: 95,
    marketingPower: 75,
    durationYears: 2,
    albumsRequired: 1,
    description: 'Sello boutique de culto internacional enfocado en innovación sonora y proyectos de alta trascendencia crítica.',
    gradient: 'from-teal-600 to-cyan-950',
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
    advance: 45000,
    creativeControl: 82,
    marketingPower: 88,
    durationYears: 3,
    albumsRequired: 2,
    description: 'Sello independiente líder del movimiento urbano argentino. Gran balance entre presupuesto, regalías justas y libertad conceptual.',
    gradient: 'from-violet-600 to-purple-950',
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
    advance: 120000,
    creativeControl: 78,
    marketingPower: 95,
    durationYears: 3,
    albumsRequired: 2,
    description: 'Independencia masiva a escala global. Visión de vanguardia en streaming mundial, estadios y retención del control del artista.',
    gradient: 'from-pink-600 to-rose-950',
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
    advance: 180000,
    creativeControl: 55,
    marketingPower: 89,
    durationYears: 4,
    albumsRequired: 3,
    description: 'Enfoque en dominar los charts hispanohablantes con giras masivas, festivales internacionales y gran marketing.',
    gradient: 'from-amber-600 to-red-950',
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
    advance: 250000,
    creativeControl: 40,
    marketingPower: 96,
    durationYears: 4,
    albumsRequired: 3,
    description: 'Coloso discográfico con alcance radial mundial y máxima maquinaria de difusión a cambio de menores regalías directas.',
    gradient: 'from-blue-700 to-indigo-950',
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
    advance: 300000,
    creativeControl: 45,
    marketingPower: 98,
    durationYears: 4,
    albumsRequired: 3,
    description: 'Líder de la industria musical mundial. Presupuestos millonarios de marketing y colocación en playlists de primer orden.',
    gradient: 'from-purple-700 to-black',
    iconType: 'crown'
  }
];

export const IndustryView: React.FC<IndustryViewProps> = ({
  player,
  world,
  onSignContract,
  onHireManager
}) => {
  const [activeTab, setActiveTab] = useState<IndustryTab>('current');
  const [distFilter, setDistFilter] = useState<DistributionFilter>('all');
  const [managerTierFilter, setManagerTierFilter] = useState<ManagerTier | 'all'>('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [newLabelName, setNewLabelName] = useState<string>('');

  const currentLabel = player.labelId ? world.labels[player.labelId] : null;
  const currentManager = player.managerId ? world.managers[player.managerId] : null;
  const activeContract = player.activeContract;
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
    const contract = targetLabel
      ? IndustryEngine.generateDynamicLabelOffer(player, targetLabel, world.currentYear)
      : {
          labelId: option.id,
          signingBonus: option.advance,
          royaltyPercentage: option.royaltyPct,
          albumsRequired: option.albumsRequired,
          albumsDelivered: 0,
          creativeControl: option.creativeControl,
          marketingPower: option.marketingPower,
          marketingBudgetPerRelease: Math.max(5000, Math.floor(option.advance * 0.2)),
          breakoutClause: option.advance > 0 ? option.advance * 2 : 5000,
          durationYears: option.durationYears,
          signedYear: world.currentYear,
          isDistributor: option.category === 'distributor',
          annualFee: option.annualFee
        };

    onSignContract(contract);
    playSound('money');
    setNotification(
      option.category === 'distributor'
        ? `¡Distribución configurada! Tu música ahora se distribuye globalmente con ${option.name}.`
        : `¡Contrato discográfico firmado con éxito con ${option.name}! Anticipo cobrado: ${formatMoney(option.advance)}.`
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
    IndustryEngine.fireManager(player, world);
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
    <div
      className="space-y-6 pb-12 font-sans text-[#F8FAFC]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Consolidated Header Banner & Navigation */}
      <div className="bg-[#16181F] p-6 sm:p-8 rounded-[12px] border border-[#2A2E3D] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 shadow-md backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#94A3B8] px-2.5 py-0.5 rounded-[9999px] bg-white/[0.04] border border-[#2A2E3D]">
              Industria Musical
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#F8FAFC] tracking-tight mt-1.5">
            Representación, Sellos & Mercado de Fichajes
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-2xl">
            Gestioná tus acuerdos discográficos, distribuí tu música en plataformas globales, monitoreá el radar de cazatalentos (A&R) y contratá managers por tiers de requisitos.
          </p>
        </div>

        {/* Unified Top Tabs Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 xl:pt-0 shrink-0">
          <button
            id="tab-btn-current"
            onClick={() => handleTabSwitch('current')}
            className={`px-3.5 py-2 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'current'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
            }`}
          >
            Situación Actual
          </button>
          <button
            id="tab-btn-distribution"
            onClick={() => handleTabSwitch('distribution_labels')}
            className={`px-3.5 py-2 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'distribution_labels'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
            }`}
          >
            Distribución & Sellos
          </button>
          <button
            id="tab-btn-radar"
            onClick={() => handleTabSwitch('radar')}
            className={`px-3.5 py-2 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
            }`}
          >
            Radar de A&R
          </button>
          <button
            id="tab-btn-managers"
            onClick={() => handleTabSwitch('managers')}
            className={`px-3.5 py-2 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'managers'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
            }`}
          >
            Mercado de Managers
          </button>
          <button
            id="tab-btn-own-label"
            onClick={() => handleTabSwitch('own_label')}
            className={`px-3.5 py-2 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'own_label'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
            }`}
          >
            Sello Propio
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="bg-[#16181F] border border-[#8B5CF6]/40 text-[#F8FAFC] px-4 py-3 rounded-[8px] flex items-center gap-2 text-xs font-medium shadow-md animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TAB 1: SITUACIÓN ACTUAL */}
      {activeTab === 'current' && (
        <div className="space-y-6">
          {/* Card 1: Contrato Activo o Estado de Distribución */}
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-5 shadow-md">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#8B5CF6]" />
                <h2 className="text-lg font-semibold text-[#F8FAFC]">
                  Contrato / Distribución Actual
                </h2>
              </div>
              {currentLabel && activeContract ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-[9999px] bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]">
                  {isCurrentArtistOwned ? 'Sello Propio' : isCurrentDistributor ? 'Distribución Activa' : 'Contrato Vigente'}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-[9999px] bg-white/[0.04] border border-[#2A2E3D] text-[#94A3B8]">
                  Agente Libre / Independiente
                </span>
              )}
            </div>

            {currentLabel && activeContract ? (
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B0C10] p-5 rounded-[8px] border border-[#2A2E3D]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl font-semibold text-[#F8FAFC]">
                        {currentLabel.name}
                      </h3>
                      <span className="text-[11px] uppercase font-semibold px-2.5 py-0.5 rounded-[4px] bg-white/[0.06] border border-[#2A2E3D] text-[#F8FAFC]">
                        {isCurrentArtistOwned ? 'Sello Propio (Autogestionado)' : isCurrentDistributor ? 'Distribuidora Digital' : currentLabel.type === 'major' ? 'Major Label' : currentLabel.type === 'indie' ? 'Sello Indie' : 'Sello Local / Boutique'}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1.5">
                      {currentLabel.country} • Roster de artistas: {currentLabel.rosterArtistIds.length} integrantes
                    </p>
                  </div>

                  <div className="text-left md:text-right text-xs text-[#94A3B8] shrink-0">
                    <span className="block font-medium text-[#F8FAFC]">Firmado en {activeContract.signedYear}</span>
                    <span>Duración: {activeContract.durationYears} {activeContract.durationYears === 1 ? 'año' : 'años'}</span>
                  </div>
                </div>

                {/* Progress bar of Albums (if applicable) */}
                {activeContract.albumsRequired > 0 && (
                  <div className="bg-[#0B0C10] border border-[#2A2E3D] p-4 rounded-[8px] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F8FAFC]">Compromiso de Álbumes de Estudio:</span>
                      <span className="font-semibold text-[#F8FAFC]">
                        {activeContract.albumsDelivered} de {activeContract.albumsRequired} Entregados ({Math.min(100, Math.floor((activeContract.albumsDelivered / activeContract.albumsRequired) * 100))}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#16181F] h-2 rounded-[9999px] overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] h-full rounded-[9999px] transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        style={{ width: `${Math.min(100, (activeContract.albumsDelivered / activeContract.albumsRequired) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">
                      Al completar todos los álbumes exigidos, el contrato se considerará cumplido y quedarás en libertad para renovar o cambiar de entidad.
                    </p>
                  </div>
                )}

                {/* Terms Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#0B0C10] border border-[#2A2E3D] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#94A3B8] block">Regalías Artista</span>
                    <span className="text-lg font-semibold text-[#F8FAFC]">{activeContract.royaltyPercentage}%</span>
                    <span className="text-[10px] text-[#94A3B8] block">({100 - activeContract.royaltyPercentage}% para la entidad)</span>
                  </div>

                  <div className="bg-[#0B0C10] border border-[#2A2E3D] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#94A3B8] block">Anticipo Cobrado</span>
                    <span className="text-lg font-semibold text-[#F8FAFC]">{formatMoney(activeContract.signingBonus)}</span>
                    <span className="text-[10px] text-[#94A3B8] block">Firma inicial</span>
                  </div>

                  <div className="bg-[#0B0C10] border border-[#2A2E3D] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#94A3B8] block">Músculo de Marketing</span>
                    <span className="text-lg font-semibold text-[#F8FAFC]">{activeContract.marketingPower}%</span>
                    <span className="text-[10px] text-[#94A3B8] block">Potencia promocional</span>
                  </div>

                  <div className="bg-[#0B0C10] border border-[#2A2E3D] p-3.5 rounded-[8px] space-y-1">
                    <span className="text-xs text-[#94A3B8] block">Control Creativo</span>
                    <span className="text-lg font-semibold text-[#F8FAFC]">{activeContract.creativeControl}%</span>
                    <span className="text-[10px] text-[#94A3B8] block">Libertad de dirección</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#0B0C10] border border-[#2A2E3D] p-5 rounded-[8px] space-y-2">
                  <h3 className="text-base font-semibold text-[#F8FAFC]">
                    Artista 100% Independiente (Agente Libre)
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Conservás el <strong className="text-[#F8FAFC]">100% de tus regalías de streaming</strong> y la propiedad absoluta de todos tus másters. Los costos de producción y marketing dependen exclusivamente de tus propios fondos.
                  </p>
                </div>

                <div className="p-4 bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] text-xs text-[#94A3B8] space-y-1">
                  <span className="font-semibold text-[#F8FAFC] block">Opciones en la Industria:</span>
                  <p>
                    Podés elegir una distribuidora digital abierta desde la pestaña <strong className="text-[#F8FAFC]">Distribución & Sellos</strong> en la barra superior o esperar a recibir ofertas exclusivas mediante el <strong className="text-[#F8FAFC]">Radar de A&R</strong> al superar los 100.000 oyentes mensuales.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Representación Oficial (Manager) */}
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#8B5CF6]" />
                <h2 className="text-lg font-semibold text-[#F8FAFC]">
                  Representación Oficial (Manager)
                </h2>
              </div>
              {currentManager && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-[9999px] bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-purple-300">
                  {tierNames[currentManager.tier]}
                </span>
              )}
            </div>

            {currentManager ? (
              <div className="bg-[#0B0C10] p-5 rounded-[8px] border border-[#2A2E3D] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[#F8FAFC]">{currentManager.name}</h3>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[9999px] bg-white/[0.06] border border-[#2A2E3D] text-[#F8FAFC]">
                      {currentManager.commissionFeePct}% Comisión
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] max-w-xl">
                    {currentManager.bio}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] pt-1">
                    <strong className="text-[#F8FAFC]">Especialidades:</strong> {currentManager.specialties.join(' • ')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="text-left md:text-right text-xs">
                    <span className="font-semibold text-[#F8FAFC] block">{currentManager.commissionFeePct}% Comisión</span>
                    <span className="text-[#94A3B8]">Negociación: {currentManager.negotiationSkill}% • Contactos: {currentManager.industryNetwork}%</span>
                  </div>
                  <button
                    onClick={handleFireManager}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3.5 py-2 rounded-[6px] border border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    Finalizar Vínculo
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#0B0C10] p-5 rounded-[8px] border border-[#2A2E3D] text-xs text-[#94A3B8] space-y-1">
                <p className="font-semibold text-[#F8FAFC] text-sm">Sin Representación Oficial</p>
                <p>
                  Actualmente gestionás tus propios contactos y fechas sin pagar comisiones de management. Podés contratar un representante calificado desde la pestaña <strong className="text-[#F8FAFC]">Mercado de Managers</strong> en la barra superior.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISTRIBUCIÓN & SELLOS (LA ESCALERA COMPLETA) */}
      {activeTab === 'distribution_labels' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-4 shadow-md">
            <div>
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                Escalera de Distribución & Sellos Discográficos
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Elegí el modelo de distribución adecuado según tu tracción de oyentes mensuales, objetivos de regalías y respaldo promocional.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'distributor', label: 'Distribuidoras (0k+)' },
                { id: 'local', label: 'Sellos Locales (5k+)' },
                { id: 'indie', label: 'Indies (25k+)' },
                { id: 'major', label: 'Majors (100k+)' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    playSound('click');
                    setDistFilter(f.id as DistributionFilter);
                  }}
                  className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
                    distFilter === f.id
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                      : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
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
              const isCurrent = player.labelId === opt.id;
              const hasListeners = player.stats.monthlyListeners >= opt.minListeners;
              const canAffordAnnual = !opt.annualFee || player.stats.funds >= opt.annualFee;
              const isUnlocked = hasListeners && canAffordAnnual;

              return (
                <div
                  key={opt.id}
                  className={`bg-[#16181F] rounded-[12px] p-5 border transition-all space-y-4 flex flex-col justify-between shadow-md ${
                    isCurrent
                      ? 'border-[#10B981] ring-1 ring-[#10B981]'
                      : isUnlocked
                      ? 'border-[#2A2E3D] hover:border-[#8B5CF6]/60'
                      : 'border-[#2A2E3D] opacity-80'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-[8px] bg-gradient-to-tr ${opt.gradient} text-white flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {renderOptionIcon(opt.iconType)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[#F8FAFC] leading-snug">
                            {opt.name}
                          </h3>
                          <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">
                            {opt.typeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Requirement badge */}
                      {hasListeners ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-[9999px] border border-[#10B981]/30 shrink-0">
                          <Check className="w-3 h-3 text-[#10B981]" />
                          {opt.minListeners === 0 ? 'Abierto' : `${formatCompactNumber(opt.minListeners)}`}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-[9999px] border border-amber-400/20 shrink-0">
                          <Lock className="w-3 h-3 text-amber-400" />
                          {formatCompactNumber(opt.minListeners)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#94A3B8] leading-relaxed min-h-[36px]">
                      {opt.description}
                    </p>

                    {/* Key Terms Grid */}
                    <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-[#2A2E3D] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Regalías Artista:</span>
                        <span className="font-semibold text-[#F8FAFC]">{opt.royaltyPct}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Anticipo:</span>
                        <span className="font-semibold text-[#F8FAFC]">
                          {opt.advance > 0 ? formatMoney(opt.advance) : '$0'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Cuota Anual:</span>
                        <span className="font-semibold text-[#F8FAFC]">
                          {opt.annualFee > 0 ? `$${opt.annualFee}/año` : 'Gratis'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Control Creativo:</span>
                        <span className="font-semibold text-[#F8FAFC]">{opt.creativeControl}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Marketing Power:</span>
                        <span className="font-semibold text-[#F8FAFC]">{opt.marketingPower}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Exigencia:</span>
                        <span className="font-semibold text-[#F8FAFC]">
                          {opt.albumsRequired > 0 ? `${opt.albumsRequired} Álbumes` : 'Sin entregas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {isCurrent ? (
                      <div className="w-full text-center py-2.5 bg-[#10B981]/15 text-[#10B981] font-semibold text-xs rounded-[6px] border border-[#10B981]/30">
                        Contrato Actual
                      </div>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleSignOption(opt)}
                        className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-xs py-2.5 rounded-[6px] shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        {opt.category === 'distributor' ? 'Distribuir Aquí' : 'Firmar Contrato'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#0B0C10] text-[#64748B] font-medium text-xs py-2.5 rounded-[6px] border border-[#2A2E3D] cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Bloqueado (Faltan {(opt.minListeners - player.stats.monthlyListeners).toLocaleString()} oyentes)
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
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-5 shadow-md">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#8B5CF6]" />
                <div>
                  <h2 className="text-lg font-semibold text-[#F8FAFC]">
                    Radar de Cazatalentos & Scouting (A&R)
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Monitoreo en tiempo real del interés de directivos discográficos nacionales e internacionales.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-[9999px] bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-purple-300">
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
            <div className="bg-[#0B0C10] p-5 rounded-[8px] border border-[#2A2E3D] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-semibold text-[#F8FAFC]">
                  Umbral de Fichaje Profesional (Mínimo 100.000 Oyentes Mensuales):
                </span>
                <span className="font-semibold text-[#F8FAFC]">
                  {scoutRadar.monthlyListeners.toLocaleString()} / {scoutRadar.thresholdListeners.toLocaleString()} ({scoutRadar.progressPercentage}%)
                </span>
              </div>

              <div className="w-full bg-[#16181F] h-3 rounded-[9999px] overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#06B6D4] h-full rounded-[9999px] transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  style={{ width: `${scoutRadar.progressPercentage}%` }}
                />
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {scoutRadar.statusMessage}
              </p>
            </div>

            {/* Rules explanation */}
            <div className="p-4 bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] text-xs text-[#94A3B8] space-y-1.5">
              <p className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#8B5CF6]" /> Dinámica del Mercado de Fichajes
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li><strong className="text-[#F8FAFC]">Monitoreo Automático:</strong> Los directivos de A&R evalúan tu crecimiento orgánico y repercusión en charts.</li>
                <li><strong className="text-[#F8FAFC]">Eventos Emergentes (Pop-ups):</strong> Al alcanzar el umbral de oyentes, se dispararán eventos narrativos competitivos con ofertas millonarias contrastadas.</li>
                <li><strong className="text-[#F8FAFC]">Autonomía:</strong> Siempre podés rechazar ofertas para mantener tu sello independiente o distribución abierta.</li>
              </ul>
            </div>
          </div>

          {/* Active Scouting Labels List */}
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-4 shadow-md">
            <h3 className="text-base font-semibold text-[#F8FAFC] border-b border-[#2A2E3D] pb-3">
              Sellos Discográficos en Seguimiento ({scoutRadar.scoutingLabels.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoutRadar.scoutingLabels.map(label => (
                <div key={label.id} className="bg-[#0B0C10] p-4 rounded-[8px] border border-[#2A2E3D] space-y-2 flex flex-col justify-between hover:border-[#8B5CF6]/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#F8FAFC]">{label.name}</h4>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[4px] bg-white/[0.06] border border-[#2A2E3D] text-[#F8FAFC]">
                        {label.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1">
                      {label.country} • Prestigio: {label.prestige}% • Músculo de Marketing: {label.marketingPower}%
                    </p>
                    <p className="text-xs text-[#F8FAFC] mt-2 leading-relaxed">
                      {label.scoutingCriteria || 'Busca talentos con fuerte identidad sonora e impacto en la audiencia.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#2A2E3D] flex items-center justify-between text-[11px] text-[#94A3B8]">
                    <span>Libertad Creativa: {label.creativeFreedomAllowed}%</span>
                    <span className="font-medium text-[#F8FAFC]">
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
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 space-y-4 shadow-md">
            <div>
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                Mercado de Managers & Representación
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Contratá al representante ideal según tu etapa de carrera. Cada nivel exige requisitos previos de audiencia, reputación y capital.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  playSound('click');
                  setManagerTierFilter('all');
                }}
                className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
                  managerTierFilter === 'all'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                    : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
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
                  className={`px-3.5 py-1.5 rounded-[9999px] text-xs font-semibold transition-all cursor-pointer ${
                    managerTierFilter === t
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                      : 'bg-[#0B0C10] text-[#94A3B8] border border-[#2A2E3D] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/40'
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
                  className={`bg-[#16181F] rounded-[12px] p-5 border transition-all space-y-4 flex flex-col justify-between shadow-md ${
                    isHired
                      ? 'border-[#10B981] bg-[#16181F] ring-1 ring-[#10B981]'
                      : check.canHire
                      ? 'border-[#2A2E3D] hover:border-[#8B5CF6]/60'
                      : 'border-[#2A2E3D] opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-[8px] bg-gradient-to-tr ${m.avatarGradient || 'from-stone-700 to-zinc-900'} text-[#F8FAFC] font-semibold text-sm flex items-center justify-center shadow-sm`}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[#F8FAFC]">{m.name}</h3>
                          <span className="text-[10px] uppercase font-semibold text-[#94A3B8]">
                            {tierNames[m.tier]}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded-[9999px] bg-white/[0.06] border border-[#2A2E3D] text-[#F8FAFC]">
                        {m.commissionFeePct}% Comisión
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {m.bio}
                    </p>

                    {/* Stats & Network */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#2A2E3D] text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Reputación</span>
                        <span className="font-semibold text-[#F8FAFC]">{m.reputation}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Negociación</span>
                        <span className="font-semibold text-[#F8FAFC]">{m.negotiationSkill}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Contactos</span>
                        <span className="font-semibold text-[#F8FAFC]">{m.industryNetwork}%</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="text-[11px] text-[#94A3B8]">
                      <span className="font-medium text-[#F8FAFC]">Especialidades: </span>
                      {m.specialties.join(' • ')}
                    </div>

                    {/* Requirements Checklist */}
                    <div className="bg-[#0B0C10] p-3 rounded-[8px] border border-[#2A2E3D] space-y-1.5 text-xs">
                      <span className="text-[11px] font-semibold text-[#F8FAFC] block">Requisitos Previos:</span>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#94A3B8]">Oyentes Mensuales:</span>
                        <span className={`font-medium flex items-center gap-1 ${hasListeners ? 'text-[#10B981]' : 'text-amber-400'}`}>
                          {hasListeners ? <Check className="w-3 h-3 text-[#10B981]" /> : <Lock className="w-3 h-3 text-amber-400" />}
                          {m.requirements.minMonthlyListeners.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#94A3B8]">Reputación Mínima:</span>
                        <span className={`font-medium flex items-center gap-1 ${hasRep ? 'text-[#10B981]' : 'text-amber-400'}`}>
                          {hasRep ? <Check className="w-3 h-3 text-[#10B981]" /> : <Lock className="w-3 h-3 text-amber-400" />}
                          {m.requirements.minReputation}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#94A3B8]">Tarifa de Contratación:</span>
                        <span className={`font-medium flex items-center gap-1 ${hasFunds ? 'text-[#10B981]' : 'text-amber-400'}`}>
                          {hasFunds ? <Check className="w-3 h-3 text-[#10B981]" /> : <Lock className="w-3 h-3 text-amber-400" />}
                          {formatMoney(m.requirements.hiringFee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {isHired ? (
                      <div className="w-full text-center py-2.5 bg-[#10B981]/15 text-[#10B981] font-semibold text-xs rounded-[6px] border border-[#10B981]/30">
                        Representante Actual
                      </div>
                    ) : check.canHire ? (
                      <button
                        onClick={() => handleHireManager(m)}
                        className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-xs py-2.5 rounded-[6px] shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Contratar Representante ({formatMoney(m.requirements.hiringFee)})
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#0B0C10] text-[#64748B] font-medium text-xs py-2.5 rounded-[6px] border border-[#2A2E3D] cursor-not-allowed flex items-center justify-center gap-1.5"
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
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-[12px] p-6 sm:p-8 space-y-6 shadow-md">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#F8FAFC]">
                Fundar tu Propio Sello Discográfico
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xl">
                Llegó el momento de tomar el control total de la cadena de valor musical. Fundar tu propio sello te permite retener el 95% de las regalías de streaming, autogestionar tus contratos y reclutar futuros artistas.
              </p>
            </div>

            <div className="bg-[#0B0C10] p-5 rounded-[8px] border border-[#2A2E3D] space-y-4">
              <h3 className="text-xs font-semibold text-[#F8FAFC]">Requisitos de Fundación:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#16181F] rounded-[6px] border border-[#2A2E3D]">
                  <span className="text-[#94A3B8] block">Inversión Legal Inicial:</span>
                  <span className={`font-semibold text-sm flex items-center gap-1 mt-0.5 ${player.stats.funds >= 25000 ? 'text-[#10B981]' : 'text-amber-400'}`}>
                    {player.stats.funds >= 25000 ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    $25,000 (Tenés {formatMoney(player.stats.funds)})
                  </span>
                </div>
                <div className="p-3 bg-[#16181F] rounded-[6px] border border-[#2A2E3D]">
                  <span className="text-[#94A3B8] block">Popularidad Mínima:</span>
                  <span className={`font-semibold text-sm flex items-center gap-1 mt-0.5 ${player.stats.popularity >= 40 ? 'text-[#10B981]' : 'text-amber-400'}`}>
                    {player.stats.popularity >= 40 ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    40 / 100 (Tenés {player.stats.popularity}/100)
                  </span>
                </div>
                <div className="p-3 bg-[#16181F] rounded-[6px] border border-[#2A2E3D]">
                  <span className="text-[#94A3B8] block">Reputación en la Escena:</span>
                  <span className={`font-semibold text-sm flex items-center gap-1 mt-0.5 ${player.stats.reputation >= 40 ? 'text-[#10B981]' : 'text-amber-400'}`}>
                    {player.stats.reputation >= 40 ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    40 / 100 (Tenés {player.stats.reputation}/100)
                  </span>
                </div>
              </div>

              {/* Input for name */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-[#F8FAFC]">
                  Nombre del Sello Discográfico:
                </label>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Ej: Mansión Records, La Cueva Discos..."
                  className="w-full max-w-md bg-[#0B0C10] border border-[#2A2E3D] text-[#F8FAFC] placeholder:text-[#64748B] text-sm px-3.5 py-2.5 rounded-[6px] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                />
              </div>

              <button
                onClick={handleCreateOwnLabel}
                disabled={player.stats.funds < 25000 || player.stats.popularity < 40 || player.stats.reputation < 40}
                className={`px-5 py-2.5 rounded-[6px] text-xs font-bold transition-all ${
                  player.stats.funds >= 25000 && player.stats.popularity >= 40 && player.stats.reputation >= 40
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-[0.98] cursor-pointer'
                    : 'bg-[#16181F] text-[#64748B] border border-[#2A2E3D] cursor-not-allowed'
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

