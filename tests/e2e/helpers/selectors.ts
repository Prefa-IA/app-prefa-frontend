/**
 * Selectores centralizados para tests E2E
 * 
 * IMPORTANTE: Para que estos selectores funcionen, los componentes deben tener
 * atributos data-testid correspondientes. Ver convenciones en:
 * prefa-infra/docs/development/PLAYWRIGHT_TESTING_PLAN.md
 */

export const Selectors = {
  // Autenticación
  auth: {
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    loginButton: '[data-testid="login-button"]',
    registerButton: '[data-testid="register-button"]',
    logoutButton: '[data-testid="logout-button"]',
    userMenu: '[data-testid="user-menu"]',
    userMenuButton: '[data-testid="user-menu-button"]',
  },

  // Navegación
  navigation: {
    navbar: '[data-testid="navbar"]',
    mobileMenuButton: '[data-testid="mobile-menu-button"]',
    mobileMenu: '[data-testid="mobile-menu"]',
    footer: '[data-testid="footer"]',
    themeToggle: '[data-testid="theme-toggle"]',
  },

  // Consulta de direcciones
  consulta: {
    searchInput: '[data-testid="address-search-input"]',
    searchButton: '[data-testid="address-search-button"]',
    searchResults: '[data-testid="search-results"]',
    consultaButton: '[data-testid="consulta-button"]',
    consultaBasicButton: '[data-testid="consulta-basic-button"]',
    consultaCompleteButton: '[data-testid="consulta-complete-button"]',
    consultaCompoundButton: '[data-testid="consulta-compound-button"]',
    resultsContainer: '[data-testid="results-container"]',
    loadingOverlay: '[data-testid="loading-overlay"]',
  },

  // Informes
  informes: {
    informeList: '[data-testid="informe-list"]',
    informeItem: '[data-testid="informe-item"]',
    downloadButton: '[data-testid="download-button"]',
    deleteButton: '[data-testid="delete-button"]',
    searchInput: '[data-testid="informe-search-input"]',
    filterSelect: '[data-testid="informe-filter-select"]',
  },

  // Perfil
  perfil: {
    profileForm: '[data-testid="profile-form"]',
    saveButton: '[data-testid="save-profile-button"]',
    creditsDisplay: '[data-testid="credits-display"]',
  },

  // Suscripciones
  suscripciones: {
    planCard: '[data-testid="plan-card"]',
    selectPlanButton: '[data-testid="select-plan-button"]',
    currentPlan: '[data-testid="current-plan"]',
  },

  // Modales y notificaciones
  modals: {
    confirmModal: '[data-testid="confirm-modal"]',
    confirmButton: '[data-testid="confirm-button"]',
    cancelButton: '[data-testid="cancel-button"]',
    closeButton: '[data-testid="close-button"]',
    toast: '[data-testid="toast"]',
  },

  // Chatbot
  chatbot: {
    chatbotButton: '[data-testid="chatbot-button"]',
    chatbotWindow: '[data-testid="chatbot-window"]',
    chatbotInput: '[data-testid="chatbot-input"]',
    chatbotSendButton: '[data-testid="chatbot-send-button"]',
  },
} as const;

