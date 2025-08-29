import type { ToastInterface } from "./ts/interface"
import type {
  AnimationConfig,
  TransitionConfig,
  SpringConfig,
} from "./types/animations"
import type { PluginOptions } from "./types/plugin"

import "./scss/index.scss"
import {
  createToastInstance,
  provideToast,
  useToast,
} from "./ts/composables/useToast"
import { POSITION, TYPE, ANIMATION_TYPE } from "./ts/constants"
import { EventBus } from "./ts/eventBus"
import { VueToastificationPlugin } from "./ts/plugin"

export default VueToastificationPlugin

export {
  createToastInstance,
  provideToast,
  useToast,
  EventBus,
  POSITION,
  TYPE,
  ANIMATION_TYPE,
  PluginOptions,
  ToastInterface,
  AnimationConfig,
  TransitionConfig,
  SpringConfig,
}
