document.addEventListener('DOMContentLoaded', () => {

  /* ===== Language Toggle (AR/EN) ===== */
  const langBtn = document.getElementById('langToggle');
  const body = document.body;
  let currentLang = 'ar';

  function applyLang(lang){
    currentLang = lang;
    body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    langBtn.textContent = lang === 'ar' ? 'EN' : 'AR';

    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      el.innerHTML = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    });
    document.querySelectorAll('[data-ar-ph][data-en-ph]').forEach(el => {
      el.placeholder = lang === 'ar' ? el.getAttribute('data-ar-ph') : el.getAttribute('data-en-ph');
    });
  }

  langBtn.addEventListener('click', () => applyLang(currentLang === 'ar' ? 'en' : 'ar'));

  /* ===== Mobile menu ===== */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

  /* ===== Search box ===== */
  const searchToggle = document.getElementById('searchToggle');
  const searchBox = document.getElementById('searchBox');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  searchToggle.addEventListener('click', () => {
    searchBox.classList.toggle('open');
    if (searchBox.classList.contains('open')) searchInput.focus();
  });
  searchClose.addEventListener('click', () => searchBox.classList.remove('open'));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const term = searchInput.value.trim().toLowerCase();
    if (!term) return;
    const sections = document.querySelectorAll('main, section');
    for (const sec of sections) {
      if (sec.innerText.toLowerCase().includes(term)) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  });

  /* ===== Animated counters ===== */
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ===== KPI bars ===== */
  const kpiFills = document.querySelectorAll('.kpi-fill');
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-value') + '%';
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  kpiFills.forEach(f => kpiObserver.observe(f));

  /* ===== Gallery filter ===== */
  const gtabs = document.querySelectorAll('.gtab');
  const galleryItems = document.querySelectorAll('.gallery-item');
  gtabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gtabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* ===== Contact form ===== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.add('show');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  });

  /* ===== Back to top ===== */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===== Visitor counter (localStorage, simulated) ===== */
  const visitorEl = document.getElementById('visitorCount');
  let count = parseInt(localStorage.getItem('zubaida_visitor_count') || '15820', 10);
  count += 1;
  localStorage.setItem('zubaida_visitor_count', count);
  visitorEl.textContent = count.toLocaleString();

  /* ===== Charts ===== */
  const maroon = '#8a1538';
  const gold = '#c9a24b';
  const maroonLight = 'rgba(138,21,56,0.15)';

  if (window.Chart) {
    new Chart(document.getElementById('chartSuccess'), {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'نسبة النجاح %',
          data: [89, 91, 93, 95, 97, 98],
          borderColor: maroon,
          backgroundColor: maroonLight,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: gold
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    new Chart(document.getElementById('chartLevels'), {
      type: 'bar',
      data: {
        labels: ['الصف العاشر', 'الصف الحادي عشر', 'الصف الثاني عشر'],
        datasets: [{
          label: 'متوسط التحصيل %',
          data: [88, 91, 96],
          backgroundColor: [maroon, '#a8224a', gold]
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    new Chart(document.getElementById('chartCompare'), {
      type: 'bar',
      data: {
        labels: ['2022', '2023', '2024', '2025'],
        datasets: [
          { label: 'علمي', data: [90, 92, 95, 97], backgroundColor: maroon },
          { label: 'أدبي', data: [86, 89, 91, 94], backgroundColor: gold }
        ]
      },
      options: { responsive: true }
    });

    new Chart(document.getElementById('chartImprovement'), {
      type: 'radar',
      data: {
        labels: ['القراءة', 'الرياضيات', 'العلوم', 'اللغة الإنجليزية', 'المهارات الحياتية'],
        datasets: [{
          label: 'مؤشر التحسن',
          data: [85, 88, 90, 87, 93],
          borderColor: maroon,
          backgroundColor: maroonLight,
          pointBackgroundColor: gold
        }]
      },
      options: { responsive: true }
    });
  }

});
