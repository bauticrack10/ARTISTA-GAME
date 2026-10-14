import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioSystem, playSound } from '../utils/audioSystem';

export const AudioEqualizer: React.FC<{ isPlaying?: boolean; className?: string }> = ({
  isPlaying = true,
  className = ''
}) => {
  return (
    <div className={`flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 rounded-[2px] bg-[#09090B] border border-[#242429] ${className}`}>
      <span className={`w-0.5 rounded-[1px] bg-[#00E599] transition-all duration-300 ${isPlaying ? 'animate-bounce h-3' : 'h-1 opacity-40'}`} style={{ animationDuration: '450ms' }} />
      <span className={`w-0.5 rounded-[1px] bg-[#00E599] transition-all duration-300 ${isPlaying ? 'animate-bounce h-2.5' : 'h-1.5 opacity-40'}`} style={{ animationDuration: '600ms', animationDelay: '100ms' }} />
      <span className={`w-0.5 rounded-[1px] bg-[#FF4F00] transition-all duration-300 ${isPlaying ? 'animate-bounce h-3.5' : 'h-1 opacity-40'}`} style={{ animationDuration: '500ms', animationDelay: '200ms' }} />
      <span className={`w-0.5 rounded-[1px] bg-[#EF4444] transition-all duration-300 ${isPlaying ? 'animate-bounce h-2' : 'h-2 opacity-40'}`} style={{ animationDuration: '700ms', animationDelay: '300ms' }} />
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
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] bg-[#111114] border border-[#242429] hover:border-[#3F3F46] text-xs transition-all cursor-pointer ${className}`}
      title={muted ? 'Activar Efectos de Sonido WebAudio' : 'Silenciar Efectos de Sonido'}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#52525B]" />
          <span className="text-2xs text-[#52525B] font-mono">SFX OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#00E599]" />
          <AudioEqualizer isPlaying={true} />
          <span className="text-2xs text-[#00E599] font-mono font-bold">SFX ON</span>
        </>
      )}
    </button>
  );
};
