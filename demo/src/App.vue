<template>
  <div id="demo">
    <img alt="Vue logo" src="./assets/logo.png" /><br />

    <h2>Enhanced Animation System Demo</h2>

    <div class="controls">
      <h3>Animation Types</h3>
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

      <h3>Quick Tests</h3>
      <div class="button-grid">
        <button @click="showRandomToast">Random Animation</button>
        <button @click="showMultipleToasts">Multiple Toasts</button>
        <button @click="showAllTypes">Show All Types</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Enhanced demo showcasing the new animation system
import { POSITION, TYPE, useToast } from "../../src"

const toast = useToast()

const getRandom = <T>(list: T[]) =>
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
  max-width: 800px;
  margin: 0 auto;
}

.controls h3 {
  margin: 30px 0 15px 0;
  color: #1976d2;
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

@media (max-width: 600px) {
  .button-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .button-grid button {
    padding: 10px 12px;
    font-size: 12px;
  }
}
</style>
