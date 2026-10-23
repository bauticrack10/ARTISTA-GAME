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
    <div className="space-y-6 pb-12 text-[#F4F0EA]">
      {/* Consolidated Header Banner & 3 Main Tabs */}
      <div className="bg-[#141417] p-5 sm:p-6 rounded-[6px] border border-[#26262B] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-2xs uppercase tracking-wider font-sans font-bold text-[#8E8E99] px-2 py-0.5 rounded-[4px] bg-[#1C1C21] border border-[#26262B]">
            Industria Musical
          </span>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#F4F0EA] tracking-tight">
            Sellos, Distribución & Representación
          </h1>
        </div>

        {/* 3 Main Tabs Navigation */}
        <div className="flex flex-wrap gap-1.5 bg-[#0B0B0C] p-1 rounded-[4px] border border-[#26262B] shrink-0">
          <button
            id="tab-btn-current"
            onClick={() => handleTabSwitch('current')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-colors cursor-pointer ${
              activeTab === 'current'
                ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
            }`}
          >
            Situación Actual
          </button>
          <button
            id="tab-btn-distribution"
            onClick={() => handleTabSwitch('distribution_labels')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-colors cursor-pointer ${
              activeTab === 'distribution_labels'
                ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
            }`}
          >
            Distribución & Sellos
          </button>
          <button
            id="tab-btn-managers"
            onClick={() => handleTabSwitch('managers')}
            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans font-bold transition-colors cursor-pointer ${
              activeTab === 'managers'
                ? 'bg-[#FF2A4B] text-[#F4F0EA]'
                : 'text-[#8E8E99] hover:text-[#F4F0EA] hover:bg-[#1C1C21]'
            }`}
          >
            Mercado de Managers
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="bg-[#141417] border border-[#FF2A4B]/40 text-[#F4F0EA] px-4 py-3 rounded-[4px] flex items-center gap-2 text-xs font-sans font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" strokeWidth={1.75} />
          <span>{notification}</span>
        </div>
      )}

      {/* TAB 1: SITUACIÓN ACTUAL (+ SELLO PROPIO INTEGRADO) */}
      {activeTab === 'current' && (
        <div className="space-y-5">
          {/* Card 1: Contrato Activo o Estado de Distribución */}
          <div className="bg-[#141417] border border-[#26262B] rounded-[6px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FF2A4B]" strokeWidth={1.75} />
                <h2 className="font-display text-base font-bold text-[#F4F0EA] tracking-tight">
                  Contrato / Distribución Actual
                </h2>
              </div>
              {currentLabel && activeContract ? (
                <span className="text-2xs font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
                  {isCurrentArtistOwned ? 'Sello Propio' : isCurrentDistributor ? 'Distribución Activa' : 'Contrato Vigente'}
                </span>
              ) : (
                <span className="text-2xs font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] bg-[#1C1C21] border border-[#26262B] text-[#8E8E99]">
                  Independiente
                </span>
              )}
            </div>

            {currentLabel && activeContract ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-[#F4F0EA]">
                        {currentLabel.name}
                      </h3>
                      <span className="text-2xs font-sans uppercase font-bold px-2 py-0.5 rounded-[4px] bg-[#1C1C21] border border-[#26262B] text-[#F4F0EA]">
                        {isCurrentArtistOwned ? 'Sello Propio' : isCurrentDistributor ? 'Distribuidora' : currentLabel.type === 'major' ? 'Major Label' : currentLabel.type === 'indie' ? 'Indie' : 'Sello Local'}
                      </span>
                    </div>
                    <p className="text-xs text-[#8E8E99] mt-1 font-sans tabular-nums">
                      {currentLabel.country} • Roster: {currentLabel.rosterArtistIds.length} artistas
                    </p>
                  </div>

                  <div className="text-left md:text-right text-xs text-[#8E8E99] font-sans tabular-nums shrink-0">
                    <span className="block font-bold text-[#F4F0EA]">Firmado en {activeContract.signedYear}</span>
                    <span>Duración: {activeContract.durationYears} {activeContract.durationYears === 1 ? 'año' : 'años'}</span>
                  </div>
                </div>

                {activeContract.albumsRequired > 0 && (
                  <div className="bg-[#0B0B0C] border border-[#26262B] p-3.5 rounded-[4px] space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="font-bold text-[#F4F0EA]">Compromiso de Álbumes:</span>
                      <span className="font-bold text-[#FF2A4B] tabular-nums">
                        {activeContract.albumsDelivered} / {activeContract.albumsRequired} entregados ({Math.min(100, Math.floor((activeContract.albumsDelivered / activeContract.albumsRequired) * 100))}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#1C1C21] h-1.5 rounded-[2px] overflow-hidden">
                      <div
                        className="bg-[#FF2A4B] h-full rounded-[2px] transition-all duration-300"
                        role="progressbar"
                        aria-label="Álbumes entregados del contrato"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(Number(Math.min(100, (activeContract.albumsDelivered / activeContract.albumsRequired) * 100)))}
                        style={{ width: `${Math.min(100, (activeContract.albumsDelivered / activeContract.albumsRequired) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-sans tabular-nums">
                  <div className="bg-[#0B0B0C] border border-[#26262B] p-3 rounded-[4px]">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] block">Regalías Artista</span>
                    <span className="text-base font-bold text-[#10B981]">{activeContract.royaltyPercentage}%</span>
                  </div>

                  <div className="bg-[#0B0B0C] border border-[#26262B] p-3 rounded-[4px]">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] block">Anticipo Cobrado</span>
                    <span className="text-base font-bold text-[#F4F0EA]">{formatMoney(activeContract.signingBonus)}</span>
                  </div>

                  <div className="bg-[#0B0B0C] border border-[#26262B] p-3 rounded-[4px]">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] block">Músculo Marketing</span>
                    <span className="text-base font-bold text-[#F4F0EA]">{activeContract.marketingPower}%</span>
                  </div>

                  <div className="bg-[#0B0B0C] border border-[#26262B] p-3 rounded-[4px]">
                    <span className="text-2xs uppercase tracking-wider text-[#52525B] block">Control Creativo</span>
                    <span className="text-base font-bold text-[#F4F0EA]">{activeContract.creativeControl}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0B0B0C] border border-[#26262B] p-4 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#F4F0EA]">
                    Artista 100% Independiente
                  </h3>
                  <p className="text-xs text-[#8E8E99]">
                    Retenés el 100% de tus regalías y másters, financiando cada lanzamiento con fondos propios.
                  </p>
                </div>
                <button
                  onClick={() => handleTabSwitch('distribution_labels')}
                  className="px-3.5 py-2 rounded-[4px] bg-[#1C1C21] hover:bg-[#26262B] border border-[#26262B] text-xs font-sans font-bold text-[#F4F0EA] transition-colors cursor-pointer shrink-0"
                >
                  Explorar Distribuidoras & Sellos →
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Representación Oficial (Manager) */}
          <div className="bg-[#141417] border border-[#26262B] rounded-[6px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#FF2A4B]" strokeWidth={1.75} />
                <h2 className="font-display text-base font-bold text-[#F4F0EA] tracking-tight">
                  Representación Oficial (Manager)
                </h2>
              </div>
              {currentManager && (
                <span className="text-2xs font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] bg-[#FF2A4B]/10 border border-[#FF2A4B]/30 text-[#FF2A4B]">
                  {tierNames[currentManager.tier]}
                </span>
              )}
            </div>

            {currentManager ? (
              <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-[#F4F0EA]">{currentManager.name}</h3>
                    <span className="text-2xs font-sans uppercase font-bold px-2 py-0.5 rounded-[4px] bg-[#1C1C21] border border-[#26262B] text-[#10B981] tabular-nums">
                      {currentManager.commissionFeePct}% Comisión
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E99] max-w-xl">
                    {currentManager.bio}
                  </p>
                  <p className="text-xs text-[#8E8E99] font-sans tabular-nums pt-0.5">
                    Negociación: <strong className="text-[#F4F0EA]">{currentManager.negotiationSkill}%</strong> • Contactos: <strong className="text-[#F4F0EA]">{currentManager.industryNetwork}%</strong> • {currentManager.specialties.join(' • ')}
                  </p>
                </div>

                <button
                  onClick={handleFireManager}
                  className="text-xs font-sans text-[#EF4444] hover:text-[#F4F0EA] font-semibold px-3 py-2 rounded-[4px] border border-[#EF4444]/30 hover:bg-[#EF4444]/20 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <UserMinus className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Finalizar Vínculo</span>
                </button>
              </div>
            ) : (
              <div className="bg-[#0B0B0C] p-4 rounded-[4px] border border-[#26262B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-[#F4F0EA] text-sm">Sin Representación Oficial</p>
                  <p className="text-xs text-[#8E8E99]">
                    Gestionás tus propios contratos y fechas sin pagar comisiones de management.
                  </p>
                </div>
                <button
                  onClick={() => handleTabSwitch('managers')}
                  className="px-3.5 py-2 rounded-[4px] bg-[#1C1C21] hover:bg-[#26262B] border border-[#26262B] text-xs font-sans font-bold text-[#F4F0EA] transition-colors cursor-pointer shrink-0"
                >
                  Contratar Manager →
                </button>
              </div>
            )}
          </div>

          {/* Card 3: Sello Propio (Integrado directamente en Situación Actual) */}
          <div className="bg-[#141417] border border-[#26262B] rounded-[6px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#F59E0B]" strokeWidth={1.75} />
                <div>
                  <h2 className="font-display text-base font-bold text-[#F4F0EA] tracking-tight">
                    Sello Discográfico Propio
                  </h2>
                  <p className="text-xs text-[#8E8E99]">
                    95% de regalías netas y 100% de propiedad de tus másters sin adelantos a recuperar.
                  </p>
                </div>
              </div>
              {isCurrentArtistOwned && (
                <span className="text-2xs font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
                  Activo
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-sans tabular-nums">
              <div className="p-2.5 bg-[#0B0B0C] rounded-[4px] border border-[#26262B] flex items-center justify-between">
                <span className="text-2xs uppercase text-[#52525B]">Capital ($25k):</span>
                <span className={`font-bold flex items-center gap-1 ${player.stats.funds >= 25000 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                  {player.stats.funds >= 25000 ? <Check className="w-3 h-3" strokeWidth={1.75} /> : <Lock className="w-3 h-3" strokeWidth={1.75} />}
                  {formatMoney(player.stats.funds)}
                </span>
              </div>
              <div className="p-2.5 bg-[#0B0B0C] rounded-[4px] border border-[#26262B] flex items-center justify-between">
                <span className="text-2xs uppercase text-[#52525B]">Popularidad (40+):</span>
                <span className={`font-bold flex items-center gap-1 ${player.stats.popularity >= 40 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                  {player.stats.popularity >= 40 ? <Check className="w-3 h-3" strokeWidth={1.75} /> : <Lock className="w-3 h-3" strokeWidth={1.75} />}
                  {player.stats.popularity}/100
                </span>
              </div>
              <div className="p-2.5 bg-[#0B0B0C] rounded-[4px] border border-[#26262B] flex items-center justify-between">
                <span className="text-2xs uppercase text-[#52525B]">Reputación (40+):</span>
                <span className={`font-bold flex items-center gap-1 ${player.stats.reputation >= 40 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                  {player.stats.reputation >= 40 ? <Check className="w-3 h-3" strokeWidth={1.75} /> : <Lock className="w-3 h-3" strokeWidth={1.75} />}
                  {player.stats.reputation}/100
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Nombre de tu sello (ej: Mansión Records)..."
                className="flex-1 bg-[#0B0B0C] border border-[#26262B] text-[#F4F0EA] placeholder-[#52525B] font-sans text-xs px-3 py-2 rounded-[4px] focus:outline-none focus:border-[#FF2A4B]"
              />
              <button
                onClick={handleCreateOwnLabel}
                disabled={player.stats.funds < 25000 || player.stats.popularity < 40 || player.stats.reputation < 40}
                className={`px-4 py-2 rounded-[4px] text-xs font-sans font-bold transition-all shrink-0 ${
                  player.stats.funds >= 25000 && player.stats.popularity >= 40 && player.stats.reputation >= 40
                    ? 'bg-[#FF2A4B] hover:bg-[#E01E3D] text-[#F4F0EA] active:translate-y-[1px] cursor-pointer'
                    : 'bg-[#1C1C21] text-[#52525B] border border-[#26262B] cursor-not-allowed'
                }`}
              >
                Constituir Sello • $25,000
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISTRIBUCIÓN & SELLOS (+ RESUMEN COMPACTO DE RADAR A&R) */}
      {activeTab === 'distribution_labels' && (
        <div className="space-y-5">
          {/* Compact A&R Radar + Filter Bar */}
          <div className="bg-[#141417] border border-[#26262B] rounded-[6px] p-5 space-y-4">
            {/* Compact A&R Radar Summary */}
            <div className="bg-[#0B0B0C] p-3.5 rounded-[4px] border border-[#26262B] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#FF2A4B]" strokeWidth={1.75} />
                  <span className="font-bold text-[#F4F0EA]">
                    Radar de A&R (Majors: 100k oyentes):
                  </span>
                  <span className="text-[#8E8E99] tabular-nums">
                    {scoutRadar.monthlyListeners.toLocaleString()} / {scoutRadar.thresholdListeners.toLocaleString()} ({scoutRadar.progressPercentage}%)
                  </span>
                </div>
                <span className="text-2xs font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#FF2A4B]/10 border border-[#FF2A4B]/30 text-[#FF2A4B] w-fit">
                  {scoutRadar.scoutInterestLevel === 'bidding_war_target'
                    ? 'Guerra de Fichajes'
                    : scoutRadar.scoutInterestLevel === 'high_priority'
                    ? 'Interés Alto'
                    : scoutRadar.scoutInterestLevel === 'emerging_scouting'
                    ? 'En Seguimiento'
                    : 'En Desarrollo'}
                </span>
              </div>

              <div className="w-full bg-[#1C1C21] h-1.5 rounded-[2px] overflow-hidden">
                <div
                  className="bg-[#FF2A4B] h-full rounded-[2px] transition-all duration-300"
                  role="progressbar"
                  aria-label="Progreso hacia el umbral de scouting"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(Number(scoutRadar.progressPercentage))}
                  style={{ width: `${scoutRadar.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 font-sans">
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
                    className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-colors cursor-pointer ${
                      distFilter === f.id
                        ? 'bg-[#F4F0EA] text-[#0B0B0C]'
                        : 'bg-[#0B0B0C] text-[#8E8E99] border border-[#26262B] hover:border-[#3F3F46] hover:text-[#F4F0EA]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#8E8E99] font-sans tabular-nums">
                Tus oyentes: <strong className="text-[#F4F0EA]">{player.stats.monthlyListeners.toLocaleString()}</strong>/mes
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistOptions.map((opt) => {
              const isUnlocked = player.stats.monthlyListeners >= opt.minListeners;
              const isCurrent = player.labelId === opt.id;
              const hasListeners = player.stats.monthlyListeners >= opt.minListeners;

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
                  className={`bg-[#141417] rounded-[6px] p-4 border transition-all space-y-3.5 flex flex-col justify-between ${
                    isCurrent
                      ? 'border-[#10B981]'
                      : isUnlocked
                      ? 'border-[#26262B] hover:border-[#3F3F46]'
                      : 'border-[#26262B] opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-[4px] bg-[#1C1C21] border border-[#26262B] text-[#F4F0EA] flex items-center justify-center shrink-0">
                          {renderOptionIcon(opt.iconType)}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-[#F4F0EA] leading-snug">
                            {opt.name}
                          </h3>
                          <span className="text-2xs uppercase font-sans font-bold text-[#8E8E99] block">
                            {opt.typeLabel}
                          </span>
                        </div>
                      </div>

                      {hasListeners ? (
                        <span className="flex items-center gap-1 text-2xs font-sans font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-[4px] border border-[#10B981]/30 shrink-0 tabular-nums">
                          <Check className="w-3 h-3 text-[#10B981]" strokeWidth={1.75} />
                          {opt.minListeners === 0 ? 'Abierto' : `${formatCompactNumber(opt.minListeners)}`}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-2xs font-sans font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-[4px] border border-[#F59E0B]/30 shrink-0 tabular-nums">
                          <Lock className="w-3 h-3 text-[#F59E0B]" strokeWidth={1.75} />
                          {formatCompactNumber(opt.minListeners)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#8E8E99] leading-relaxed line-clamp-2">
                      {opt.description}
                    </p>

                    <div className="bg-[#0B0B0C] p-2.5 rounded-[4px] border border-[#26262B] grid grid-cols-2 gap-2 text-xs font-sans tabular-nums">
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Regalías:</span>
                        <span className="font-bold text-[#10B981]">{dynamicOffer.royaltyPercentage}%</span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Anticipo:</span>
                        <span className={`font-bold ${displayAdvance > 0 ? 'text-[#10B981]' : 'text-[#F4F0EA]'}`}>
                          {displayAdvance > 0 ? formatMoney(displayAdvance) : '$0'}
                        </span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Marketing:</span>
                        <span className="font-bold text-[#F4F0EA]">
                          {dynamicOffer.marketingBudgetPerRelease && dynamicOffer.marketingBudgetPerRelease > 0
                            ? `${formatMoney(dynamicOffer.marketingBudgetPerRelease)}/lanz.`
                            : opt.annualFee > 0
                            ? `$${opt.annualFee}/año`
                            : `${opt.marketingPower}%`}
                        </span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Compromiso:</span>
                        <span className="font-bold text-[#F4F0EA]">
                          {dynamicOffer.albumsRequired > 0 ? `${dynamicOffer.albumsRequired} Álbumes` : 'Libre'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="w-full text-center py-2 bg-[#10B981]/10 text-[#10B981] font-sans font-bold text-xs rounded-[4px] border border-[#10B981]/30">
                        Contrato Actual
                      </div>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleSignOption(opt)}
                        className="w-full bg-[#FF2A4B] hover:bg-[#E01E3D] text-[#F4F0EA] font-sans font-bold text-xs py-2 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer"
                      >
                        {opt.category === 'distributor' ? 'Distribuir Aquí' : 'Firmar Contrato'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#0B0B0C] text-[#52525B] font-sans font-medium text-xs py-2 rounded-[4px] border border-[#26262B] cursor-not-allowed flex items-center justify-center gap-1.5 tabular-nums"
                      >
                        <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>Faltan {(opt.minListeners - player.stats.monthlyListeners).toLocaleString()} oyentes</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MERCADO DE MANAGERS */}
      {activeTab === 'managers' && (
        <div className="space-y-5">
          {/* Compact Tier Filter Bar */}
          <div className="bg-[#141417] border border-[#26262B] rounded-[6px] p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 font-sans">
              <button
                onClick={() => {
                  playSound('click');
                  setManagerTierFilter('all');
                }}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-colors cursor-pointer ${
                  managerTierFilter === 'all'
                    ? 'bg-[#F4F0EA] text-[#0B0B0C]'
                    : 'bg-[#0B0B0C] text-[#8E8E99] border border-[#26262B] hover:border-[#3F3F46] hover:text-[#F4F0EA]'
                }`}
              >
                Todos
              </button>
              {(['underground', 'regional', 'national', 'elite_global'] as ManagerTier[]).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    playSound('click');
                    setManagerTierFilter(t);
                  }}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-colors cursor-pointer ${
                    managerTierFilter === t
                      ? 'bg-[#F4F0EA] text-[#0B0B0C]'
                      : 'bg-[#0B0B0C] text-[#8E8E99] border border-[#26262B] hover:border-[#3F3F46] hover:text-[#F4F0EA]'
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
                  className={`bg-[#141417] rounded-[6px] p-4 border transition-all space-y-3.5 flex flex-col justify-between ${
                    isHired
                      ? 'border-[#10B981]'
                      : check.canHire
                      ? 'border-[#26262B] hover:border-[#3F3F46]'
                      : 'border-[#26262B] opacity-75'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-[4px] bg-[#1C1C21] border border-[#26262B] text-[#F4F0EA] font-sans font-bold text-sm flex items-center justify-center">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-[#F4F0EA]">{m.name}</h3>
                          <span className="text-2xs uppercase font-sans font-bold text-[#8E8E99]">
                            {tierNames[m.tier]}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-[4px] bg-[#1C1C21] border border-[#26262B] text-[#F4F0EA] tabular-nums">
                        {m.commissionFeePct}% Comisión
                      </span>
                    </div>

                    <p className="text-xs text-[#8E8E99] leading-relaxed line-clamp-2">
                      {m.bio}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#26262B] text-center text-xs font-sans tabular-nums">
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Reputación</span>
                        <span className="font-bold text-[#F4F0EA]">{m.reputation}%</span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Negociación</span>
                        <span className="font-bold text-[#F4F0EA]">{m.negotiationSkill}%</span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Contactos</span>
                        <span className="font-bold text-[#F4F0EA]">{m.industryNetwork}%</span>
                      </div>
                    </div>

                    <div className="bg-[#0B0B0C] p-2.5 rounded-[4px] border border-[#26262B] grid grid-cols-3 gap-2 text-xs font-sans tabular-nums">
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Oyentes</span>
                        <span className={`font-bold flex items-center gap-1 ${hasListeners ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                          {hasListeners ? <Check className="w-3 h-3" strokeWidth={1.75} /> : <Lock className="w-3 h-3" strokeWidth={1.75} />}
                          {formatCompactNumber(m.requirements.minMonthlyListeners)}
                        </span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Reputación</span>
                        <span className={`font-bold flex items-center gap-1 ${hasRep ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                          {hasRep ? <Check className="w-3 h-3" strokeWidth={1.75} /> : <Lock className="w-3 h-3" strokeWidth={1.75} />}
                          {m.requirements.minReputation}%
                        </span>
                      </div>
                      <div>
                        <span className="text-2xs uppercase text-[#52525B] block">Tarifa</span>
                        <span className={`font-bold flex items-center gap-1 ${hasFunds ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                          {hasFunds ? <Check className="w-3 h-3" strokeWidth={1.75} /> : <Lock className="w-3 h-3" strokeWidth={1.75} />}
                          {formatMoney(m.requirements.hiringFee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isHired ? (
                      <div className="w-full text-center py-2 bg-[#10B981]/10 text-[#10B981] font-sans font-bold text-xs rounded-[4px] border border-[#10B981]/30">
                        Representante Actual
                      </div>
                    ) : check.canHire ? (
                      <button
                        onClick={() => handleHireManager(m)}
                        className="w-full bg-[#FF2A4B] hover:bg-[#E01E3D] text-[#F4F0EA] font-sans font-bold text-xs py-2 rounded-[4px] active:translate-y-[1px] transition-all cursor-pointer tabular-nums"
                      >
                        Contratar • {formatMoney(m.requirements.hiringFee)}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#0B0B0C] text-[#52525B] font-sans font-medium text-xs py-2 rounded-[4px] border border-[#26262B] cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" strokeWidth={1.75} /> Requisitos Bloqueados
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

