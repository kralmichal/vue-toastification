<template>
  <div class="vt-confirmation-toast">
    <div class="vt-confirmation-toast__header">
      <h4 class="vt-confirmation-toast__title">{{ title }}</h4>
    </div>

    <div class="vt-confirmation-toast__body">
      <p class="vt-confirmation-toast__message">{{ message }}</p>
    </div>

    <div class="vt-confirmation-toast__actions">
      <button
        class="vt-confirmation-toast__button vt-confirmation-toast__button--cancel"
        :disabled="loading"
        @click="handleCancel"
      >
        {{ cancelLabel }}
      </button>

      <button
        :class="[
          'vt-confirmation-toast__button',
          'vt-confirmation-toast__button--confirm',
          dangerous && 'vt-confirmation-toast__button--danger',
        ]"
        :disabled="loading"
        @click="handleConfirm"
      >
        <span v-if="loading" class="vt-confirmation-toast__spinner" />
        <span v-else>{{ confirmLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import type { ConfirmationToast } from "../types/interactions"

interface Props extends ConfirmationToast {
  toastId: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  dangerous: false,
})

const emit = defineEmits(["close"])

const loading = ref(false)

const handleConfirm = async () => {
  if (loading.value) return

  try {
    loading.value = true
    await props.onConfirm(props.toastId)
    emit("close")
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Confirmation action error:", error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (loading.value) return

  if (props.onCancel) {
    props.onCancel(props.toastId)
  }
  emit("close")
}
</script>

<style lang="scss">
@import "../scss/variables";

.vt-confirmation-toast {
  padding: 4px;
}

.vt-confirmation-toast__header {
  margin-bottom: 8px;
}

.vt-confirmation-toast__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: inherit;
  line-height: 1.3;
}

.vt-confirmation-toast__body {
  margin-bottom: 16px;
}

.vt-confirmation-toast__message {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: inherit;
  opacity: 0.9;
}

.vt-confirmation-toast__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  @media #{$vt-mobile} {
    flex-direction: column-reverse;
    gap: 6px;
  }
}

.vt-confirmation-toast__button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  // Enhanced touch targets for mobile
  @media #{$vt-mobile} {
    min-height: $vt-mobile-touch-target;
    padding: 12px 16px;
    font-size: 16px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }

  &--cancel {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: inherit;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    &:active:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &--confirm {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    min-width: 80px;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &--danger {
      background: #ff5252;
      color: white;

      &:hover:not(:disabled) {
        background: #ff1744;
      }
    }
  }
}

.vt-confirmation-toast__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: vt-confirmation-spin 1s linear infinite;
}

@keyframes vt-confirmation-spin {
  to {
    transform: rotate(360deg);
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .vt-confirmation-toast__button {
    border: 2px solid currentColor;

    &--confirm {
      background: white;
      color: black;
      border-color: black;

      &--danger {
        background: #ff5252;
        color: white;
        border-color: white;
      }
    }

    &--cancel {
      border-color: currentColor;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .vt-confirmation-toast__button {
    transition: none;

    &:hover:not(:disabled) {
      transform: none;
    }

    &:active:not(:disabled) {
      transform: none;
    }
  }

  .vt-confirmation-toast__spinner {
    animation: none;
    border: 2px solid currentColor;
    border-radius: 0;
  }
}
</style>
