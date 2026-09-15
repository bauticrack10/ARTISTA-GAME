import type React from 'react';

/**
 * Keyboard activation for non-button elements that act as buttons (selection cards, toggles).
 * Pair with role="button" and tabIndex={0}; Enter and Space trigger the element's own onClick.
 */
export const activateOnKey = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.target !== e.currentTarget) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.currentTarget.click();
  }
};
