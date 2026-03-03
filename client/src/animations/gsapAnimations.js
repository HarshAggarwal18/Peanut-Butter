/**
 * GSAP scroll-triggered animations.
 * Register ScrollTrigger plugin and export reusable functions.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax effect on an element.
 * @param {string|Element} element - Target selector or element
 * @param {number} speed - Parallax speed multiplier (default: 0.5)
 */
export const createParallax = (element, speed = 0.5) => {
  return gsap.to(element, {
    y: () => ScrollTrigger.maxScroll(window) * speed * -0.1,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
};

/**
 * Fade in on scroll with configurable direction.
 * @param {string|Element} elements - Target selector or elements
 * @param {Object} options - Animation options
 */
export const scrollFadeIn = (elements, options = {}) => {
  const {
    direction = 'up',
    distance = 60,
    duration = 1,
    stagger = 0.15,
    start = 'top 85%',
  } = options;

  const from = {
    opacity: 0,
    ...(direction === 'up' && { y: distance }),
    ...(direction === 'down' && { y: -distance }),
    ...(direction === 'left' && { x: -distance }),
    ...(direction === 'right' && { x: distance }),
  };

  return gsap.from(elements, {
    ...from,
    duration,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements,
      start,
      toggleActions: 'play none none reverse',
    },
  });
};

/**
 * Pin a section for storytelling scroll.
 * @param {string|Element} trigger - Section to pin
 * @param {Function} onProgress - Callback with scroll progress (0–1)
 */
export const createStickySection = (trigger, onProgress) => {
  return ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      if (onProgress) onProgress(self.progress);
    },
  });
};

/**
 * Text line-by-line reveal on scroll.
 * @param {string|Element} container - Container with line elements
 */
export const textLineReveal = (container, lineSelector = '.reveal-line') => {
  const lines = gsap.utils.toArray(`${container} ${lineSelector}`);

  return gsap.from(lines, {
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
};

/**
 * Kill all ScrollTrigger instances (cleanup).
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

export { gsap, ScrollTrigger };
