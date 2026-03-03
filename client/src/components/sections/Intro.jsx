import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

const FRAME_COUNT = 192;
const FRAME_TOP_CROP_RATIO = 0.12;

const Intro = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const completionRef = useRef(false);
  const [frameIndex, setFrameIndex] = useState(0);

  const frameSources = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, index) => {
      const frameNumber = String(index + 1).padStart(3, '0');
      return `/sequence-hero-section/ezgif-frame-${frameNumber}.png`;
    }),
    []
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = framesRef.current[index] || framesRef.current.find(Boolean);
    if (!image) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const nextCanvasWidth = Math.floor(viewportWidth * devicePixelRatio);
    const nextCanvasHeight = Math.floor(viewportHeight * devicePixelRatio);

    if (canvas.width !== nextCanvasWidth || canvas.height !== nextCanvasHeight) {
      canvas.width = nextCanvasWidth;
      canvas.height = nextCanvasHeight;
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
    }

    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    const sourceCropTop = Math.floor(image.height * FRAME_TOP_CROP_RATIO);
    const sourceWidth = image.width;
    const sourceHeight = image.height - sourceCropTop;

    const scale = Math.max(viewportWidth / sourceWidth, viewportHeight / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const offsetX = (viewportWidth - drawWidth) / 2;
    const offsetY = (viewportHeight - drawHeight) / 2;

    ctx.drawImage(
      image,
      0,
      sourceCropTop,
      sourceWidth,
      sourceHeight,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('intro-sequence-complete', { detail: { complete: false } })
    );
  }, []);

  useEffect(() => {
    let isCancelled = false;

    frameSources.forEach((src, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      image.onload = () => {
        if (isCancelled) return;
        framesRef.current[index] = image;
        if (index === 0) {
          drawFrame(frameIndex);
        }
      };
    });

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, frameIndex, frameSources]);

  useEffect(() => {
    drawFrame(frameIndex);
  }, [drawFrame, frameIndex]);

  useEffect(() => {
    const handleResize = () => drawFrame(frameIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, frameIndex]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextFrame = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(latest * (FRAME_COUNT - 1)))
    );

    const complete = latest >= 0.98;
    if (completionRef.current !== complete) {
      completionRef.current = complete;
      window.dispatchEvent(
        new CustomEvent('intro-sequence-complete', { detail: { complete } })
      );
    }

    setFrameIndex((prev) => (prev === nextFrame ? prev : nextFrame));
  });

  const sequenceOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);
  const heroEnterOverlayOpacity = useTransform(scrollYProgress, [0.88, 1], [0, 1]);

  return (
    <section id="intro-section" ref={sectionRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ opacity: sequenceOpacity }}
          className="absolute inset-0"
        >
          <canvas
            ref={canvasRef}
            aria-label="Intro sequence"
            className="w-full h-full"
          />
        </motion.div>

        <motion.div
          style={{ opacity: heroEnterOverlayOpacity }}
          className="absolute inset-0 bg-gradient-premium pointer-events-none"
        />
      </div>
    </section>
  );
};

export default Intro;
