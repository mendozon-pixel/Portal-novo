// ============================================
// PORTAL DO SORRISO - SCRIPT PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- MENU MOBILE ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    const icon = menuToggle.querySelector('[data-icon]');
    if (nav.classList.contains('is-open')) {
      icon.setAttribute('data-icon', 'close');
    } else {
      icon.setAttribute('data-icon', 'menu');
    }
  });

  // Fecha o menu ao clicar em um link
  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle?.querySelector('[data-icon]')?.setAttribute('data-icon', 'menu');
    });
  });

  // Fecha o menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (
      nav?.classList.contains('is-open') &&
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      nav.classList.remove('is-open');
      menuToggle?.querySelector('[data-icon]')?.setAttribute('data-icon', 'menu');
    }
  });

  /* ---------- HEADER SCROLL ---------- */
  const header = document.getElementById('header');
  const toTop = document.getElementById('toTop');

  const handleScroll = () => {
    const scrolled = window.scrollY > 20;
    header?.classList.toggle('is-scrolled', scrolled);
    toTop?.classList.toggle('is-visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- BOTÃO VOLTAR AO TOPO ---------- */
  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- FAQ ACCORDION ---------- */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Fecha todos
      faqItems.forEach((i) => i.classList.remove('is-open'));

      // Abre o clicado (se estava fechado)
      if (!isOpen) item.classList.add('is-open');
    });
  });

  // Abre o primeiro item do FAQ por padrão
  faqItems[0]?.classList.add('is-open');

  /* ---------- FORMULÁRIO DE CONTATO ---------- */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const servico = form.servico.value;

    // Validação básica
    if (!nome || !email || !telefone || !servico) {
      feedback.textContent = '⚠️ Por favor, preencha todos os campos obrigatórios.';
      feedback.className = 'contact__feedback is-error';
      return;
    }

    // Validação de e-mail simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.textContent = '⚠️ Por favor, informe um e-mail válido.';
      feedback.className = 'contact__feedback is-error';
      return;
    }

    // Simula envio
    feedback.textContent = '⏳ Enviando sua solicitação...';
    feedback.className = 'contact__feedback';

    setTimeout(() => {
      feedback.textContent = `✅ Obrigado, ${nome}! Recebemos sua solicitação para "${servico}". Entraremos em contato em breve.`;
      feedback.className = 'contact__feedback is-success';
      form.reset();
    }, 1200);
  });

  /* ---------- MÁSCARA DE TELEFONE ---------- */
  const telefoneInput = document.getElementById('telefone');

  telefoneInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2}).*/, '($1');
    }

    e.target.value = value;
  });

  /* ---------- SCROLL SUAVE PARA ÂNCORAS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- ANIMAÇÃO DE ENTRADA (Intersection Observer) ---------- */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.feature, .service, .testimonial, .company__card, .faq__item, .about__content, .about__media'
  );

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  /* ---------- ANO DINÂMICO NO FOOTER ---------- */
  const footerBottom = document.querySelector('.footer__bottom p');
  if (footerBottom) {
    const anoAtual = new Date().getFullYear();
    footerBottom.innerHTML = footerBottom.innerHTML.replace('2026', anoAtual);
  }

  /* ---------- CONTADOR ANIMADO (Estatísticas) ---------- */
  const stats = document.querySelectorAll('.hero__stats strong');

  const animateNumber = (el, target, suffix = '') => {
    let current = 0;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      const formatted =
        target >= 1000
          ? Math.floor(current).toLocaleString('pt-BR')
          : Math.floor(current);
      el.textContent = formatted + suffix;
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;

          if (text.includes('+5')) {
            el.textContent = '+0';
            animateNumber(el, 5000, '');
          } else if (text.includes('+7')) {
            el.textContent = '+0';
            animateNumber(el, 7, '');
          }

          statsObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => statsObserver.observe(stat));
});
