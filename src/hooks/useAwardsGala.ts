import { useState, useMemo, useCallback } from 'react';
import { AwardCeremony, AwardCategory, Artist } from '../types';
import { playSound } from '../utils/audioSystem';
import {
  Trophy,
  Crown,
  Sparkles,
  Disc3,
  Sliders,
  Award,
  LucideIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface UseAwardsGalaProps {
  ceremony: AwardCeremony;
  player: Artist;
}

export interface UseAwardsGalaResult {
  categories: AwardCategory[];
  currentCategoryIndex: number;
  currentCategory?: AwardCategory;
  revealedCategories: Record<number, boolean>;
  isCurrentRevealed: boolean;
  allRevealed: boolean;
  showSummary: boolean;
  playerTotalNominations: number;
  playerTotalWins: number;
  temporality: {
    year: number;
    yearEndBadge: string;
    galaSubtitle: string;
    headerLabel: string;
  };
  getCategoryIcon: (name: string) => LucideIcon;
  handleRevealWinner: (index?: number) => void;
  handleRevealAll: () => void;
  handleNextCategory: () => void;
  handlePrevCategory: () => void;
  handleSelectCategory: (index: number) => void;
  setShowSummary: (show: boolean) => void;
}

/**
 * Custom Hook for AwardsGalaModal navigation, reveals, celebrations and contextual temporality
 */
export function useAwardsGala({
  ceremony,
  player
}: UseAwardsGalaProps): UseAwardsGalaResult {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const [revealedCategories, setRevealedCategories] = useState<Record<number, boolean>>({});
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const categories = useMemo(() => ceremony.categories || [], [ceremony.categories]);
  const currentCategory = categories[currentCategoryIndex];
  const isCurrentRevealed = !!revealedCategories[currentCategoryIndex];
  const allRevealed = useMemo(() => {
    return categories.length > 0 && categories.every((_, idx) => !!revealedCategories[idx]);
  }, [categories, revealedCategories]);

  // Contextual Temporality metadata
  const temporality = useMemo(() => ({
    year: ceremony.year,
    yearEndBadge: `Fin del Año ${ceremony.year}`,
    galaSubtitle: `Premios de la Academia Musical • Cierre de Temporada ${ceremony.year}`,
    headerLabel: `Gala Anual de la Música • Diciembre ${ceremony.year}`
  }), [ceremony.year]);

  // Calculate player performance in this ceremony
  const playerTotalNominations = useMemo(() => {
    return categories.filter(c =>
      c.playerNominated ||
      c.nomineeArtistIds?.includes(player.id) ||
      c.nominees?.some(n => n.artistId === player.id)
    ).length;
  }, [categories, player.id]);

  const playerTotalWins = useMemo(() => {
    return categories.filter(c => c.playerWon || c.winnerArtistId === player.id).length;
  }, [categories, player.id]);

  const getCategoryIcon = useCallback((name: string): LucideIcon => {
    if (name.includes('Artista')) return Crown;
    if (name.includes('Canción')) return Disc3;
    if (name.includes('Álbum')) return Trophy;
    if (name.includes('Nuevo') || name.includes('Revelación')) return Sparkles;
    if (name.includes('Producción')) return Sliders;
    return Award;
  }, []);

  const triggerVictoryConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#06b6d4', '#f97316', '#ffd700']
      });
    } catch {
      // Gracefully continue if confetti canvas is unavailable
    }
  }, []);

  const handleRevealWinner = useCallback((index?: number) => {
    const targetIdx = index ?? currentCategoryIndex;
    setRevealedCategories(prev => ({ ...prev, [targetIdx]: true }));
    playSound('award');

    const cat = categories[targetIdx];
    if (cat && (cat.winnerArtistId === player.id || cat.playerWon)) {
      triggerVictoryConfetti();
    }
  }, [currentCategoryIndex, categories, player.id, triggerVictoryConfetti]);

  const handleRevealAll = useCallback(() => {
    const allRev: Record<number, boolean> = {};
    categories.forEach((_, idx) => {
      allRev[idx] = true;
    });
    setRevealedCategories(allRev);
    playSound('award');

    if (playerTotalWins > 0) {
      triggerVictoryConfetti();
    }
  }, [categories, playerTotalWins, triggerVictoryConfetti]);

  const handleNextCategory = useCallback(() => {
    playSound('click');
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
      if (playerTotalWins > 0) {
        playSound('level_up');
        triggerVictoryConfetti();
      }
    }
  }, [currentCategoryIndex, categories.length, playerTotalWins, triggerVictoryConfetti]);

  const handlePrevCategory = useCallback(() => {
    playSound('click');
    if (showSummary) {
      setShowSummary(false);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  }, [showSummary, currentCategoryIndex]);

  const handleSelectCategory = useCallback((index: number) => {
    playSound('click');
    setShowSummary(false);
    setCurrentCategoryIndex(index);
  }, []);

  return {
    categories,
    currentCategoryIndex,
    currentCategory,
    revealedCategories,
    isCurrentRevealed,
    allRevealed,
    showSummary,
    playerTotalNominations,
    playerTotalWins,
    temporality,
    getCategoryIcon,
    handleRevealWinner,
    handleRevealAll,
    handleNextCategory,
    handlePrevCategory,
    handleSelectCategory,
    setShowSummary
  };
}
