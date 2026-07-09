document.addEventListener('DOMContentLoaded', function () {

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ── Nav scroll effect ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ── Mobile nav toggle ── */
  var toggle = document.getElementById('navToggle');
  var menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
      });
    });
  }

  /* ── Scroll reveal (Intersection Observer) ── */
  var revealEls = document.querySelectorAll(
    '.class-card, .feature-card, .step, .stat, .contact-item, .testimonial-card'
  );
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  /* ── Counter animation for stats ── */
  var statsObserved = false;
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !statsObserved) {
        statsObserved = true;
        animateCounters();
      }
    });
  });

  function animateCounters() {
    document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var current = 0;
      var increment = target / 30;
      var timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 30);
    });
  }

  var statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ── Form submission handler ── */
  var forms = document.querySelectorAll('.form-handler');
  if (!forms.length) return;

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var inputs = form.querySelectorAll('input, textarea');
      var isValid = true;

      inputs.forEach(function (input) {
        if (input.type !== 'submit') {
          input.classList.remove('error');
          input.style.borderColor = '';

          if (input.required && !input.value.trim()) {
            input.classList.add('error');
            input.style.borderColor = '#e74c3c';
            isValid = false;
          } else if (input.type === 'email' && input.value && !input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            input.classList.add('error');
            input.style.borderColor = '#e74c3c';
            isValid = false;
          }
        }
      });

      if (!isValid) {
        alert('⚠ Please fill in all required fields correctly.');
        return;
      }

      var formData = new FormData(form);
      var successTitle = form.id === 'admissions-form'
        ? 'Admission Application Received ✓'
        : 'Message Sent Successfully ✓';
      var successBody = form.id === 'admissions-form'
        ? 'Thank you! Our admissions team will contact you within 24 hours.'
        : 'Thank you! Our team will reach out to you shortly.';

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          alert(successTitle + '\n\n' + successBody);
          form.reset();
        } else {
          return response.json().then(function (data) {
            var error = data && data.error ? data.error : 'Unable to submit form. Please try again later.';
            alert('⚠ ' + error);
          });
        }
      }).catch(function () {
        alert('⚠ Unable to send your message right now. Please try again in a few minutes.');
      });
    });
  });

});
