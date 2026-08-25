export interface AvatarPreset {
  id: string;
  name: string;
  category: 'urban' | 'pop' | 'electronic' | 'rock' | 'artistic' | 'minimal';
  url: string;
  description: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'urban_trap_1',
    name: 'Trap King (Chains & Streetwear)',
    category: 'urban',
    description: 'Estilo urbano moderno con cadenas y gafas oscuras.',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'urban_trap_2',
    name: 'Neo Queen (Diva Urbana)',
    category: 'urban',
    description: 'Estética futurista con trenzas y actitud urbana.',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop_star_1',
    name: 'Pop Icon (Studio Lights)',
    category: 'pop',
    description: 'Voz carismática con iluminación de estudio cinematográfico.',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop_star_2',
    name: 'Melodic Singer (Warm Gold)',
    category: 'pop',
    description: 'Sonido suave, baladas y pop contemporáneo.',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'rock_star_1',
    name: 'Alt Rocker (Leather & Grunge)',
    category: 'rock',
    description: 'Guitarra, actitud rebelde y sonido alternativo potente.',
    url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'rock_star_2',
    name: 'Indie Artist (Analog Aesthetic)',
    category: 'rock',
    description: 'Texturas analógicas, indie rock y lírica introspectiva.',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'producer_1',
    name: 'Master Producer (Studio Headphones)',
    category: 'electronic',
    description: 'Auriculares de monitoreo y dominio de sintetizadores.',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'electronic_dj',
    name: 'Club & Beatmaker (Neon Nights)',
    category: 'electronic',
    description: 'Sonido vanguardista de club y sesiones de electrónica.',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'avant_garde',
    name: 'Vanguardia Conceptual (Dark Editorial)',
    category: 'artistic',
    description: 'Estética visual experimental y de alta costura.',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'latin_reggaeton',
    name: 'Hitmaker Latino (Tropical Sun)',
    category: 'urban',
    description: 'Flow caribeño y carisma para encabezar listas globales.',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'rnb_diva',
    name: 'R&B Soul (Velvet Voice)',
    category: 'pop',
    description: 'Elegancia, rango vocal prodigioso y armonías complejas.',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'acoustic_folk',
    name: 'Songwriter (Acoustic Nature)',
    category: 'artistic',
    description: 'Guitarra acústica, honestidad pura y poesía narrativa.',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
  }
];
