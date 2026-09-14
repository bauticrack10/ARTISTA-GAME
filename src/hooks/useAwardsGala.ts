import { useState, useMemo, useCallback } from 'react';
import { AwardCeremony, AwardCategory, Artist, AwardNominee } from '../types';
import { playSound } from '../utils/audioSystem';
import {
  Trophy,
  Crown,
  Sparkles,
  Disc3,
  Sliders,
  Award,
  Play,
  LucideIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type CeremonyPhase = 'presentation' | 'nominees' | 'deliberation' | 'envelope' | 'revealed';

export interface UseAwardsGalaProps {
  ceremony: AwardCeremony;
  player: Artist;
}

export interface UseAwardsGalaResult {
  categories: AwardCategory[];
  currentCategoryIndex: number;
  currentCategory?: AwardCategory;
  categoryPhase: CeremonyPhase;
  revealedCategories: Record<number, boolean>;
  isCurrentRevealed: boolean;
  allRevealed: boolean;
  showSummary: boolean;
  selectedNomineeIndex: number | null;
  playerTotalNominations: number;
  playerTotalWins: number;
  temporality: {
    year: number;
    yearEndBadge: string;
    galaSubtitle: string;
    headerLabel: string;
    eligibilityPeriod: string;
  };
  getCategoryIcon: (name: string) => LucideIcon;
  setCategoryPhase: (phase: CeremonyPhase) => void;
  setSelectedNomineeIndex: (index: number | null) => void;
  handleAdvancePhase: () => void;
  handleOpenEnvelope: (index?: number) => void;
  handleRevealWinner: (index?: number) => void;
  handleRevealAll: () => void;
  handleNextCategory: () => void;
  handlePrevCategory: () => void;
  handleSelectCategory: (index: number) => void;
  setShowSummary: (show: boolean) => void;
}

/**
 * Custom Hook for AwardsGalaModal navigation, progressive reveals, celebrations and contextual temporality.
 */
export function useAwardsGala({
  ceremony,
  player
}: UseAwardsGalaProps): UseAwardsGalaResult {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const [revealedCategories, setRevealedCategories] = useState<Record<number, boolean>>({});
  const [categoryPhase, setCategoryPhase] = useState<CeremonyPhase>('presentation');
  const [selectedNomineeIndex, setSelectedNomineeIndex] = useState<number | null>(null);
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
    yearEndBadge: `Gala Anual ${ceremony.year}`,
    galaSubtitle: `Premios de la Academia Musical • Edición ${ceremony.year}`,
    headerLabel: `Premios de la Música • Diciembre ${ceremony.year}`,
    eligibilityPeriod: ceremony.eligibilityPeriod || `Temporada ${ceremony.year} (1 de Enero - 31 de Diciembre)`
  }), [ceremony.year, ceremony.eligibilityPeriod]);

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
    if (name.includes('Álbum')) return Trophy;
    if (name.includes('Grabación')) return Disc3;
    if (name.includes('Canción')) return Sparkles;
    if (name.includes('Nuevo') || name.includes('Revelación')) return Sparkles;
    if (name.includes('Colaboración')) return Crown;
    if (name.includes('Video') || name.includes('Visual')) return Play;
    if (name.includes('Producción') || name.includes('Urbana')) return Sliders;
    return Award;
  }, []);

  const triggerVictoryConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#06b6d4', '#f97316', '#ffd700']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleOpenEnvelope = useCallback((index?: number) => {
    const targetIdx = index ?? currentCategoryIndex;
    playSound('award');
    setRevealedCategories(prev => ({ ...prev, [targetIdx]: true }));
    setCategoryPhase('revealed');

    const cat = categories[targetIdx];
    if (cat && (cat.winnerArtistId === player.id || cat.playerWon)) {
      triggerVictoryConfetti();
    }
  }, [currentCategoryIndex, categories, player.id, triggerVictoryConfetti]);

  const handleRevealWinner = useCallback((index?: number) => {
    handleOpenEnvelope(index);
  }, [handleOpenEnvelope]);

  const handleAdvancePhase = useCallback(() => {
    playSound('click');
    if (isCurrentRevealed) {
      setCategoryPhase('revealed');
      return;
    }
    if (categoryPhase === 'presentation') {
      setCategoryPhase('nominees');
    } else if (categoryPhase === 'nominees') {
      setCategoryPhase('deliberation');
    } else if (categoryPhase === 'deliberation') {
      setCategoryPhase('envelope');
    } else if (categoryPhase === 'envelope') {
      handleOpenEnvelope();
    }
  }, [categoryPhase, isCurrentRevealed, handleOpenEnvelope]);

  const handleRevealAll = useCallback(() => {
    const allRev: Record<number, boolean> = {};
    categories.forEach((_, idx) => {
      allRev[idx] = true;
    });
    setRevealedCategories(allRev);
    setCategoryPhase('revealed');
    playSound('award');

    if (playerTotalWins > 0) {
      triggerVictoryConfetti();
    }
  }, [categories, playerTotalWins, triggerVictoryConfetti]);

  const handleNextCategory = useCallback(() => {
    playSound('click');
    if (currentCategoryIndex < categories.length - 1) {
      const nextIdx = currentCategoryIndex + 1;
      setCurrentCategoryIndex(nextIdx);
      setSelectedNomineeIndex(null);
      setCategoryPhase(revealedCategories[nextIdx] ? 'revealed' : 'presentation');
    } else {
      setShowSummary(true);
      if (playerTotalWins > 0) {
        playSound('level_up');
        triggerVictoryConfetti();
      }
    }
  }, [currentCategoryIndex, categories.length, revealedCategories, playerTotalWins, triggerVictoryConfetti]);

  const handlePrevCategory = useCallback(() => {
    playSound('click');
    if (showSummary) {
      setShowSummary(false);
      setCategoryPhase(revealedCategories[currentCategoryIndex] ? 'revealed' : 'presentation');
    } else if (currentCategoryIndex > 0) {
      const prevIdx = currentCategoryIndex - 1;
      setCurrentCategoryIndex(prevIdx);
      setSelectedNomineeIndex(null);
      setCategoryPhase(revealedCategories[prevIdx] ? 'revealed' : 'presentation');
    }
  }, [showSummary, currentCategoryIndex, revealedCategories]);

  const handleSelectCategory = useCallback((index: number) => {
    playSound('click');
    setShowSummary(false);
    setCurrentCategoryIndex(index);
    setSelectedNomineeIndex(null);
    setCategoryPhase(revealedCategories[index] ? 'revealed' : 'presentation');
  }, [revealedCategories]);

  return {
    categories,
    currentCategoryIndex,
    currentCategory,
    categoryPhase,
    revealedCategories,
    isCurrentRevealed,
    allRevealed,
    showSummary,
    selectedNomineeIndex,
    playerTotalNominations,
    playerTotalWins,
    temporality,
    getCategoryIcon,
    setCategoryPhase,
    setSelectedNomineeIndex,
    handleAdvancePhase,
    handleOpenEnvelope,
    handleRevealWinner,
    handleRevealAll,
    handleNextCategory,
    handlePrevCategory,
    handleSelectCategory,
    setShowSummary
  };
}
