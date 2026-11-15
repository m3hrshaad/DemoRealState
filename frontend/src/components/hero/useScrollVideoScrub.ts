import { useEffect, useState } from 'react';

/**
 * Scroll ➜ video scrubbing engine for the home hero.
 *
 * How it works (and why it is built this way):
 *
 * 1. A single passive `scroll` listener only *measures* the hero's scroll
 *    progress and stores it as a target value. It never touches the video.
 * 2. `requestAnimationFrame` is the only place the video playhead moves, so
 *    seeking is locked to the browser's paint cadence and can never flood the
 *    decoder with hundreds of seeks per second.
 * 3. Between `target` and the value actually sent to `video.currentTime` we run
 *    a frame-rate independent exponential smoothing step, which removes the
 *    visible stepping of raw scroll deltas while staying tight enough to feel
 *    physically attached to the scroll.
 * 4. `video.play()` is never called. The element stays paused for its whole
 *    life; only `currentTime` is written. When scrolling stops the playhead
 *    settles on the matching frame and the loop shuts itself down.
 *
 * Encoding note (this is what makes scrubbing actually smooth): a normal
 * delivery encode has a keyframe every few seconds, so every `currentTime`
 * write forces the decoder to decode forward from the previous keyframe and
 * frames are dropped. The hero files in `public/videos` are re-encoded as
 * ALL-INTRA H.264 (`-g 1 -keyint_min 1 -sc_threshold 0`, yuv420p, faststart,
 * audio stripped, 24fps, 1600×900 desktop / 854×480 mobile) so every frame is
 * a random access point. Preferred characteristics if the source is ever
 * replaced: MP4/H.264, every frame (or at least every 2nd frame) a keyframe,
 * 24–30fps, ≤1600px wide, moderate CRF (22–26), `+faststart`, no audio track.
 */

export type ScrubStatus = 'loading' | 'ready' | 'failed';

type ScrubOptions = {
  sectionRef: React.RefObject<HTMLElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  hintRef: React.RefObject<HTMLElement | null>;
  /** False for reduced-motion / fallback rendering: the engine stays dormant. */
  enabled: boolean;
};

/** Share of the remaining distance covered per 60fps frame (≈130ms to settle). */
const SMOOTHING = 0.32;
/** Half a frame at the 24fps source — a smaller seek would repaint the same frame. */
const HALF_FRAME = 1 / 48;
/** Scroll progress is considered settled below this delta. */
const SETTLED = 0.0004;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

export function useScrollVideoScrub({ sectionRef, videoRef, contentRef, hintRef, enabled }: ScrubOptions) {
  const [status, setStatus] = useState<ScrubStatus>('loading');

  useEffect(() => {
    if (!enabled) return undefined;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return undefined;

    let frame = 0;
    let target = 0;
    let eased = 0;
    let lastSeek = -1;
    let lastFade = -1;
    let lastHint = -1;
    let seekDirty = false;
    let prevTimestamp = 0;
    let readyOnce = false;

    const duration = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0);

    /** Single layout read per scroll/resize event; nothing else runs there. */
    const measure = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      target = travel > 1 ? clamp01(-rect.top / travel) : 0;
    };

    const paintContent = (progress: number) => {
      // Copy holds still at the top, then drifts away so it never fights the footage.
      const fade = clamp01((progress - 0.03) / 0.22);
      if (Math.abs(fade - lastFade) > 0.001) {
        lastFade = fade;
        const node = contentRef.current;
        if (node) {
          node.style.opacity = String(1 - fade);
          node.style.transform = `translate3d(0, ${(-fade * 32).toFixed(1)}px, 0)`;
          node.style.pointerEvents = fade > 0.92 ? 'none' : '';
        }
      }

      const hint = 1 - clamp01(progress / 0.05);
      if (Math.abs(hint - lastHint) > 0.01) {
        lastHint = hint;
        const node = hintRef.current;
        if (node) node.style.opacity = String(hint);
      }
    };

    const seek = (progress: number) => {
      const total = duration();
      if (!total || video.readyState < 2) return;
      // The element is NEVER played: we only move its playhead. `duration` itself
      // can paint black in some engines, so the final frame is addressed just
      // inside the last frame boundary (still the closing frame at 24fps).
      const time = Math.max(0, Math.min(total - 0.02, progress * total));
      if (Math.abs(time - lastSeek) < HALF_FRAME) {
        seekDirty = false;
        return;
      }
      // A seek already in flight is allowed to finish; the next frame picks up
      // the newest value instead of stacking seeks in the decoder queue.
      if (video.seeking) {
        seekDirty = true;
        return;
      }
      lastSeek = time;
      seekDirty = false;
      video.currentTime = time;
    };

    const tick = (timestamp: number) => {
      frame = 0;
      const delta = prevTimestamp ? Math.min(64, timestamp - prevTimestamp) : 16.7;
      prevTimestamp = timestamp;

      // Same feel at 60Hz, 90Hz and 120Hz.
      const factor = 1 - Math.pow(1 - SMOOTHING, delta / 16.7);
      eased += (target - eased) * factor;
      if (Math.abs(target - eased) < SETTLED) eased = target;

      seek(eased);
      paintContent(eased);

      const busy = Math.abs(target - eased) > SETTLED || video.seeking || seekDirty;
      if (busy) {
        frame = window.requestAnimationFrame(tick);
      } else {
        prevTimestamp = 0;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      schedule();
    };

    const onReady = () => {
      if (video.paused === false) video.pause();
      if (readyOnce) return;
      readyOnce = true;
      measure();
      eased = target;
      lastSeek = -1;
      seekDirty = true;
      setStatus('ready');
      schedule();
    };

    const onError = () => setStatus('failed');
    const keepPaused = () => {
      if (!video.paused) video.pause();
    };

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onError);
    video.addEventListener('play', keepPaused);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    if (video.error) setStatus('failed');
    else if (video.readyState >= 2) onReady();
    else onScroll();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onError);
      video.removeEventListener('play', keepPaused);
    };
  }, [enabled, sectionRef, videoRef, contentRef, hintRef]);

  return status;
}
