/**
 * Pneuzinho Chatbot - Friendly virtual assistant for Central Autocenter.
 * Optimized for older users: large fonts, clickable steps, clear layout, no text input required.
 */

(function () {
  const WHATSAPP_NUMBER = '5573991741441';

  // State Definitions & Copywriting Funnel
  const FUNNEL_STATES = {
    start: {
      message: 'Olá! Sou o <b>Pneuzinho</b>, o ajudante virtual da Central Autocenter. 🛞<br><br>Como posso te ajudar hoje? Escolha uma das opções abaixo clicando nela:',
      options: [
        { text: '🛞 Quero Pneus novos', nextState: 'pneus_aro' },
        { text: '🔧 Serviços Mecânicos (Suspensão, Freio)', nextState: 'servicos' },
        { text: '🛢️ Troca de Óleo ou Filtros', nextState: 'oleo' },
        { text: '🧭 Alinhamento e Balanceamento 3D', nextState: 'alinhamento' },
        { text: '📞 Falar com um Atendente / Outros', nextState: 'falar_atendente' }
      ]
    },
    
    // 1. Pneus Funnel
    pneus_aro: {
      message: 'Excelente! Pneu novo é mais segurança para você e sua família. 🚙<br><br>Você sabe qual é o <b>Aro</b> do pneu do seu carro? (Geralmente é um número como 13, 14, 15, 16, 17 na lateral do pneu).',
      options: [
        { text: '📏 Aro 13 ou Aro 14', nextState: 'pneus_final_13_14' },
        { text: '📏 Aro 15 ou Aro 16', nextState: 'pneus_final_15_16' },
        { text: '📏 Aro 17 ou Aro 18', nextState: 'pneus_final_17_18' },
        { text: '📏 Aro 19 ou maior', nextState: 'pneus_final_19' },
        { text: '❓ Não sei como ver o Aro', nextState: 'pneus_final_ajuda' }
      ]
    },
    pneus_final_13_14: {
      message: 'Ótimo! Separei as melhores marcas de pneus **Aro 13/14** em promoção.<br><br>Clique no botão abaixo para ver as ofertas no WhatsApp da nossa equipe. Já deixei uma mensagem pronta para você!',
      isFinal: true,
      buttonText: '🟢 Ver Ofertas no WhatsApp',
      whatsappText: 'Olá! Gostaria de consultar pneus Aro 13 ou Aro 14 na Central Autocenter. Fui direcionado pelo assistente do site.'
    },
    pneus_final_15_16: {
      message: 'Perfeito! Temos excelentes opções de pneus **Aro 15/16** das melhores marcas.<br><br>Clique no botão abaixo para consultar os preços com nossos especialistas. Sua mensagem já está pronta!',
      isFinal: true,
      buttonText: '🟢 Ver Ofertas no WhatsApp',
      whatsappText: 'Olá! Gostaria de consultar pneus Aro 15 ou Aro 16 na Central Autocenter. Fui direcionado pelo assistente do site.'
    },
    pneus_final_17_18: {
      message: 'Excelente! Temos pneus de alta performance **Aro 17/18** prontos para entrega.<br><br>Clique abaixo para ser atendido no WhatsApp e receber o orçamento completo dos pneus.',
      isFinal: true,
      buttonText: '🟢 Ver Orçamento no WhatsApp',
      whatsappText: 'Olá! Gostaria de consultar pneus Aro 17 ou Aro 18 na Central Autocenter. Fui direcionado pelo assistente do site.'
    },
    pneus_final_19: {
      message: 'Muito bem! Temos pneus esportivos e especiais **Aro 19 ou maior** no estoque.<br><br>Clique abaixo para falar com nosso setor de vendas e receber os modelos disponíveis.',
      isFinal: true,
      buttonText: '🟢 Falar com Vendedor',
      whatsappText: 'Olá! Gostaria de consultar pneus Aro 19 ou maior na Central Autocenter. Fui direcionado pelo assistente do site.'
    },
    pneus_final_ajuda: {
      message: 'Sem problemas! Nosso time vai te ajudar a descobrir a medida correta num instante. 🛠️<br><br>Clique no botão abaixo para falar com nosso especialista. Ele vai te explicar bem direitinho!',
      isFinal: true,
      buttonText: '🟢 Receber Ajuda no WhatsApp',
      whatsappText: 'Olá! Preciso de ajuda para escolher pneus novos para o meu carro. Fui direcionado pelo assistente do site.'
    },

    // 2. Serviços Mecânicos Funnel
    servicos: {
      message: 'Muito bem! Cuidar da mecânica do carro evita problemas maiores e acidentes. 🛡️<br><br>Qual serviço você está precisando realizar?',
      options: [
        { text: '⚙️ Suspensão e Amortecedores', nextState: 'servicos_suspensao' },
        { text: '🛑 Freios (Pastilhas, Discos, Fluidos)', nextState: 'servicos_freios' },
        { text: '🚗 Revisão Geral de Segurança', nextState: 'servicos_revisao' },
        { text: '🔧 Outros reparos mecânicos', nextState: 'servicos_geral' }
      ]
    },
    servicos_suspensao: {
      message: 'A suspensão é vital para o conforto e segurança. Temos peças originais e diagnóstico preciso.<br><br>Clique abaixo para agendar a verificação da sua suspensão pelo WhatsApp.',
      isFinal: true,
      buttonText: '🟢 Agendar no WhatsApp',
      whatsappText: 'Olá! Gostaria de solicitar um orçamento para revisão da suspensão e amortecedores do meu carro na Central Autocenter. Fui direcionado pelo assistente do site.'
    },
    servicos_freios: {
      message: 'Segurança em primeiro lugar! Se o pedal estiver estranho ou fizer barulho, revise logo.<br><br>Clique no botão abaixo para agendar a revisão dos seus freios com prioridade.',
      isFinal: true,
      buttonText: '🟢 Agendar Revisão de Freios',
      whatsappText: 'Olá! Gostaria de solicitar um orçamento para o serviço de freios (pastilha e disco) do meu carro na Central Autocenter. Fui direcionado pelo assistente do site.'
    },
    servicos_revisao: {
      message: 'Fazer uma revisão de rotina é a melhor forma de economizar e rodar tranquilo. 🛣️<br><br>Clique abaixo para agendar sua revisão geral na Central Autocenter.',
      isFinal: true,
      buttonText: '🟢 Agendar Revisão Geral',
      whatsappText: 'Olá! Gostaria de agendar uma revisão geral de segurança no meu carro. Fui direcionado pelo assistente do site.'
    },
    servicos_geral: {
      message: 'Certo! Vamos analisar e resolver o que o seu carro precisar.<br><br>Clique abaixo para explicar o problema ao nosso mecânico chefe no WhatsApp.',
      isFinal: true,
      buttonText: '🟢 Falar com a Oficina',
      whatsappText: 'Olá! Preciso de um orçamento para serviços mecânicos no meu carro. Fui direcionado pelo assistente do site.'
    },

    // 3. Troca de Óleo Funnel
    oleo: {
      message: 'Perfeito! Manter o óleo limpo lubrifica e prolonga a vida do motor. 🛢️<br><br>Que tipo de troca você quer fazer?',
      options: [
        { text: '🛢️ Troca de Óleo do Motor e Filtros', nextState: 'oleo_motor' },
        { text: '⚙️ Troca de Óleo do Câmbio Automático', nextState: 'oleo_cambio' },
        { text: '❓ Preciso de ajuda para escolher', nextState: 'oleo_ajuda' }
      ]
    },
    oleo_motor: {
      message: 'Excelente! Usamos lubrificantes homologados específicos para o seu veículo.<br><br>Clique no botão abaixo para agendar a troca de óleo do motor.',
      isFinal: true,
      buttonText: '🟢 Agendar Troca de Óleo',
      whatsappText: 'Olá! Gostaria de agendar a troca de óleo do motor e filtros do meu veículo. Fui direcionado pelo assistente do site.'
    },
    oleo_cambio: {
      message: 'Destaque! A troca do fluido de câmbio automático previne quebras caríssimas de transmissão.<br><br>Clique abaixo para solicitar um orçamento para seu câmbio automático.',
      isFinal: true,
      buttonText: '🟢 Orçamento Câmbio Automático',
      whatsappText: 'Olá! Gostaria de cotar a troca de óleo de câmbio automático do meu veículo. Fui direcionado pelo assistente do site.'
    },
    oleo_ajuda: {
      message: 'Não se preocupe! Nosso técnico vai olhar o manual do seu carro para indicar o óleo perfeito. 📖<br><br>Clique abaixo para agendar a consultoria gratuita no WhatsApp.',
      isFinal: true,
      buttonText: '🟢 Falar com Especialista',
      whatsappText: 'Olá! Preciso de ajuda para saber o óleo correto para o motor do meu carro. Fui direcionado pelo assistente do site.'
    },

    // 4. Alinhamento Funnel
    alinhamento: {
      message: 'Excelente! O alinhamento correto evita desgaste dos pneus e melhora a dirigibilidade. 🧭<br><br>O que está acontecendo com seu veículo?',
      options: [
        { text: '🚗 Carro puxando para um lado', nextState: 'alinhamento_puxando' },
        { text: '🎛️ Volante vibrando na estrada', nextState: 'alinhamento_vibrando' },
        { text: '📅 Manutenção preventiva de rotina', nextState: 'alinhamento_preventiva' }
      ]
    },
    alinhamento_puxando: {
      message: 'Entendido. Se o carro está puxando, as rodas estão desalinhadas, o que come os pneus por dentro.<br><br>Clique abaixo para agendar seu Alinhamento 3D no WhatsApp.',
      isFinal: true,
      buttonText: '🟢 Agendar Alinhamento 3D',
      whatsappText: 'Olá! Gostaria de agendar alinhamento e balanceamento pois meu carro está puxando para o lado. Fui direcionado pelo assistente do site.'
    },
    alinhamento_vibrando: {
      message: 'Se o volante vibra acima de 80km/h, as rodas precisam de balanceamento com urgência para não danificar a suspensão.<br><br>Clique abaixo para agendar o serviço no WhatsApp.',
      isFinal: true,
      buttonText: '🟢 Agendar Balanceamento',
      whatsappText: 'Olá! Gostaria de agendar alinhamento e balanceamento 3D pois sinto vibração no volante. Fui direcionado pelo assistente do site.'
    },
    alinhamento_preventiva: {
      message: 'Parabéns pela prevenção! É recomendado alinhar a cada 10.000 km rodados. 🧭<br><br>Clique abaixo para agendar sua manutenção de rotina na Central Autocenter.',
      isFinal: true,
      buttonText: '🟢 Agendar Alinhamento',
      whatsappText: 'Olá! Gostaria de agendar alinhamento e balanceamento preventivo. Fui direcionado pelo assistente do site.'
    },

    // 5. Atendente Geral
    falar_atendente: {
      message: 'Tudo bem! Nosso atendimento humano irá tirar todas as suas dúvidas. 🤝<br><br>Clique no botão amarelo abaixo para iniciar a conversa diretamente no WhatsApp.',
      isFinal: true,
      buttonText: '🟢 Falar com Atendente',
      whatsappText: 'Olá! Gostaria de tirar algumas dúvidas e falar com um atendente da Central Autocenter. Fui direcionado pelo assistente do site.'
    }
  };

  // DOM Elements
  let chatbotToggleBtn, chatbotWindow, chatbotCloseBtn, chatbotMessages;

  function initChatbotDOM() {
    chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    chatbotWindow = document.getElementById('chatbot-window');
    chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    chatbotMessages = document.getElementById('chatbot-messages');

    if (!chatbotToggleBtn || !chatbotWindow || !chatbotCloseBtn || !chatbotMessages) {
      return;
    }

    // Toggle Chat visibility
    chatbotToggleBtn.addEventListener('click', openChat);
    chatbotCloseBtn.addEventListener('click', closeChat);

    // Initial state setup
    loadState('start');
  }

  function openChat() {
    chatbotWindow.classList.remove('hidden');
    chatbotToggleBtn.classList.add('hidden');
    // Firebase: track chatbot open
    if (window.CA_Analytics) window.CA_Analytics.trackChatbotOpen();
    if (window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    }
    setTimeout(() => {
      chatbotWindow.classList.remove('translate-y-4', 'opacity-0');
      chatbotWindow.classList.add('flex');
    }, 50);
    scrollToBottom();
  }

  function closeChat() {
    chatbotWindow.classList.add('translate-y-4', 'opacity-0');
    chatbotWindow.classList.remove('flex');
    document.body.style.overflow = '';
    setTimeout(() => {
      chatbotWindow.classList.add('hidden');
      chatbotToggleBtn.classList.remove('hidden');
    }, 300);
  }

  function scrollToBottom() {
    if (chatbotMessages) {
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'chatbot-typing';
    indicator.className = 'flex items-start gap-2.5 max-w-[85%] animate-fade-in';
    indicator.innerHTML = `
      <img src="public/pneuzinho.jpg" alt="Pneuzinho" class="w-8 h-8 rounded-full object-cover mt-0.5 border border-brand-green shrink-0">
      <div class="bg-zinc-150 text-zinc-900 rounded-[20px] rounded-tl-sm px-4 py-3 text-sm font-semibold flex items-center gap-1">
        <span class="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
        <span class="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
        <span class="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
      </div>
    `;
    chatbotMessages.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chatbot-typing');
    if (indicator) {
      indicator.remove();
    }
  }

  function loadState(stateKey) {
    const stateData = FUNNEL_STATES[stateKey];
    if (!stateData) return;
    // Firebase: track chatbot step
    if (window.CA_Analytics) window.CA_Analytics.trackChatbotStep(stateKey);

    // Show typing, then load messages and choices
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();

      // Clear existing temporary interactive option containers
      const oldOptions = document.getElementById('chatbot-options-container');
      if (oldOptions) oldOptions.remove();

      // 1. Create bot message bubble
      const botMsg = document.createElement('div');
      botMsg.className = 'flex items-start gap-2.5 max-w-[85%] animate-fade-in';
      botMsg.innerHTML = `
        <img src="public/pneuzinho.jpg" alt="Pneuzinho" class="w-8 h-8 rounded-full object-cover mt-0.5 border border-brand-green shrink-0">
        <div class="bg-zinc-100 text-zinc-900 rounded-[20px] rounded-tl-sm px-4.5 py-3.5 text-[15px] font-bold leading-relaxed border border-zinc-200">
          ${stateData.message}
        </div>
      `;
      chatbotMessages.appendChild(botMsg);

      // 2. Render options or final CTA buttons
      const optionsContainer = document.createElement('div');
      optionsContainer.id = 'chatbot-options-container';
      optionsContainer.className = 'w-full flex flex-col gap-2.5 pt-2 animate-fade-in text-right items-end';

      if (stateData.isFinal) {
        // Render large WhatsApp redirect CTA
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(stateData.whatsappText)}`;
        optionsContainer.innerHTML = `
          <a href="${waLink}" target="_blank" onclick="if(window.CA_Analytics)window.CA_Analytics.trackWhatsappClick('chatbot_${stateKey}')" class="w-[90%] text-center bg-brand-green text-zinc-950 font-black text-base py-4 px-6 rounded-2xl shadow-lg border border-brand-green/80 hover-glow-green transition-all duration-300 hover:scale-[1.03] active:scale-95 block flex items-center justify-center gap-2.5">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.59 2.019 14.12 1.012 11.49 1.01 6.059 1.01 1.633 5.378 1.629 10.806c-.001 1.738.462 3.43 1.34 4.957l-.98 3.578 3.658-.987z"/>
            </svg>
            <span>${stateData.buttonText}</span>
          </a>
          <button id="chatbot-restart-btn" class="text-xs font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-900 transition-colors mt-2 pr-2 cursor-pointer flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            Começar de novo
          </button>
        `;
        chatbotMessages.appendChild(optionsContainer);

        // Bind restart event
        document.getElementById('chatbot-restart-btn').addEventListener('click', () => {
          chatbotMessages.innerHTML = '';
          loadState('start');
        });

      } else {
        // Render option buttons (large, click-friendly text)
        stateData.options.forEach((opt) => {
          const btn = document.createElement('button');
          btn.className = 'w-[90%] text-left bg-white text-zinc-800 font-extrabold text-[15px] py-3.5 px-5 rounded-2xl shadow-sm border border-zinc-200 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer';
          btn.innerHTML = opt.text;
          btn.addEventListener('click', () => {
            handleUserChoice(opt.text, opt.nextState);
          });
          optionsContainer.appendChild(btn);
        });
        chatbotMessages.appendChild(optionsContainer);
      }

      // Re-initialize Lucide Icons if any
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      scrollToBottom();
    }, 600);
  }

  function handleUserChoice(choiceText, nextStateKey) {
    // 1. Render User Message bubble
    const userMsg = document.createElement('div');
    userMsg.className = 'flex justify-end w-full animate-fade-in';
    userMsg.innerHTML = `
      <div class="bg-zinc-950 text-white rounded-[20px] rounded-tr-sm px-4.5 py-3.5 text-[15px] font-extrabold max-w-[80%] border border-zinc-800 shadow-md">
        ${choiceText}
      </div>
    `;
    chatbotMessages.appendChild(userMsg);
    scrollToBottom();

    // Remove the current options list from showing up
    const optionsContainer = document.getElementById('chatbot-options-container');
    if (optionsContainer) {
      optionsContainer.remove();
    }

    // 2. Load next step
    loadState(nextStateKey);
  }

  // Self Initialization on page ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initChatbotDOM();
  } else {
    document.addEventListener('DOMContentLoaded', initChatbotDOM);
  }
})();
