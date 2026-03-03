import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

const FRAME_COUNT = 168;

const IngredientsSequence = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const frameSources = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, index) => {
      const frameNumber = String(index + 1).padStart(3, '0');
      return `/sequence-ingredients/ezgif-frame-${frameNumber}.jpg`;
    }),
    []
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
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

    const sourceWidth = image.width;
    const sourceHeight = image.height;

    const scale = Math.max(viewportWidth / sourceWidth, viewportHeight / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const offsetX = (viewportWidth - drawWidth) / 2;
    const offsetY = (viewportHeight - drawHeight) / 2;

    ctx.drawImage(
      image,
      0,
      0,
      sourceWidth,
      sourceHeight,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    frameSources.forEach((src, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      image.onload = () => {
        if (isCancelled) return;
        framesRef.current[index] = image;
        loadedCount++;
        
        // Mark as loaded when at least 10% of images are ready for smooth start
        if (loadedCount >= Math.ceil(FRAME_COUNT * 0.1) && !imagesLoaded) {
          setImagesLoaded(true);
        }
        
        if (index === 0) {
          drawFrame(frameIndex);
        }
      };
    });

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, frameIndex, frameSources, imagesLoaded]);

  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(frameIndex);
    }
  }, [drawFrame, frameIndex, imagesLoaded]);

  useEffect(() => {
    const handleResize = () => drawFrame(frameIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, frameIndex]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Map scroll progress to frame index with smooth easing
    // Start animation at 0.05 and end at 0.95 for smooth enter/exit
    const startThreshold = 0.05;
    const endThreshold = 0.95;
    
    if (latest < startThreshold) {
      setFrameIndex(0);
      return;
    }
    
    if (latest > endThreshold) {
      setFrameIndex(FRAME_COUNT - 1);
      return;
    }

    const adjustedProgress = (latest - startThreshold) / (endThreshold - startThreshold);
    const nextFrame = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(adjustedProgress * (FRAME_COUNT - 1)))
    );

    setFrameIndex((prev) => (prev === nextFrame ? prev : nextFrame));
  });

  // Smooth opacity transitions for seamless enter/exit
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1, 0.9, 0.95, 1],
    [0, 0, 1, 1, 0, 0]
  );

  const overlayOpacity = useTransform(
    scrollYProgress, 
    [0, 0.05, 0.95, 1],
    [1, 0, 0, 1]
  );

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[400vh] bg-gradient-premium"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Blend overlay for smooth transitions */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-premium pointer-events-none z-10"
        />

        {/* Canvas sequence */}
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="absolute inset-0"
        >
          <canvas
            ref={canvasRef}
            aria-label="Ingredients sequence"
            className="w-full h-full"
          />
        </motion.div>

        {/* Loading indicator */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-premium">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-golden/30 border-t-golden rounded-full animate-spin" />
              <span className="text-sm text-peanut/50 uppercase tracking-wider">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IngredientsSequence;
