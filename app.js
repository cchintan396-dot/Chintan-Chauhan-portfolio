/**
 * Chintan Chauhan - Academic Portfolio
 * Interactive Functionality: Theme Manager, Document Modal, Copy Utility & ScrollSpy
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollSpy();
  initAbstractToggle();
  initMediaModal();
  initCopyButtons();
  initDynamicYear();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialHtmlTheme = document.documentElement.getAttribute('data-theme');
  
  // Use stored preference if available, otherwise existing html attribute or system preference
  const activeTheme = storedTheme || initialHtmlTheme || (prefersDark ? 'dark' : 'dark');
  setTheme(activeTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Deep Sea Dark' : 'Coastal Light'} mode`);
    });
  }

  // Listen to OS theme changes if user hasn't manually set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  function openMenu() {
    navMenu.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.classList.add('active');
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.classList.remove('active');
  }

  // Close menu when clicking navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 820) {
        closeMenu();
      }
    });
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. ScrollSpy Navigation (Active Section Highlighting)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. Publication Abstract Accordion / Toggle
   -------------------------------------------------------------------------- */
function initAbstractToggle() {
  const toggleBtn = document.getElementById('btn-toggle-abstract');
  const abstractBox = document.getElementById('pub-abstract-full');

  if (!toggleBtn || !abstractBox) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = abstractBox.hasAttribute('hidden');
    if (isHidden) {
      abstractBox.removeAttribute('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.querySelector('span').textContent = 'Collapse Abstract';
    } else {
      abstractBox.setAttribute('hidden', '');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.querySelector('span').textContent = 'Read Full Abstract';
    }
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Certificate & Document Modal Viewer
   -------------------------------------------------------------------------- */
function initMediaModal() {
  const modal = document.getElementById('media-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const modalOpenFull = document.getElementById('modal-open-full');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalDismissBtn = document.getElementById('modal-dismiss');
  const modalBackdrop = document.getElementById('modal-backdrop');

  if (!modal) return;

  const triggerButtons = document.querySelectorAll('.btn-open-modal');

  triggerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-modal-title') || 'Document Preview';
      const imgSrc = btn.getAttribute('data-image-src') || '';
      const caption = btn.getAttribute('data-image-caption') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalImage) {
        modalImage.src = imgSrc;
        modalImage.alt = title;
      }
      if (modalCaption) modalCaption.textContent = caption;
      if (modalOpenFull) modalOpenFull.href = imgSrc;

      openModal();
    });
  });

  function openModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (modalCloseBtn) modalCloseBtn.focus();
    document.addEventListener('keydown', handleKeyDown);
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
}

/* --------------------------------------------------------------------------
   6. Copy to Clipboard & Citation Utilities
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  // Generic copy buttons (email, phone, etc.)
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(err => {
          fallbackCopyText(textToCopy);
        });
      }
    });
  });

  // Citation copy button (BibTeX)
  const citationButtons = document.querySelectorAll('.btn-copy-citation');
  citationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = `@incollection{navapara2026biofuel,
  author    = {Navapara, Radha and Vaghela, Tejas and Chauhan, Chintan and Tripathi, Deepti and Rathore, Mangal S.},
  title     = {Biofuel Production from Seaweed Feedstock: Harnessing the Coastal Innovations for Sustainable Future},
  booktitle = {Biofuels and Bioenergy},
  series    = {Green Energy and Technology},
  editor    = {Kumar, N.},
  year      = {2026},
  pages     = {347--374},
  publisher = {Springer Nature Singapore},
  doi       = {10.1007/978-981-95-6766-9_12}
}`;
      navigator.clipboard.writeText(bibtex).then(() => {
        showToast('BibTeX citation copied to clipboard');
      }).catch(() => {
        fallbackCopyText(bibtex);
      });
    });
  });
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Copied to clipboard');
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textArea);
}

/* --------------------------------------------------------------------------
   Toast Notification System
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   7. Dynamic Current Year
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
