let audioContext: AudioContext | null = null;
let rollingNoiseSource: AudioBufferSourceNode | null = null;
let rollingGainNode: GainNode | null = null;
let rollingFilterNode: BiquadFilterNode | null = null;

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

function getAudioContext() {
  const audioWindow = window as AudioWindow;
  const AudioContextCtor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
  if (!AudioContextCtor) return null;

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }

  return audioContext;
}

function playTone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine', startDelay = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const startAt = ctx.currentTime + startDelay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.03);
}

export function playLeverPullSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(180, 0.08, 0.16, 'sawtooth');
  playTone(95, 0.16, 0.18, 'triangle', 0.05);
  playTone(320, 0.05, 0.08, 'square', 0.19);
}

export function startRollingSound() {
  const ctx = getAudioContext();
  if (!ctx || rollingNoiseSource) return;

  const bufferSize = Math.floor(ctx.sampleRate * 0.45);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.8;
  }

  rollingNoiseSource = ctx.createBufferSource();
  rollingGainNode = ctx.createGain();
  rollingFilterNode = ctx.createBiquadFilter();

  rollingNoiseSource.buffer = buffer;
  rollingNoiseSource.loop = true;
  rollingFilterNode.type = 'bandpass';
  rollingFilterNode.frequency.setValueAtTime(950, ctx.currentTime);
  rollingFilterNode.Q.setValueAtTime(9, ctx.currentTime);
  rollingGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
  rollingGainNode.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.08);

  rollingNoiseSource.connect(rollingFilterNode);
  rollingFilterNode.connect(rollingGainNode);
  rollingGainNode.connect(ctx.destination);
  rollingNoiseSource.start();
}

export function playRollTickSound(speed = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(520 + Math.random() * 140 * speed, now);
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(420, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.045);
}

export function stopRollingSound() {
  const ctx = getAudioContext();
  if (!ctx || !rollingNoiseSource || !rollingGainNode) return;

  const stopAt = ctx.currentTime + 0.12;
  rollingGainNode.gain.cancelScheduledValues(ctx.currentTime);
  rollingGainNode.gain.setValueAtTime(Math.max(rollingGainNode.gain.value, 0.0001), ctx.currentTime);
  rollingGainNode.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  try {
    rollingNoiseSource.stop(stopAt + 0.02);
  } catch {
    // The source may already be stopped if the user clicks through quickly.
  }

  rollingNoiseSource = null;
  rollingGainNode = null;
  rollingFilterNode = null;
}

export function playResultChimeSound() {
  stopRollingSound();
  playTone(880, 0.1, 0.13, 'sine');
  playTone(1320, 0.16, 0.12, 'sine', 0.08);
  playTone(1760, 0.22, 0.08, 'triangle', 0.18);
}

export function playThunderSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = Math.floor(ctx.sampleRate * 0.7);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const decay = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * decay * decay;
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, now);
  filter.frequency.exponentialRampToValueAtTime(120, now + 0.55);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.75);

  playTone(70, 0.35, 0.11, 'sawtooth', 0.04);
}
