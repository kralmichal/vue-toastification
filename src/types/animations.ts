export enum ANIMATION_TYPE {
  FADE = "fade",
  SLIDE_UP = "slide-up",
  SLIDE_DOWN = "slide-down",
  SLIDE_LEFT = "slide-left",
  SLIDE_RIGHT = "slide-right",
  SCALE = "scale",
  SCALE_BOUNCE = "scale-bounce",
  ROTATE_IN = "rotate-in",
  ROTATE_OUT = "rotate-out",
  SLIDE_SCALE = "slide-scale",
  FADE_ROTATE = "fade-rotate",
  SPRING = "spring",
}

export enum EASING_TYPE {
  EASE = "ease",
  EASE_IN = "ease-in",
  EASE_OUT = "ease-out",
  EASE_IN_OUT = "ease-in-out",
  EASE_IN_BACK = "ease-in-back",
  EASE_OUT_BACK = "ease-out-back",
  EASE_IN_OUT_BACK = "ease-in-out-back",
  EASE_IN_BOUNCE = "ease-in-bounce",
  EASE_OUT_BOUNCE = "ease-out-bounce",
  EASE_IN_OUT_BOUNCE = "ease-in-out-bounce",
  CUSTOM = "custom",
}

export interface SpringConfig {
  tension?: number
  friction?: number
  mass?: number
  velocity?: number
}

export interface AnimationConfig {
  type: string // Changed from ANIMATION_TYPE to string for flexibility
  duration?: number
  easing?: EASING_TYPE
  customEasing?: string // cubic-bezier values
  spring?: SpringConfig
  delay?: number
}

export interface TransitionConfig {
  enter: AnimationConfig
  leave: AnimationConfig
  respectsReducedMotion?: boolean
}
