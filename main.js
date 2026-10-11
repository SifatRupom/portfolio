/* =============================================
   SIFAT AHAMMED — PORTFOLIO MAIN JAVASCRIPT
   GSAP + ScrollTrigger + Custom Cursor
   ============================================= */

if (typeof gsap !== 'undefined') {
  const plugins = [];
  if (typeof ScrollTrigger !== 'undefined') plugins.push(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') plugins.push(ScrollToPlugin);
  if (plugins.length > 0) {
    gsap.registerPlugin(...plugins);
  }
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.05 });
});

function updateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(updateFollower);
}
updateFollower();

// Cursor interactions
const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card, .nav-cta');
hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { width: 20, height: 20, background: 'var(--cyan)', duration: 0.3 });
    gsap.to(follower, { width: 64, height: 64, borderColor: 'rgba(0,229,255,0.5)', duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { width: 12, height: 12, background: 'var(--gold)', duration: 0.3 });
    gsap.to(follower, { width: 40, height: 40, borderColor: 'rgba(245,180,0,0.4)', duration: 0.3 });
  });
});

// ==========================================
// NAVIGATION SCROLL EFFECT
// ==========================================
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -80px',
  onUpdate: (self) => {
    if (self.progress > 0) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});

// Smooth scroll nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut'
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ==========================================
// HERO ANIMATIONS — ON LOAD
// ==========================================
if (typeof gsap !== 'undefined') {
  const heroTL = gsap.timeline({ delay: 0.3 });

  heroTL
    .to('.title-line', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: 'expo.out'
    })
    .to('.hero-tagline', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .to('.hero-meta .meta-item', {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5')
    .to('.hero-scroll-indicator', {
      opacity: 1,
      duration: 0.8
    }, '-=0.3')
    .call(() => {
      // Trigger accent text stroke reveal
      setTimeout(() => {
        const accent = document.querySelector('.accent');
        if (accent) accent.classList.add('revealed');
      }, 200);
    });

  // Initial hidden state for hero meta
  gsap.set('.hero-meta .meta-item', { opacity: 0, y: 20 });
  gsap.set('.hero-scroll-indicator', { opacity: 0 });
  gsap.set('.hero-tagline', { opacity: 0, y: 20 });
}

// Fallback to guarantee hero text visibility
setTimeout(() => {
  document.querySelectorAll('.title-line, .hero-tagline, .hero-meta .meta-item, .hero-scroll-indicator').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
  const accent = document.querySelector('.accent');
  if (accent) accent.classList.add('revealed');
}, 1200);

// ==========================================
// AMBIENT GLOW — MOUSE PARALLAX
// ==========================================
document.addEventListener('mousemove', (e) => {
  const xPercent = (e.clientX / window.innerWidth - 0.5) * 20;
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 20;
  gsap.to('.glow-1', { x: xPercent * 1.5, y: yPercent * 1.5, duration: 2, ease: 'power1.out' });
  gsap.to('.glow-2', { x: -xPercent, y: -yPercent, duration: 3, ease: 'power1.out' });
  gsap.to('.glow-3', { x: xPercent * 0.5, y: yPercent * 0.5, duration: 2.5, ease: 'power1.out' });
});

// ==========================================
// SCROLL REVEAL — GENERIC
// ==========================================
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

initReveal();

// ==========================================
// SKILL BAR ANIMATIONS
// ==========================================
const skillCards = document.querySelectorAll('.skill-card');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      const targetWidth = fill.getAttribute('data-width') + '%';
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillCards.forEach(card => skillObserver.observe(card));

// ==========================================
// PROJECT CARDS — GSAP SCROLL STAGGER
// ==========================================
const projectCards = document.querySelectorAll('.project-card');

ScrollTrigger.batch(projectCards, {
  onEnter: (batch) => {
    gsap.from(batch, {
      opacity: 0,
      y: 60,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out'
    });
  },
  start: 'top 85%',
  once: true
});

// ==========================================
// ABOUT SECTION — NUMBERS COUNTER
// ==========================================
function animateCounter(el, target, suffix = '') {
  const isSpecial = target === '∞';
  if (isSpecial) return;

  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 30);
}

const numObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.num');
      nums.forEach(num => {
        const text = num.textContent;
        const match = text.match(/\d+/);
        if (match) {
          const suffix = text.replace(match[0], '');
          animateCounter(num, parseInt(match[0]), suffix.replace(/\+/g, '+'));
        }
      });
      numObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const aboutNums = document.querySelector('.about-numbers');
if (aboutNums) numObserver.observe(aboutNums);

// ==========================================
// HERO TITLE — MAGNETIC EFFECT ON MOUSE NEAR
// ==========================================
const heroTitle = document.getElementById('heroTitle');
if (heroTitle) {
  document.addEventListener('mousemove', (e) => {
    const rect = heroTitle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) / rect.width;
    const distY = (e.clientY - centerY) / rect.height;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < 0.8) {
      gsap.to(heroTitle, {
        x: distX * 12,
        y: distY * 6,
        duration: 0.8,
        ease: 'power2.out'
      });
    } else {
      gsap.to(heroTitle, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' });
    }
  });
}

