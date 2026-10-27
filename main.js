/**
 * KTÜ Modern Web Portalı - Ana JavaScript Dosyası
 * Özellikler: Tema Değiştirici (Dark/Light), Mobil Menü, Sayaç Animasyonları,
 * Sekme Sistemi, Canlı Arama (Ctrl+K)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollEffects();
  initAnimatedCounters();
  initTabs();
  initModals();
  initSearch();
});

/* ==========================================================================
   1. Tema Yönetimi (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('ktu-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ktu-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      icon.parentElement.setAttribute('title', 'Aydınlık Moda Geç');
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.parentElement.setAttribute('title', 'Karanlık Moda Geç');
    }
  }
}

/* ==========================================================================
   2. Mobil Menü ve Dropdown Kontrolü
   ========================================================================== */
function initMobileMenu() {
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Sayfa dışına tıklandığında mobil menüyü kapat
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });

    // Mobil dropdown tıklama yönetimi
    const dropdownItems = navMenu.querySelectorAll('.nav-item');
    dropdownItems.forEach((item) => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown-menu');
      if (dropdown && link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('mobile-open');
          }
        });
      }
    });
  }
}

function initScrollEffects() {
  const mainHeader = document.querySelector('.main-header');
  const heroMedia = document.getElementById('heroBgMedia') || document.getElementById('heroBgVideo');
  const heroContent = document.querySelector('.hero-center-content');
  
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader?.classList.add('scrolled');
    } else {
      mainHeader?.classList.remove('scrolled');
    }

    // Hero Kâğıt Geçişi Parallaks ve Kararma Efekti
    if (heroMedia && !ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        
        if (scrolled <= windowHeight * 1.2) {
          const ratio = Math.min(scrolled / windowHeight, 1);
          heroMedia.style.transform = `scale(${1 + ratio * 0.08})`;
          heroMedia.style.filter = `brightness(${1 - ratio * 0.35})`;
          
          if (heroContent) {
            heroContent.style.opacity = Math.max(1 - ratio * 1.6, 0);
            heroContent.style.transform = `translateY(${ratio * 50}px)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   4. Canlı İstatistik Sayaçları (Sayılarla KTÜ)
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-number[data-count], .stat-paper-number[data-count]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const duration = 2000; // ms
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.innerHTML = formatNumber(target) + '<span class="plus">+</span>';
              clearInterval(timer);
            } else {
              el.innerHTML = formatNumber(Math.floor(current)) + '<span class="plus">+</span>';
            }
          }, stepTime);

          observerInstance.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  counterElements.forEach((el) => observer.observe(el));
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ==========================================================================
   5. Sekmeli İçerik Sistemi (Haberler, Duyurular, Etkinlikler)
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Modallar
   ========================================================================== */
function initModals() {
  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Escape tuşu ile açık modalları kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-backdrop.open');
      if (openModalEl) closeModal(openModalEl);
    }
  });
}

/* ==========================================================================
   7. Hızlı Arama Modalı (Ctrl + K / Canlı Filtreleme)
   ========================================================================== */
function initSearch() {
  const searchModal = document.getElementById('searchModal');
  const searchTriggers = document.querySelectorAll('.open-search-modal');
  const closeSearchBtn = document.getElementById('closeSearchModal');
  const searchInput = document.getElementById('siteSearchInput');
  const searchResults = document.getElementById('searchResults');

  // Canlı arama için KTÜ dizini verileri
  const searchableIndex = [
    { title: 'Mühendislik Fakültesi', category: 'Fakülte', url: 'course.html' },
    { title: 'Tıp Fakültesi', category: 'Fakülte', url: 'course.html' },
    { title: 'Sürmene Deniz Bilimleri Fakültesi', category: 'Fakülte', url: 'course.html' },
    { title: 'Mimarlık Fakültesi', category: 'Fakülte', url: 'course.html' },
    { title: 'Fen Fakültesi (Yazılım Geliştirme)', category: 'Bölüm', url: 'course.html' },
    { title: 'İktisadi ve İdari Bilimler Fakültesi', category: 'Fakülte', url: 'course.html' },
    { title: 'Bilgisayar Mühendisliği Bölümü', category: 'Bölüm', url: 'course.html' },
    { title: 'Maden Mühendisliği Bölümü (Dünya 14.)', category: 'Bölüm', url: 'course.html' },
    { title: 'Akademik Takvim 2026-2027', category: 'Duyuru', url: 'blog.html' },
    { title: 'Farabi Hastanesi Randevu', category: 'Hizmet', url: 'contact.html' },
    { title: 'Kanuni Kampüsü Ulaşım & Harita', category: 'İletişim', url: 'contact.html' },
    { title: 'KTÜ 1955 Tarihçesi ve Vizyonu', category: 'Kurumsal', url: 'about.html' },
    { title: 'TEKNOFEST 3. Kez Şampiyon Creatiny Takımı', category: 'Haber', url: 'blog.html' },
    { title: 'TÜBİTAK 1002-A ve 1007 Proje Çağrıları', category: 'Araştırma', url: 'blog.html' },
    { title: 'KTÜ Kurumsal E-Posta Servisi', category: 'Hizmet', url: '#' }
  ];

  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 100);
      renderSearchResults(searchableIndex.slice(0, 5));
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove('open');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
    }
  }

  searchTriggers.forEach((btn) => btn.addEventListener('click', openSearch));
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Klavye Kısayolu: Ctrl + K veya Cmd + K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal?.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  });

  // Arama Girişi Dinleme
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        renderSearchResults(searchableIndex.slice(0, 5));
        return;
      }

      const filtered = searchableIndex.filter((item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );

      renderSearchResults(filtered);
    });
  }

  function renderSearchResults(items) {
    if (!searchResults) return;
    if (!items.length) {
      searchResults.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">Eşleşen sonuç bulunamadı.</div>`;
      return;
    }

    searchResults.innerHTML = items
      .map(
        (item) => `
        <a href="${item.url}" class="search-result-item">
          <span><i class="fa-solid fa-arrow-right" style="color: var(--ktu-blue-accent); font-size: 0.8rem; margin-right: 0.5rem;"></i>${item.title}</span>
          <span style="font-size: 0.75rem; background: rgba(2, 132, 199, 0.1); color: var(--ktu-blue-accent); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600;">${item.category}</span>
        </a>
      `
      )
      .join('');
  }
}
