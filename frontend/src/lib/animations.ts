// src/lib/animations.ts
import { Variants } from 'framer-motion';

/**
 * For the root of a panel or a major section that appears.
 * Slides up and fades in.
 */
export const panelSlideUpFadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};

/**
 * For content that expands/collapses (e.g., accordion content).
 * Animates height and opacity.
 */
export const contentCollapseVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.4, ease: 'easeInOut', when: 'beforeChildren' },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: 'easeInOut', when: 'afterChildren' },
  },
};

/**
 * For individual items appearing within a list or small elements like messages.
 * Fades in and slides down slightly.
 */
export const itemFadeSlideDownVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }, // Can adjust exit y if needed
};

/**
 * For list items appearing with a horizontal slide and fade.
 */
export const listItemSlideFadeInVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
  exit: { opacity: 0, x: 15, transition: { duration: 0.2 } },
};

/**
 * Container variant for staggering the animation of its children.
 */
export const listContainerStaggerVariants: Variants = {
  hidden: { opacity: 0 }, // Parent can also fade if needed
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Adjust timing as needed
      delayChildren: 0.1,    // Optional delay before first child
    },
  },
};

/**
 * Simple fade in/out for elements.
 */
export const simpleFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * For chevron icons indicating open/closed states.
 */
export const chevronRotateVariants = (isActive: boolean) => ({
  animate: { rotate: isActive ? 180 : 0 },
  transition: { duration: 0.3 },
});

// You can add more specific or complex variants here as needed
/**
 * Common hover/tap animation for buttons.
 */
export const buttonHoverTapVariants = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

/**
 * More subtle scale effect for list items or small elements.
 */
export const subtleScaleHoverTapVariants = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};