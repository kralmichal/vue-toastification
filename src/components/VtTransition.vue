<template>
  <transition-group
    type="animation"
    tag="div"
    :enter-active-class="
      getProp(transition, 'enter', `${getTransitionName()}-enter-active`)
    "
    :move-class="getProp(transition, 'move', `${getTransitionName()}-move`)"
    :leave-active-class="
      getProp(transition, 'leave', `${getTransitionName()}-leave-active`)
    "
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition-group>
</template>

<script lang="ts" setup>
// Enhanced transition component with spring animation support
import { computed, ref } from "vue"

import { useSpringAnimation } from "../ts/composables/useSpringAnimation"
import { ANIMATION_TYPE } from "../ts/constants"
import { TOAST_CONTAINER_DEFAULTS } from "../ts/propValidators"
import { getProp } from "../ts/utils"

import type { BaseToastContainerOptions } from "../types/toastContainer"

interface TransitionProps {
  transition?: BaseToastContainerOptions["transition"]
  springConfig?: {
    tension?: number
    friction?: number
    mass?: number
  }
  respectsReducedMotion?: boolean
}

const emit = defineEmits([
  "leave",
  "enter",
  "before-enter",
  "after-enter",
  "after-leave",
])

const props = withDefaults(defineProps<TransitionProps>(), {
  transition: TOAST_CONTAINER_DEFAULTS.transition,
  respectsReducedMotion: true,
  springConfig: () => ({
    tension: 170,
    friction: 26,
    mass: 1,
  }),
})

// Check if reduced motion is preferred
const prefersReducedMotion = computed(() => {
  if (!props.respectsReducedMotion) return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
})

const getTransitionName = () => {
  if (typeof props.transition === "string") {
    return props.transition
  }

  if (typeof props.transition === "object" && "enter" in props.transition) {
    return props.transition.enter || "vt-fade"
  }

  return "vt-fade"
}

const isSpringAnimation = computed(() => {
  const transitionName = getTransitionName()
  return (
    transitionName === ANIMATION_TYPE.SPRING || transitionName === "vt-spring"
  )
})

// Spring animation setup
const springElements = ref(
  new WeakMap<HTMLElement, ReturnType<typeof useSpringAnimation>>(),
)

const beforeEnter = (el: unknown) => {
  if (!(el instanceof HTMLElement)) return

  if (isSpringAnimation.value && !prefersReducedMotion.value) {
    // Initialize spring animation
    const spring = useSpringAnimation({
      from: 0,
      to: 1,
      tension: props.springConfig?.tension || 170,
      friction: props.springConfig?.friction || 26,
      mass: props.springConfig?.mass || 1,
      onUpdate: value => {
        if (el) {
          const scale = 0.8 + value * 0.2 // Scale from 0.8 to 1
          const translateY = (1 - value) * 20 // Translate from 20px to 0
          const opacity = value // Opacity from 0 to 1

          el.style.transform = `scale(${scale}) translateY(${translateY}px)`
          el.style.opacity = opacity.toString()
        }
      },
      onComplete: () => {
        if (el) {
          el.style.transform = ""
          el.style.opacity = ""
        }
      },
    })

    springElements.value.set(el, spring)

    // Set initial state
    el.style.transform = "scale(0.8) translateY(20px)"
    el.style.opacity = "0"
  }
}

const enter = (el: unknown) => {
  if (!(el instanceof HTMLElement)) return

  if (isSpringAnimation.value && !prefersReducedMotion.value) {
    const spring = springElements.value.get(el)
    if (spring) {
      spring.start()
    }
  }

  emit("enter", el)
}

const afterEnter = (el: unknown) => {
  if (!(el instanceof HTMLElement)) return

  if (isSpringAnimation.value) {
    // Clean up spring animation
    springElements.value.delete(el)
  }

  emit("after-enter", el)
}

const leave = (el: unknown) => {
  if (el instanceof HTMLElement) {
    el.style.left = el.offsetLeft + "px"
    el.style.top = el.offsetTop + "px"
    el.style.width = getComputedStyle(el).width
    el.style.position = "absolute"
  }

  emit("leave", el)
}

const afterLeave = (el: unknown) => {
  if (!(el instanceof HTMLElement)) return

  // Clean up any remaining styles
  if (isSpringAnimation.value) {
    el.style.transform = ""
    el.style.opacity = ""
  }

  emit("after-leave", el)
}
</script>
