/* =========================================================
   CourseHub — Script
   ========================================================= */

/* ---------------------------------------------------------
   1. Header shrink + shadow on scroll
   --------------------------------------------------------- */
const siteHeader = document.querySelector('header');
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------
   2. Close the mobile menu when a link is tapped
   --------------------------------------------------------- */
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => { navToggle.checked = false; });
  });
}

/* ---------------------------------------------------------
   3. Reveal-on-scroll for any element with class="reveal"
   --------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

/* ---------------------------------------------------------
   4. Animated counters (hero glass-stat numbers)
   --------------------------------------------------------- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.count.includes('.') ? 1 : 0;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (decimals ? value.toFixed(1) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));
}

/* ---------------------------------------------------------
   5. Course data (variables & arrays)
   --------------------------------------------------------- */
const courses = [
  { id: 1, title: "HTML & CSS Foundations", level: "beginner", category: "Web Development", lessons: 12, badge: "new", icon: "images/course-html-css.svg" },
  { id: 2, title: "JavaScript Basics", level: "beginner", category: "Programming", lessons: 16, badge: "popular", icon: "images/course-js.svg" },
  { id: 3, title: "UI / UX Design Fundamentals", level: "beginner", category: "Design", lessons: 10, badge: "free", icon: "images/course-uiux.svg" },
  { id: 4, title: "Responsive Layouts with Bootstrap", level: "intermediate", category: "Web Development", lessons: 14, badge: "popular", icon: "images/course-bootstrap.svg" },
  { id: 5, title: "React Fundamentals", level: "intermediate", category: "Programming", lessons: 18, badge: "new", icon: "images/course-react.svg" },
  { id: 6, title: "Advanced CSS Animations", level: "advanced", category: "Web Development", lessons: 9, badge: "advanced", icon: "images/course-css-anim.svg" },
];

const badgeClass = { new: "badge-new", free: "badge-free", advanced: "badge-advanced", popular: "badge-popular" };

/* ---------------------------------------------------------
   6. Render a filtered set of courses (function for logic)
   --------------------------------------------------------- */
function renderCourses(level) {
  const grid = document.getElementById("course-grid");
  if (!grid) return;
  const filtered = level === "all" ? courses : courses.filter(c => c.level === level);

  grid.innerHTML = filtered.map(c => `
    <article class="course-card reveal in-view">
      <div class="course-top">
        <div class="course-icon"><img src="${c.icon}" alt="${c.category} icon"></div>
        <span class="badge ${badgeClass[c.badge]}">${c.badge}</span>
      </div>
      <h3>${c.title}</h3>
      <p>${c.category} · ${c.level[0].toUpperCase() + c.level.slice(1)} level</p>
      <div class="course-meta">
        <span>${c.lessons} lessons</span>
        <span>${c.category}</span>
      </div>
    </article>
  `).join("");
}

/* ---------------------------------------------------------
   7. Filter buttons: filter data on click
   --------------------------------------------------------- */
const filtersEl = document.getElementById("filters");
if (filtersEl) {
  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderCourses(btn.dataset.level);
  });
}

if (document.getElementById("course-grid")) {
  renderCourses("all");
}

/* ---------------------------------------------------------
   8. Loop over data grouped by category, log to console
   --------------------------------------------------------- */
function logCoursesByCategory(data) {
  const categories = [...new Set(data.map(c => c.category))];

  categories.forEach(category => {
    console.log(`%c${category}`, "color:#5B3DF5; font-weight:bold; font-size:13px;");
    const group = data.filter(c => c.category === category);

    for (const course of group) {
      console.log(`  - ${course.title} (${course.level}, ${course.lessons} lessons)`);
    }
  });

  console.log(`%cTotal courses: ${data.length}`, "color:#17A163; font-weight:bold;");
}
logCoursesByCategory(courses);

/* on-page preview mirroring the console output */
(function renderConsolePreview() {
  const box = document.getElementById("console-preview");
  if (!box) return;
  const categories = [...new Set(courses.map(c => c.category))];
  let html = "";
  categories.forEach(category => {
    html += `<div class="c-head">${category}</div>`;
    courses.filter(c => c.category === category).forEach(c => {
      html += `<div>&nbsp;&nbsp;- ${c.title} <span class="c-dim">(${c.level}, ${c.lessons} lessons)</span></div>`;
    });
  });
  html += `<div style="margin-top:10px;">Total courses: ${courses.length}</div>`;
  box.innerHTML = html;
})();

/* ---------------------------------------------------------
   9. Generic scroll-snap slider + dot navigation
      (works for the course slider on the home page)
   --------------------------------------------------------- */
document.querySelectorAll('.slider-shell').forEach(shell => {
  const track = shell.querySelector('.slider-track');
  const dotsWrap = shell.querySelector('.slide-dots');
  if (!track || !dotsWrap) return;

  const slides = track.querySelectorAll('.slide');
  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('button');
  track.addEventListener('scroll', () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }, { passive: true });
});

/* ---------------------------------------------------------
   10. Contact form — front-end only feedback (no backend)
   --------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message sent ✓';
    btn.style.filter = 'brightness(1)';
    contactForm.reset();
    setTimeout(() => { btn.textContent = original; }, 2600);
  });
}

/* ---------------------------------------------------------
   11. Sign-in form — front-end only feedback (no backend)
   --------------------------------------------------------- */
const signinForm = document.getElementById('signin-form');
if (signinForm) {
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = signinForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Signing in…';
    setTimeout(() => { btn.textContent = 'Welcome back ✓'; }, 700);
    setTimeout(() => { btn.textContent = original; }, 2600);
  });
}
