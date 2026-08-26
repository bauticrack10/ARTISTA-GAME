import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioSystem, playSound } from '../utils/audioSystem';

export const AudioEqualizer: React.FC<{ isPlaying?: boolean; className?: string }> = ({
  isPlaying = true,
  className = ''
}) => {
  return (
    <div className={`flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 rounded-[4px] bg-[#0B0C10] border border-[#2A2E3D] ${className}`}>
      <span className={`w-0.5 rounded-full bg-[#8B5CF6] transition-all duration-300 ${isPlaying ? 'animate-bounce h-3' : 'h-1 opacity-50'}`} style={{ animationDuration: '450ms' }} />
      <span className={`w-0.5 rounded-full bg-[#EC4899] transition-all duration-300 ${isPlaying ? 'animate-bounce h-2.5' : 'h-1.5 opacity-50'}`} style={{ animationDuration: '600ms', animationDelay: '100ms' }} />
      <span className={`w-0.5 rounded-full bg-[#06B6D4] transition-all duration-300 ${isPlaying ? 'animate-bounce h-3.5' : 'h-1 opacity-50'}`} style={{ animationDuration: '500ms', animationDelay: '200ms' }} />
      <span className={`w-0.5 rounded-full bg-[#10B981] transition-all duration-300 ${isPlaying ? 'animate-bounce h-2' : 'h-2 opacity-50'}`} style={{ animationDuration: '700ms', animationDelay: '300ms' }} />
    </div>
  );
};

export const AudioToggleButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [muted, setMuted] = useState<boolean>(audioSystem.getIsMuted());

  useEffect(() => {
    setMuted(audioSystem.getIsMuted());
  }, []);

  const handleToggle = () => {
    const nextMuted = audioSystem.toggleMute();
    setMuted(nextMuted);
    if (!nextMuted) {
      playSound('click');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-[#16181F] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 text-xs transition-all cursor-pointer shadow-xs group ${className}`}
      title={muted ? 'Activar Efectos de Sonido WebAudio' : 'Silenciar Efectos de Sonido'}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#F8FAFC]" />
          <span className="text-[10px] text-[#64748B] font-mono group-hover:text-[#F8FAFC]">SFX OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:text-[#C084FC]" />
          <AudioEqualizer isPlaying={true} />
          <span className="text-[10px] text-[#10B981] font-mono font-bold">SFX ON</span>
        </>
      )}
    </button>
  );
};
