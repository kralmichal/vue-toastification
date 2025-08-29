/**
 * Enhanced toast creation utilities with interaction support
 */
import VtConfirmationToast from "../components/VtConfirmationToast.vue"
import VtToastActions from "../components/VtToastActions.vue"

import type { ToastID } from "../types/common"
import type {
  ConfirmationToast,
  ToastAction,
  InteractiveToastOptions,
} from "../types/interactions"
import type { ToastOptions } from "../types/toast"

import { useToast } from "./composables/useToast"
import { TYPE, POSITION } from "./constants"

/**
 * Create a confirmation toast with confirm/cancel actions
 */
export function createConfirmationToast(
  confirmation: Omit<ConfirmationToast, "onConfirm" | "onCancel"> & {
    onConfirm: () => void | Promise<void>
    onCancel?: () => void
  },
  options?: ToastOptions,
): Promise<boolean> {
  return new Promise(resolve => {
    const toast = useToast()

    const confirmationToast: ConfirmationToast = {
      ...confirmation,
      onConfirm: async () => {
        try {
          await confirmation.onConfirm()
          resolve(true)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Confirmation error:", error)
          resolve(false)
        }
      },
      onCancel: () => {
        if (confirmation.onCancel) {
          confirmation.onCancel()
        }
        resolve(false)
      },
    }

    const component = {
      components: { VtConfirmationToast },
      template:
        '<VtConfirmationToast v-bind="$attrs" @close="$emit(\'close-toast\')" />',
      emits: ["close-toast"],
    }

    toast({
      component,
      props: confirmationToast,
      timeout: false, // Don't auto-dismiss confirmation toasts
      closeOnClick: false,
      hideProgressBar: true,
      ...options,
    })
  })
}

/**
 * Create an action toast with custom action buttons
 */
export function createActionToast(
  content: string,
  actions: ToastAction[],
  options?: ToastOptions & InteractiveToastOptions,
): ToastID {
  const toast = useToast()

  const component = {
    components: { VtToastActions },
    template: `
      <div>
        <div class="vt-toast-content">{{ content }}</div>
        <VtToastActions 
          :actions="actions" 
          :toast-id="toastId"
          @action-click="onActionClick"
          @close="$emit('close-toast')"
        />
      </div>
    `,
    props: ["content", "actions", "toastId"],
    emits: ["close-toast"],
    methods: {
      onActionClick(action: ToastAction) {
        // Handle action click
        if (options?.onInteraction?.onFocus) {
          // Could trigger additional callbacks here
        }
      },
    },
  }

  return toast({
    component,
    props: { content, actions, toastId: "" },
    timeout: options?.persistent ? false : (options?.timeout ?? 5000),
    closeOnClick: false,
    hideProgressBar: options?.persistent,
    ...options,
  })
}

/**
 * Create a progress toast that can be updated
 */
export function createProgressToast(
  title: string,
  options?: ToastOptions & {
    cancelable?: boolean
    onCancel?: () => void
  },
): {
  toastId: ToastID
  updateProgress: (progress: number, message?: string) => void
  complete: (message?: string) => void
  error: (message?: string) => void
} {
  const toast = useToast()
  let currentProgress = 0

  const actions: ToastAction[] = []

  if (options?.cancelable && options?.onCancel) {
    actions.push({
      label: "Cancel",
      onClick: () => {
        options.onCancel?.()
      },
      variant: "secondary",
    })
  }

  const component = {
    template: `
      <div class="vt-progress-toast">
        <div class="vt-progress-toast__title">{{ title }}</div>
        <div v-if="message" class="vt-progress-toast__message">{{ message }}</div>
        <div class="vt-progress-toast__bar">
          <div 
            class="vt-progress-toast__fill" 
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <div class="vt-progress-toast__text">{{ progress }}%</div>
        <VtToastActions 
          v-if="actions.length > 0"
          :actions="actions" 
          :toast-id="toastId"
          @close="$emit('close-toast')"
        />
      </div>
    `,
    components: { VtToastActions },
    props: ["title", "message", "progress", "actions", "toastId"],
    emits: ["close-toast"],
  }

  const toastId = toast({
    component,
    props: {
      title,
      message: "",
      progress: 0,
      actions,
      toastId: "",
    },
    timeout: false,
    closeOnClick: false,
    hideProgressBar: true,
    ...options,
  })

  return {
    toastId,
    updateProgress: (progress: number, message?: string) => {
      currentProgress = Math.min(100, Math.max(0, progress))
      toast.update(toastId, {
        content: {
          component,
          props: {
            title,
            message: message || "",
            progress: currentProgress,
            actions,
            toastId,
          },
        },
      })
    },
    complete: (message?: string) => {
      toast.update(toastId, {
        content: message || "Completed!",
        options: {
          type: TYPE.SUCCESS,
          timeout: 3000,
          hideProgressBar: false,
        },
      })
    },
    error: (message?: string) => {
      toast.update(toastId, {
        content: message || "An error occurred",
        options: {
          type: TYPE.ERROR,
          timeout: 5000,
          hideProgressBar: false,
        },
      })
    },
  }
}

/**
 * Create a loading toast
 */
export function createLoadingToast(
  message: string,
  options?: ToastOptions,
): {
  toastId: ToastID
  updateMessage: (message: string) => void
  complete: (message?: string) => void
  error: (message?: string) => void
} {
  const toast = useToast()

  const component = {
    template: `
      <div class="vt-loading-toast">
        <div class="vt-loading-toast__spinner"></div>
        <div class="vt-loading-toast__message">{{ message }}</div>
      </div>
    `,
    props: ["message"],
  }

  const toastId = toast({
    component,
    props: { message },
    timeout: false,
    closeOnClick: false,
    hideProgressBar: true,
    ...options,
  })

  return {
    toastId,
    updateMessage: (newMessage: string) => {
      toast.update(toastId, {
        content: {
          component,
          props: { message: newMessage },
        },
      })
    },
    complete: (completeMessage?: string) => {
      toast.update(toastId, {
        content: completeMessage || "Complete!",
        options: {
          type: TYPE.SUCCESS,
          timeout: 3000,
          hideProgressBar: false,
        },
      })
    },
    error: (errorMessage?: string) => {
      toast.update(toastId, {
        content: errorMessage || "An error occurred",
        options: {
          type: TYPE.ERROR,
          timeout: 5000,
          hideProgressBar: false,
        },
      })
    },
  }
}

/**
 * Create a snackbar-style toast with undo action
 */
export function createUndoToast(
  message: string,
  onUndo: () => void | Promise<void>,
  options?: ToastOptions,
): ToastID {
  return createActionToast(
    message,
    [
      {
        label: "Undo",
        onClick: async () => {
          await onUndo()
        },
        variant: "secondary",
      },
    ],
    {
      timeout: 8000, // Longer timeout for undo actions
      position: POSITION.BOTTOM_CENTER,
      ...options,
    },
  )
}

// Export all utilities
export const toastHelpers = {
  confirm: createConfirmationToast,
  action: createActionToast,
  progress: createProgressToast,
  loading: createLoadingToast,
  undo: createUndoToast,
}
