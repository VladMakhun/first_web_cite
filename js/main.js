document.addEventListener('DOMContentLoaded', init);

function init() {
  initActiveNav();
  initThemeToggle();
  initBackToTop();
  initAccordion();
  initContactForm();
}

function initActiveNav() {
  const links = document.querySelectorAll('.nav-list a');
  const current = window.location.pathname;

  links.forEach(link => {
    if (current.includes(link.getAttribute('href'))) {
      link.classList.add('is-active');
    }
  });
}

function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('siteTheme');

  if (saved === 'dark') {
    document.body.classList.add('theme-dark');
  }

  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      const isDark = document.body.classList.contains('theme-dark');
      localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
    });
  }
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  const year = document.querySelector('.year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (btn) {
    window.addEventListener('scroll', () => {
      btn.hidden = window.scrollY < 300;
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const btn = item.querySelector('.accordion-header');

    btn?.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

function initContactForm() {
  const form = document.querySelector('form');
  if (!form) return;

  const draftKey = 'contactDraft';
  const textarea = form.querySelector('textarea');
  const counter = document.createElement('div');

  if (textarea) {
    textarea.after(counter);

    textarea.addEventListener('input', () => {
      counter.textContent = `Символів: ${textarea.value.length}`;
    });
  }

  const saved = JSON.parse(localStorage.getItem(draftKey) || '{}');
  Object.entries(saved).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });

  form.addEventListener('input', () => {
    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem(draftKey, JSON.stringify(data));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || data.name.length < 2) {
      alert('Ім’я мінімум 2 символи');
      return;
    }

    if (!data.email.includes('@')) {
      alert('Невірний email');
      return;
    }

    if (!data.message) {
      alert('Повідомлення не може бути пустим');
      return;
    }

    const result = document.createElement('div');
    result.className = 'card';
    result.innerHTML = `
      <h2>Дані відправлено:</h2>
      <p><b>Ім’я:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Повідомлення:</b> ${data.message}</p>
    `;

    form.after(result);

    localStorage.removeItem(draftKey);
    form.reset();
  });
}