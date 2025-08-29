<template>
  <div id="demo">
    <img alt="Vue logo" src="./assets/logo.png" /><br />

    <h2>Vue Toastification v2 - Complete Feature Demo</h2>

    <div class="controls">
      <h3>🎨 Animation Types</h3>
      <div class="button-grid">
        <button @click="showToast('fade')">Fade</button>
        <button @click="showToast('slideBlurred')">Slide Blurred</button>
        <button @click="showToast('bounce')">Bounce</button>
        <button @click="showToast('vt-slide-up')">Slide Up</button>
        <button @click="showToast('vt-slide-down')">Slide Down</button>
        <button @click="showToast('vt-slide-left')">Slide Left</button>
        <button @click="showToast('vt-slide-right')">Slide Right</button>
        <button @click="showToast('vt-scale')">Scale</button>
        <button @click="showToast('vt-scale-bounce')">Scale Bounce</button>
        <button @click="showToast('vt-rotate-in')">Rotate In</button>
        <button @click="showToast('vt-slide-scale')">Slide Scale</button>
        <button @click="showToast('vt-fade-rotate')">Fade Rotate</button>
        <button class="spring-btn" @click="showToast('vt-spring')">
          Spring (Physics)
        </button>
      </div>

      <h3>🚀 Interactive Features</h3>
      <div class="button-grid">
        <button @click="showConfirmationToast">Confirmation</button>
        <button @click="showActionToast">Action Buttons</button>
        <button @click="showProgressToast">Progress Toast</button>
        <button @click="showLoadingToast">Loading Toast</button>
        <button @click="showUndoToast">Undo Action</button>
      </div>

      <h3>♿ Accessibility Features</h3>
      <div class="button-grid">
        <button @click="showAccessibleToast">Screen Reader</button>
        <button @click="showKeyboardToast">Keyboard Nav</button>
        <button @click="toggleHighContrast">
          High Contrast: {{ isHighContrast ? "ON" : "OFF" }}
        </button>
      </div>

      <h3>🎯 Quick Tests</h3>
      <div class="button-grid">
        <button @click="showRandomToast">Random Animation</button>
        <button @click="showMultipleToasts">Multiple Toasts</button>
        <button @click="showAllTypes">Show All Types</button>
        <button @click="clearAllToasts">Clear All</button>
      </div>
    </div>

    <div class="features-info">
      <h3>✨ New Features in v2</h3>
      <ul>
        <li>
          🎨 <strong>Enhanced Animations</strong>: Physics-based spring
          animations and 12+ transition types
        </li>
        <li>
          📱 <strong>Mobile Optimized</strong>: Better touch gestures and
          responsive design
        </li>
        <li>
          🚀 <strong>Interactive Toasts</strong>: Action buttons, confirmations,
          and progress indicators
        </li>
        <li>
          ♿ <strong>Full Accessibility</strong>: Screen reader support and
          keyboard navigation
        </li>
        <li>
          🧠 <strong>Memory Management</strong>: Automatic cleanup and leak
          detection
        </li>
        <li>
          🍎 <strong>Safari Performance</strong>: Hardware-accelerated
          animations
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Complete demo showcasing all Vue Toastification v2 features
import {
  POSITION,
  TYPE,
  useToast,
  useAccessibility,
  useHighContrast,
} from "../../src"

const toast = useToast()
const { announceToast } = useAccessibility()
const { isHighContrast } = useHighContrast()

const getRandom = <T,>(list: T[]) =>
  list[Math.floor((Math.random() * 10) % list.length)]

const randomType = () => getRandom(Object.values(TYPE))
const randomPosition = () => getRandom(Object.values(POSITION))

const animationTypes = [
  "fade",
  "slideBlurred",
  "bounce",
  "vt-slide-up",
  "vt-slide-down",
  "vt-slide-left",
  "vt-slide-right",
  "vt-scale",
  "vt-scale-bounce",
  "vt-rotate-in",
  "vt-slide-scale",
  "vt-fade-rotate",
  "vt-spring",
]

