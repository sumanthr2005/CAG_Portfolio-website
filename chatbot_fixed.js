// chatbot_fixed.js — cleaned chatbot implementation
class SimpleBot {
  constructor() {
    this.knowledgeBase = {
      activity1: {
        title: 'Tidal Energy Conversion System',
        qa: [
          { q: 'what is tidal energy', a: 'Tidal energy is renewable energy harnessed from the rise and fall of sea levels caused by the gravitational interaction between the Earth, Moon and Sun.' },
          { q: 'how does tidal energy work', a: 'Tidal systems capture potential or kinetic energy from tides using barrages or tidal stream turbines.' },
          { q: 'what are tidal turbines', a: 'Tidal turbines are underwater devices similar to wind turbines that convert kinetic energy from moving water into electricity.' },
          { q: 'what is tidal range', a: 'Tidal range is the vertical difference between high tide and low tide; larger ranges can provide more potential energy for barrage systems.' },
          { q: 'what is a tidal barrage', a: 'A tidal barrage is a dam-like structure built across estuaries that captures and releases water through turbines to generate power.' },
          { q: 'what is a tidal lagoon', a: 'A tidal lagoon is an enclosed area built to capture tidal water and release it in a controlled way to drive turbines.' },
          { q: 'how to choose a tidal site', a: 'Select sites with high tidal range or strong tidal currents, suitable bathymetry, and good grid connection with minimal environmental conflict.' },
          { q: 'how to reduce environmental impact', a: 'Mitigations include fish-friendly turbine designs, timed operations, sediment management and continuous ecological monitoring.' },
          { q: 'how is tidal energy stored', a: 'Common storage options include batteries, pumped hydro storage and converting surplus energy to green hydrogen.' },
          { q: 'what affects tidal turbine efficiency', a: 'Efficiency depends on flow velocity, turbine design, blockage effects, and maintenance; slower, optimised blade designs can help.' }
        ]
      },
      activity2: {
        title: 'Biomass Energy System',
        qa: [
          { q: 'what is biomass energy', a: 'Biomass energy is produced by converting organic materials into heat, electricity, or biofuels.' },
          { q: 'what is anaerobic digestion', a: 'Anaerobic digestion breaks down organic matter to produce biogas.' },
          { q: 'what are common biomass feedstocks', a: 'Feedstocks include wood residues, agricultural residues, energy crops, municipal organic waste, and algae.' },
          { q: 'what is torrefaction', a: 'Torrefaction is a mild pyrolysis process that improves biomass energy density and grindability for co-firing or pellet production.' },
          { q: 'what is pelletization', a: 'Pelletization compresses dried biomass into uniform pellets for easier transport and efficient combustion.' },
          { q: 'what is co-firing', a: 'Co-firing mixes biomass with coal in existing plants to reduce net CO2 emissions while using existing infrastructure.' },
          { q: 'what is combined heat and power', a: 'CHP recovers waste heat from electricity generation for heating, greatly improving overall efficiency.' },
          { q: 'how to improve biomass sustainability', a: 'Use residues, ensure responsible sourcing, apply certification schemes, and avoid land-use change that harms food production.' },
          { q: 'what is biochar', a: 'Biochar is the solid byproduct of pyrolysis that can improve soil water retention and sequester carbon when applied to soils.' }
        ]
      },
      activity3: {
        title: 'Geothermal System',
        qa: [
          { q: 'what is geothermal energy', a: 'Geothermal energy taps heat from the Earth for power generation or direct heating.' },
          { q: 'what is EGS', a: 'Enhanced Geothermal Systems (EGS) create permeability in hot rock to extract heat where natural reservoirs do not exist.' },
          { q: 'what is a binary cycle plant', a: 'A binary cycle plant uses a secondary fluid with a lower boiling point to generate electricity from moderate-temperature geothermal water.' },
          { q: 'what is reinjection', a: 'Reinjection returns cooled geothermal fluid to maintain reservoir pressure and sustainability while reducing environmental impacts.' },
          { q: 'how to manage induced seismicity', a: 'Mitigation includes controlled injection rates, thorough monitoring, and adaptive operations to limit seismic risk.' },
          { q: 'what is ground-source heat pump', a: 'A ground-source heat pump exchanges heat with shallow ground for efficient heating and cooling of buildings.' },
          { q: 'what affects geothermal plant economics', a: 'Economics depend on drilling costs, resource temperature, capacity factor, financing, and distance to grid or loads.' }
        ]
      }
    };
    this.confidenceThreshold = 0.35;
  }

