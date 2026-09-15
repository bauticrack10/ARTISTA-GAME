import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioSystem, playSound } from '../utils/audioSystem';

export const AudioEqualizer: React.FC<{ isPlaying?: boolean; className?: string }> = ({
  isPlaying = true,
  className = ''
}) => {
  return (
    <div className={`flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 rounded-sm bg-canvas border border-line ${className}`}>
      <span className={`w-0.5 rounded-full bg-primary transition-all duration-300 ${isPlaying ? 'animate-bounce h-3' : 'h-1 opacity-50'}`} style={{ animationDuration: '450ms' }} />
      <span className={`w-0.5 rounded-full bg-accent transition-all duration-300 ${isPlaying ? 'animate-bounce h-2.5' : 'h-1.5 opacity-50'}`} style={{ animationDuration: '600ms', animationDelay: '100ms' }} />
      <span className={`w-0.5 rounded-full bg-info transition-all duration-300 ${isPlaying ? 'animate-bounce h-3.5' : 'h-1 opacity-50'}`} style={{ animationDuration: '500ms', animationDelay: '200ms' }} />
      <span className={`w-0.5 rounded-full bg-success transition-all duration-300 ${isPlaying ? 'animate-bounce h-2' : 'h-2 opacity-50'}`} style={{ animationDuration: '700ms', animationDelay: '300ms' }} />
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
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-line hover:border-primary/50 text-xs transition-all cursor-pointer shadow-xs group ${className}`}
      title={muted ? 'Activar Efectos de Sonido WebAudio' : 'Silenciar Efectos de Sonido'}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-fg-subtle group-hover:text-fg" />
          <span className="text-2xs text-fg-subtle font-mono group-hover:text-fg">SFX OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-primary group-hover:text-primary-soft" />
          <AudioEqualizer isPlaying={true} />
          <span className="text-2xs text-success font-mono font-bold">SFX ON</span>
        </>
      )}
    </button>
  );
};