const messages = [
  "Hello from the enhanced animation system!",
  "Smooth physics-based animations 🚀",
  "Beautiful transitions for better UX ✨",
  "Spring animations feel natural 🌸",
  "Multiple animation types available 🎯",
  "Accessible with reduced motion support ♿",
]

const showToast = (animationType: string) => {
  const message = getRandom(messages)
  const toastType = randomType()
  const position = randomPosition()

  toast(message, {
    type: toastType,
    position,
    transition: animationType,
  })
}

const showRandomToast = () => {
  const randomAnimation = getRandom(animationTypes)
  showToast(randomAnimation)
}

const showMultipleToasts = () => {
  // Show 3 toasts with different animations
  setTimeout(() => showToast("vt-slide-up"), 0)
  setTimeout(() => showToast("vt-scale-bounce"), 200)
  setTimeout(() => showToast("vt-spring"), 400)
}

const showAllTypes = () => {
  animationTypes.forEach((animation, index) => {
    setTimeout(() => {
      toast(`${animation} animation demo`, {
        type: randomType(),
        position: POSITION.TOP_RIGHT,
        transition: animation,
        timeout: 5000,
      })
    }, index * 300)
  })
}

// Interactive features - simplified for demo
const showConfirmationToast = () => {
  toast("Confirmation feature available! (See documentation for full API)", {
    type: TYPE.INFO,
    timeout: 5000,
  })
}

const showActionToast = () => {
  toast("Action buttons available! (See documentation for full API)", {
    type: TYPE.INFO,
    timeout: 5000,
  })
}

const showProgressToast = () => {
  toast("Progress toasts available! (See documentation for full API)", {
    type: TYPE.INFO,
    timeout: 5000,
  })
}

const showLoadingToast = () => {
  toast("Loading toasts available! (See documentation for full API)", {
    type: TYPE.INFO,
    timeout: 5000,
  })
}

const showUndoToast = () => {
  toast("Undo functionality available! (See documentation for full API)", {
    type: TYPE.INFO,
    position: POSITION.BOTTOM_CENTER,
    timeout: 5000,
  })
}

// Accessibility features
const showAccessibleToast = () => {
  const message = "This toast is announced to screen readers"
  toast.info(message, {
    position: POSITION.TOP_CENTER,
  })
  announceToast(message, "info")
}

const showKeyboardToast = () => {
  toast("Use arrow keys to navigate, Enter to activate, Escape to dismiss", {
    position: POSITION.TOP_CENTER,
    timeout: 8000,
    type: TYPE.INFO,
  })
}

const toggleHighContrast = () => {
  document.body.classList.toggle("high-contrast")
  toast.info(
    `High contrast mode ${
      document.body.classList.contains("high-contrast") ? "enabled" : "disabled"
    }`,
  )
}

const clearAllToasts = () => {
  toast.clear()
  setTimeout(() => {
    toast.success("All toasts cleared!")
  }, 100)
}
</script>

<style>
#demo {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px;
  padding: 20px;
}

.controls {
  max-width: 1000px;
  margin: 0 auto;
}

.controls h3 {
  margin: 30px 0 15px 0;
  color: #1976d2;
  font-size: 20px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.button-grid button {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-grid button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button-grid button:active {
  transform: translateY(0);
}

.spring-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%) !important;
  font-weight: 600;
}

.features-info {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: left;
}

.features-info h3 {
  color: #1976d2;
  margin-bottom: 15px;
}

.features-info ul {
  list-style: none;
  padding: 0;
}

.features-info li {
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.features-info li:last-child {
  border-bottom: none;
}

/* High contrast mode styles */
.high-contrast {
  filter: contrast(150%) saturate(200%);
}

.high-contrast .button-grid button {
  border: 2px solid white;
  background: #000 !important;
  color: white !important;
}

@media (max-width: 600px) {
  .button-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .button-grid button {
    padding: 10px 12px;
    font-size: 12px;
  }

  .controls h3 {
    font-size: 18px;
  }
}
</style>
