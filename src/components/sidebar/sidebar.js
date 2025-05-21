export function initComponent() {
  const sidebar = document.getElementById('sidebar');
  const closeSidebarBtn = document.getElementById('close-sidebar');
  const toggleSidebarBtn = document.getElementById('toggle-sidebar');
  const openSidebarBtn = document.getElementById('open-sidebar');

  // Los iconos de menú están dentro del botón toggle-sidebar
  const openMenuIcon = toggleSidebarBtn.querySelector('[menu-icon="open"]');
  const closeMenuIcon = toggleSidebarBtn.querySelector('[menu-icon="close"]');

  const sidebarTextElements = document.querySelectorAll('.sidebar-text');

  // Set initial state
  sidebar.classList.add('sidebar-expanded');

  // Toggle sidebar collapse/expand
  toggleSidebarBtn.addEventListener('click', () => {
    const isExpanded = sidebar.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
      // Collapse sidebar
      sidebar.classList.remove('sidebar-expanded');
      sidebar.classList.add('sidebar-collapsed');

      openMenuIcon.classList.remove('hidden');
      closeMenuIcon.classList.add('hidden');

      sidebarTextElements.forEach(el => el.classList.add('hidden'));
      sidebar.setAttribute('data-expanded', 'false');
    } else {
      // Expand sidebar
      sidebar.classList.remove('sidebar-collapsed');
      sidebar.classList.add('sidebar-expanded');

      openMenuIcon.classList.add('hidden');
      closeMenuIcon.classList.remove('hidden');

      sidebarTextElements.forEach(el => el.classList.remove('hidden'));
      sidebar.setAttribute('data-expanded', 'true');
    }
  });

  // Mobile: Close sidebar
  closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
  });

  // Mobile: Open sidebar
  if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
    });
  }

  // Handle mobile view
  function handleMobileView() {

    const isExpanded = sidebar.getAttribute('data-expanded') === 'true';

    if (window.innerWidth < 768) { // md breakpoint in Tailwind
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('sidebar-collapsed');
      sidebar.classList.add('sidebar-expanded');

      openMenuIcon.classList.add('hidden');
      closeMenuIcon.classList.add('hidden');

      sidebarTextElements.forEach(el => el.classList.remove('hidden'));
      sidebar.setAttribute('data-expanded', 'true');
    } else {

      if (isExpanded) {
        closeMenuIcon.classList.remove('hidden');
      } else {
        closeMenuIcon.classList.add('hidden');
      }


      sidebar.classList.remove('-translate-x-full');
    }
  }

  // Initial check for mobile view
  handleMobileView();

  // Listen for window resize
  window.addEventListener('resize', handleMobileView);
}
