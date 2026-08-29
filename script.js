/**
 * COEP Impressions '26 — Coming Soon Page
 * Interactive 3D Cursor Physics & Theatrical Props Parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const ticketScene = document.getElementById('ticket3dScene');
  const ticketCard = document.getElementById('ticketCard');
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
});
