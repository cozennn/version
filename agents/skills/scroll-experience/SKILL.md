---
name: scroll-experience
description: Design and implement scroll-driven storytelling, parallax, sticky scenes, scroll-triggered motion, and cinematic product narratives. Use only when the brief calls for a scroll-led experience.
---

# Scroll Experience

## Role
Treat scrolling as a narrative and navigation medium. The purpose is to make complex content easier to understand or to demonstrate a product through meaningful progression, not to add motion to every page.

## Activation
Use when the user requests scroll storytelling, parallax, sticky product demonstrations, cinematic landing pages, scroll-linked progress, or interactive narratives. Do not activate for ordinary content pages or small UI fixes.

## Plan the narrative
1. Define the story, audience, and one outcome for the experience.
2. Break the story into beats: hook, context, progression, reveal, resolution/action.
3. Decide which content must remain readable and which visual layer may move.
4. Choose the simplest implementation that meets the brief.
5. Define a reduced-motion and small-screen alternative before coding.

## Technique selection
- CSS sticky: simple pinned scenes and persistent context.
- CSS scroll-driven animations: progressive enhancement only; feature-detect and provide a static fallback.
- Framer Motion: React projects with modest scroll-linked transformations.
- GSAP ScrollTrigger: complex timelines, pinning, sequencing, and synchronized scenes.
- Native scrolling remains the default. Lenis or similar smooth-scroll libraries require a concrete benefit and compatibility testing.

## Engineering rules
- Never hijack wheel, touch, keyboard, or native scroll behavior.
- Avoid horizontal scroll unless it is clearly discoverable and operable with touch, keyboard, and assistive technology.
- Animate transform and opacity first; profile filters, clip-path, and canvas effects.
- Avoid animating layout dimensions and properties that trigger repeated layout.
- Use IntersectionObserver or animation-library lifecycle hooks to avoid initializing expensive scenes off-screen.
- Clean up observers, event listeners, timelines, and animation contexts on unmount.
- Do not use `will-change` broadly or permanently.
- Avoid scroll-linked work on every frame when a declarative timeline can do it.
- Respect `prefers-reduced-motion`: remove parallax, pinning, scrubbed motion, and nonessential transitions; retain all content and actions.
- Never hide content until JavaScript runs. The non-animated page must remain complete and usable.
- Test touch, keyboard, resize, browser zoom, slow devices, and long content.

## Responsive behavior
On narrow screens, reduce layers and travel distance, avoid pinned scenes that consume the viewport, and keep the reading order linear. Do not force desktop cinematic choreography onto mobile.

## Performance checks
Measure rather than promise a frame rate. Check for layout shifts, long tasks, dropped frames, memory leaks, and excessive image/video decoding. Use poster/static fallbacks for media-heavy sequences.

## Delivery checklist
- The narrative works without animation.
- Native scroll and browser navigation remain intact.
- Reduced-motion mode is complete.
- Keyboard and touch users can reach every action.
- No hidden or clipped content at common viewport sizes.
- Animations are cleaned up and do not continue off-screen unnecessarily.
- Performance is checked on a representative mobile device when possible.
