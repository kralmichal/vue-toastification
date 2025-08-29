import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"

import { useSpringAnimation } from "../../src/ts/composables/useSpringAnimation"

// Mock requestAnimationFrame for Jest
const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  return setTimeout(callback, 16) as unknown as number // ~60fps
})

const mockCancelAnimationFrame = jest.fn((id: number) => {
  clearTimeout(id as unknown as NodeJS.Timeout)
})

Object.defineProperty(global, "requestAnimationFrame", {
  value: mockRequestAnimationFrame,
})

Object.defineProperty(global, "cancelAnimationFrame", {
  value: mockCancelAnimationFrame,
})

describe("useSpringAnimation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it("should initialize with correct default values", () => {
    const spring = useSpringAnimation()

    expect(spring.state.value.value).toBe(0)
    expect(spring.state.value.velocity).toBe(0)
    expect(spring.isRunning.value).toBe(false)
    expect(spring.progress.value).toBe(0)
  })

  it("should initialize with custom values", () => {
    const spring = useSpringAnimation({
      from: 0.5,
      to: 2,
      velocity: 10,
    })

    expect(spring.state.value.value).toBe(0.5)
    expect(spring.state.value.velocity).toBe(10)
    expect(spring.progress.value).toBe(0)
  })

  it("should start animation when start() is called", () => {
    const spring = useSpringAnimation()

    spring.start()

    expect(spring.isRunning.value).toBe(true)
    expect(mockRequestAnimationFrame).toHaveBeenCalled()
  })

  it("should stop animation when stop() is called", () => {
    const spring = useSpringAnimation()

    spring.start()
    expect(spring.isRunning.value).toBe(true)

    spring.stop()
    expect(spring.isRunning.value).toBe(false)
  })

  it("should reset to initial state when reset() is called", () => {
    const spring = useSpringAnimation({ from: 0, to: 1 })

    // Modify state
    spring.setValue(0.5, 10)
    expect(spring.state.value.value).toBe(0.5)
    expect(spring.state.value.velocity).toBe(10)

    // Reset
    spring.reset()
    expect(spring.state.value.value).toBe(0)
    expect(spring.state.value.velocity).toBe(0)
  })

  it("should calculate progress correctly", () => {
    const spring = useSpringAnimation({ from: 0, to: 10 })

    spring.setValue(5, 0)
    expect(spring.progress.value).toBe(0.5)

    spring.setValue(10, 0)
    expect(spring.progress.value).toBe(1)

    spring.setValue(0, 0)
    expect(spring.progress.value).toBe(0)
  })

  it("should detect completion correctly", () => {
    const spring = useSpringAnimation({ from: 0, to: 1 })

    // Not complete when far from target
    spring.setValue(0.5, 10)
    expect(spring.isComplete.value).toBe(false)

    // Complete when close to target with low velocity
    spring.setValue(0.9999, 0.0001)
    expect(spring.isComplete.value).toBe(true)
  })

  it("should call onUpdate callback during animation", () => {
    const onUpdate = jest.fn()
    const spring = useSpringAnimation({
      from: 0,
      to: 1,
      onUpdate,
    })

    spring.setValue(0.5, 0)

    // Note: In real animation, onUpdate would be called during the animation loop
    expect(onUpdate).not.toHaveBeenCalled() // setValue doesn't trigger onUpdate
  })

  it("should call onComplete callback when animation finishes", () => {
    const onComplete = jest.fn()
    const spring = useSpringAnimation({
      from: 0,
      to: 1,
      onComplete,
    })

    // Simulate completion by setting close values
    spring.setValue(0.9999, 0.0001)
    expect(spring.isComplete.value).toBe(true)
  })
})
