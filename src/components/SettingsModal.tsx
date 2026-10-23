import React, { useState, useRef } from 'react';
import { Artist, WorldState } from '../types';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Save,
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { playSound } from '../utils/audioSystem';

interface SettingsModalProps {
  player: Artist;
  world: WorldState;
  onClose: () => void;
  onExportSave: () => void;
  onImportSave: (jsonContent: string) => void;
  onResetCareer: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  player,
  world,
  onClose,
  onExportSave,
  onImportSave,
  onResetCareer
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        onImportSave(content);
        playSound('level_up');
        setImportStatus('Partida cargada exitosamente.');
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1500);
      } catch (err) {
        setImportStatus('Error: Archivo de guardado no válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#141417] border border-[#26262B] rounded-[6px] shadow-2xl text-[#F4F0EA] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#26262B] flex items-center justify-between bg-[#111114]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#18181C] border border-[#26262B] flex items-center justify-center text-[#FF4F00]">
              <Save className="w-4 h-4" />
            </div>
            <div>
              <span className="text-3xs uppercase font-mono font-bold tracking-widest text-[#8E8E99] block">
                MEMORIA & GESTIÓN
              </span>
              <h2 className="text-sm font-bold text-[#F4F0EA]">
                Ajustes & Guardado de Partida
              </h2>
            </div>
          </div>

          <button
            onClick={() => { playSound('click'); onClose(); }}
            className="p-1 rounded-[4px] hover:bg-[#18181C] text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Status Badge */}
          <div className="p-3.5 rounded-[4px] bg-[#0B0B0C] border border-[#26262B] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
              <span className="text-[#F4F0EA] font-semibold">Autoguardado Activo</span>
            </div>
            <span className="text-3xs text-[#8E8E99] uppercase">
              Sincronizado tras cada acción
            </span>
          </div>

          {/* Export & Import Section */}
          <div className="space-y-3">
            <h3 className="text-3xs uppercase font-mono font-bold text-[#8E8E99] tracking-wider">
              Copias de Seguridad (Archivos JSON)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  playSound('click');
                  onExportSave();
                }}
                className="p-3 rounded-[4px] bg-[#18181C] hover:bg-[#1C1C21] border border-[#26262B] hover:border-[#3F3F46] flex flex-col items-start gap-1 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F4F0EA]">
                  <Download className="w-3.5 h-3.5 text-[#FF4F00] group-hover:translate-y-0.5 transition-transform" />
                  <span>Exportar Partida</span>
                </div>
                <span className="text-3xs text-[#8E8E99]">
                  Descarga un archivo .JSON con todo tu progreso actual.
                </span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  fileInputRef.current?.click();
                }}
                className="p-3 rounded-[4px] bg-[#18181C] hover:bg-[#1C1C21] border border-[#26262B] hover:border-[#3F3F46] flex flex-col items-start gap-1 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F4F0EA]">
                  <Upload className="w-3.5 h-3.5 text-[#10B981] group-hover:-translate-y-0.5 transition-transform" />
                  <span>Cargar Respaldo</span>
                </div>
                <span className="text-3xs text-[#8E8E99]">
                  Restaura una partida previa desde un archivo .JSON.
                </span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            {importStatus && (
              <div className="p-2.5 rounded-[4px] bg-[#18181C] border border-[#26262B] text-xs font-mono text-[#10B981] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{importStatus}</span>
              </div>
            )}
          </div>

          {/* Danger Zone: Reset Career */}
          <div className="pt-3 border-t border-[#26262B] space-y-3">
            <h3 className="text-3xs uppercase font-mono font-bold text-[#EF4444] tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
              Zona Crítica
            </h3>

            {!showResetConfirm ? (
              <div className="p-3.5 rounded-[4px] bg-[#18181C] border border-[#26262B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#F4F0EA]">Reiniciar Carrera</h4>
                  <p className="text-3xs text-[#8E8E99] mt-0.5">
                    Borra la partida actual de localStorage y vuelve a la pantalla inicial para crear un nuevo artista.
                  </p>
                </div>
                <button
                  onClick={() => { playSound('click'); setShowResetConfirm(true); }}
                  className="px-3 py-1.5 rounded-[4px] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
                >
                  Reiniciar Carrera
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-[4px] bg-[#EF4444]/10 border border-[#EF4444]/40 space-y-3 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#EF4444] block">¿Confirmar reinicio de carrera?</strong>
                    <span className="text-[#8E8E99] text-3xs leading-relaxed">
                      Esta acción es irreversible. Se eliminará el autoguardado de {player.name} en este dispositivo.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-[4px] bg-[#18181C] border border-[#26262B] text-xs font-mono text-[#8E8E99] hover:text-[#F4F0EA] transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      playSound('release');
                      onResetCareer();
                    }}
                    className="px-3.5 py-1.5 rounded-[4px] bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Sí, Reiniciar Definitivamente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
