import { ref, computed, onUnmounted, getCurrentInstance } from "vue"

export interface SpringState {
  value: number
  velocity: number
}

export interface SpringConfig {
  tension?: number
  friction?: number
  mass?: number
  velocity?: number
}

export interface SpringOptions extends SpringConfig {
  from?: number
  to?: number
  onUpdate?: (value: number) => void
  onComplete?: () => void
}

export function useSpringAnimation(options: SpringOptions = {}) {
  const {
    tension = 170,
    friction = 26,
    mass = 1,
    velocity = 0,
    from = 0,
    to: initialTo = 1,
    onUpdate,
    onComplete,
  } = options

  const targetValue = ref(initialTo)
  const state = ref<SpringState>({
    value: from,
    velocity,
  })

  const isRunning = ref(false)
  const animationId = ref<number | null>(null)

  const progress = computed(() => {
    const range = targetValue.value - from
    if (range === 0) return 1
    return Math.min(Math.max((state.value.value - from) / range, 0), 1)
  })

  const isComplete = computed(() => {
    const threshold = 0.001
    const valueClose =
      Math.abs(state.value.value - targetValue.value) < threshold
    const velocityLow = Math.abs(state.value.velocity) < threshold
    return valueClose && velocityLow
  })

  function animate() {
    if (isComplete.value) {
      isRunning.value = false
      state.value.value = targetValue.value
      onComplete?.()
      return
    }

    const dt = 1 / 60 // 60fps
    const force = -tension * (state.value.value - targetValue.value)
    const damping = -friction * state.value.velocity
    const acceleration = (force + damping) / mass

    state.value.velocity += acceleration * dt
    state.value.value += state.value.velocity * dt

    onUpdate?.(state.value.value)

    if (isRunning.value) {
      animationId.value = requestAnimationFrame(animate)
    }
  }

  function start(newTarget?: number) {
    if (newTarget !== undefined) {
      targetValue.value = newTarget
    }

    if (isRunning.value) {
      stop()
    }

    isRunning.value = true
    animationId.value = requestAnimationFrame(animate)
  }

  function stop() {
    isRunning.value = false
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
  }

  function reset(newFrom?: number) {
    stop()
    state.value.value = newFrom ?? from
    state.value.velocity = 0
  }

  function setValue(value: number, newVelocity = 0) {
    state.value.value = value
    state.value.velocity = newVelocity
  }

  // Only register onUnmounted if we're inside a component
  if (getCurrentInstance()) {
    onUnmounted(() => {
      stop()
    })
  }

  return {
    state: computed(() => state.value),
    progress,
    isRunning: computed(() => isRunning.value),
    isComplete,
    start,
    stop,
    reset,
    setValue,
  }
}
