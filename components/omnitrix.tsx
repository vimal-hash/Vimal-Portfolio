'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX } from 'lucide-react';
import type { LottieRefCurrentProps } from 'lottie-react';

// Only needed once this section is close, and About is near the end of the page.
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// The dial opens from frame 20 to 40, which takes 0.67s. The sound also lasts 0.67s,
// starting 0.37s into the file, so starting them together makes them end together.
const OPEN_FRAME = 20;
const REPLAY_FRAME = OPEN_FRAME - 8;
const FPS = 29.97;
const SOUND_OFFSET = 0.37;
const SOUND_URL = '/omnitrix-ativado.mp3';
// Set once the sound has played. From then on the visitor starts muted, with the button to turn it on.
const PLAYED_KEY = 'omnitrix-sound-played';
// Shown instead of the loop when the visitor prefers reduced motion.
const REST_FRAME = 60;

type Audio = { ctx: AudioContext; buffer: AudioBuffer | null; ready: Promise<void> };

function hasPlayed() {
  try {
    return window.localStorage.getItem(PLAYED_KEY) !== null;
  } catch {
    return false;
  }
}

function markPlayed() {
  try {
    window.localStorage.setItem(PLAYED_KEY, '1');
  } catch {}
}

export function Omnitrix() {
  const [animationData, setAnimationData] = React.useState<object | null>(null);
  const [soundOn, setSoundOn] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);
  const audioRef = React.useRef<Audio | null>(null);
  const soundOnRef = React.useRef(false);
  // True until the first run has been heard.
  const firstRunRef = React.useRef(false);
  const reducedRef = React.useRef(false);
  const visibleRef = React.useRef(false);
  const lastFrameRef = React.useRef(0);

  const setSound = React.useCallback((on: boolean) => {
    soundOnRef.current = on;
    setSoundOn(on);
  }, []);

  const replayOpening = React.useCallback(() => {
    if (lastFrameRef.current >= REPLAY_FRAME) lottieRef.current?.goToAndPlay(REPLAY_FRAME, true);
  }, []);

  const syncPlayback = React.useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (reducedRef.current) anim.goToAndStop(REST_FRAME, true);
    else if (!visibleRef.current) anim.pause();
    else if (firstRunRef.current && audioRef.current?.ctx.state === 'running') {
      // The next opening could be 9 seconds away, so a waiting first run starts on arrival.
      anim.play();
      replayOpening();
    } else anim.play();
  }, [replayOpening]);

  // Browsers keep this suspended until the visitor has clicked, tapped or pressed a key on the page.
  const startAudio = React.useCallback(() => {
    if (!audioRef.current) {
      const ctx = new AudioContext();
      const audio: Audio = { ctx, buffer: null, ready: Promise.resolve() };
      audio.ready = fetch(SOUND_URL)
        .then((response) => response.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data))
        .then((buffer) => {
          audio.buffer = buffer;
        });
      audioRef.current = audio;
    }
    const { ctx, ready } = audioRef.current;
    return Promise.all([ctx.resume(), ready]).then(() => setUnlocked(true));
  }, []);

  React.useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reducedRef.current);
    firstRunRef.current = !reducedRef.current && !hasPlayed();
    setSound(firstRunRef.current);
  }, [setSound]);

  // The first gesture anywhere on the page lets a waiting first run through.
  React.useEffect(() => {
    if (unlocked) return;
    const unlock = (e: Event) => {
      if (e.target instanceof Element && e.target.closest('[data-sound-toggle]')) return;
      if (!firstRunRef.current) return;
      startAudio()
        .then(() => {
          if (firstRunRef.current && visibleRef.current) replayOpening();
        })
        .catch(() => undefined);
    };
    const events = ['click', 'keydown', 'touchend'];
    events.forEach((type) => window.addEventListener(type, unlock, { passive: true }));
    return () => events.forEach((type) => window.removeEventListener(type, unlock));
  }, [unlocked, startAudio, replayOpening]);

  // Fetches the animation shortly before it arrives, and only runs it while it is on screen.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearObserver.disconnect();
        // Works straight away if the visitor has already interacted with the page.
        if (firstRunRef.current) startAudio().catch(() => undefined);
        fetch('/watch_sample2.json')
          .then((response) => response.json())
          .then(setAnimationData)
          .catch((error) => console.error('Error loading animation:', error));
      },
      { rootMargin: '400px 0px' },
    );
    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.4 },
    );
    nearObserver.observe(root);
    viewObserver.observe(root);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [syncPlayback, startAudio]);

  const onEnterFrame = React.useCallback(
    (event: unknown) => {
      const frame = (event as { currentTime: number }).currentTime;
      const opened = lastFrameRef.current < OPEN_FRAME && frame >= OPEN_FRAME;
      lastFrameRef.current = frame;
      if (!opened || !soundOnRef.current) return;

      const audio = audioRef.current;
      if (!audio?.buffer || audio.ctx.state !== 'running') return;
      // A slow frame can land late, so the sound starts that much further in and stays in step.
      const late = (frame - OPEN_FRAME) / FPS;
      if (late > 0.2) return;
      const source = audio.ctx.createBufferSource();
      source.buffer = audio.buffer;
      source.connect(audio.ctx.destination);
      source.start(0, SOUND_OFFSET + late);

      if (firstRunRef.current) {
        firstRunRef.current = false;
        markPlayed();
        source.onended = () => setSound(false);
      }
    },
    [setSound],
  );

  const audible = soundOn && unlocked;

  const toggleSound = () => {
    if (audible) {
      // Turning off the first run counts as having dealt with it.
      if (firstRunRef.current) markPlayed();
      firstRunRef.current = false;
      setSound(false);
      return;
    }
    // Runs the dial's opening again so turning the sound on is heard straight away.
    setSound(true);
    startAudio().then(replayOpening).catch(() => undefined);
  };

  return (
    <div ref={rootRef} className="flex w-full flex-col items-center gap-4">
      <div className="aspect-square w-full max-w-[300px]" aria-hidden>
        {animationData && (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop
            autoplay={false}
            onDOMLoaded={syncPlayback}
            onEnterFrame={onEnterFrame}
          />
        )}
      </div>
      {!reducedMotion && (
        <button
          type="button"
          data-sound-toggle
          aria-pressed={audible}
          onClick={toggleSound}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border-strong)] px-4 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
        >
          {audible ? <Volume2 size={14} strokeWidth={1.75} /> : <VolumeX size={14} strokeWidth={1.75} />}
          {audible ? 'Sound on' : soundOn ? 'Tap for sound' : 'Sound off'}
        </button>
      )}
    </div>
  );
}
