// --- PRODUCT MODAL LOGIC ---
  const productModal = document.getElementById('product-modal');
  const btnCloseProductModal = document.getElementById('product-modal-close');
  const productModalInterest = document.getElementById('product-modal-interest');
  
  if (productModal) {
    // Open product modal
    document.querySelectorAll('a[href="#product-modal"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = btn.getAttribute('data-product');
        if (productName && productModalInterest) {
          Array.from(productModalInterest.options).forEach(opt => {
            if (opt.value === productName) {
              opt.selected = true;
            }
          });
        }
        productModal.classList.add('show');
      });
    });

    if (btnCloseProductModal) {
      btnCloseProductModal.addEventListener('click', () => {
        productModal.classList.remove('show');
      });
    }

    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        productModal.classList.remove('show');
      }
    });

    const productModalFormToGoogle = document.getElementById('product-modal-form');
    if (productModalFormToGoogle) {
      productModalFormToGoogle.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnSubmit = productModalFormToGoogle.querySelector('button[type="submit"]');
        const originalText = btnSubmit ? btnSubmit.textContent : 'Enviar Solicitud';
        if (btnSubmit) btnSubmit.textContent = 'Enviando...';

        const modalLoadingOverlay = document.getElementById('modal-loading-overlay');
        const modalSuccessOverlay = document.getElementById('modal-success-overlay');

        if (modalLoadingOverlay) modalLoadingOverlay.classList.add('active');

        const formData = {
          origen: 'Modal Productos - Sitio Web',
          producto: productModalInterest ? productModalInterest.value : '',
          nombre: document.getElementById('product-modal-name') ? document.getElementById('product-modal-name').value : '',
          email: document.getElementById('product-modal-email') ? document.getElementById('product-modal-email').value : '',
          telefono: document.getElementById('product-modal-phone') ? document.getElementById('product-modal-phone').value : '',
          mensaje: document.getElementById('product-modal-message') ? document.getElementById('product-modal-message').value : ''
        };

        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQTtdGqMu0vigsXYXe47OlQC2nXowQnFtumJPkumZRLuJPGNjPnZF4LNCS5-uy-GJh/exec';

        try {
          fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          
          setTimeout(() => {
            productModalFormToGoogle.reset();
            if (btnSubmit) btnSubmit.textContent = originalText;
            if (modalLoadingOverlay) modalLoadingOverlay.classList.remove('active');
            if (modalSuccessOverlay) modalSuccessOverlay.classList.add('active');
            productModal.classList.remove('show');
          }, 1500);

        } catch (error) {
          console.error('Error:', error);
          if (btnSubmit) btnSubmit.textContent = originalText;
          if (modalLoadingOverlay) modalLoadingOverlay.classList.remove('active');
        }
      });
    }
  }

}); // End DOMContentLoaded

// Fix encoding
