/**
 * COEP Impressions '26 — Coming Soon Page
 * Interactive 3D Cursor Physics, Theatrical Props Parallax & Audio Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const ticketScene = document.getElementById('ticket3dScene');
  const ticketCard = document.getElementById('ticketCard');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');
  const cinemaToast = document.getElementById('cinemaToast');
  const stagePropsLayer = document.getElementById('stagePropsLayer');

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. 3D Tilt & Specular Sheen Physics
     -------------------------------------------------------------------------- */
  let bounds = null;

  function updateBounds() {
    if (ticketCard) {
      bounds = ticketCard.getBoundingClientRect();
    }
  }

  window.addEventListener('resize', updateBounds);
  updateBounds();

  if (!prefersReducedMotion && ticketScene && ticketCard) {
    ticketScene.addEventListener('mouseenter', () => {
      updateBounds();
      ticketCard.style.transition = 'transform 0.15s ease-out';
    });

    ticketScene.addEventListener('mousemove', (e) => {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      const deltaX = (mouseX - centerX) / centerX;
      const deltaY = (mouseY - centerY) / centerY;

      // Max rotation angles in degrees
      const maxRotY = 9;
      const maxRotX = 9;

      const rotY = deltaX * maxRotY;
      const rotX = -deltaY * maxRotX;

      ticketCard.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(10px)`;

      // Update specular sheen position
      const glarePercentX = (mouseX / bounds.width) * 100;
      const glarePercentY = (mouseY / bounds.height) * 100;

      const sheen = document.querySelector('.ticket-sheen-glare');
      if (sheen) {
        sheen.style.setProperty('--glare-x', `${glarePercentX.toFixed(1)}%`);
        sheen.style.setProperty('--glare-y', `${glarePercentY.toFixed(1)}%`);
        sheen.style.setProperty('--glare-opacity', '0.65');
      }
    });

    ticketScene.addEventListener('mouseleave', () => {
      ticketCard.style.transition = 'transform 0.8s var(--ease-elastic)';
      ticketCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';

      const sheen = document.querySelector('.ticket-sheen-glare');
      if (sheen) {
        sheen.style.setProperty('--glare-opacity', '0');
      }
    });

    // Parallax stage props and ribbons on mouse move
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 24;
      const normY = (e.clientY / window.innerHeight - 0.5) * 24;

      if (stagePropsLayer) {
        stagePropsLayer.style.transform = `translate3d(${-normX * 0.4}px, ${-normY * 0.4}px, 0)`;
      }

      const topRibbon = document.querySelector('.film-tape-top-wrapper');
      if (topRibbon) {
        topRibbon.style.transform = `translate3d(${normX * 0.25}px, ${normY * 0.15}px, 0)`;
      }

      const rightRibbon = document.querySelector('.film-tape-right-wrapper');
      if (rightRibbon) {
        rightRibbon.style.transform = `translate3d(${-normX * 0.3}px, ${-normY * 0.3}px, 0)`;
      }

      const bottomRibbon = document.querySelector('.film-tape-bottom-wrapper');
      if (bottomRibbon) {
        bottomRibbon.style.transform = `translate3d(${normX * 0.35}px, ${normY * 0.35}px, 0)`;
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. Toast Notification System
     -------------------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    if (!cinemaToast) return;
    cinemaToast.textContent = message;
    cinemaToast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cinemaToast.classList.remove('show');
    }, 2800);
  }

  /* --------------------------------------------------------------------------
     3. Retro Web Audio API Projector Synthesizer
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isSoundActive = false;
  let projectorHumNode = null;
  let projectorGainNode = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function startProjectorHum() {
    initAudioContext();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.08;
      }

      projectorHumNode = audioCtx.createBufferSource();
      projectorHumNode.buffer = noiseBuffer;
      projectorHumNode.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, audioCtx.currentTime);

      projectorGainNode = audioCtx.createGain();
      projectorGainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      projectorGainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1);

      projectorHumNode.connect(filter);
      filter.connect(projectorGainNode);
      projectorGainNode.connect(audioCtx.destination);

      projectorHumNode.start();
    } catch (e) {}
  }

  function stopProjectorHum() {
    if (projectorGainNode && audioCtx) {
      try {
        projectorGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        setTimeout(() => {
          if (projectorHumNode) {
            projectorHumNode.stop();
            projectorHumNode = null;
          }
        }, 450);
      } catch (e) {}
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudioContext();
      isSoundActive = !isSoundActive;

      if (isSoundActive) {
        audioToggleBtn.classList.add('active');
        if (soundLabel) soundLabel.textContent = 'SOUND ON';
        if (soundIcon) {
          soundIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          `;
        }
        startProjectorHum();
        showToast('🎬 Vintage Cinema Audio Enabled');
      } else {
        audioToggleBtn.classList.remove('active');
        if (soundLabel) soundLabel.textContent = 'SOUND OFF';
        if (soundIcon) {
          soundIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          `;
        }
        stopProjectorHum();
        showToast('Audio Muted');
      }
    });
  }
});
