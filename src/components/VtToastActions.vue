<template>
  <div v-if="actions && actions.length > 0" class="vt-toast-actions">
    <button
      v-for="(action, index) in actions"
      :key="index"
      :class="[
        'vt-toast-action',
        `vt-toast-action--${action.variant || 'primary'}`,
        action.className,
      ]"
      :disabled="action.disabled || loading"
      @click="handleActionClick(action)"
    >
      <span
        v-if="action.icon"
        :class="['vt-toast-action__icon', action.icon]"
      />
      <span class="vt-toast-action__label">{{ action.label }}</span>
      <span
        v-if="loading && currentAction === action"
        class="vt-toast-action__spinner"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import type { ToastAction } from "../types/interactions"

interface Props {
  actions?: ToastAction[]
  toastId: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  loading: false,
})

const emit = defineEmits(["actionClick", "close"])

const currentAction = ref<ToastAction | null>(null)
const isProcessing = ref(false)

const handleActionClick = async (action: ToastAction) => {
  if (action.disabled || isProcessing.value) return

  try {
    currentAction.value = action
    isProcessing.value = true

    // Execute the action callback
    await action.onClick(props.toastId)

    // Emit the action event
    emit("actionClick", action)

    // Close toast if specified
    if (action.closeOnClick !== false) {
      emit("close")
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Toast action error:", error)
  } finally {
    currentAction.value = null
    isProcessing.value = false
  }
}
</script>

<style lang="scss">
@import "../scss/variables";

.vt-toast-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  @media #{$vt-mobile} {
    flex-direction: column;
    gap: 6px;
  }
}

.vt-toast-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 32px;

  // Enhanced touch targets for mobile
  @media #{$vt-mobile} {
    min-height: $vt-mobile-touch-target;
    padding: 12px 16px;
    font-size: 16px;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }

  // Action variants
  &--primary {
    background: rgba(255, 255, 255, 0.9);
    color: #333;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 1);
    }
  }

  &--secondary {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.5);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.8);
    }
  }

  &--danger {
    background: #ff5252;

    &:hover:not(:disabled) {
      background: #ff1744;
    }
  }

  &--success {
    background: #4caf50;

    &:hover:not(:disabled) {
      background: #388e3c;
    }
  }
}

.vt-toast-action__icon {
  font-size: 16px;
  line-height: 1;
}

.vt-toast-action__label {
  flex: 1;
  text-align: center;
}

.vt-toast-action__spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: vt-toast-action-spin 1s linear infinite;
}

@keyframes vt-toast-action-spin {
  to {
    transform: rotate(360deg);
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .vt-toast-action {
    border: 2px solid currentColor;

    &--primary {
      background: white;
      color: black;
      border-color: black;
    }

    &--secondary {
      border-color: white;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .vt-toast-action {
    transition: none;

    &:hover:not(:disabled) {
      transform: none;
    }

    &:active:not(:disabled) {
      transform: none;
    }
  }

  .vt-toast-action__spinner {
    animation: none;
    border: 2px solid currentColor;
    border-radius: 0;
  }
}
</style>
