// Web Audio API Synthesizer for SOS Alarm and Driver Notifications

let audioCtx: AudioContext | null = null;
let currentOscillator: OscillatorNode | null = null;
let sirenInterval: any = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSosSiren() {
  stopAllAudio();
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, ctx.currentTime);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    currentOscillator = osc;

    let high = true;
    sirenInterval = setInterval(() => {
      if (osc && ctx) {
        const nextFreq = high ? 950 : 650;
        osc.frequency.linearRampToValueAtTime(nextFreq, ctx.currentTime + 0.25);
        high = !high;
      }
    }, 400);
  } catch (e) {
    console.warn('Web Audio not allowed without user gesture', e);
  }
}

export function playNotificationChime() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    console.warn(e);
  }
}

export function playRideIncomingTone() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.36); // C6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch (e) {
    console.warn(e);
  }
}

export function stopAllAudio() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (currentOscillator) {
    try {
      currentOscillator.stop();
      currentOscillator.disconnect();
    } catch (e) {}
    currentOscillator = null;
  }
}
