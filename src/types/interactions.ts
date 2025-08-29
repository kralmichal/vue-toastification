// Action and interaction types for enhanced toast functionality

export interface ToastAction {
  /**
   * Label text for the action button
   */
  label: string
  /**
   * Callback function when action is triggered
   */
  onClick: (toastId: string) => void | Promise<void>
  /**
   * CSS classes for custom styling
   */
  className?: string | string[]
  /**
   * Disable the action temporarily
   */
  disabled?: boolean
  /**
   * Close toast after action is executed
   */
  closeOnClick?: boolean
  /**
   * Action variant for different styling
   */
  variant?: "primary" | "secondary" | "danger" | "success"
  /**
   * Icon to display with the action
   */
  icon?: string
}

export interface SwipeAction {
  /**
   * Direction for the swipe gesture
   */
  direction: "left" | "right" | "up" | "down"
  /**
   * Callback function when swipe action is triggered
   */
  onSwipe: (toastId: string) => void | Promise<void>
  /**
   * Threshold distance for triggering the action (in pixels)
   */
  threshold?: number
  /**
   * Background color shown during swipe
   */
  backgroundColor?: string
  /**
   * Icon shown during swipe
   */
  icon?: string
  /**
   * Label shown during swipe
   */
  label?: string
}

export interface ToastInteractionOptions {
  /**
   * Action buttons to display in the toast
   */
  actions?: ToastAction[]
  /**
   * Swipe actions for gesture-based interactions
   */
  swipeActions?: SwipeAction[]
  /**
   * Allow focus within the toast content
   */
  focusable?: boolean
  /**
   * Prevent auto-dismiss when user is interacting
   */
  pauseOnInteraction?: boolean
  /**
   * Custom interaction handlers
   */
  onInteraction?: {
    onFocus?: (toastId: string) => void
    onBlur?: (toastId: string) => void
    onKeyDown?: (event: KeyboardEvent, toastId: string) => void
  }
}

export interface InteractiveToastOptions extends ToastInteractionOptions {
  /**
   * Make the toast persistent (requires user action to dismiss)
   */
  persistent?: boolean
  /**
   * Show loading state for async actions
   */
  loading?: boolean
  /**
   * Progress value for progress-type toasts (0-100)
   */
  progress?: number
}

// Form support for interactive toasts
export interface ToastFormField {
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "checkbox"
    | "radio"
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  value?: any
  options?: { label: string; value: any }[] // for select/radio
  validation?: (value: any) => string | null
}

export interface ToastForm {
  fields: ToastFormField[]
  onSubmit: (
    formData: Record<string, any>,
    toastId: string
  ) => void | Promise<void>
  onCancel?: (toastId: string) => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
}

// Confirmation toast type
export interface ConfirmationToast {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: ToastAction["variant"]
  onConfirm: (toastId: string) => void | Promise<void>
  onCancel?: (toastId: string) => void
  dangerous?: boolean // for destructive actions
}

// Snooze functionality
export interface SnoozeOptions {
  /**
   * Predefined snooze durations in minutes
   */
  durations?: number[]
  /**
   * Custom snooze duration picker
   */
  customDuration?: boolean
  /**
   * Callback when toast is snoozed
   */
  onSnooze?: (duration: number, toastId: string) => void
}

// Enhanced callback events
export interface ToastCallbacks {
  onShow?: (toastId: string) => void
  onHide?: (toastId: string) => void
  onAction?: (actionLabel: string, toastId: string) => void
  onSwipe?: (direction: SwipeAction["direction"], toastId: string) => void
  onSnooze?: (duration: number, toastId: string) => void
  onProgress?: (progress: number, toastId: string) => void
}
