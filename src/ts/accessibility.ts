/**
 * Accessibility enhancements for Vue Toastification
 * Provides screen reader announcements, keyboard navigation, and ARIA support
 */
import { ref, onMounted, onUnmounted } from "vue"

import type { TYPE } from "./constants"
import type { ToastID } from "../types/common"

export interface AccessibilityOptions {
  /**
   * Enable screen reader announcements
   */
  announceToasts?: boolean
  /**
   * Custom announcement templates
   */
  announcements?: {
    success?: string
    error?: string
    warning?: string
    info?: string
    default?: string
  }
  /**
   * ARIA live region politeness level
   */
  politeness?: "polite" | "assertive"
  /**
   * Enable keyboard navigation
   */
  keyboardNavigation?: boolean
  /**
   * Focus management for interactive toasts
   */
  focusManagement?: boolean
}

// Default announcement templates
const DEFAULT_ANNOUNCEMENTS = {
  success: "Success: {message}",
  error: "Error: {message}",
  warning: "Warning: {message}",
  info: "Information: {message}",
  default: "Notification: {message}",
}

// ARIA live region manager
class AriaLiveRegionManager {
  private politeRegion: HTMLElement | null = null
  private assertiveRegion: HTMLElement | null = null
  private isInitialized = false

  initialize() {
    if (this.isInitialized || typeof window === "undefined") return

    // Create polite live region
    this.politeRegion = document.createElement("div")
    this.politeRegion.setAttribute("aria-live", "polite")
    this.politeRegion.setAttribute("aria-atomic", "true")
    this.politeRegion.setAttribute("class", "vt-sr-only")
    this.politeRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `

    // Create assertive live region
    this.assertiveRegion = document.createElement("div")
    this.assertiveRegion.setAttribute("aria-live", "assertive")
    this.assertiveRegion.setAttribute("aria-atomic", "true")
    this.assertiveRegion.setAttribute("class", "vt-sr-only")
    this.assertiveRegion.style.cssText = this.politeRegion.style.cssText

    // Add to DOM
    document.body.appendChild(this.politeRegion)
    document.body.appendChild(this.assertiveRegion)

    this.isInitialized = true
  }

  announce(message: string, politeness: "polite" | "assertive" = "polite") {
    if (!this.isInitialized) this.initialize()

    const region =
      politeness === "assertive" ? this.assertiveRegion : this.politeRegion
    if (!region) return

    // Clear previous message
    region.textContent = ""

    // Set new message after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      region.textContent = message
    }, 100)

    // Clear message after announcement to avoid repetition
    setTimeout(() => {
      region.textContent = ""
    }, 1000)
  }

  cleanup() {
    if (this.politeRegion) {
      document.body.removeChild(this.politeRegion)
      this.politeRegion = null
    }
    if (this.assertiveRegion) {
      document.body.removeChild(this.assertiveRegion)
      this.assertiveRegion = null
    }
    this.isInitialized = false
  }
}

// Global live region manager instance
const liveRegionManager = new AriaLiveRegionManager()

// Keyboard navigation manager
class KeyboardNavigationManager {
  private activeToasts: Set<ToastID> = new Set()
  private currentFocusIndex = -1
  private keyboardHandlers = new Map<string, () => void>()

  constructor() {
    this.setupKeyboardHandlers()
  }

  private setupKeyboardHandlers() {
    this.keyboardHandlers.set("Escape", () => {
      this.dismissCurrentToast()
    })

    this.keyboardHandlers.set("ArrowUp", () => {
      this.focusPreviousToast()
    })

    this.keyboardHandlers.set("ArrowDown", () => {
      this.focusNextToast()
    })

    this.keyboardHandlers.set("Enter", () => {
      this.activateCurrentToast()
    })

    this.keyboardHandlers.set(" ", () => {
      this.activateCurrentToast()
    })
  }

  handleKeyDown(event: KeyboardEvent) {
    const handler = this.keyboardHandlers.get(event.key)
    if (handler) {
      event.preventDefault()
      handler()
    }
  }

  addToast(toastId: ToastID) {
    this.activeToasts.add(toastId)
  }

  removeToast(toastId: ToastID) {
    this.activeToasts.delete(toastId)
    if (this.activeToasts.size === 0) {
      this.currentFocusIndex = -1
    }
  }

  private focusPreviousToast() {
    const toasts = Array.from(this.activeToasts)
    if (toasts.length === 0) return

    this.currentFocusIndex =
      this.currentFocusIndex <= 0
        ? toasts.length - 1
        : this.currentFocusIndex - 1

    this.focusToastByIndex(this.currentFocusIndex)
  }

  private focusNextToast() {
    const toasts = Array.from(this.activeToasts)
    if (toasts.length === 0) return

    this.currentFocusIndex =
      this.currentFocusIndex >= toasts.length - 1
        ? 0
        : this.currentFocusIndex + 1

    this.focusToastByIndex(this.currentFocusIndex)
  }

  private focusToastByIndex(index: number) {
    const toasts = Array.from(this.activeToasts)
    const toastId = toasts[index]
    if (!toastId) return

    const toastElement = document.querySelector(
      `[data-toast-id="${toastId}"]`,
    ) as HTMLElement
    if (toastElement) {
      toastElement.focus()
    }
  }

  private dismissCurrentToast() {
    const toasts = Array.from(this.activeToasts)
    const toastId = toasts[this.currentFocusIndex]
    if (!toastId) return

    // Trigger close event
    const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`)
    if (toastElement) {
      const closeEvent = new CustomEvent("toast-dismiss", {
        detail: { toastId },
      })
      toastElement.dispatchEvent(closeEvent)
    }
  }

  private activateCurrentToast() {
    const toasts = Array.from(this.activeToasts)
    const toastId = toasts[this.currentFocusIndex]
    if (!toastId) return

    // Trigger click event on the toast
    const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`)
    if (toastElement) {
      const clickEvent = new MouseEvent("click", { bubbles: true })
      toastElement.dispatchEvent(clickEvent)
    }
  }
}

// Global keyboard navigation manager
const keyboardManager = new KeyboardNavigationManager()

/**
 * Composable for accessibility features
 */
export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    announceToasts = true,
    announcements = DEFAULT_ANNOUNCEMENTS,
    politeness = "polite",
    keyboardNavigation = true,
    focusManagement = true,
  } = options

  const isEnabled = ref(announceToasts)

  onMounted(() => {
    if (announceToasts) {
      liveRegionManager.initialize()
    }

    if (keyboardNavigation) {
      document.addEventListener(
        "keydown",
        keyboardManager.handleKeyDown.bind(keyboardManager),
      )
    }
  })

  onUnmounted(() => {
    if (keyboardNavigation) {
      document.removeEventListener(
        "keydown",
        keyboardManager.handleKeyDown.bind(keyboardManager),
      )
    }
  })

  /**
   * Announce a toast to screen readers
   */
  const announceToast = (content: string, type: TYPE | string = "default") => {
    if (!isEnabled.value) return

    const template =
      announcements[type as keyof typeof announcements] || announcements.default
    const message = template?.replace("{message}", content) || content

    // Use assertive for errors, polite for others
    const announcementPoliteness = type === "error" ? "assertive" : politeness

    liveRegionManager.announce(message, announcementPoliteness)
  }

  /**
   * Register a toast for keyboard navigation
   */
  const registerToast = (toastId: ToastID) => {
    if (keyboardNavigation) {
      keyboardManager.addToast(toastId)
    }
  }

  /**
   * Unregister a toast from keyboard navigation
   */
  const unregisterToast = (toastId: ToastID) => {
    if (keyboardNavigation) {
      keyboardManager.removeToast(toastId)
    }
  }

  /**
   * Get ARIA attributes for a toast element
   */
  const getToastAriaAttributes = (
    toastId: ToastID,
    type: TYPE | string = "default",
  ) => {
    return {
      role: type === "error" ? "alert" : "status",
      "aria-live": type === "error" ? "assertive" : "polite",
      "aria-atomic": "true",
      "data-toast-id": toastId,
      tabindex: keyboardNavigation ? "0" : undefined,
    }
  }

  /**
   * Get focus management attributes for interactive elements
   */
  const getFocusAttributes = (isInteractive = false) => {
    if (!focusManagement || !isInteractive) return {}

    return {
      tabindex: "0",
      role: "button",
      "aria-describedby": "toast-instructions",
    }
  }

  /**
   * Enable or disable accessibility features
   */
  const setEnabled = (enabled: boolean) => {
    isEnabled.value = enabled
  }

  return {
    isEnabled,
    announceToast,
    registerToast,
    unregisterToast,
    getToastAriaAttributes,
    getFocusAttributes,
    setEnabled,
  }
}

/**
 * High contrast theme support
 */
export function useHighContrast() {
  const isHighContrast = ref(false)

  onMounted(() => {
    // Check for high contrast preference
    const checkHighContrast = () => {
      const highContrastQuery = window.matchMedia("(prefers-contrast: high)")
      isHighContrast.value = highContrastQuery.matches
    }

    checkHighContrast()

    // Listen for changes
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)")
    if (highContrastQuery.addEventListener) {
      highContrastQuery.addEventListener("change", checkHighContrast)
    } else {
      // Fallback for older browsers
      highContrastQuery.addListener(checkHighContrast)
    }
  })

  return {
    isHighContrast,
  }
}

/**
 * Reduced motion support
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    const checkReducedMotion = () => {
      const reducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      )
      prefersReducedMotion.value = reducedMotionQuery.matches
    }

    checkReducedMotion()

    // Listen for changes
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    )
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", checkReducedMotion)
    } else {
      // Fallback for older browsers
      reducedMotionQuery.addListener(checkReducedMotion)
    }
  })

  return {
    prefersReducedMotion,
  }
}

// Cleanup function for global managers
export function cleanupAccessibility() {
  liveRegionManager.cleanup()
}
