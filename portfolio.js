/* ── TYPING EFFECT ── */
const phrases = [
  "Python Developer 🐍",
  "Web Developer 💻",
  "BSc Graduate from Anantapur 🎓"
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const word = phrases[pi];
  if (!deleting) {
    typedEl.innerHTML = word.slice(0, ++ci) + '<span class="cursor"></span>';
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.innerHTML = word.slice(0, --ci) + '<span class="cursor"></span>';
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 50 : 90);
}
setTimeout(type, 1000);

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      /* animate skill bars inside this element */
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      /* if the element itself is a skill item */
      if (e.target.classList.contains('skill-item')) {
        const bar = e.target.querySelector('.skill-fill');
        if (bar) bar.style.width = bar.dataset.width + '%';
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .timeline-item').forEach(item => {
  observer.observe(item);
});

/* ── CERTIFICATE MODAL ── */
function openCert(title, sub, imgFile) {
  const wrap = document.getElementById('modal-img-wrap');
  const img = new Image();
  img.src = imgFile;
  img.className = 'modal-img';
  img.onerror = function () {
    wrap.innerHTML = `<div class="modal-placeholder"><span>🏅</span>
      To show your certificate image here:<br/>
      1. Save your certificate as <strong>${imgFile}</strong><br/>
      2. Put it in the <strong>same folder</strong> as index.html<br/>
      3. Click View Certificate again!</div>`;
  };
  img.onload = function () { wrap.innerHTML = ''; wrap.appendChild(img); };
  wrap.innerHTML = '';
  wrap.appendChild(img);
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-sub').textContent = sub;
  document.getElementById('certModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCert() {
  document.getElementById('certModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('certModal').addEventListener('click', function (e) {
  if (e.target === this) closeCert();
});

/* ── FORMSPREE CONTACT FORM ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        status.style.color = 'var(--accent)';
        status.textContent = '✓ Message sent! I will get back to you soon.';
        contactForm.reset();
      } else {
        let reason = '';
        try {
          const data = await res.json();
          if (data.errors) reason = data.errors.map(er => er.message).join(', ');
          else if (data.error) reason = data.error;
        } catch (_) {}
        console.error('Formspree error:', res.status, reason);
        status.style.color = '#ff6b6b';
        status.textContent = '⚠ Could not send (' + res.status + (reason ? ': ' + reason : '') + '). Please email me directly.';
      }
    } catch {
      status.style.color = '#ff6b6b';
      status.textContent = '⚠ Network error. Please email me directly.';
    }
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  });
}

/* ── SHRINK NAVBAR ON SCROLL ── */
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.padding =
    window.scrollY > 60 ? '12px 60px' : '18px 60px';
});

/* ── GET IN TOUCH BUTTON → scroll to form and focus name field ── */
const getInTouchBtn = document.querySelector('a.btn[href="#contact"]');
if (getInTouchBtn) {
  getInTouchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const nameInput = document.querySelector('#contact-form input[name="name"]');
      if (nameInput) nameInput.focus({ preventScroll: true });
    }, 800);
  });
}