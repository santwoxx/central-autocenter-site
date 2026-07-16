// firebase-config.js — Central Autocenter Firebase Integration
// Loaded as <script type="module"> in index.html

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getAnalytics, logEvent, setUserProperties } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyDnjjvnU8SQfqh6wVCmWRZKPpO_Yrcfipg",
  authDomain: "central-autocar-site.firebaseapp.com",
  projectId: "central-autocar-site",
  storageBucket: "central-autocar-site.firebasestorage.app",
  messagingSenderId: "693980213531",
  appId: "1:693980213531:web:c6000915ca31b621dda3be",
  measurementId: "G-PP1LNR1BNQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ─────────────────────────────────────────────
// Helper global exposto para app.js / chatbot.js
// ─────────────────────────────────────────────
window.CA_Analytics = {

  // Navegação entre abas
  trackTabChange(tabName) {
    logEvent(analytics, 'tab_view', { tab_name: tabName });
    logEvent(analytics, 'page_view', { page_title: tabName });
  },

  // Busca de pneus
  trackSearch(query, resultCount) {
    logEvent(analytics, 'search', {
      search_term: query,
      result_count: resultCount
    });
  },

  // Clique em pneu específico
  trackTireClick(tireBrand, tireSize, tirePrice) {
    logEvent(analytics, 'select_item', {
      item_name: `${tireBrand} ${tireSize}`,
      item_brand: tireBrand,
      price: tirePrice,
      currency: 'BRL'
    });
  },

  // Clique em link WhatsApp (qualquer botão)
  trackWhatsappClick(context) {
    logEvent(analytics, 'contact', {
      method: 'whatsapp',
      context: context
    });
    logEvent(analytics, 'generate_lead', {
      source: context
    });
  },

  // Clique nos banners
  trackBannerClick(bannerName) {
    logEvent(analytics, 'select_promotion', {
      promotion_name: bannerName,
      creative_name: bannerName
    });
  },

  // Chatbot aberto
  trackChatbotOpen() {
    logEvent(analytics, 'chatbot_open');
  },

  // Passo do chatbot
  trackChatbotStep(stateName, choiceText) {
    logEvent(analytics, 'chatbot_step', {
      state: stateName,
      choice: choiceText || 'start'
    });
  },

  // Filial visualizada
  trackFilialView(filialName) {
    logEvent(analytics, 'filial_view', { filial_name: filialName });
  },

  // Busca rápida (quick tags)
  trackQuickTag(tagText) {
    logEvent(analytics, 'quick_search_tag', { tag: tagText });
  }
};

// Log inicial de visita
logEvent(analytics, 'page_view', {
  page_title: 'Central Autocenter - Início',
  page_location: window.location.href
});

console.log('[Firebase] Analytics ativo ✅');
