/**
 * Scratch Card Reveal Interaction Component
 * Native Canvas + Pointer Events + Accessible Fallback
 * Scoped exclusively to the "Coming Soon" ticket section
 */

(function () {
  'use strict';

  function initScratchCard() {
    const targetSection = document.querySelector('.ticket-status-footer.marquee-spotlight');
    if (!targetSection) return;

    // Check prefers-reduced-motion — auto-reveal if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      targetSection.classList.add('scratch-revealed-static');
      return;
    }

    // Detect primary input device for initial hint text
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const hintLabel = isTouchDevice ? 'Scratch to reveal' : 'Scratch to reveal';

    // Build overlay container
    const overlay = document.createElement('div');
    overlay.className = 'scratch-card-overlay';
    overlay.setAttribute('role', 'region');
    overlay.setAttribute('aria-label', 'Scratch card foil overlay');

    // Canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'scratch-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    // Visual hint badge
    const hintBadge = document.createElement('div');
    hintBadge.className = 'scratch-hint-badge';
    hintBadge.setAttribute('aria-hidden', 'true');
    hintBadge.innerHTML = `<span class="scratch-sparkle">✦</span><span class="scratch-text">${hintLabel}</span><span class="scratch-sparkle">✦</span>`;

    // Accessible keyboard / screen-reader reveal button
    const a11yBtn = document.createElement('button');
    a11yBtn.type = 'button';
    a11yBtn.className = 'scratch-a11y-btn';
    a11yBtn.textContent = 'Reveal Coming Soon';
    a11yBtn.setAttribute('aria-label', 'Reveal Coming Soon details');

    overlay.appendChild(canvas);
    overlay.appendChild(hintBadge);
    overlay.appendChild(a11yBtn);
    targetSection.appendChild(overlay);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      overlay.remove();
      return;
    }

    let isScratching = false;
    let isRevealed = false;
    let lastPoint = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let brushRadius = 18;
    let progressCheckTimer = null;

    // Draw luxury golden foil coating on canvas
    function renderFoil() {
      if (isRevealed) return;
      const rect = targetSection.getBoundingClientRect();
      width = Math.max(rect.width, 100);
      height = Math.max(rect.height, 40);
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Rich metallic gold foil gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0.0, '#D4AF37');
      grad.addColorStop(0.2, '#F7E7A9');
      grad.addColorStop(0.4, '#AA771C');
      grad.addColorStop(0.65, '#FDF3C2');
      grad.addColorStop(0.85, '#C5A059');
      grad.addColorStop(1.0, '#8C6218');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle brushed metallic diagonal luster
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = -width; i < width * 2; i += 24) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 40, height);
        ctx.lineTo(i + 52, height);
        ctx.lineTo(i + 12, 0);
        ctx.closePath();
        ctx.fill();
      }

      // 3. Vintage ticket dashed inner security frame
      ctx.strokeStyle = 'rgba(90, 45, 10, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(5, 5, width - 10, height - 10);
      ctx.setLineDash([]);

      // 4. Central embossed gold foil text stamp
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = 'bold 10px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '0.15em';

      // 5. Star accent stamps
      ctx.fillStyle = 'rgba(80, 35, 5, 0.55)';
      ctx.font = '900 11px sans-serif';
      ctx.fillText('★  ★  ★', width / 2, height / 2);

      ctx.restore();

      brushRadius = Math.max(16, Math.min(32, width * 0.08));
    }

    renderFoil();

    // Resize listener (debounced)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isRevealed) {
          renderFoil();
        }
      }, 150);
    });

    // Erase foil at client coordinates
    function eraseAt(clientX, clientY) {
      if (isRevealed) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = 'destination-out';

      // Circular dab
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();

      // Smooth connecting stroke from previous point
      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.lineWidth = brushRadius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      ctx.restore();
      lastPoint = { x, y };

      // Fade hint badge on first scratch
      if (!overlay.classList.contains('is-scratching')) {
        overlay.classList.add('is-scratching');
      }

      // Schedule progress check
      scheduleProgressCheck();
    }

    // Throttled pixel transparency calculation
    function scheduleProgressCheck() {
      if (progressCheckTimer || isRevealed) return;
      progressCheckTimer = setTimeout(() => {
        progressCheckTimer = null;
        checkProgress();
      }, 100);
    }

    function checkProgress() {
      if (isRevealed) return;
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let transparentCount = 0;
        const step = 4 * 16; // Sample every 16th pixel for high performance
        const totalSampled = Math.floor(pixels.length / step);

        for (let i = 3; i < pixels.length; i += step) {
          if (pixels[i] < 128) {
            transparentCount++;
          }
        }

        const scratchedRatio = transparentCount / totalSampled;
        // When 48%+ is cleared, smoothly auto-reveal the rest
        if (scratchedRatio >= 0.48) {
          revealAll();
        }
      } catch (err) {
        // Fallback: if getImageData fails (e.g. security sandbox), auto-reveal after several scratches
      }
    }

    // Complete reveal animation
    function revealAll() {
      if (isRevealed) return;
      isRevealed = true;
      overlay.classList.add('scratch-revealed');

      // Cleanup after fade-out transition
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 600);

      // Trigger custom event for hooks if needed
      try {
        targetSection.dispatchEvent(new CustomEvent('scratchrevealed', { bubbles: true }));
      } catch (e) { }
    }

    // -------------------------------------------------------------------------
    // Pointer Events (Unified Touch & Mouse Scratching)
    // -------------------------------------------------------------------------
    overlay.addEventListener('pointerdown', (e) => {
      if (isRevealed) return;
      if (e.cancelable && (e.pointerType === 'touch' || e.pointerType === 'pen')) {
        e.preventDefault();
      }
      isScratching = true;
      lastPoint = null;
      try {
        overlay.setPointerCapture(e.pointerId);
      } catch (err) { }
      eraseAt(e.clientX, e.clientY);
    });

    overlay.addEventListener('pointermove', (e) => {
      if (isRevealed) return;

      // On touch devices: only erase when finger is pressed down
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        if (isScratching) {
          if (e.cancelable) e.preventDefault();
          eraseAt(e.clientX, e.clientY);
        }
      } else {
        // On desktop mouse: erase either when clicking/dragging OR hovering across
        eraseAt(e.clientX, e.clientY);
      }
    });

    overlay.addEventListener('pointerup', (e) => {
      isScratching = false;
      lastPoint = null;
      try {
        overlay.releasePointerCapture(e.pointerId);
      } catch (err) { }
      checkProgress();
    });

    overlay.addEventListener('pointercancel', (e) => {
      isScratching = false;
      lastPoint = null;
      checkProgress();
    });

    overlay.addEventListener('pointerleave', () => {
      lastPoint = null;
    });

    // -------------------------------------------------------------------------
    // Accessible Keyboard / Screen-reader Handler
    // -------------------------------------------------------------------------
    a11yBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      revealAll();
    });

    a11yBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        revealAll();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScratchCard);
  } else {
    initScratchCard();
  }
})();
