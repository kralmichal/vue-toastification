export enum TYPE {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  DEFAULT = "default",
}

export enum POSITION {
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

export enum EVENTS {
  ADD = "add",
  DISMISS = "dismiss",
  UPDATE = "update",
  CLEAR = "clear",
  UPDATE_DEFAULTS = "update_defaults",
}

export enum ANIMATION_TYPE {
  FADE = "fade",
  SLIDE_UP = "slide-up",
  SLIDE_DOWN = "slide-down",
  SLIDE_LEFT = "slide-left",
  SLIDE_RIGHT = "slide-right",
  SCALE = "scale",
  SCALE_BOUNCE = "scale-bounce",
  ROTATE_IN = "rotate-in",
  SLIDE_SCALE = "slide-scale",
  FADE_ROTATE = "fade-rotate",
  SPRING = "spring",
  BOUNCE = "bounce",
  SLIDE_BLURRED = "slideBlurred",
}

export const VT_NAMESPACE = "Vue-Toastification"
