import React, { useState, useEffect, useRef } from 'react';
import { Artist, WorldState, CareerEra } from '../types';
import {
  Sparkles,
  Download,
  Share2,
  Check,
  X,
  Trophy,
  Flame,
  Award,
  Disc3,
  TrendingUp,
  Newspaper,
  Star,
  Layers,
  Palette,
  Copy,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCityCountry, cleanQuotes } from '../utils/formatters';

export type MagazinePreset = 'rolling_stone' | 'billboard' | 'underground_zine' | 'the_fader';

export interface EraMilestoneData {
  type: 'era_transition' | 'listeners_milestone' | 'gold_record' | 'chart_no1' | 'award_win' | 'sold_out_tour' | 'custom';
  title: string;
  headline?: string;
  subheadline?: string;
  eraName?: string;
  stage?: string;
  milestoneLabel?: string;
  statValue?: string;
  quote?: string;
  year: number;
  month?: number;
  coverPreset?: MagazinePreset;
}

interface EraMilestoneModalProps {
  milestone: EraMilestoneData;
  player: Artist;
  world: WorldState;
  onClose: () => void;
}

export const EraMilestoneModal: React.FC<EraMilestoneModalProps> = ({
  milestone,
  player,
  world,
  onClose
}) => {
  const [selectedPreset, setSelectedPreset] = useState<MagazinePreset>(
    milestone.coverPreset || (player.careerStage === 'Underground' ? 'underground_zine' : 'rolling_stone')
  );
  const [customHeadline, setCustomHeadline] = useState<string>(
    milestone.headline || getDefaultHeadline(milestone, player)
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const coverRef = useRef<HTMLDivElement | null>(null);

  // Trigger confetti explosion on open
  useEffect(() => {
    try {
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#06b6d4', '#f97316', '#ffd700']
      });
    } catch (e) {}
  }, []);

  function getDefaultHeadline(m: EraMilestoneData, p: Artist): string {
    switch (m.type) {
      case 'era_transition':
        return `EL REINADO DE UNA NUEVA ERA: CÓMO ${p.name.toUpperCase()} REESCRIBIÓ LAS REGLAS`;
      case 'listeners_milestone':
        return `FENÓMENO GLOBAL: ${p.name.toUpperCase()} SUPERA LOS ${m.statValue || '100,000'} OYENTES`;
      case 'gold_record':
        return `DE LA NADA AL DISCO DE ORO: EL HIT QUE CONSAGRÓ A ${p.name.toUpperCase()}`;
      case 'chart_no1':
        return `EN LA CIMA DEL MUNDO: ${p.name.toUpperCase()} ALCANZA EL #1 HISTÓRICO`;
      case 'award_win':
        return `LA CONSAGRACIÓN DEL AÑO: ${p.name.toUpperCase()} SE LLEVA LA ESTATUILLA`;
      case 'sold_out_tour':
        return `SOLD OUT TOTAL: LA GIRA MONUMENTAL DE ${p.name.toUpperCase()}`;
      default:
        return `${p.name.toUpperCase()}: LA NUEVA FUERZA QUE REVOLUCIONA LA MÚSICA`;
    }
  }

  const headlineSuggestions: string[] = [
    `EL REINADO DE UNA NUEVA ERA: CÓMO ${player.name.toUpperCase()} REESCRIBIÓ LAS REGLAS`,
    `FENÓMENO IMPARABLE: DE MAQUETAS CASERAS A LOS RANKINGS MUNDIALES`,
    `LA VOZ DE UNA GENERACIÓN: EL SONIDO INCONFUNDIBLE DE ${player.name.toUpperCase()}`,
    `EL HIT QUE CAMBIÓ TODO: ANATOMÍA DE UN ÉXITO SUBTERRÁNEO`,
    `LA REVOLUCIÓN SONORA: ¿EL MEJOR DISCO DE LA DÉCADA?`
  ];

  // Helper to format social text
  const getSocialShareText = (): string => {
    const genreName = world.genres[player.mainGenreId]?.name || player.mainGenreId;
    const location = formatCityCountry(player.city, player.country);
    return `🔥 ¡HITO HISTÓRICO EN "EL ARTISTA"! 🏆\n\n📰 Portada de Revista: ${getMagazineName(selectedPreset)}\n🌟 Artista: ${player.name} (${location})\n🎯 Logro: ${milestone.title}\n📊 ${milestone.milestoneLabel || 'Etapa'}: ${milestone.statValue || player.careerStage}\n🎵 Sonido: ${genreName}\n\n"${cleanQuotes(customHeadline)}"\n\n#ElArtista #MusicaIndie #${player.name.replace(/\s+/g, '')} #RollingStone #Billboard`;
  };

  const handleCopyShareText = async () => {
    try {
      await navigator.clipboard.writeText(getSocialShareText());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (e) {
      alert('Texto copiado al portapapeles.');
    }
  };

  // Direct High-Resolution HTML5 Canvas Renderer & Exporter
  const handleDownloadCover = () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // 1. Draw Background
      if (selectedPreset === 'rolling_stone') {
        ctx.fillStyle = '#181816';
        ctx.fillRect(0, 0, 1200, 1600);
        // Vignette gradient
        const grad = ctx.createRadialGradient(600, 700, 200, 600, 800, 900);
        grad.addColorStop(0, '#2c221a');
        grad.addColorStop(1, '#0e0e0d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 1600);
      } else if (selectedPreset === 'billboard') {
        ctx.fillStyle = '#f8f6f0';
        ctx.fillRect(0, 0, 1200, 1600);
        const grad = ctx.createLinearGradient(0, 0, 1200, 1600);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, '#ebe6db');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 1600);
      } else if (selectedPreset === 'underground_zine') {
        ctx.fillStyle = '#f2ede2';
        ctx.fillRect(0, 0, 1200, 1600);
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(40, 40, 1120, 1520);
        ctx.fillStyle = '#f7f4ed';
        ctx.fillRect(50, 50, 1100, 1500);
      } else {
        // The FADER / Urban
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 1200, 1600);
        const grad = ctx.createLinearGradient(0, 0, 1200, 1600);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 1600);
      }

      // 2. Draw Masthead
      ctx.textAlign = 'center';
      if (selectedPreset === 'rolling_stone') {
        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 95px Georgia, serif';
        ctx.letterSpacing = '-2px';
        ctx.fillText('Rolling Stone', 600, 170);

        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`EDICIÓN ESPECIAL • AÑO ${milestone.year} • NO. 1420`, 600, 220);
      } else if (selectedPreset === 'billboard') {
        ctx.fillStyle = '#0f172a';
        ctx.font = '900 110px "Arial Black", Impact, sans-serif';
        ctx.fillText('billboard', 600, 175);

        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('CHART TOPPER & MUSIC INDUSTRY REPORT', 600, 225);
      } else if (selectedPreset === 'underground_zine') {
        ctx.fillStyle = '#1c1c1c';
        ctx.font = '900 90px "Courier New", monospace';
        ctx.fillText('UNDERGROUND ZINE', 600, 170);

        ctx.fillStyle = '#50504e';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('// 100% INDIE & CASSETTE CULTURE // ISSUE #01', 600, 220);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '900 120px Impact, sans-serif';
        ctx.fillText('THE FADER', 600, 175);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('THE GLOBAL SOUNDSCAPE & FUTURE ICONS', 600, 225);
      }

      // 3. Draw Milestone Badge / Tag
      ctx.fillStyle = selectedPreset === 'billboard' ? '#1c1c1c' : '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`★ ${milestone.title.toUpperCase()} ★`, 600, 310);

      // 4. Draw Centerpiece Artist Name
      ctx.font = '900 100px sans-serif';
      ctx.fillStyle = selectedPreset === 'billboard' ? '#0f172a' : '#fcfbf8';
      ctx.fillText(player.name.toUpperCase(), 600, 750);

      // 5. Draw Headline
      ctx.font = 'bold 42px sans-serif';
      ctx.fillStyle = selectedPreset === 'billboard' ? '#334155' : '#fde047';

      // Multiline headline wrapping
      const words = customHeadline.split(' ');
      let line = '';
      let y = 1100;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 1000 && n > 0) {
          ctx.fillText(line, 600, y);
          line = words[n] + ' ';
          y += 55;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 600, y);

      // 6. Draw Sub-lines and Barcode
      ctx.font = '30px sans-serif';
      ctx.fillStyle = selectedPreset === 'billboard' ? '#64748b' : '#94a3b8';
      ctx.fillText(`Etapa: ${player.careerStage} • Ciudad: ${formatCityCountry(player.city, player.country)}`, 600, 1380);
      ctx.fillText(`Música: ${world.genres[player.mainGenreId]?.name || player.mainGenreId} • Legado: ${player.legacyScore}/100`, 600, 1430);

      // Barcode box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(80, 1460, 240, 80);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('|| | |||| | ||||| |', 200, 1500);
      ctx.font = '14px monospace';
      ctx.fillText('$4.99 USD', 200, 1530);

      // Export canvas to download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `portada_${player.name.toLowerCase().replace(/\s+/g, '_')}_${selectedPreset}_${milestone.year}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating canvas cover:', err);
      alert('No se pudo generar el archivo de imagen automáticamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  function getMagazineName(preset: MagazinePreset): string {
    switch (preset) {
      case 'rolling_stone':
        return 'Rolling Stone';
      case 'billboard':
        return 'Billboard Magazine';
      case 'underground_zine':
        return 'Underground Zine';
      case 'the_fader':
        return 'The FADER';
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div
        className="bg-[#16181F] border border-[#2A2E3D] max-w-4xl w-full rounded-[18px] flex flex-col overflow-hidden text-[#F8FAFC] shadow-2xl relative my-auto max-h-[92vh]"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#2A2E3D] bg-[#16181F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-[8px] bg-[#0B0C10] border border-[#2A2E3D] text-[#F8FAFC] shadow-sm shrink-0"
            >
              <Newspaper className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-[4px] inline-block">
                Hito & Social Proof • Portada Conmemorativa
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-[-0.7px] text-[#F8FAFC]">
                {milestone.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] hover:bg-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (2 Columns: Live Magazine Poster vs Customization Controls) */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================================= */}
          {/* LEFT: SIMULATED MAGAZINE COVER POSTER (7 COLS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div
              ref={coverRef}
              className={`w-full max-w-[420px] aspect-[3/4.2] rounded-[14px] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none border transition-all duration-300 ${
                selectedPreset === 'rolling_stone'
                  ? 'bg-gradient-to-b from-[#221c17] via-[#141413] to-[#0c0c0b] text-[#fcfbf8] border-stone-800'
                  : selectedPreset === 'billboard'
                  ? 'bg-gradient-to-b from-[#ffffff] via-[#fcfbf8] to-[#f4efe4] text-[#1c1c1c] border-[#e2dec9]'
                  : selectedPreset === 'underground_zine'
                  ? 'bg-[#f7f4ed] text-[#1c1c1c] border-2 border-[#1c1c1c]'
                  : 'bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#020617] text-[#fcfbf8] border-indigo-900'
              }`}
            >
              {/* Paper / Gloss Sheen Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

              {/* 1. MASTHEAD & HEADER */}
              <div className="relative z-10 text-center space-y-1">
                {selectedPreset === 'rolling_stone' && (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-1.5px] text-rose-500 font-serif drop-shadow-sm">
                      Rolling Stone
                    </h1>
                    <div className="flex items-center justify-between text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-400/90 font-mono border-y border-white/10 py-1">
                      <span>ISSUE #{milestone.year * 2}</span>
                      <span>{milestone.year}</span>
                      <span>$4.99 USD</span>
                    </div>
                  </>
                )}

                {selectedPreset === 'billboard' && (
                  <>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-[-2px] text-[#0f172a] drop-shadow-xs">
                      billboard
                    </h1>
                    <div className="flex items-center justify-between text-[8px] sm:text-[9px] uppercase tracking-wider text-[#5f5f5d] font-bold border-y border-[#eceae4] py-1">
                      <span>CHARTS & SPECIAL EDITION</span>
                      <span>VOL. {milestone.year}</span>
                      <span>MUSIC REPORT</span>
                    </div>
                  </>
                )}

                {selectedPreset === 'underground_zine' && (
                  <>
                    <div className="border-b-2 border-[#1c1c1c] pb-1">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-[#1c1c1c] font-mono uppercase">
                        UNDERGROUND ZINE
                      </h1>
                    </div>
                    <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-[#50504e] pt-0.5">
                      <span>// 100% INDIE CULTURE</span>
                      <span>#01</span>
                    </div>
                  </>
                )}

                {selectedPreset === 'the_fader' && (
                  <>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-[-1.5px] text-sky-400 uppercase italic">
                      THE FADER
                    </h1>
                    <div className="flex items-center justify-between text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-300 font-mono border-y border-white/10 py-1">
                      <span>THE SOUND OF TOMORROW</span>
                      <span>{milestone.year}</span>
                    </div>
                  </>
                )}
              </div>

              {/* 2. CENTERPIECE: ARTIST PORTRAIT & GLAMOUR STYLING */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-3 py-2">
                {/* Milestone Badge Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border bg-amber-400 text-stone-950 border-amber-300">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{milestone.milestoneLabel || 'HITO ARTÍSTICO'}</span>
                </div>

                {/* Artist Avatar Presentation */}
                <div className="relative group">
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                  ) : (
                    <div
                      className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr ${
                        player.avatarColor || 'from-[#7C3AED] via-[#8B5CF6] to-[#C026D3]'
                      } flex items-center justify-center text-white text-4xl sm:text-5xl font-black border-4 border-white shadow-2xl`}
                    >
                      {player.name.charAt(0)}
                    </div>
                  )}

                  {/* Gold Star Stamp */}
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md border-2 border-white">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>

                {/* Artist Name */}
                <div className="space-y-0.5">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                    {player.name}
                  </h2>
                  <p className="text-[10px] sm:text-xs opacity-75 font-mono uppercase">
                    {player.careerStage} • {formatCityCountry(player.city, player.country)}
                  </p>
                </div>
              </div>

              {/* 3. EDITORIAL HEADLINES & FOOTER CALLOUTS */}
              <div className="relative z-10 space-y-2 border-t border-current/15 pt-3">
                {/* Main Headline */}
                <h3 className="text-xs sm:text-sm font-black leading-tight tracking-tight uppercase line-clamp-3">
                  "{customHeadline}"
                </h3>

                {/* Sub-stories & Barcode Footer */}
                <div className="flex items-end justify-between gap-2 pt-1">
                  <div className="space-y-0.5 text-[8px] sm:text-[9px] opacity-80 leading-tight">
                    <p className="font-bold">★ Exclusiva: La visión detrás de su música</p>
                    <p>★ Legado oficial: {player.legacyScore}/100 pts</p>
                  </div>

                  {/* Simulated Barcode */}
                  <div className="bg-white px-2 py-1 rounded-[3px] text-[#1c1c1c] text-center shrink-0 shadow-xs">
                    <div className="font-mono text-[9px] font-black tracking-tighter">
                      ||| | |||| | ||
                    </div>
                    <span className="text-[6px] block font-mono">$4.99 USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: CONTROLS & SOCIAL ACTIONS (5 COLS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Magazine Style Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Estilo Editorial / Revista
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rolling_stone', label: 'Rolling Stone', sub: 'Prestigio & Rock/Pop' },
                  { id: 'billboard', label: 'Billboard', sub: 'Charts & Industria' },
                  { id: 'underground_zine', label: 'Underground Zine', sub: 'Indie & DIY Punk' },
                  { id: 'the_fader', label: 'The FADER', sub: 'Cultura Urbana & Trap' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPreset(item.id as MagazinePreset)}
                    className={`p-3 rounded-[10px] border text-left transition-all cursor-pointer ${
                      selectedPreset === item.id
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.35)] font-semibold'
                        : 'bg-[#0B0C10] text-[#F8FAFC] border border-[#2A2E3D] hover:border-[#8B5CF6]/50'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[10px] opacity-75 block">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Headline Editor & Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Titular Principal de la Portada
              </label>

              <textarea
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                rows={3}
                maxLength={160}
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-[8px] p-3 text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] leading-relaxed resize-none"
                placeholder="Escribe el titular impactante..."
              />

              {/* Quick Preset Headline Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                  O sugerencias automáticas:
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {headlineSuggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setCustomHeadline(sug)}
                      className="w-full text-left p-2 rounded-[6px] bg-[#0B0C10] border border-[#2A2E3D] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6]/50 transition-all truncate block cursor-pointer"
                    >
                      "{sug}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Export & Share Actions */}
            <div className="space-y-2.5 pt-2 border-t border-[#2A2E3D]">
              {/* Download PNG Button */}
              <button
                onClick={handleDownloadCover}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white py-3 px-4 rounded-[6px] text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-white" />
                <span>{isDownloading ? 'Generando imagen PNG...' : 'Descargar Portada en Alta Calidad (PNG)'}</span>
              </button>

              {/* Copy Social Announcement Button */}
              <button
                onClick={handleCopyShareText}
                className="w-full bg-[#0B0C10] text-[#F8FAFC] border border-[#2A2E3D] hover:bg-[#16181F] py-2.5 px-4 rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">¡Texto Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Copiar Publicación para Redes Sociales</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#2A2E3D] bg-[#16181F] flex items-center justify-between">
          <span className="text-xs text-[#94A3B8]">
            Hito registrado en la cronología de carrera y en los archivos de la revista.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[6px] text-xs font-bold bg-[#0B0C10] text-[#F8FAFC] border border-[#2A2E3D] hover:bg-[#2A2E3D] transition-all cursor-pointer shadow-sm"
          >
            Continuar Carrera
          </button>
        </div>
      </div>
    </div>
  );
};
