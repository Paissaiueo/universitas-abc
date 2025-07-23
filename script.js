/**
 * UNIVERSITAS ABCD - MAIN SCRIPT
 * Enhanced with error handling and fallbacks
 */

document.addEventListener('DOMContentLoaded', function () {
  // ======================
  // 1. SMOOTH SCROLL
  // ======================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        // Skip if href is empty or just #
        if (!this.getAttribute('href') || this.getAttribute('href') === '#') return;

        e.preventDefault();
        const targetId = this.getAttribute("href");

        try {
          const target = document.querySelector(targetId);
          if (target) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth"
            });

            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, targetId);
            }
          }
        } catch (error) {
          console.error('Smooth scroll error:', error);
          window.location.href = targetId; // Fallback
        }
      });
    });
  }

  // ======================
  // 2. IMAGE HANDLING
  // ======================
  function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
      // Skip if already handled
      if (img.hasAttribute('data-error-handled')) return;

      img.setAttribute('data-error-handled', 'true');

      img.addEventListener('error', function () {
        // Only replace if not already a placeholder
        if (!this.src.includes('placeholder.com')) {
          this.src = 'https://via.placeholder.com/600x400?text=Gambar+Tidak+Tersedia';
          this.alt = 'Gambar tidak dapat dimuat';
        }
      });

      // Fade-in on load
      if (!img.complete) {
        img.style.opacity = '0';
        img.addEventListener('load', function () {
          this.style.opacity = '1';
          this.style.transition = 'opacity 0.5s ease';
        });
      }
    });
  }

  // ======================
  // 3. ANIMATIONS
  // ======================
  function initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach(el => {
      observer.observe(el);
    });
  }

  // ======================
  // 4. FORM HANDLING
  // ======================
  function initForms() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        nama: document.getElementById("nama")?.value.trim(),
        email: document.getElementById("email")?.value.trim(),
        pesan: document.getElementById("pesan")?.value.trim()
      };

      // Validation
      if (!formData.nama || !formData.email || !formData.pesan) {
        showAlert('Mohon lengkapi semua kolom!', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showAlert('Format email tidak valid!', 'error');
        return;
      }

      // Simulate submission
      showAlert(`Terima kasih ${formData.nama}! Pesan Anda telah dikirim.`, 'success');
      this.reset();
    });

    function showAlert(message, type) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} fixed-top mt-5 mx-auto w-75`;
      alertDiv.textContent = message;
      document.body.appendChild(alertDiv);

      setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
      }, 3000);
    }
  }

  // ======================
  // 5. SCROLL EFFECTS
  // ======================
  function initScrollEffects() {
    // Navbar effect
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
          navbar.style.cssText = `
            background-color: rgba(0, 123, 255, 0.95) !important;
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          `;
        } else {
          navbar.style.cssText = '';
        }
      });
    }

    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
      window.addEventListener("scroll", () => {
        backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
      });

      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  // ======================
  // 6. COUNTER ANIMATION
  // ======================
  function initCounters() {
    const counters = document.querySelectorAll('.count');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element) {
      const target = +element.getAttribute('data-target');
      const duration = 2000;
      const startTime = performance.now();
      const formatNumber = num => new Intl.NumberFormat('id-ID').format(num);

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);

        element.textContent = formatNumber(value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = formatNumber(target);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  // ======================
  // 7. SEARCH BAR
  // ======================
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsDropdown = document.getElementById('searchResultsDropdown');

    if (!searchInput || !resultsDropdown) return;

    // Data pencarian statis
    const searchData = [
      { title: 'Profil Prodi', url: '#profil' },
      { title: 'Kurikulum TI & SI', url: 'kurikulum.html' },
      { title: 'Fakultas', url: '#fakultas' },
      { title: 'Prestasi Membanggakan', url: '#prestasi' },
      { title: 'Dokumentasi Kegiatan', url: '#kegiatan' },
      { title: 'Testimoni Alumni', url: '#testimoni' },
      { title: 'Hubungi Kami', url: '#kontak' },
    ];

    searchInput.addEventListener('input', function () {
      const filter = this.value.toLowerCase();
      resultsDropdown.innerHTML = '';
      resultsDropdown.style.display = 'block';

      const filtered = searchData.filter(item => item.title.toLowerCase().includes(filter));

      if (filtered.length === 0) {
        resultsDropdown.style.display = 'none';
        return;
      }

      filtered.forEach(result => {
        const link = document.createElement('a');
        link.href = result.url;
        link.className = 'dropdown-item';
        link.textContent = result.title;
        resultsDropdown.appendChild(link);
      });
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function (event) {
      if (!searchInput.contains(event.target) && !resultsDropdown.contains(event.target)) {
        resultsDropdown.style.display = 'none';
      }
    });
  }

  // ======================
  // 8. INITIALIZER
  // ======================
  function initAll() {
    initSmoothScroll();     // Smooth scroll
    handleImageErrors();    // Image error handling
    initAnimations();       // Fade-in animations
    initForms();            // Contact form handling
    initScrollEffects();    // Scroll-based effects
    initCounters();         // Counter animations
    initSearch();           // Search bar with dropdown
    setTimeout(handleImageErrors, 1000);
  }

  // Jalankan semua fungsi setelah DOM selesai dimuat
  initAll();

  // ======================
  // 9. FALLBACK
  // ======================
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      return setTimeout(callback, 16);
    };
  }

  // ======================
  // 10. PRELOADER
  // ======================
  window.addEventListener("load", function () {
    const loader = document.querySelector(".loader-container");
    if (loader) {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      setTimeout(() => loader.remove(), 1000);
    }
  });
});

