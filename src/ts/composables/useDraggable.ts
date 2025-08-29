import {
  toRefs,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue"

import { MemoryManager } from "../memoryManager"
import { isDOMRect, getX, getY } from "../utils"

import type { Draggable } from "../../types/common"

export interface MobileDragOptions {
  swipeThreshold?: number
  velocityThreshold?: number
  touchHoldDelay?: number
  preventScrollDuringDrag?: boolean
}

export const useDraggable = (
  el: Ref<HTMLElement | undefined>,
  props: Required<Draggable>,
  mobileOptions: MobileDragOptions = {}
) => {
  // Extract used props
  const { draggablePercent, draggable } = toRefs(props)

  // Create memory manager instance for this composable
  const memoryManager = new MemoryManager()

  // Mobile-specific options with defaults
  const {
    swipeThreshold = 10,
    velocityThreshold = 0.5,
    touchHoldDelay = 100,
    preventScrollDuringDrag = true,
  } = mobileOptions

  // Define state
  const dragRect = computed(() =>
    el.value ? el.value.getBoundingClientRect() : undefined
  )
  const dragStarted = ref(false)
  const beingDragged = ref(false)
  const dragPos = ref({ x: 0, y: 0 })
  const dragStart = ref(0)
  const dragStartTime = ref(0)
  const dragVelocity = ref(0)
  const touchHoldTimer = ref<number | null>(null)
  const isDragIntentional = ref(false)

  const dragDelta = computed(() =>
    beingDragged.value ? dragPos.value.x - dragStart.value : 0
  )
  const dragComplete = ref(false)

  // Enhanced mobile detection
  const isMobileDevice = computed(() => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    )
  })

  // Computed state
  const removalDistance = computed(() => {
    if (!isDOMRect(dragRect.value)) return 0

    const baseDistance =
      (dragRect.value.right - dragRect.value.left) * draggablePercent.value

    // Reduce required distance on mobile for easier dismissal
    return isMobileDevice.value ? baseDistance * 0.8 : baseDistance
  })

  // Enhanced velocity calculation
  const calculateVelocity = (currentTime: number, currentPos: number) => {
    const timeDelta = currentTime - dragStartTime.value
    const posDelta = currentPos - dragStart.value
    return timeDelta > 0 ? Math.abs(posDelta) / timeDelta : 0
  }

  // Update style to match drag
  watch(
    [
      el,
      dragStart,
      dragPos,
      dragDelta,
      removalDistance,
      beingDragged,
      dragComplete,
    ],
    () => {
      /* istanbul ignore else  */
      if (el.value) {
        if (dragComplete.value) {
          // Maintain final position when drag is complete
          el.value.style.transform = `translateX(${dragDelta.value}px)`
          el.value.style.opacity = "0"
          el.value.style.transition = ""
        } else if (dragStart.value === dragPos.value.x) {
          el.value.style.transform = "translateX(0px)"
          el.value.style.opacity = "1"
          el.value.style.transition = ""
        } else if (beingDragged.value) {
          const transform = `translateX(${dragDelta.value}px)`
          const opacity = 1 - Math.abs(dragDelta.value / removalDistance.value)

          el.value.style.transform = transform
          el.value.style.opacity = `${Math.max(0.1, opacity)}`

          // Add visual feedback for mobile
          if (isMobileDevice.value) {
            el.value.style.willChange = "transform, opacity"
            el.value.style.backfaceVisibility = "hidden"
          }
        } else {
          el.value.style.transform = "translateX(0px)"
          el.value.style.opacity = "1"
          el.value.style.transition =
            "transform 0.2s ease-out, opacity 0.2s ease-out"
          if (isMobileDevice.value) {
            el.value.style.willChange = "auto"
          }
        }
      }
    }
  )

  // Enhanced drag start handler
  const onDragStart = (event: TouchEvent | MouseEvent) => {
    if (!draggable.value) return

    const currentTime = Date.now()
    const pos = { x: getX(event), y: getY(event) }

    dragStarted.value = true
    dragPos.value = pos
    dragStart.value = pos.x
    dragStartTime.value = currentTime
    isDragIntentional.value = false

    // For touch events, wait a bit to distinguish between tap and drag
    if (event.type === "touchstart") {
      touchHoldTimer.value = memoryManager.setTimeout(() => {
        isDragIntentional.value = true
      }, touchHoldDelay)
    } else {
      isDragIntentional.value = true
    }
  }

  // Enhanced drag move handler
  const onDragMove = (event: TouchEvent | MouseEvent) => {
    if (!dragStarted.value) return

    const currentTime = Date.now()
    const currentPos = { x: getX(event), y: getY(event) }
    const deltaX = Math.abs(currentPos.x - dragStart.value)
    const deltaY = Math.abs(currentPos.y - dragPos.value.y)

    // Check if this is an intentional horizontal drag
    if (!beingDragged.value) {
      // For mobile, require minimum threshold to prevent accidental drags
      if (deltaX < swipeThreshold) return

      // Prefer horizontal movement for drag (vs vertical scroll)
      if (deltaY > deltaX * 1.5) {
        // More vertical than horizontal - likely a scroll
        if (touchHoldTimer.value) {
          memoryManager.clearTimer(touchHoldTimer.value)
          touchHoldTimer.value = null
        }
        dragStarted.value = false
        return
      }
    }

    beingDragged.value = true

    // Prevent scrolling during drag if configured
    if (preventScrollDuringDrag && event.type.startsWith("touch")) {
      event.preventDefault()
    }

    dragPos.value = currentPos
    dragVelocity.value = calculateVelocity(currentTime, currentPos.x)
  }

  // Enhanced drag end handler
  const onDragEnd = () => {
    if (touchHoldTimer.value) {
      memoryManager.clearTimer(touchHoldTimer.value)
      touchHoldTimer.value = null
    }

    dragStarted.value = false

    if (beingDragged.value) {
      const distanceThreshold = removalDistance.value
      const velocityDismiss =
        dragVelocity.value > velocityThreshold &&
        Math.abs(dragDelta.value) > swipeThreshold

      // Enhanced dismissal logic: distance OR velocity
      if (Math.abs(dragDelta.value) >= distanceThreshold || velocityDismiss) {
        dragComplete.value = true
      } else {
        memoryManager.setTimeout(() => {
          beingDragged.value = false
          dragVelocity.value = 0
        })
      }
    }
  }

  // Viewport change handler for mobile keyboard
  const handleViewportChange = () => {
    if (isMobileDevice.value && beingDragged.value) {
      // Reset drag if viewport changes (e.g., keyboard appears)
      beingDragged.value = false
      dragStarted.value = false
    }
  }

  onMounted(() => {
    if (draggable.value && el.value) {
      const element = el.value

      // Use memory manager for event listeners
      memoryManager.addEventListener(element, "touchstart", onDragStart, {
        passive: true,
      })
      memoryManager.addEventListener(element, "mousedown", onDragStart, {
        passive: true,
      })

      memoryManager.addEventListener(window, "touchmove", onDragMove, {
        passive: false,
      })
      memoryManager.addEventListener(window, "mousemove", onDragMove, {
        passive: true,
      })
      memoryManager.addEventListener(window, "touchend", onDragEnd, {
        passive: true,
      })
      memoryManager.addEventListener(window, "mouseup", onDragEnd, {
        passive: true,
      })

      // Listen for viewport changes (mobile keyboard)
      memoryManager.addEventListener(window, "resize", handleViewportChange, {
        passive: true,
      })
      memoryManager.addEventListener(
        window,
        "orientationchange",
        handleViewportChange,
        { passive: true }
      )
    }
  })

  onBeforeUnmount(() => {
    // Use memory manager for comprehensive cleanup
    memoryManager.cleanup()
  })

  return {
    dragComplete,
    beingDragged,
    isMobileDevice: computed(() => isMobileDevice.value),
    dragVelocity: computed(() => dragVelocity.value),
    // Expose memory stats for debugging
    memoryStats: computed(() => memoryManager.getStats()),
  }
}