// ==========================================
// CONTACT BUTTON — MAGNETIC
// ==========================================
const contactBtn = document.getElementById('contactBtn');
const socialLinks = document.getElementById('socialLinks');
const socialLinkItems = socialLinks ? socialLinks.querySelectorAll('.social-link') : [];
let socialOpen = false;

if (contactBtn) {
  contactBtn.addEventListener('mousemove', (e) => {
    const rect = contactBtn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    gsap.to(contactBtn, { x, y, duration: 0.4, ease: 'power2.out' });
  });
  contactBtn.addEventListener('mouseleave', () => {
    gsap.to(contactBtn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });

  // ==========================================
  // SOCIAL LINKS — REVEAL ON CLICK
  // ==========================================
  contactBtn.addEventListener('click', () => {
    socialOpen = !socialOpen;

    if (socialOpen) {
      // Show container first
      socialLinks.classList.add('is-open');
      // Stagger each link in
      socialLinkItems.forEach((link, i) => {
        const delay = parseInt(link.getAttribute('data-delay') || i) * 90;
        setTimeout(() => {
          link.classList.add('link-visible');
        }, delay);
      });
    } else {
      // Reverse: hide links then container
      socialLinkItems.forEach(link => link.classList.remove('link-visible'));
      setTimeout(() => {
        socialLinks.classList.remove('is-open');
      }, 350);
    }
  });
}

// ==========================================
// LOADING EFFECT — PAGE ENTRY
// ==========================================
gsap.from('body', {
  opacity: 0,
  duration: 0.6,
  ease: 'power2.out'
});

// ==========================================
// PHOTO — HANDLE MISSING IMAGE
// ==========================================
const profilePhoto = document.getElementById('profilePhoto');
if (profilePhoto) {
  profilePhoto.addEventListener('error', () => {
    const frame = profilePhoto.closest('.photo-frame');
    frame.classList.add('no-photo');
    profilePhoto.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.classList.add('photo-placeholder-text');
    placeholder.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 16px; opacity: 0.3;">👤</div>
      <div style="font-size: 0.75rem; color: #6b7280; letter-spacing: 0.1em; text-transform: uppercase;">
        Add your photo<br/>
        <code style="font-size: 0.65rem; color: #4ade80; background: rgba(74,222,128,0.1); padding: 4px 8px; border-radius: 4px; margin-top: 8px; display: inline-block;">photo.jpg</code>
      </div>
    `;
    frame.appendChild(placeholder);
  });
}

// ==========================================
// PARALLAX — HERO ON SCROLL
// ==========================================
gsap.to('.hero-title', {
  y: -60,
  opacity: 0.3,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

gsap.to('.hero-tagline', {
  y: -40,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

// ==========================================
// SECTION HEADERS — SCROLL REVEAL
// ==========================================
gsap.utils.toArray('.section-header').forEach(header => {
  gsap.from(header, {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: header,
      start: 'top 80%',
      once: true
    }
  });
});

// ==========================================
// CONTACT SECTION — SCROLL REVEAL
// ==========================================
gsap.from('.contact-inner', {
  opacity: 0,
  y: 60,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.contact',
    start: 'top 70%',
    once: true
  }
});
