import { TargetAndTransition, Transition } from 'motion/react'

export interface AnimationPreset {
  initial: TargetAndTransition
  animate: TargetAndTransition
  exit: TargetAndTransition
  transition: Transition
}

const baseTransition: Transition = { duration: 0.2, ease: 'easeOut' }

export const fadeInUp: AnimationPreset = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: baseTransition,
}

export const scaleIn: AnimationPreset = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

export const slideInRight: AnimationPreset = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
  transition: baseTransition,
}

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
}
