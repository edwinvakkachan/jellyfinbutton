/**
 * index.extra.js
 * Enhances the UI without modifying index.js.
 * Watches #status text and syncs the dot + body class.
 */

(function () {
  const dot    = document.getElementById('status-dot');
  const status = document.getElementById('status');
  const button = document.querySelector('.btn');
  const label  = button ? button.querySelector('.btn__label') : null;

  // ── Dot & body class from status text ──────────────────────
  function syncDot(text) {
    if (!dot) return;
    dot.className = 'status-dot'; // reset
    if (/on/i.test(text) && !/wait|sending/i.test(text)) {
      dot.classList.add('is-on');
    } else if (/off/i.test(text)) {
      dot.classList.add('is-off');
    }
  }

  // ── Body class when button is disabled (cooldown active) ───
  function syncWaiting() {
    if (!button) return;
    if (button.disabled) {
      document.body.classList.add('is-waiting');
    } else {
      document.body.classList.remove('is-waiting');
    }
  }

  // ── Keep btn__label in sync with button text ────────────────
  // index.js sets button.innerText directly; mirror that to label span
  function syncLabel() {
    if (!label || !button) return;
    // Grab only text nodes of btn (ignore icon svg)
    const nodes = [...button.childNodes].filter(n => n.nodeType === Node.TEXT_NODE);
    if (nodes.length) {
      label.textContent = nodes.map(n => n.textContent.trim()).join(' ');
      // Remove raw text nodes so label is the only text
      nodes.forEach(n => n.remove());
    }
    // Reflect innerText changes from index.js
    const raw = button.innerText.trim();
    if (raw && raw !== label.textContent.trim()) {
      label.textContent = raw;
    }
  }

  // MutationObserver on #status
  const statusObs = new MutationObserver(() => {
    syncDot(status.innerText);
  });
  statusObs.observe(status, { childList: true, characterData: true, subtree: true });

  // MutationObserver on button (disabled attr + label text)
  const btnObs = new MutationObserver(() => {
    syncWaiting();
    syncLabel();
  });
  if (button) {
    btnObs.observe(button, {
      attributes: true,
      attributeFilter: ['disabled'],
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  // Ripple effect on button click
  if (button) {
    button.addEventListener('pointerdown', (e) => {
      if (button.disabled) return;
      const ripple = document.createElement('span');
      const rect   = button.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top  - size/2}px;
        background:rgba(255,255,255,0.18);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.55s ease-out forwards;
        pointer-events:none;
        z-index:3;
      `;
      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Initial sync
  syncDot(status.innerText);
  syncWaiting();
})();