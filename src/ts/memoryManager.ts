/**
 * Memory management utilities for better cleanup and performance
 */

// WeakMap for storing component references without creating memory leaks
export const componentRefs = new WeakMap<HTMLElement, any>()

// Registry for active event listeners
const activeListeners = new Map<
  string,
  {
    element: HTMLElement | Window | Document
    event: string
    handler: EventListener
    options?: AddEventListenerOptions
  }
>()

// Registry for active timers
const activeTimers = new Set<number>()

// Registry for active animation frames
const activeAnimationFrames = new Set<number>()

/**
 * Enhanced event listener management with automatic cleanup
 */
export class EventListenerManager {
  private listenerId = 0
  private listeners = new Map<string, () => void>()

  /**
   * Add an event listener with automatic cleanup tracking
   */
  addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): string
  addEventListener<K extends keyof WindowEventMap>(
    element: Window,
    event: K,
    handler: (event: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): string
  addEventListener<K extends keyof DocumentEventMap>(
    element: Document,
    event: K,
    handler: (event: DocumentEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): string
  addEventListener(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): string {
    const id = `listener_${++this.listenerId}`

    element.addEventListener(event, handler, options)

    // Store cleanup function
    this.listeners.set(id, () => {
      element.removeEventListener(event, handler, options)
    })

    // Store in global registry for debugging
    activeListeners.set(id, { element, event, handler, options })

    return id
  }

  /**
   * Remove a specific event listener
   */
  removeEventListener(id: string): void {
    const cleanup = this.listeners.get(id)
    if (cleanup) {
      cleanup()
      this.listeners.delete(id)
      activeListeners.delete(id)
    }
  }

  /**
   * Remove all managed event listeners
   */
  cleanup(): void {
    this.listeners.forEach((cleanup, id) => {
      cleanup()
      activeListeners.delete(id)
    })
    this.listeners.clear()
  }

  /**
   * Get count of active listeners (for debugging)
   */
  get activeCount(): number {
    return this.listeners.size
  }
}

/**
 * Timer management with automatic cleanup
 */
export class TimerManager {
  private timers = new Set<number>()

  /**
   * Set a timeout with automatic cleanup tracking
   */
  setTimeout(callback: () => void, delay?: number): number {
    const id = window.setTimeout(() => {
      callback()
      this.timers.delete(id)
      activeTimers.delete(id)
    }, delay)

    this.timers.add(id)
    activeTimers.add(id)

    return id
  }

  /**
   * Set an interval with automatic cleanup tracking
   */
  setInterval(callback: () => void, delay?: number): number {
    const id = window.setInterval(callback, delay)

    this.timers.add(id)
    activeTimers.add(id)

    return id
  }

  /**
   * Clear a specific timer
   */
  clearTimer(id: number): void {
    if (this.timers.has(id)) {
      window.clearTimeout(id)
      window.clearInterval(id)
      this.timers.delete(id)
      activeTimers.delete(id)
    }
  }

  /**
   * Clear all managed timers
   */
  cleanup(): void {
    this.timers.forEach(id => {
      window.clearTimeout(id)
      window.clearInterval(id)
      activeTimers.delete(id)
    })
    this.timers.clear()
  }

  /**
   * Get count of active timers (for debugging)
   */
  get activeCount(): number {
    return this.timers.size
  }
}

/**
 * Animation frame management with automatic cleanup
 */
export class AnimationFrameManager {
  private frames = new Set<number>()

  /**
   * Request animation frame with automatic cleanup tracking
   */
  requestAnimationFrame(callback: FrameRequestCallback): number {
    const id = requestAnimationFrame(time => {
      callback(time)
      this.frames.delete(id)
      activeAnimationFrames.delete(id)
    })

    this.frames.add(id)
    activeAnimationFrames.add(id)

    return id
  }

  /**
   * Cancel a specific animation frame
   */
  cancelAnimationFrame(id: number): void {
    if (this.frames.has(id)) {
      cancelAnimationFrame(id)
      this.frames.delete(id)
      activeAnimationFrames.delete(id)
    }
  }

  /**
   * Cancel all managed animation frames
   */
  cleanup(): void {
    this.frames.forEach(id => {
      cancelAnimationFrame(id)
      activeAnimationFrames.delete(id)
    })
    this.frames.clear()
  }

  /**
   * Get count of active animation frames (for debugging)
   */
  get activeCount(): number {
    return this.frames.size
  }
}

/**
 * Comprehensive memory manager for Vue Toastification components
 */
export class MemoryManager {
  private eventManager = new EventListenerManager()
  private timerManager = new TimerManager()
  private frameManager = new AnimationFrameManager()
  private observers = new Set<
    MutationObserver | ResizeObserver | IntersectionObserver
  >()

  /**
   * Add event listener with cleanup tracking
   */
  addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): string
  addEventListener<K extends keyof WindowEventMap>(
    element: Window,
    event: K,
    handler: (event: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): string
  addEventListener<K extends keyof DocumentEventMap>(
    element: Document,
    event: K,
    handler: (event: DocumentEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): string
  addEventListener(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): string {
    // Use type assertion since we know the event types are compatible
    return this.eventManager.addEventListener(
      element as any,
      event as any,
      handler,
      options,
    )
  }

  /**
   * Remove event listener
   */
  removeEventListener(id: string): void {
    this.eventManager.removeEventListener(id)
  }

  /**
   * Set timeout with cleanup tracking
   */
  setTimeout(callback: () => void, delay?: number): number {
    return this.timerManager.setTimeout(callback, delay)
  }

  /**
   * Set interval with cleanup tracking
   */
  setInterval(callback: () => void, delay?: number): number {
    return this.timerManager.setInterval(callback, delay)
  }

  /**
   * Clear timer
   */
  clearTimer(id: number): void {
    this.timerManager.clearTimer(id)
  }

  /**
   * Request animation frame with cleanup tracking
   */
  requestAnimationFrame(callback: FrameRequestCallback): number {
    return this.frameManager.requestAnimationFrame(callback)
  }

  /**
   * Cancel animation frame
   */
  cancelAnimationFrame(id: number): void {
    this.frameManager.cancelAnimationFrame(id)
  }

  /**
   * Add observer (MutationObserver, ResizeObserver, etc.) with cleanup tracking
   */
  addObserver(
    observer: MutationObserver | ResizeObserver | IntersectionObserver,
  ): void {
    this.observers.add(observer)
  }

  /**
   * Remove and disconnect observer
   */
  removeObserver(
    observer: MutationObserver | ResizeObserver | IntersectionObserver,
  ): void {
    if (this.observers.has(observer)) {
      observer.disconnect()
      this.observers.delete(observer)
    }
  }

  /**
   * Cleanup all managed resources
   */
  cleanup(): void {
    this.eventManager.cleanup()
    this.timerManager.cleanup()
    this.frameManager.cleanup()

    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }

  /**
   * Get memory usage stats for debugging
   */
  getStats(): {
    activeListeners: number
    activeTimers: number
    activeFrames: number
    activeObservers: number
  } {
    return {
      activeListeners: this.eventManager.activeCount,
      activeTimers: this.timerManager.activeCount,
      activeFrames: this.frameManager.activeCount,
      activeObservers: this.observers.size,
    }
  }
}

/**
 * Global memory monitoring for debugging
 */
export const memoryMonitor = {
  /**
   * Get global stats of all active resources
   */
  getGlobalStats(): {
    totalListeners: number
    totalTimers: number
    totalFrames: number
  } {
    return {
      totalListeners: activeListeners.size,
      totalTimers: activeTimers.size,
      totalFrames: activeAnimationFrames.size,
    }
  },

  /**
   * Log current memory usage (development only)
   */
  logStats(): void {
    // Development logging (only works in development builds)
    try {
      const stats = this.getGlobalStats()
      // eslint-disable-next-line no-console
      console.log("Vue Toastification Memory Stats:", stats)
    } catch (e) {
      // Ignore in production
    }
  },

  /**
   * Warn about potential memory leaks (development only)
   */
  checkForLeaks(): void {
    // Development leak detection (only works in development builds)
    try {
      const stats = this.getGlobalStats()
      const threshold = 50

      if (stats.totalListeners > threshold) {
        // eslint-disable-next-line no-console
        console.warn(
          `Potential memory leak: ${stats.totalListeners} active event listeners`,
        )
      }
      if (stats.totalTimers > threshold) {
        // eslint-disable-next-line no-console
        console.warn(
          `Potential memory leak: ${stats.totalTimers} active timers`,
        )
      }
      if (stats.totalFrames > threshold) {
        // eslint-disable-next-line no-console
        console.warn(
          `Potential memory leak: ${stats.totalFrames} active animation frames`,
        )
      }
    } catch (e) {
      // Ignore in production
    }
  },
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    // Force cleanup of any remaining resources
    activeListeners.forEach((_, id) => {
      // eslint-disable-next-line no-console
      console.warn("Uncleaned event listener:", id)
    })
    activeTimers.forEach(id => {
      window.clearTimeout(id)
      window.clearInterval(id)
    })
    activeAnimationFrames.forEach(id => {
      cancelAnimationFrame(id)
    })
  })
}