  normalize(text) {
    return (text || '').toString().toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  jaccard(aTokens, bTokens) {
    const aSet = new Set(aTokens);
    const bSet = new Set(bTokens);
    const inter = [...aSet].filter(x => bSet.has(x)).length;
    const union = new Set([...aSet, ...bSet]).size;
    return union === 0 ? 0 : inter / union;
  }

  scoreCandidate(userText, questionText) {
    const u = this.normalize(userText);
    const q = this.normalize(questionText);
    if (!u || !q) return 0;
    if (u === q || u.includes(q) || q.includes(u)) return 1.0;
    const uTokens = u.split(' ');
    const qTokens = q.split(' ');
    return this.jaccard(uTokens, qTokens);
  }

  findBestQA(userText, qaList) {
    let best = null, bestScore = 0;
    for (const item of qaList) {
      const s = this.scoreCandidate(userText, item.q);
      if (s > bestScore) { bestScore = s; best = item; }
    }
    return { best, score: bestScore };
  }

  getResponse(input, activity) {
    const u = this.normalize(input);
    if (!u) return "Please type a question so I can help.";
    const activityData = this.knowledgeBase[activity];
    if (!activityData) return "I don't have information for this page.";
    const { best, score } = this.findBestQA(u, activityData.qa);
    if (best && score >= this.confidenceThreshold) return best.a;
    const scored = activityData.qa.map(item => ({ item, s: this.scoreCandidate(u, item.q) })).sort((a,b)=>b.s-a.s);
    const top = scored.slice(0,3).filter(x=>x.s>0);
    if (top.length === 1 && top[0].s > 0.2) return `Do you mean: "${top[0].item.q}" ? If yes, I can explain: <br>${top[0].item.a}`;
    if (top.length > 0) return `I couldn't find an exact match. Did you mean one of these topics: ${top.map(t=>`"${t.item.q}"`).join(', ')}?`;
    return `I can help with ${activityData.title}. Try asking about one of these:<br>${activityData.qa.slice(0,5).map(x=>`- ${x.q}`).join('<br>')}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bot = new SimpleBot();
  const wrappers = document.querySelectorAll('.chat-wrapper');
  if (!wrappers || wrappers.length === 0) return;

  wrappers.forEach(wrapper => {
    const chatIcon = wrapper.querySelector('.chat-bot-icon');
    const chatContainer = wrapper.querySelector('.chat-container');
    const chatBody = wrapper.querySelector('.chat-body');
    const chatInput = wrapper.querySelector('.chat-input input');
    const sendButton = wrapper.querySelector('.chat-input button');

    const path = window.location.pathname.toLowerCase();
    const currentActivity = path.includes('activity1') ? 'activity1' : path.includes('activity2') ? 'activity2' : path.includes('activity3') ? 'activity3' : 'activity1';

    let pinned = false;

    if (chatIcon) {
      chatIcon.addEventListener('click', (e) => {
        pinned = !pinned;
        wrapper.classList.toggle('pinned', pinned);
        if (pinned && chatContainer) chatContainer.style.display = 'flex';
        else if (chatContainer) chatContainer.style.display = '';
        e.stopPropagation();
      });
    }

    document.addEventListener('click', (e) => {
      if (pinned && !wrapper.contains(e.target)) {
        pinned = false;
        wrapper.classList.remove('pinned');
        if (chatContainer) chatContainer.style.display = '';
      }
    });

    function appendMessage(text, className) {
      if (!chatBody) return;
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', className);
      messageDiv.innerHTML = text.replace(/\n/g, '<br>');
      chatBody.appendChild(messageDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage() {
      if (!chatInput) return;
      const message = chatInput.value.trim();
      if (!message) return;
      appendMessage(message, 'user-message');
      const response = bot.getResponse(message, currentActivity);
      setTimeout(() => appendMessage(response, 'bot-message'), 250);
      chatInput.value = '';
    }

    if (sendButton) sendButton.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    setTimeout(() => {
      appendMessage(`Welcome! I'm your assistant for ${bot.knowledgeBase[currentActivity].title}. Ask me questions about the topic.`, 'bot-message');
    }, 600);
  });
});
