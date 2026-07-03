/* ============================================================
   CorchoPaymo - Complete JavaScript
   Pure Vanilla JS · No frameworks · No libraries
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PRELOADER
  ---------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  let preloaderHidden = false;

  function hidePreloader() {
    if (preloaderHidden || !preloader) return;
    preloaderHidden = true;
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }


  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 800);
  });

  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 800);
  }

  // Safety fallback: always hide after 2.5s even if assets are still loading
  setTimeout(hidePreloader, 2500);


  /* ----------------------------------------------------------
     2. NAVBAR SCROLL BEHAVIOR
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  const hero = document.getElementById('hero');

  // Add/remove 'scrolled' class based on scroll position
  function handleNavbarScroll() {
    if (!navbar) return;
    if (!hero || window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        handleParallax && handleParallax();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  handleNavbarScroll(); // Run once on init

  // Active nav-link tracking with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));
  }


  /* ----------------------------------------------------------
     3. HAMBURGER MENU (Mobile)
  ---------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-link');

  function openMobileMenu() {
    hamburger && hamburger.classList.add('active');
    mobileMenu && mobileMenu.classList.add('active');
    mobileOverlay && mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    hamburger && hamburger.classList.remove('active');
    mobileMenu && mobileMenu.classList.remove('active');
    mobileOverlay && mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (hamburger.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  /* ----------------------------------------------------------
     4. SCROLL-TRIGGERED ANIMATIONS
  ---------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  }


  /* ----------------------------------------------------------
     5. COUNTER ANIMATION (Stats Bar)
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('es-ES') + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate all counters inside or matching this element
          const countersInView = entry.target.querySelectorAll
            ? entry.target.querySelectorAll('.counter[data-target]')
            : [];

          // If the entry itself is a counter
          if (entry.target.classList.contains('counter') && entry.target.dataset.target) {
            animateCounter(entry.target);
          }

          // Animate child counters
          countersInView.forEach(counter => animateCounter(counter));

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    // Observe either the stats-bar container or each counter individually
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
      counterObserver.observe(statsBar);
    } else {
      counters.forEach(counter => counterObserver.observe(counter));
    }
  }


  /* ----------------------------------------------------------
     6. FEATURE TABS (Paymo section)
  ---------------------------------------------------------- */
  const featureTabs = document.querySelectorAll('.feature-tab');

  featureTabs.forEach(tab => {
    const header = tab.querySelector('.feature-tab__header');
    if (!header) return;

    header.addEventListener('click', () => {
      if (tab.classList.contains('active')) {
        // Close this tab
        tab.classList.remove('active');
      } else {
        // Close all tabs, open this one
        featureTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      }
    });
  });

  // Open first tab by default
  if (featureTabs.length > 0) {
    featureTabs[0].classList.add('active');
  }


  /* ----------------------------------------------------------
     7. BEFORE/AFTER COMPARISON SLIDER (Gallery section)
  ---------------------------------------------------------- */
  function initComparisonSlider(wrapper) {
    if (!wrapper) return;

    const handle = wrapper.querySelector('.comparison-handle');
    const beforeImg = wrapper.querySelector('.before-image');
    let isDragging = false;

    function getPosition(e) {
      const rect = wrapper.getBoundingClientRect();
      let x;
      if (e.touches) {
        x = e.touches[0].clientX - rect.left;
      } else {
        x = e.clientX - rect.left;
      }
      return Math.max(0, Math.min(x / rect.width * 100, 100));
    }

    function updatePosition(percent) {
      if (handle) handle.style.left = percent + '%';
      if (beforeImg) beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }

    // Mouse events
    wrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      updatePosition(getPosition(e));
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updatePosition(getPosition(e));
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    wrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      updatePosition(getPosition(e));
    }, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
      if (isDragging) updatePosition(getPosition(e));
    }, { passive: true });
    wrapper.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Initialize at 50%
    updatePosition(50);
  }

  // Initialize all comparison wrappers once
  document.querySelectorAll('.comparison-wrapper').forEach(wrapper => {
    initComparisonSlider(wrapper);
  });

  // Comparison slide navigation (dots)
  const comparisonDots = document.querySelectorAll('.comparison-dot');
  const comparisonSlides = document.querySelectorAll('.comparison-slide');

  comparisonDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      // Remove active from all slides and dots
      comparisonSlides.forEach(slide => slide.classList.remove('active'));
      comparisonDots.forEach(d => d.classList.remove('active'));

      // Activate clicked
      if (comparisonSlides[index]) {
        comparisonSlides[index].classList.add('active');
      }
      dot.classList.add('active');
    });
  });


  /* ----------------------------------------------------------
     8. COLOR CHART INTERACTIVITY
  ---------------------------------------------------------- */

  // Full color data array (40 colors)
  const colores = [
    { codigo: 'PAYMO-01', nombre: 'Blanco Natural', hex: '#F5F0E8', familia: 'neutros' },
    { codigo: 'PAYMO-02', nombre: 'Marfil', hex: '#F2E8D5', familia: 'neutros' },
    { codigo: 'PAYMO-03', nombre: 'Crema', hex: '#F0DEB4', familia: 'neutros' },
    { codigo: 'PAYMO-04', nombre: 'Arena', hex: '#D4BC8B', familia: 'tierras' },
    { codigo: 'PAYMO-05', nombre: 'Beige', hex: '#C8B896', familia: 'tierras' },
    { codigo: 'PAYMO-06', nombre: 'Salmón', hex: '#E8A088', familia: 'rojos' },
    { codigo: 'PAYMO-07', nombre: 'Melocotón', hex: '#F0B89A', familia: 'rojos' },
    { codigo: 'PAYMO-08', nombre: 'Terracota', hex: '#C0603C', familia: 'rojos' },
    { codigo: 'PAYMO-09', nombre: 'Teja', hex: '#B34A30', familia: 'rojos' },
    { codigo: 'PAYMO-10', nombre: 'Rojo Ladrillo', hex: '#8B3020', familia: 'rojos' },
    { codigo: 'PAYMO-11', nombre: 'Ocre', hex: '#C8A040', familia: 'tierras' },
    { codigo: 'PAYMO-12', nombre: 'Amarillo Pálido', hex: '#F0D870', familia: 'rojos' },
    { codigo: 'PAYMO-13', nombre: 'Amarillo Arena', hex: '#E0C860', familia: 'tierras' },
    { codigo: 'PAYMO-14', nombre: 'Naranja Suave', hex: '#E0903C', familia: 'rojos' },
    { codigo: 'PAYMO-15', nombre: 'Gris Perla', hex: '#C0BEB8', familia: 'grises' },
    { codigo: 'PAYMO-16', nombre: 'Gris Medio', hex: '#909090', familia: 'grises' },
    { codigo: 'PAYMO-17', nombre: 'Gris Pizarra', hex: '#606060', familia: 'grises' },
    { codigo: 'PAYMO-18', nombre: 'Gris Antracita', hex: '#404040', familia: 'grises' },
    { codigo: 'PAYMO-19', nombre: 'Verde Oliva', hex: '#6B8E4E', familia: 'verdes' },
    { codigo: 'PAYMO-20', nombre: 'Verde Musgo', hex: '#4A6B3A', familia: 'verdes' },
    { codigo: 'PAYMO-21', nombre: 'Verde Bosque', hex: '#2D5A27', familia: 'verdes' },
    { codigo: 'PAYMO-22', nombre: 'Azul Grisáceo', hex: '#6A7B8A', familia: 'azules' },
    { codigo: 'PAYMO-23', nombre: 'Azul Piedra', hex: '#4A6070', familia: 'azules' },
    { codigo: 'PAYMO-24', nombre: 'Marrón Claro', hex: '#A07850', familia: 'tierras' },
    { codigo: 'PAYMO-25', nombre: 'Marrón Medio', hex: '#7A5A38', familia: 'tierras' },
    { codigo: 'PAYMO-26', nombre: 'Marrón Oscuro', hex: '#5A3E28', familia: 'tierras' },
    { codigo: 'PAYMO-27', nombre: 'Marrón Chocolate', hex: '#3E2A1A', familia: 'tierras' },
    { codigo: 'PAYMO-28', nombre: 'Corcho Natural', hex: '#B89868', familia: 'tierras' },
    { codigo: 'PAYMO-29', nombre: 'Rosa Pálido', hex: '#E0B0A0', familia: 'rojos' },
    { codigo: 'PAYMO-30', nombre: 'Piedra Natural', hex: '#B8A888', familia: 'neutros' },
    { codigo: 'PAYMO-31', nombre: 'Tostado', hex: '#C89060', familia: 'tierras' },
    { codigo: 'PAYMO-32', nombre: 'Burdeos', hex: '#6B2028', familia: 'rojos' },
    { codigo: 'PAYMO-33', nombre: 'Siena', hex: '#A0522D', familia: 'tierras' },
    { codigo: 'PAYMO-34', nombre: 'Miel', hex: '#D4A050', familia: 'tierras' },
    { codigo: 'PAYMO-35', nombre: 'Canela', hex: '#8B6538', familia: 'tierras' },
    { codigo: 'PAYMO-36', nombre: 'Hueso', hex: '#E8DCC8', familia: 'neutros' },
    { codigo: 'PAYMO-37', nombre: 'Pergamino', hex: '#F0E6D0', familia: 'neutros' },
    { codigo: 'PAYMO-38', nombre: 'Almendra', hex: '#D2B48C', familia: 'tierras' },
    { codigo: 'PAYMO-39', nombre: 'Grafito', hex: '#333333', familia: 'grises' },
    { codigo: 'PAYMO-40', nombre: 'Negro Pizarra', hex: '#1A1A1A', familia: 'grises' }
  ];

  // Dynamic color grid generation
  const colorGrid = document.querySelector('.color-grid');

  if (colorGrid) {
    colores.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.dataset.familia = color.familia;
      swatch.dataset.codigo = color.codigo;
      swatch.innerHTML = `
        <div class="color-swatch__color" style="background-color: ${color.hex}"></div>
        <div class="color-swatch__info">
          <span class="color-swatch__code">${color.codigo}</span>
          <span class="color-swatch__name">${color.nombre}</span>
        </div>
      `;
      colorGrid.appendChild(swatch);
    });
  }

  // Color filter buttons
  const colorFilters = document.querySelectorAll('.color-filter');
  const colorSwatches = document.querySelectorAll('.color-swatch');

  colorFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Update active filter
      colorFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const filterValue = filter.dataset.filter;
      // Re-query swatches (they were dynamically generated)
      const swatches = document.querySelectorAll('.color-swatch');

      swatches.forEach(swatch => {
        if (filterValue === 'todos' || swatch.dataset.familia === filterValue) {
          // Show swatch
          swatch.style.display = 'block';
          requestAnimationFrame(() => {
            swatch.style.opacity = '1';
            swatch.style.transform = 'scale(1)';
          });
        } else {
          // Hide swatch with animation
          swatch.style.opacity = '0';
          swatch.style.transform = 'scale(0.8)';
          setTimeout(() => {
            swatch.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Color modal
  const colorModal = document.querySelector('.color-modal');
  const colorModalClose = document.querySelector('.color-modal__close');

  function openColorModal(colorData) {
    if (!colorModal) return;

    // Populate modal content
    const modalPreview = colorModal.querySelector('.color-modal__preview');
    const modalName = colorModal.querySelector('.color-modal__name');
    const modalCode = colorModal.querySelector('.color-modal__code');
    const modalHex = colorModal.querySelector('.color-modal__hex');

    if (modalPreview) modalPreview.style.backgroundColor = colorData.hex;
    if (modalName) modalName.textContent = colorData.nombre;
    if (modalCode) modalCode.textContent = colorData.codigo;
    if (modalHex) modalHex.textContent = colorData.hex;

    colorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeColorModal() {
    if (!colorModal) return;
    colorModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event delegation for dynamically generated swatches
  if (colorGrid) {
    colorGrid.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;

      const codigo = swatch.dataset.codigo;
      const colorData = colores.find(c => c.codigo === codigo);
      if (colorData) {
        openColorModal(colorData);
      }
    });
  }

  if (colorModalClose) {
    colorModalClose.addEventListener('click', closeColorModal);
  }

  if (colorModal) {
    colorModal.addEventListener('click', (e) => {
      // Close when clicking outside modal content
      if (!e.target.closest('.color-modal__content')) {
        closeColorModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeColorModal();
    }
  });

  /* ----------------------------------------------------------
     8.5 PRODUCT FILTER INTERACTIVITY
  ---------------------------------------------------------- */
  const productFilters = document.querySelectorAll('.product-filter');
  const productCards = document.querySelectorAll('.product-card');

  if (productFilters.length && productCards.length) {
    productFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        // Update active state
        productFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const filterValue = filter.dataset.filter;

        productCards.forEach(card => {
          const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
          if (filterValue === 'todos' || categories.includes(filterValue)) {
            // Show card
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });
          } else {
            // Hide card
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     9. FAQ ACCORDION
  ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__header');
    if (!question) return;

    question.addEventListener('click', () => {
      if (item.classList.contains('active')) {
        // Close this item
        item.classList.remove('active');
      } else {
        // Close all, open this one
        faqItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });


  /* ----------------------------------------------------------
     10. CONTACT FORM VALIDATION
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    // Validation helpers
    const validators = {
      name: (value) => {
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      },
      email: (value) => {
        if (!value.trim()) return 'El email es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Introduce un email válido';
        return '';
      },
      phone: (value) => {
        if (!value.trim()) return ''; // Optional
        const phoneRegex = /^[\d\s\+\-]{9,}$/;
        if (!phoneRegex.test(value.trim())) return 'Introduce un teléfono válido';
        return '';
      },
      type: (value) => {
        if (!value) return 'Selecciona un tipo de consulta';
        return '';
      },
      message: (value) => {
        if (!value.trim()) return 'El mensaje es obligatorio';
        if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        return '';
      },
      privacy: (checked) => {
        if (!checked) return 'Debes aceptar la política de privacidad';
        return '';
      }
    };

    function validateField(field) {
      const name = field.name || field.id;
      let error = '';

      if (name === 'privacy') {
        error = validators.privacy(field.checked);
      } else if (validators[name]) {
        error = validators[name](field.value);
      }

      const errorEl = field.closest('.form-group')
        ? field.closest('.form-group').querySelector('.form-error')
        : null;

      if (error) {
        field.classList.remove('valid');
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = error;
          errorEl.style.display = 'block';
        }
        return false;
      } else {
        field.classList.remove('error');
        field.classList.add('valid');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.style.display = 'none';
        }
        return true;
      }
    }

    // Validate on blur for each input
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
    });

    // Form submit
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let allValid = true;
      let firstErrorField = null;

      formFields.forEach(field => {
        const isValid = validateField(field);
        if (!isValid && !firstErrorField) {
          firstErrorField = field;
          allValid = false;
        }
        if (!isValid) allValid = false;
      });

      if (allValid) {
        // Success: hide form, show success message
        contactForm.style.display = 'none';
        const formSuccess = document.querySelector('.form-success');
        if (formSuccess) {
          formSuccess.style.display = 'block';
          requestAnimationFrame(() => {
            formSuccess.classList.add('active');
          });
        }
      } else {
        // Scroll to first error
        if (firstErrorField) {
          const offset = 100;
          const top = firstErrorField.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
          firstErrorField.focus();
        }
      }
    });
  }


  /* ----------------------------------------------------------
     11. WHATSAPP FAQ WIDGET
  ---------------------------------------------------------- */
  const waWidget = document.getElementById('wa-widget');
  const waFab = document.getElementById('wa-fab');
  const waClose = document.getElementById('wa-close');
  const waBody = document.getElementById('wa-body');
  const waQuestions = document.getElementById('wa-questions');

  const WA_PHONE = '34604820462'; // Placeholder number — change later

  const waFaqData = [
    {
      q: '¿Qué es el corcho proyectado <span class="notranslate">Paymo</span>?',
      a: '<span class="notranslate">Paymo</span> es un revestimiento patentado compuesto por polvo de corcho natural, resina acrílica, grasas vegetales y agua. Se aplica por proyección mecánica sobre cualquier superficie, creando una capa continua que impermeabiliza, aísla térmica y acústicamente, y embellece. Es 100% ecológico y no tóxico.'
    },
    {
      q: '¿Cuánto dura y qué garantía tiene?',
      a: 'Correctamente aplicado, <span class="notranslate">Paymo</span> mantiene sus propiedades impermeabilizantes, aislantes y estéticas durante más de 15-20 años sin necesidad de mantenimiento. El corcho es extremadamente estable frente a la radiación UV, ciclos de hielo-deshielo y agentes químicos.'
    },
    {
      q: '¿Cómo puedo solicitar un presupuesto?',
      a: 'Puedes solicitar un presupuesto sin compromiso a través de nuestro formulario de contacto, llamándonos o escribiéndonos por WhatsApp. Necesitaremos conocer el tipo de superficie, los metros cuadrados, la ubicación y el tipo de aplicación deseada.'
    }
  ];

  function toggleWaWidget() {
    if (!waWidget) return;
    waWidget.classList.toggle('open');
  }

  function closeWaWidget() {
    if (!waWidget) return;
    waWidget.classList.remove('open');
  }

  function resetWaWidget() {
    if (!waBody || !waQuestions) return;
    // Remove any answer wrap
    const answerWrap = waBody.querySelector('.wa-widget__answer-wrap');
    if (answerWrap) answerWrap.remove();
    // Show questions again
    waQuestions.style.display = 'flex';
  }

  function showWaAnswer(index) {
    const faq = waFaqData[index];
    if (!faq || !waBody || !waQuestions) return;

    // Hide questions
    waQuestions.style.display = 'none';

    // Remove any existing answer wrap
    const existing = waBody.querySelector('.wa-widget__answer-wrap');
    if (existing) existing.remove();

    // Build answer UI
    const wrap = document.createElement('div');
    wrap.className = 'wa-widget__answer-wrap';
    wrap.innerHTML = `
      <div class="wa-widget__selected-q">${faq.q}</div>
      <div class="wa-widget__answer">
        <p>${faq.a}</p>
      </div>
      <div class="wa-widget__cta-wrap">
        <a href="https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hola, me gustaría más información sobre corcho proyectado Paymo.')}" target="_blank" rel="noopener noreferrer" class="wa-widget__cta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          Contactar por WhatsApp
        </a>
      </div>
    `;
    waBody.appendChild(wrap);

    setTimeout(() => {
      waBody.scrollTo({
        top: waBody.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);
  }

  if (waFab) {
    waFab.addEventListener('click', toggleWaWidget);
  }

  if (waClose) {
    waClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWaWidget();
      // Reset to initial state after close animation
      setTimeout(resetWaWidget, 400);
    });
  }

  // Event delegation for question clicks
  if (waQuestions) {
    waQuestions.addEventListener('click', (e) => {
      const btn = e.target.closest('.wa-widget__question');
      if (!btn) return;
      const faqIndex = parseInt(btn.dataset.faq);
      showWaAnswer(faqIndex);
    });
  }

  // Close widget when clicking outside
  document.addEventListener('click', (e) => {
    if (waWidget && waWidget.classList.contains('open')) {
      if (!e.target.closest('.wa-widget')) {
        closeWaWidget();
        setTimeout(resetWaWidget, 400);
      }
    }
  });


  /* ----------------------------------------------------------
     12. PARALLAX EFFECT (Hero section)
  ---------------------------------------------------------- */
  const heroContent = document.querySelector('.hero__content');

  function handleParallax() {
    if (heroContent && window.scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - (window.scrollY / window.innerHeight) * 0.5;
    }
  }

  // window.addEventListener('scroll', handleParallax); // Moved to unified scroll handler


  /* ----------------------------------------------------------
     13. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Si es un enlace al contacto, lo ignoramos para que el Modal se encargue
      if (this.getAttribute('href').endsWith('#contacto') || this.classList.contains('warranty-badge') || this.classList.contains('btn-contacto-footer')) {
        return;
      }

      e.preventDefault();
      const targetSelector = this.getAttribute('href');
      if (!targetSelector || targetSelector === '#') return;

      const target = document.querySelector(targetSelector);
      if (target) {
        const offset = 80; // Navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     14. COOKIES BANNER
  ---------------------------------------------------------- */
  const cookiesBanner = document.getElementById('cookies-banner');
  const btnAcceptCookies = document.getElementById('btn-accept-cookies');
  const btnRejectCookies = document.getElementById('btn-reject-cookies');

  if (cookiesBanner && btnAcceptCookies && btnRejectCookies) {
    if (!localStorage.getItem('corchopaymo_cookies_accepted') && !localStorage.getItem('corchopaymo_cookies_rejected')) {
      setTimeout(() => {
        cookiesBanner.classList.add('show');
      }, 1000);
    }

    btnAcceptCookies.addEventListener('click', () => {
      localStorage.setItem('corchopaymo_cookies_accepted', 'true');
      cookiesBanner.classList.remove('show');
    });

    btnRejectCookies.addEventListener('click', () => {
      localStorage.setItem('corchopaymo_cookies_rejected', 'true');
      cookiesBanner.classList.remove('show');
    });
  }

  /* ----------------------------------------------------------
     15. MODAL POP-UP (GLOBAL)
  ---------------------------------------------------------- */
  const contactModal = document.getElementById('contact-modal');
  const btnCloseModal = document.getElementById('modal-close');
  
  // Find elements that open the contact modal (any link ending in #contacto, plus specific badges)
  const ctaButtons = document.querySelectorAll('a[href$="#contacto"], .warranty-badge, .btn-contacto-footer');
  
  if (contactModal) {
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        contactModal.classList.remove('show');
        document.body.style.overflow = '';
      });
    }

    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     16. CUSTOM LANGUAGE SWITCHER
  ---------------------------------------------------------- */
  const langBtns = document.querySelectorAll('.lang-btn');
  const preloaderEl = document.getElementById('preloader');

  function translatePage(lang) {
    if (preloaderEl) {
      preloaderEl.style.display = 'flex';
      void preloaderEl.offsetWidth;
      preloaderEl.classList.remove('hidden');
    }

    const doTranslate = () => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        // If switching back to Spanish, we can clear the Google Translate iframe if 'es' isn't in combo
        // But includedLanguages='en,es' makes 'es' available in the combo
        select.value = lang;
        select.dispatchEvent(new Event('change'));
        localStorage.setItem('corchopaymo_lang', lang);
      }
      
      setTimeout(() => {
        if (preloaderEl) {
          preloaderEl.classList.add('hidden');
          setTimeout(() => { preloaderEl.style.display = 'none'; }, 500);
        }
      }, 800);
    };

    let attempts = 0;
    const checkExist = setInterval(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select || attempts > 20) {
        clearInterval(checkExist);
        doTranslate();
      }
      attempts++;
    }, 150);
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.currentTarget.classList.contains('active')) return;
      
      const lang = e.currentTarget.dataset.lang;
      
      langBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      translatePage(lang);
    });
  });

  // Restore language from localStorage if exists
  setTimeout(() => {
    const savedLang = localStorage.getItem('corchopaymo_lang');
    if (savedLang && savedLang === 'en') {
      const enBtn = document.querySelector('.lang-btn[data-lang="en"]');
      if (enBtn) {
        langBtns.forEach(b => b.classList.remove('active'));
        enBtn.classList.add('active');
        translatePage('en');
      }
    }
  }, 300);

  /* ----------------------------------------------------------
     17. MODAL FORM SUBMISSION TO GOOGLE APPS SCRIPT
  ---------------------------------------------------------- */
  const modalFormToGoogle = document.getElementById('modal-form');
  const modalLoadingOverlay = document.getElementById('modal-loading-overlay');
  const modalSuccessOverlay = document.getElementById('modal-success-overlay');
  const btnCloseModalSuccess = document.getElementById('btn-close-modal-success');
  
  function resetModalStatus() {
    if (modalLoadingOverlay) modalLoadingOverlay.classList.remove('active');
    if (modalSuccessOverlay) modalSuccessOverlay.classList.remove('active');
  }
  
  document.querySelectorAll('#btn-close-modal-success, .btn-close-modal-success-top').forEach(btn => {
    btn.addEventListener('click', () => {
      const contactModal = document.getElementById('contact-modal');
      if (contactModal) contactModal.classList.remove('show');
      document.body.style.overflow = 'auto';
      setTimeout(resetModalStatus, 400); // Wait for modal to hide
    });
  });
  
  // Make sure closing the modal via generic close button or outside click also resets
  document.querySelectorAll('.modal-close, #contact-modal').forEach(el => {
    el.addEventListener('click', (e) => {
      // If clicking the overlay directly, or clicking the close button
      if (e.target === el || el.classList.contains('modal-close') || el.closest('.modal-close')) {
        setTimeout(resetModalStatus, 400);
      }
    });
  });
  
  if (modalFormToGoogle) {
    modalFormToGoogle.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btnSubmit = modalFormToGoogle.querySelector('button[type="submit"]') || modalFormToGoogle.querySelector('.btn-submit');
      const originalText = btnSubmit ? btnSubmit.textContent : 'Enviar Solicitud';
      
      if (modalLoadingOverlay) {
        modalLoadingOverlay.classList.add('active');
      } else if (btnSubmit) {
        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;
      }
      
      const formData = {
        nombre: document.getElementById('modal-name') ? document.getElementById('modal-name').value : '',
        email: document.getElementById('modal-email') ? document.getElementById('modal-email').value : '',
        telefono: document.getElementById('modal-phone') ? document.getElementById('modal-phone').value : '',
        mensaje: document.getElementById('modal-message') ? document.getElementById('modal-message').value : ''
      };
      
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwy3pxeVmjoTLcwRJfenzsE0uNc850xrxJkCwJEQSFmkTBSy0DiV6gxr8aaLagr8k_H/exec';
      
      try {
        const fetchPromise = fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
        
        // Wait for fetch to finish, or a maximum of 3 seconds to show the loading animation
        await Promise.race([
            fetchPromise,
            new Promise(resolve => setTimeout(resolve, 3000))
        ]);
        
        // Al usar no-cors, la respuesta es opaca, por lo que asumimos éxito si no hubo error de red
        modalFormToGoogle.reset();
        if (modalLoadingOverlay) modalLoadingOverlay.classList.remove('active');
        if (modalSuccessOverlay) modalSuccessOverlay.classList.add('active');
      } catch (error) {
        console.error('Error:', error);
        resetModalStatus();
        alert('Hubo un problema de conexión. El mensaje podría no haberse enviado.');
      } finally {
        if (btnSubmit) {
          btnSubmit.textContent = originalText;
          btnSubmit.disabled = false;
        }
      }
    });
  }

  /* ----------------------------------------------------------
     18. PRODUCT IMAGE ZOOM ON HOVER (Desktop) / FULLSCREEN (Mobile)
  ---------------------------------------------------------- */
  document.querySelectorAll('.product-zoom-wrap').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;

    // Desktop: hover zoom
    wrap.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return;
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(2.5)';
    });

    wrap.addEventListener('mouseleave', () => {
      img.style.transformOrigin = 'center center';
      img.style.transform = 'scale(1)';
    });

    // Mobile: tap to fullscreen lightbox
    wrap.addEventListener('click', () => {
      if (window.innerWidth > 768) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity 0.3s ease;';

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = 'position:absolute;top:16px;right:20px;background:none;border:none;color:white;font-size:36px;cursor:pointer;z-index:100000;line-height:1;';

      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.style.cssText = 'max-width:90%;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.4);';

      overlay.appendChild(closeBtn);
      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => { overlay.style.opacity = '1'; });

      function closeLightbox() {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = 'auto';
        }, 300);
      }

      closeBtn.addEventListener('click', closeLightbox);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    });
  });

}); // End DOMContentLoaded
