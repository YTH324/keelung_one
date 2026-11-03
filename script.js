// 手機／平板導覽選單，桌機版會自動維持一般導覽列。
const navToggle = document.querySelector('.nav-toggle');
const mainNavigation = document.querySelector('.main-navigation');
const mobileBreakpoint = window.matchMedia('(max-width: 1180px)');

if (navToggle && mainNavigation) {
  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '開啟導覽選單');
    mainNavigation.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? '開啟導覽選單' : '關閉導覽選單');
    mainNavigation.classList.toggle('is-open', !isOpen);
  });

  mainNavigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      navToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  mobileBreakpoint.addEventListener('change', closeMenu);
}


// 桌機版導覽列：單一底線滑動到滑鼠指向／鍵盤聚焦的項目。
// 離開選單後，回到 aria-current="page" 標示的目前頁面。
const navList = document.querySelector('.nav-list');
const desktopNavigation = window.matchMedia('(min-width: 1181px)');

if (navList) {
  const links = [...navList.querySelectorAll('a')];
  const currentLink = links.find((link) => link.getAttribute('aria-current') === 'page') || links[0];

  const slideLineTo = (link) => {
    if (!desktopNavigation.matches || !link) return;

    const menuBox = navList.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    navList.style.setProperty('--nav-line-x', `${linkBox.left - menuBox.left}px`);
    navList.style.setProperty('--nav-line-y', `${linkBox.bottom - menuBox.top - 2}px`);
    navList.style.setProperty('--nav-line-width', `${linkBox.width}px`);
    navList.classList.add('nav-line-ready');
  };

  const returnLine = () => slideLineTo(currentLink);

  links.forEach((link) => {
    link.addEventListener('pointerenter', () => slideLineTo(link));
    link.addEventListener('focus', () => slideLineTo(link));
  });

  navList.addEventListener('pointerleave', returnLine);
  navList.addEventListener('focusout', (event) => {
    if (!navList.contains(event.relatedTarget)) returnLine();
  });

  const syncLine = () => {
    if (desktopNavigation.matches) {
      slideLineTo(currentLink);
    } else {
      navList.classList.remove('nav-line-ready');
    }
  };

  window.addEventListener('resize', syncLine);
  desktopNavigation.addEventListener('change', syncLine);
  // 字型載入後選單文字寬度可能改變，需重新計算底線位置。
  if (document.fonts) document.fonts.ready.then(syncLine);
  syncLine();
}
