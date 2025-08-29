import type { ToastInterface } from "./ts/interface"
import type {
  AnimationConfig,
  TransitionConfig,
  SpringConfig,
} from "./types/animations"
import type {
  ToastAction,
  ConfirmationToast,
  InteractiveToastOptions,
  ToastForm,
} from "./types/interactions"
import type { PluginOptions } from "./types/plugin"

import "./scss/index.scss"
import {
  useAccessibility,
  useHighContrast,
  useReducedMotion,
  cleanupAccessibility,
} from "./ts/accessibility"
import {
  createToastInstance,
  provideToast,
  useToast,
} from "./ts/composables/useToast"
import { POSITION, TYPE, ANIMATION_TYPE } from "./ts/constants"
import { EventBus } from "./ts/eventBus"
import { VueToastificationPlugin } from "./ts/plugin"
import { toastHelpers } from "./ts/toastHelpers"

export default VueToastificationPlugin

export {
  // Core functionality
  createToastInstance,
  provideToast,
  useToast,
  EventBus,
  // Constants
  POSITION,
  TYPE,
  ANIMATION_TYPE,
  // Types
  PluginOptions,
  ToastInterface,
  AnimationConfig,
  TransitionConfig,
  SpringConfig,
  ToastAction,
  ConfirmationToast,
  InteractiveToastOptions,
  ToastForm,
  // Enhanced functionality
  toastHelpers,
  // Accessibility
  useAccessibility,
  useHighContrast,
  useReducedMotion,
  cleanupAccessibility,
}
