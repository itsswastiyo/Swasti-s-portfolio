/**
 * PORTFOLIO CONTROLLER — SWASTI GUPTA
 * Handles multi-page navigation, keyboard shortcuts, swipe events,
 * and page transitions.
 */

let currentPage = 1;
const totalPages = 5;

// Elements
const pages = document.querySelectorAll('.page');
const dockButtons = document.querySelectorAll('.dock-btn');
const pageNumberIndicator = document.getElementById('pageNumber');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

/**
 * Navigate to a specific page number (1-5)
 * @param {number} pageNum 
 */
function goToPage(pageNum) {
  if (pageNum < 1 || pageNum > totalPages) return;
  
  currentPage = pageNum;

  // 1. Update pages
  pages.forEach(page => {
    const pageId = parseInt(page.getAttribute('data-page'));
    if (pageId === currentPage) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  // 2. Update Dock buttons
  dockButtons.forEach(btn => {
    const targetId = parseInt(btn.getAttribute('data-target'));
    if (targetId === currentPage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 3. Update top indicator
  if (pageNumberIndicator) {
    pageNumberIndicator.textContent = `0${currentPage} / 0${totalPages}`;
  }

  // 4. Update arrow button states
  if (prevBtn) {
    prevBtn.style.opacity = currentPage === 1 ? '0.35' : '1';
    prevBtn.style.pointerEvents = currentPage === 1 ? 'none' : 'auto';
  }
  if (nextBtn) {
    nextBtn.style.opacity = currentPage === totalPages ? '0.35' : '1';
    nextBtn.style.pointerEvents = currentPage === totalPages ? 'none' : 'auto';
  }

  // 5. Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Advance or go back pages
 * @param {number} delta (+1 or -1)
 */
function changePage(delta) {
  const target = currentPage + delta;
  if (target >= 1 && target <= totalPages) {
    goToPage(target);
  }
}

// Keyboard Navigation
window.addEventListener('keydown', (e) => {
  // Arrow keys or Space
  if (e.key === 'ArrowRight' || e.key === 'PageDown') {
    changePage(1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    changePage(-1);
  } else if (e.key >= '1' && e.key <= '5') {
    goToPage(parseInt(e.key));
  }
});

// Touch / Swipe Navigation for Mobile Devices
let touchStartX = 0;
let touchEndX = 0;

window.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const threshold = 50; // minimum distance for swipe
  const diff = touchEndX - touchStartX;

  if (Math.abs(diff) > threshold) {
    if (diff < 0) {
      // Swiped Left -> Next page
      changePage(1);
    } else {
      // Swiped Right -> Previous page
      changePage(-1);
    }
  }
}

/**
 * Copy contact number with toast notification and button feedback
 * @param {string} text 
 * @param {HTMLElement} btn 
 */
function copyContact(text, btn) {
  if (!text) text = '8791356430';
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      triggerCopySuccess(text, btn);
    }).catch(() => {
      fallbackCopy(text, btn);
    });
  } else {
    fallbackCopy(text, btn);
  }
}

function fallbackCopy(text, btn) {
  try {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    triggerCopySuccess(text, btn);
  } catch (err) {
    showToast(`Phone number: ${text}`);
  }
}

function triggerCopySuccess(text, btn) {
  showToast(`Copied +91 ${text} to clipboard! ✨`);
  if (btn) {
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<span>✅ Copied!</span>';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.classList.remove('copied');
    }, 2200);
  }
}

/**
 * Display toast popup
 * @param {string} msg 
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  
  if (window.toastTimer) clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  goToPage(1);
});

