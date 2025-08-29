import { describe, it, expect } from "@jest/globals"

import { ANIMATION_TYPE } from "../../src/ts/constants"

import type {
  AnimationConfig,
  TransitionConfig,
} from "../../src/types/animations"

describe("Animation Types", () => {
  it("should have all expected animation types", () => {
    expect(ANIMATION_TYPE.FADE).toBe("fade")
    expect(ANIMATION_TYPE.SLIDE_UP).toBe("slide-up")
    expect(ANIMATION_TYPE.SLIDE_DOWN).toBe("slide-down")
    expect(ANIMATION_TYPE.SLIDE_LEFT).toBe("slide-left")
    expect(ANIMATION_TYPE.SLIDE_RIGHT).toBe("slide-right")
    expect(ANIMATION_TYPE.SCALE).toBe("scale")
    expect(ANIMATION_TYPE.SCALE_BOUNCE).toBe("scale-bounce")
    expect(ANIMATION_TYPE.ROTATE_IN).toBe("rotate-in")
    expect(ANIMATION_TYPE.SLIDE_SCALE).toBe("slide-scale")
    expect(ANIMATION_TYPE.FADE_ROTATE).toBe("fade-rotate")
    expect(ANIMATION_TYPE.SPRING).toBe("spring")
  })

  it("should create valid animation config objects", () => {
    const animationConfig: AnimationConfig = {
      type: ANIMATION_TYPE.SPRING,
      duration: 300,
      spring: {
        tension: 170,
        friction: 26,
        mass: 1,
      },
    }

    expect(animationConfig.type).toBe(ANIMATION_TYPE.SPRING)
    expect(animationConfig.duration).toBe(300)
    expect(animationConfig.spring?.tension).toBe(170)
  })

  it("should create valid transition config objects", () => {
    const transitionConfig: TransitionConfig = {
      enter: {
        type: ANIMATION_TYPE.SLIDE_UP,
        duration: 250,
      },
      leave: {
        type: ANIMATION_TYPE.FADE,
        duration: 200,
      },
      respectsReducedMotion: true,
    }

    expect(transitionConfig.enter.type).toBe(ANIMATION_TYPE.SLIDE_UP)
    expect(transitionConfig.leave.type).toBe(ANIMATION_TYPE.FADE)
    expect(transitionConfig.respectsReducedMotion).toBe(true)
  })
})
