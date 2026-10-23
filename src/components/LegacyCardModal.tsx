import React, { useRef, useState } from 'react';
import { Artist, WorldState, Song, Album, Tour } from '../types';
import {
  X,
  Download,
  Disc3,
  Trophy,
  Crown,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Share2,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { playSound } from '../utils/audioSystem';
import { formatMoney, formatFans } from '../utils/formatters';

interface LegacyCardModalProps {
  player: Artist;
  world: WorldState;
  onClose: () => void;
  onRetire?: () => void;
}

export const LegacyCardModal: React.FC<LegacyCardModalProps> = ({
  player,
  world,
  onClose,
  onRetire
}) => {
  const [copied, setCopied] = useState(false);
  const [retireConfirm, setRetireConfirm] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playerSongs = (Object.values(world.songs || {}) as Song[]).filter(s => s.artistId === player.id);
  const playerAlbums = (Object.values(world.albums || {}) as Album[]).filter(a => a.artistId === player.id);
  const playerTours = (world.tours || []).filter(t => t.artistId === player.id);

  const topSongs = [...playerSongs]
    .sort((a, b) => (b.streamsTotal || 0) - (a.streamsTotal || 0))
    .slice(0, 3);

  const bestAlbum = [...playerAlbums].sort((a, b) => (b.totalStreams || 0) - (a.totalStreams || 0))[0];
  const bestTour = [...playerTours].sort((a, b) => (b.grossRevenue || 0) - (a.grossRevenue || 0))[0];

  const totalCertificationsCount = (player.officialCertifications?.length || 0);
  const yearsActive = Math.max(0, (player.retirementYear || world.currentYear) - player.careerStartYear);

  const handleShare = () => {
    playSound('click');
    const text = `📁 DOSSIER OFICIAL: ${player.name} (${player.careerStage})\n🌟 Legado: ${player.legacyScore}/100 • Streams: ${(player.stats.totalStreams / 1000000).toFixed(1)}M\n🏆 Premios: ${player.awardsWon.length} • Placas Oficiales: ${totalCertificationsCount}\n#ElArtista #LegadoMusical`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadImage = () => {
    playSound('release');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1600;

    // Background
    ctx.fillStyle = '#0B0B0C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Frame
    ctx.strokeStyle = '#26262B';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Header Tag
    ctx.fillStyle = '#141417';
    ctx.fillRect(60, 60, canvas.width - 120, 160);
    ctx.strokeStyle = '#26262B';
    ctx.strokeRect(60, 60, canvas.width - 120, 160);

    ctx.fillStyle = '#FF4F00';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('HISTORICAL ARCHIVE • VINYL PRESS EPK DOSSIER', 100, 110);

    ctx.fillStyle = '#8E8E99';
    ctx.font = '20px monospace';
    ctx.fillText(`AÑO DE REGISTRO ${world.currentYear} • ESTADO: ${player.isRetired ? 'RETIRADO / LEYENDA' : 'EN ACTIVO'}`, 100, 150);

    // Artist Name
    ctx.fillStyle = '#F4F0EA';
    ctx.font = 'bold 84px sans-serif';
    ctx.fillText(player.name.toUpperCase(), 100, 290);

    // Metadata subheader
    ctx.fillStyle = '#8E8E99';
    ctx.font = '28px sans-serif';
    ctx.fillText(`${player.country} • ${world.genres[player.mainGenreId]?.name || 'Urbano'} • Etapa: ${player.careerStage}`, 100, 340);

    // Key Stats Grid
    const statCards = [
      { label: 'STREAMS TOTALES', value: `${(player.stats.totalStreams / 1000000).toFixed(2)}M` },
      { label: 'PUNTAJE LEGADO', value: `${player.legacyScore}/100` },
      { label: 'AÑOS DE CARRERA', value: `${yearsActive} AÑOS` },
      { label: 'PREMIOS GANADOS', value: `${player.awardsWon.length}` }
    ];

    statCards.forEach((sc, i) => {
      const x = 100 + (i % 2) * 510;
      const y = 400 + Math.floor(i / 2) * 160;
      ctx.fillStyle = '#141417';
      ctx.fillRect(x, y, 480, 130);
      ctx.strokeStyle = '#26262B';
      ctx.strokeRect(x, y, 480, 130);

      ctx.fillStyle = '#8E8E99';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(sc.label, x + 30, y + 45);

      ctx.fillStyle = '#F4F0EA';
      ctx.font = 'bold 44px monospace';
      ctx.fillText(sc.value, x + 30, y + 100);
    });

    // Top Songs
    ctx.fillStyle = '#141417';
    ctx.fillRect(100, 750, 1000, 360);
    ctx.strokeStyle = '#26262B';
    ctx.strokeRect(100, 750, 1000, 360);

    ctx.fillStyle = '#FF4F00';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('CATÁLOGO PRINCIPAL (TOP HITS)', 130, 800);

    topSongs.forEach((song, idx) => {
      const y = 860 + idx * 75;
      ctx.fillStyle = '#F4F0EA';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(`${idx + 1}. ${song.title}`, 130, y);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`${(song.streamsTotal / 1000000).toFixed(2)}M streams`, 780, y);
    });

    // Footer
    ctx.fillStyle = '#8E8E99';
    ctx.font = '18px monospace';
    ctx.fillText('EL ARTISTA — MUSIC CAREER SIMULATOR • REPRODUCCIÓN OFICIAL DE ARCHIVO', 100, 1500);

    // Download link
    const link = document.createElement('a');
    link.download = `EPK_${player.name.replace(/\s+/g, '_')}_${world.currentYear}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#141417] border border-[#26262B] rounded-[6px] shadow-2xl text-[#F4F0EA] flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 border-b border-[#26262B] flex items-center justify-between bg-[#111114]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#18181C] border border-[#26262B] flex items-center justify-center text-[#FF4F00]">
              <Disc3 className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-3xs uppercase font-mono font-bold tracking-widest text-[#8E8E99] block">
                DOSSIER EDITORIAL OFICIAL (EPK)
              </span>
              <h2 className="text-base font-bold text-[#F4F0EA]">
                Ficha de Carrera & Archivo Histórico
              </h2>
            </div>
          </div>

          <button
            onClick={() => { playSound('click'); onClose(); }}
            className="p-1.5 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Hero Sheet */}
          <div className="p-6 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] relative overflow-hidden space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-3xs uppercase font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#18181C] border border-[#26262B] text-[#FF4F00]">
                  {player.careerStage} • {yearsActive} Años de Trayectoria
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F4F0EA] tracking-tight mt-2 font-display">
                  {player.name}
                </h1>
                <p className="text-xs text-[#8E8E99] mt-1 font-mono">
                  {player.country} • {player.city} • Sonido Principal: {world.genres[player.mainGenreId]?.name || 'Urbano'}
                </p>
              </div>

              <div className="text-right shrink-0 bg-[#141417] p-3 rounded-[4px] border border-[#26262B]">
                <span className="text-3xs font-mono uppercase text-[#8E8E99] block font-bold">Puntaje Legado</span>
                <span className="text-2xl font-bold font-mono text-[#F59E0B] tabular-nums">
                  {player.legacyScore}/100
                </span>
              </div>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#26262B] text-xs font-mono tabular-nums">
              <div className="p-2.5 bg-[#141417] rounded-[4px] border border-[#26262B]">
                <span className="text-3xs text-[#8E8E99] uppercase block font-bold">Streams Totales</span>
                <span className="text-sm font-bold text-[#10B981]">{(player.stats.totalStreams / 1000000).toFixed(2)}M</span>
              </div>
              <div className="p-2.5 bg-[#141417] rounded-[4px] border border-[#26262B]">
                <span className="text-3xs text-[#8E8E99] uppercase block font-bold">Base de Fans</span>
                <span className="text-sm font-bold text-[#F4F0EA]">{formatFans(player.stats.fansCount)}</span>
              </div>
              <div className="p-2.5 bg-[#141417] rounded-[4px] border border-[#26262B]">
                <span className="text-3xs text-[#8E8E99] uppercase block font-bold">Premios Ganados</span>
                <span className="text-sm font-bold text-[#F59E0B]">{player.awardsWon.length}</span>
              </div>
              <div className="p-2.5 bg-[#141417] rounded-[4px] border border-[#26262B]">
                <span className="text-3xs text-[#8E8E99] uppercase block font-bold">Placas Oficiales</span>
                <span className="text-sm font-bold text-[#38BDF8]">{totalCertificationsCount}</span>
              </div>
            </div>
          </div>

          {/* Top Hits Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase font-bold text-[#8E8E99] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
              Obras Fundamentales del Catálogo
            </h3>

            <div className="space-y-2">
              {topSongs.map((song, i) => (
                <div
                  key={song.id}
                  className="p-3 bg-[#0B0B0C] border border-[#26262B] rounded-[4px] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[#8E8E99] font-bold w-4">{i + 1}.</span>
                    <span className="font-bold text-[#F4F0EA] truncate">{song.title}</span>
                  </div>
                  <span className="text-[#10B981] font-bold shrink-0 tabular-nums">
                    {(song.streamsTotal / 1000000).toFixed(2)}M streams
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Retirement Section */}
          <div className="p-4 rounded-[4px] bg-[#111114] border border-[#26262B] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-[#F4F0EA]">
                  Gestión de Retiro Artístico
                </h4>
                <p className="text-2xs text-[#8E8E99] mt-0.5 max-w-lg leading-relaxed">
                  {player.isRetired
                    ? `El artista se retiró formalmente en el año ${player.retirementYear}. Su legado continúa acumulando regalías y reconocimiento histórico.`
                    : 'Al retirarse, el artista concluye su etapa de lanzamientos activos y giras, preservando su legado para la posteridad.'}
                </p>
              </div>

              {!player.isRetired && onRetire && (
                <div>
                  {!retireConfirm ? (
                    <button
                      onClick={() => setRetireConfirm(true)}
                      className="px-3 py-1.5 rounded-[4px] border border-[#EF4444]/40 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Anunciar Retiro
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playSound('award');
                          onRetire();
                          setRetireConfirm(false);
                        }}
                        className="px-3 py-1.5 rounded-[4px] bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-mono font-bold transition-all cursor-pointer"
                      >
                        Confirmar Retiro
                      </button>
                      <button
                        onClick={() => setRetireConfirm(false)}
                        className="px-2 py-1.5 rounded-[4px] border border-[#26262B] text-xs font-mono text-[#8E8E99]"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#26262B] bg-[#111114] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#8E8E99]">
            {copied ? (
              <span className="text-[#10B981] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ficha copiada al portapapeles
              </span>
            ) : (
              <span>Diseño editorial "Analog Master & Vinyl Press"</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none px-4 py-2 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#26262B] text-[#F4F0EA] text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copiar Texto</span>
            </button>

            <button
              onClick={handleDownloadImage}
              className="flex-1 sm:flex-none px-4 py-2 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-[1px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Ficha (PNG)</span>
            </button>
          </div>
        </div>

        {/* Hidden Canvas for High-Res PNG Rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
