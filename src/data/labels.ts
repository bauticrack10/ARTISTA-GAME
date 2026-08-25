import { RecordLabel } from '../types';

export const INITIAL_LABELS: Record<string, RecordLabel> = {
  label_sony_columbia: {
    id: 'label_sony_columbia',
    name: 'Sony Music / Columbia Records',
    type: 'major',
    country: 'Global / USA',
    prestige: 95,
    budget: 5000000,
    marketingPower: 96,
    creativeFreedomAllowed: 40,
    rosterArtistIds: ['artist_rosalia', 'artist_travis_scott'],
    favoredGenreIds: ['pop_moderno', 'trap_latino', 'hip_hop_rap', 'r_and_b_soul']
  },
  label_universal_interscope: {
    id: 'label_universal_interscope',
    name: 'Universal / Interscope Records',
    type: 'major',
    country: 'Global / USA',
    prestige: 96,
    budget: 6000000,
    marketingPower: 98,
    creativeFreedomAllowed: 45,
    rosterArtistIds: ['artist_billie_eilish', 'artist_kendrick_lamar'],
    favoredGenreIds: ['pop_moderno', 'hip_hop_rap', 'rock_alternativo']
  },
  label_warner_latam: {
    id: 'label_warner_latam',
    name: 'Warner Music Latina',
    type: 'major',
    country: 'LatinAmerica',
    prestige: 88,
    budget: 3500000,
    marketingPower: 89,
    creativeFreedomAllowed: 55,
    rosterArtistIds: ['artist_duki', 'artist_khea'],
    favoredGenreIds: ['trap_latino', 'reggaeton', 'pop_moderno']
  },
  label_dale_play: {
    id: 'label_dale_play',
    name: 'Dale Play Records',
    type: 'indie',
    country: 'Argentina',
    prestige: 86,
    budget: 1800000,
    marketingPower: 88,
    creativeFreedomAllowed: 82,
    rosterArtistIds: ['artist_bizarrap', 'artist_bhavi', 'artist_milo_j', 'artist_ysy_a'],
    favoredGenreIds: ['trap_latino', 'hip_hop_rap', 'musica_electronica']
  },
  label_rimas_music: {
    id: 'label_rimas_music',
    name: 'Rimas Entertainment',
    type: 'indie',
    country: 'Puerto Rico / LatinAmerica',
    prestige: 94,
    budget: 4500000,
    marketingPower: 95,
    creativeFreedomAllowed: 78,
    rosterArtistIds: ['artist_bad_bunny'],
    favoredGenreIds: ['reggaeton', 'trap_latino', 'corridos_urbanos']
  },
  label_xl_recordings: {
    id: 'label_xl_recordings',
    name: 'XL Recordings & Beggars Group',
    type: 'boutique',
    country: 'UK',
    prestige: 91,
    budget: 1200000,
    marketingPower: 75,
    creativeFreedomAllowed: 95,
    rosterArtistIds: [],
    favoredGenreIds: ['rock_alternativo', 'musica_electronica', 'r_and_b_soul']
  },
  label_underground_syndicate: {
    id: 'label_underground_syndicate',
    name: 'Underground Syndicate Collective',
    type: 'boutique',
    country: 'Argentina / España',
    prestige: 55,
    budget: 250000,
    marketingPower: 45,
    creativeFreedomAllowed: 98,
    rosterArtistIds: [],
    favoredGenreIds: ['drill', 'trap_latino', 'hip_hop_rap']
  }
};
