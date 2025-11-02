// chatbot.js — simple, validated chatbot for activity pages
class SimpleBot {
  constructor() {
    this.knowledgeBase = {
      activity1: {
        title: 'Tidal Energy Conversion System',
        qa: [
          { q: 'what is tidal energy', a: 'Tidal energy is renewable energy harnessed from the rise and fall of sea levels caused by the gravitational interaction between the Earth, Moon and Sun.' },
          { q: 'how does tidal energy work', a: 'Tidal systems capture potential or kinetic energy from tides using barrages or tidal stream turbines.' }
        ]
      },
      activity2: {
        title: 'Biomass Energy System',
        qa: [
          { q: 'what is biomass energy', a: 'Biomass energy is produced by converting organic materials into heat, electricity, or biofuels.' },
          { q: 'what is anaerobic digestion', a: 'Anaerobic digestion breaks down organic matter to produce biogas.' }
        ]
      },
      activity3: {
        title: 'Geothermal System',
        qa: [
          { q: 'what is geothermal energy', a: 'Geothermal energy taps heat from the Earth for power generation or direct heating.' },
          { q: 'what is EGS', a: 'Enhanced Geothermal Systems (EGS) create permeability in hot rock to extract heat where natural reservoirs do not exist.' }
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

// Wire chat UI for every .chat-wrapper on the page
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

    // Determine activity from URL
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

    // Clicking outside unpins
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

    // Welcome
    setTimeout(() => {
      appendMessage(`Welcome! I'm your assistant for ${bot.knowledgeBase[currentActivity].title}. Ask me questions about the topic.`, 'bot-message');
    }, 600);
  });
});
class SimpleBot {
    constructor() {
        // Synonyms and small NLP helpers
        this.synonyms = {
            'tidal': ['tide', 'tidal', 'ocean', 'sea'],
            'turbine': ['turbine', 'generator', 'rotor'],
            'biomass': ['biomass', 'biofuel', 'biogas', 'bio mass'],
            'geothermal': ['geothermal', 'ground heat', 'earth heat']
        };

        // Compact, well-organized knowledge base. Can be extended.
        this.knowledgeBase = {
            'activity1': {
                'title': 'Tidal Energy Conversion System',
                'qa': [
                    { q: 'what is tidal energy', a: 'Tidal energy is renewable energy harnessed from the rise and fall of sea levels caused by the gravitational interaction between the Earth, Moon and Sun. It can be captured using barrages, tidal lagoons or tidal stream generators.' },
                    { q: 'what causes tides', a: 'Tides are caused by the gravitational pull of the Moon and Sun on Earth\'s oceans. The Moon has the strongest effect due to its proximity, creating two daily high tides and two low tides.' },
                    { q: 'what is spring tide', a: 'Spring tides occur when the Sun and Moon align (during new and full moons), creating higher high tides and lower low tides. These provide maximum power generation potential.' },
                    { q: 'what is neap tide', a: 'Neap tides occur when the Sun and Moon are at right angles to Earth (during quarter moons), resulting in smaller differences between high and low tides and reduced power generation.' },
                    { q: 'how does tidal energy work', a: 'Tidal systems capture potential or kinetic energy from tides. Barrages store water at high tide and release it through turbines; tidal stream systems place turbines in tidal currents to extract kinetic energy.' },
                    { q: 'what are tidal barrages', a: 'Tidal barrages are dam-like structures across estuaries that capture water at high tide and release it through turbines to generate power.' },
                    { q: 'types of tidal turbines', a: 'Common tidal turbine types: bulb turbines (for barrages), horizontal-axis turbines, vertical-axis turbines, and cross-flow designs. Selection depends on flow, depth and site.' },
                    { q: 'advantages of tidal energy', a: 'Advantages: predictable generation, long asset life, no fuel cost, high energy density, and grid reliability when integrated correctly.' },
                    { q: 'disadvantages of tidal energy', a: 'Disadvantages: high upfront cost, environmental impacts on habitats, limited suitable sites, and intermittent generation tied to tidal cycles.' },
                    { q: 'efficiency of tidal power', a: 'Tidal systems can be highly efficient; turbine conversion efficiencies often exceed 80% depending on design and site conditions.' },
                    { q: 'environmental impacts of tidal energy', a: 'Impacts include altered sediment transport, changes to estuary habitats, potential harm to fish and marine mammals. Mitigations: fish-friendly turbines, monitoring and adaptive operation.' },
                    { q: 'cost of tidal power', a: 'Costs vary widely by project. Capital costs are high due to civil works and marine construction. Levelized costs are typically above mature technologies but can improve with scale.' },
                    { q: 'site selection for tidal', a: 'Ideal sites have high tidal range or strong tidal currents, suitable bathymetry, and grid access; estuaries and narrow channels are common.' },
                    { q: 'maintenance of tidal plants', a: 'Maintenance: corrosion protection, regular turbine inspection, marine growth removal, and sediment management. Access logistics increase costs.' },
                    { q: 'how to reduce environmental impact', a: 'Use slower-turning, fish-friendly turbines, scheduled operations, habitat compensation, and thorough environmental monitoring.' },
                    { q: 'examples of tidal projects', a: 'Notable projects: Rance (France), Sihwa Lake (Korea), and small tidal stream deployments in Scotland and Canada.' },
                    { q: 'how to store tidal energy', a: 'Storage options: pumped hydro, batteries, hydrogen production, and demand-side management to smooth delivery.' },
                    { q: 'compare tidal with wind and solar', a: 'Tidal is more predictable than wind/solar and often has higher energy density, but it is more site-constrained and has higher civil costs.' },
                    { q: 'what is tidal lagoon', a: 'A tidal lagoon is an enclosed area built to capture tidal water and release it through turbines; it is similar to a barrage but can be modular.' },
                    { q: 'what is dynamic tidal power', a: 'Dynamic tidal power is an experimental concept using long dams perpendicular to the coast to exploit phase differences in tides for power.' },
                    { q: 'what is tidal fence', a: 'A tidal fence is a series of vertical-axis turbines mounted in a fence-like structure across channels, combining high energy capture with lower environmental impact than barrages.' },
                    { q: 'what is tidal kite technology', a: 'Tidal kites are underwater devices that "fly" in a figure-8 pattern through tidal streams, increasing relative water velocity and power generation efficiency.' },
                    { q: 'future of tidal energy', a: 'Future developments include floating tidal platforms, improved turbine designs for lower flows, smart arrays that adapt to conditions, and hybrid systems combining tidal with other renewables.' },
                    { q: 'tidal energy in developing countries', a: 'Developing countries with suitable coastlines are exploring tidal power through small-scale projects, technology transfer programs, and international partnerships. Key challenges include infrastructure and financing.' },
                    { q: 'what is tidal range', a: 'Tidal range is the vertical difference between high and low tide. A range of at least 5 meters is typically needed for economical tidal barrage systems.' },
                    { q: 'what are tidal arrays', a: 'Tidal arrays are groups of multiple tidal stream turbines arranged to maximize power generation while minimizing environmental impact and maintenance costs.' },
                    { q: 'how to maintain tidal turbines', a: 'Maintenance involves regular inspection using ROVs, anti-fouling coatings, removal of marine growth, bearing replacement, and careful timing of maintenance during slack tides.' },
                    { q: 'tidal energy economics', a: 'Economic factors include high initial capital costs, long-term reliability, maintenance accessibility, power purchase agreements, and government incentives. Costs typically decrease with scale and experience.' },
                    { q: 'tidal power grid integration', a: 'Grid integration requires careful planning for predictable but intermittent generation, smart grid technologies, energy storage systems, and robust underwater transmission infrastructure.' },
                    { q: 'tidal energy impact on marine life', a: 'Impacts include altered water flow patterns, potential collision risks for marine mammals and fish, changes in sediment transport, and noise during construction. Modern designs incorporate fish-friendly features and environmental monitoring.' },
                    { q: 'tidal energy success stories', a: 'Notable successes include the La Rance Tidal Power Station in France (240MW, since 1966), Sihwa Lake Tidal Power Station in South Korea (254MW), and MeyGen project in Scotland using tidal stream technology.' },
                    { q: 'tidal energy and coastal communities', a: 'Tidal projects can benefit coastal communities through job creation, tourism opportunities, and improved marine infrastructure, while requiring careful consideration of fishing rights and navigation needs.' },
                    { q: 'tidal energy monitoring systems', a: 'Modern tidal installations use advanced monitoring systems including underwater cameras, sonar, environmental sensors, and real-time performance tracking to ensure optimal operation and environmental protection.' },
                    { q: 'what is a sluice gate', a: 'A sluice gate is a movable gate used to control water flow into and out of a tidal basin or barrage. These gates are crucial for managing the water levels and optimizing power generation timing.' },
                    { q: 'how often do tides occur', a: 'Typically there are two high and two low tides per day (semi-diurnal pattern) in most locations, caused by the Earth\'s rotation and the Moon\'s gravitational pull.' },
                    { q: 'what is a bulb turbine', a: 'A bulb turbine is a type commonly used in tidal barrages where the generator is housed in a waterproof bulb-shaped casing submerged in the water flow. This design is efficient for low-head, high-flow conditions.' },
                    { q: 'what is a cross-flow turbine', a: 'A cross-flow turbine is designed so that water flows across the blades rather than along them. This design performs well in variable current conditions and can be effective in both directions of tidal flow.' },
                    { q: 'what is kaplan turbine', a: 'A Kaplan turbine is a propeller-type turbine with adjustable blades, specifically designed for low-head and high-flow applications. It\'s often used in tidal installations for its efficiency in these conditions.' },
                    { q: 'how to estimate tidal power', a: 'Tidal power estimation involves calculating potential energy based on tidal range or kinetic energy from current velocity, considering basin area, turbine efficiency, and other site-specific factors.' }
                    { q: 'what is tidal stream energy', a: 'Tidal stream energy uses underwater turbines placed in fast-moving tidal currents to generate electricity from kinetic energy.' }
                    { q: 'what is a tidal barrage environmental mitigation', a: 'Mitigation includes fish ladders, sediment management, and adaptive operation schedules to reduce ecological impact.' }
                    { q: 'what is the role of bathymetry in tidal energy', a: 'Bathymetry (underwater topography) affects turbine placement, flow speed, and energy yield in tidal projects.' }
                    { q: 'what is a tidal phase difference', a: 'Phase difference refers to timing differences in tides at different locations, exploited in dynamic tidal power concepts.' },
                    { q: 'what is a tidal energy feasibility study', a: 'A feasibility study assesses site conditions, tidal range, environmental impact, and economic viability for tidal projects.' }
                    { q: 'what is a tidal energy demonstration project', a: 'Demonstration projects test new tidal technologies at small scale before commercial deployment.' },
                    { q: 'what is a tidal energy licensing process', a: 'Licensing involves environmental review, stakeholder consultation, and regulatory approval for tidal installations.' }
                    { q: 'what is a tidal energy monitoring buoy', a: 'Monitoring buoys collect data on currents, water quality, and marine life near tidal energy sites.' },
                    { q: 'what is a tidal energy maintenance schedule', a: 'Maintenance schedules include regular inspections, cleaning, and part replacement to ensure reliable operation.' }
                    { q: 'what is a tidal energy stakeholder', a: 'Stakeholders include local communities, fishermen, environmental groups, regulators, and energy companies.' }
                ]
            },
            'activity2': {
                'title': 'Biomass Energy System',
                'qa': [
                    { q: 'what is biomass energy', a: 'Biomass energy is produced by converting organic materials (wood, agricultural residues, manure, waste) into heat, electricity or biofuels.' },
                    { q: 'what is the carbon cycle in biomass', a: 'The biomass carbon cycle involves plants absorbing CO2 during growth, which is later released when the biomass is used for energy. When sustainably managed, this creates a near carbon-neutral cycle.' },
                    { q: 'what are energy crops', a: 'Energy crops are plants specifically grown for fuel production, such as miscanthus, switchgrass, short rotation coppice willow, and energy cane. They\'re chosen for rapid growth and high energy content.' },
                    { q: 'what is biomass pelletization', a: 'Pelletization compresses dried biomass into dense, uniform pellets for easier transport and more efficient combustion. This process improves handling and energy density.' },
                    { q: 'how does biomass energy work', a: 'Conversion methods: direct combustion for heat, gasification to syngas, anaerobic digestion to biogas, fermentation for bioethanol, and pyrolysis for bio-oils.' },
                    { q: 'types of biomass', a: 'Types include woody biomass, agricultural residues, energy crops, municipal solid waste, organic industrial residues, and algae.' },
                    { q: 'advantages of biomass', a: 'Advantages: can be carbon-neutral when sustainably sourced, supports waste management, provides baseload capability and rural jobs.' },
                    { q: 'disadvantages of biomass', a: 'Disadvantages: land-use competition, variable feedstock supply, transport costs, and air pollution if not controlled.' },
                    { q: 'what is anaerobic digestion', a: 'Anaerobic digestion is a biochemical process that breaks down organic matter in oxygen-free conditions to produce biogas (mainly methane and CO2) and digestate.' },
                    { q: 'what is gasification', a: 'Gasification converts biomass at high temperature with controlled oxygen into syngas (CO + H2) that can be burned or processed into fuels.' },
                    { q: 'what is biofuel', a: 'Biofuels are liquid fuels produced from biomass, e.g., bioethanol (from sugars) or biodiesel (from oils) for transport.' },
                    { q: 'efficiency of biomass systems', a: 'Efficiencies vary: combustion power plants 20–40%, gasification and combined heat & power setups can reach 60–90% overall.' },
                    { q: 'biogas applications', a: 'Biogas can be used for heat, electricity generation in CHP units, upgraded to biomethane for grid injection or vehicle fuel.' },
                    { q: 'feedstock sustainability', a: 'Sustainability requires responsible sourcing, avoiding deforestation, and using residues or dedicated energy crops on marginal land.' },
                    { q: 'what is pyrolysis', a: 'Pyrolysis thermally decomposes biomass in low/no oxygen to produce bio-oil, syngas and biochar.' },
                    { q: 'what is combined heat and power', a: 'CHP recovers waste heat from electricity generation for heating, increasing overall energy utilization.' },
                    { q: 'emissions from biomass', a: 'When sustainably sourced, biomass can be close to carbon-neutral, but combustion may emit particulates and NOx if not controlled; emissions controls are important.' },
                    { q: 'how to improve biomass efficiency', a: 'Improve through feedstock drying, high-efficiency boilers, gasification, and using CHP to capture heat.' },
                    { q: 'what is torrefaction', a: 'Torrefaction is a thermal process at 200-300°C in absence of oxygen that converts biomass into a coal-like material with higher energy density and better grinding properties.' },
                    { q: 'what is biomass co-firing', a: 'Co-firing is the simultaneous combustion of biomass with coal in existing power plants, reducing carbon emissions while utilizing existing infrastructure.' },
                    { q: 'future of biomass energy', a: 'Future developments include advanced gasification, improved catalysts for biofuel production, artificial photosynthesis research, and integrated biorefineries for multiple products.' },
                    { q: 'what are second generation biofuels', a: 'Second generation biofuels are made from non-food biomass like agricultural residues, wood waste, or dedicated energy crops, avoiding competition with food production.' },
                    { q: 'what is biochemical conversion', a: 'Biochemical conversion uses microorganisms or enzymes to break down biomass into fuels or chemicals, including processes like fermentation and anaerobic digestion.' },
                    { q: 'biomass supply chain management', a: 'Supply chain management involves feedstock sourcing, storage facilities, transportation logistics, preprocessing requirements, and just-in-time delivery to minimize costs and ensure consistent supply.' },
                    { q: 'biomass plant maintenance', a: 'Maintenance includes regular boiler cleaning, emissions control system checks, fuel handling system maintenance, and monitoring of conversion efficiency and emissions levels.' },
                    { q: 'biomass economics', a: 'Economic considerations include feedstock costs and availability, transport distances, processing efficiency, scale economies, and competition with other energy sources.' },
                    { q: 'what is biomass preprocessing', a: 'Preprocessing includes size reduction, drying, densification, and sorting to improve handling, storage, and conversion efficiency of biomass feedstocks.' },
                    { q: 'biomass and rural development', a: 'Biomass energy projects can support rural development through job creation in farming and processing, additional income from agricultural residues, and local energy security.' },
                    { q: 'biomass success stories', a: 'Successful examples include the Drax power station conversion in UK, Brazilian sugarcane ethanol program, and Swedish district heating systems using forest residues.' },
                    { q: 'biomass sustainability certification', a: 'Certification schemes verify sustainable sourcing through criteria like biodiversity protection, soil quality maintenance, water management, and socio-economic impacts.' },
                    { q: 'smart biomass plants', a: 'Modern biomass plants use smart technologies for automated fuel handling, optimized combustion control, emissions monitoring, and predictive maintenance.' },
                    { q: 'role of moisture content', a: 'Moisture content significantly affects thermal efficiency in biomass conversion. Higher moisture reduces efficiency and requires more energy for processing; proper drying of feedstock improves overall system performance.' },
                    { q: 'how is syngas used', a: 'Syngas can be burned directly for heat generation or in combined cycle power plants, or converted into liquid fuels through the Fischer-Tropsch process. It\'s also used as a chemical feedstock.' },
                    { q: 'what is biochar used for', a: 'Biochar is used primarily as a soil amendment to improve soil quality and carbon sequestration. It can enhance water retention, nutrient availability, and microbial activity while storing carbon long-term.' },
                    { q: 'what is a gasifier', a: 'A gasifier is a reactor vessel that converts solid biomass into syngas through controlled high-temperature reactions with limited oxygen. Different designs include fixed bed, fluidized bed, and entrained flow.' },
                    { q: 'what is LHV and HHV', a: 'Lower Heating Value (LHV) and Higher Heating Value (HHV) are measures of fuel energy content. HHV includes heat from water vapor condensation, while LHV excludes it, providing practical energy available in most applications.' },
                    { q: 'how are pellets produced', a: 'Biomass pellets are produced by compressing milled biomass under high pressure and heat, causing lignin to soften and bind the material. The process includes drying, grinding, conditioning, and cooling steps.' }
                    { q: 'what is a biomass digester', a: 'A biomass digester is a sealed vessel where organic material is broken down anaerobically to produce biogas.' }
                    { q: 'what is a biomass feedstock contract', a: 'Feedstock contracts secure long-term supply of biomass materials for energy production.' }
                    { q: 'what is a biomass logistics challenge', a: 'Logistics challenges include transport, storage, and handling of bulky, variable biomass materials.' }
                    { q: 'what is a biomass ash utilization', a: 'Biomass ash can be used as fertilizer, soil amendment, or in construction materials.' },
                    { q: 'what is a biomass energy policy', a: 'Energy policies set incentives, sustainability standards, and targets for biomass energy development.' }
                    { q: 'what is a biomass energy audit', a: 'An energy audit evaluates efficiency, emissions, and cost-effectiveness of biomass systems.' },
                    { q: 'what is a biomass CHP plant', a: 'A biomass CHP plant generates both electricity and useful heat from biomass, improving overall efficiency.' }
                    { q: 'what is a biomass pellet market', a: 'The pellet market involves production, trade, and use of compressed biomass pellets for heating and power.' },
                    { q: 'what is a biomass energy export', a: 'Biomass energy export refers to shipping pellets, biofuels, or biogas to other regions or countries.' }
                    { q: 'what is a biomass energy certification', a: 'Certification verifies that biomass is sourced and processed sustainably, meeting environmental and social standards.' }
                ]
            },
            'activity3': {
                'title': 'Geothermal System',
                'qa': [
                    { q: 'what is geothermal energy', a: 'Geothermal energy taps heat stored in the Earth — from hot water reservoirs, steam, hot dry rocks, or shallow ground heat.' },
                    { q: 'what are geothermal hotspots', a: 'Geothermal hotspots are areas with unusually high heat flow, often near tectonic plate boundaries or volcanic regions. Examples include Iceland, New Zealand\'s Taupo Zone, and the US Geysers.' },
                    { q: 'what is the geothermal gradient', a: 'The geothermal gradient is the rate at which temperature increases with depth in the Earth, typically 25-30°C per kilometer but much higher in geothermal areas.' },
                    { q: 'what is binary cycle power plant', a: 'A binary cycle power plant uses moderate-temperature geothermal water to heat a secondary fluid with a lower boiling point, which then vaporizes to drive a turbine. This is more efficient for lower temperature resources.' },
                    { q: 'how does geothermal power work', a: 'Wells bring hot water or steam to the surface to run turbines (or heat exchangers for direct use); cooled fluid is re-injected.' },
                    { q: 'types of geothermal systems', a: 'Types: hydrothermal (natural reservoirs), enhanced geothermal systems (EGS), ground-source heat pumps, and direct-use systems.' },
                    { q: 'advantages of geothermal', a: 'Advantages: continuous baseload power, small land footprint, high capacity factor, and long life.' },
                    { q: 'disadvantages of geothermal', a: 'Disadvantages: site-specific, high upfront drilling costs, potential induced seismicity, and water use.' },
                    { q: 'environmental impacts of geothermal', a: 'Impacts: low greenhouse gas emissions, possible water contamination, induced seismicity and land subsidence. Mitigations include reinjection and monitoring.' },
                    { q: 'what is EGS', a: 'Enhanced Geothermal Systems (EGS) create permeability in hot dry rock by hydraulic stimulation to extract heat where natural reservoirs do not exist.' },
                    { q: 'geothermal applications', a: 'Applications: electricity generation, district heating, greenhouse heating, industrial process heat, and ground-source heat pumps for buildings.' },
                    { q: 'how efficient is geothermal', a: 'Geothermal plant efficiency depends on resource temperature; binary plants for lower temps are common and overall system efficiency plus high capacity factor makes geothermal competitive.' },
                    { q: 'what is a ground source heat pump', a: 'Ground source heat pumps move heat between buildings and the ground (or water source) for efficient heating and cooling.' },
                    { q: 'what is geothermal reservoir stimulation', a: 'Reservoir stimulation involves injecting fluids under pressure to create or enhance fractures in hot rock, improving fluid circulation and heat extraction in EGS systems.' },
                    { q: 'what is district heating', a: 'District heating uses geothermal energy to heat water that is distributed through a network of insulated pipes to heat multiple buildings in an area.' },
                    { q: 'future of geothermal energy', a: 'Future developments include advanced drilling technologies, supercritical geothermal systems, hybrid power plants, and improved reservoir modeling using AI and machine learning.' },
                    { q: 'what is cascaded use', a: 'Cascaded use involves using geothermal fluid multiple times at decreasing temperatures - first for power generation, then district heating, greenhouse heating, and finally aquaculture or snow melting.' },
                    { q: 'what are geothermal heat exchangers', a: 'Geothermal heat exchangers transfer heat between geothermal fluid and a working fluid without mixing them, enabling efficient heat extraction while protecting equipment from corrosive geothermal fluids.' },
                    { q: 'geothermal plant maintenance', a: 'Maintenance includes monitoring well pressure and flow rates, managing scaling and corrosion, maintaining heat exchangers, and regular inspection of turbines and cooling systems.' },
                    { q: 'geothermal drilling technology', a: 'Advanced drilling technologies include directional drilling, managed pressure drilling, and high-temperature tools designed to withstand extreme geothermal conditions.' },
                    { q: 'geothermal project economics', a: 'Economic factors include exploration risks, drilling costs, resource temperature, plant size, capacity factor, and long-term resource sustainability.' },
                    { q: 'geothermal hybrid systems', a: 'Hybrid systems combine geothermal with other energy sources like solar thermal or biomass to improve efficiency and provide more consistent power output.' },
                    { q: 'geothermal success stories', a: 'Notable examples include Iceland\'s widespread geothermal use for power and heating, The Geysers in California (largest geothermal complex globally), and Kenya\'s significant geothermal development.' },
                    { q: 'geothermal environmental monitoring', a: 'Monitoring includes seismic activity, ground deformation, water quality, air emissions, and subsidence through networks of sensors and regular environmental impact assessments.' },
                    { q: 'geothermal energy in agriculture', a: 'Agricultural applications include greenhouse heating, soil heating for crop growth, aquaculture, and food drying, providing year-round growing capabilities and energy cost savings.' },
                    { q: 'geothermal community benefits', a: 'Benefits include stable long-term energy prices, local job creation, increased energy independence, tourism opportunities at geothermal sites, and potential for cascaded use in multiple applications.' },
                    { q: 'what is reinjection', a: 'Reinjection is the process of returning cooled geothermal fluid back into the reservoir to maintain pressure, prevent subsidence, and ensure resource sustainability.' },
                    { q: 'what is induced seismicity', a: 'Induced seismicity refers to small earthquakes that can be triggered by fluid injection or extraction in geothermal operations. It requires careful monitoring and management through controlled injection rates.' },
                    { q: 'what temperatures are ideal for electricity generation', a: 'Temperatures above 150°C are ideal for conventional steam turbines, while lower temperatures can be utilized with binary cycle plants. Higher temperatures generally yield better efficiency.' },
                    { q: 'what is reservoir permeability', a: 'Reservoir permeability measures how easily fluids can flow through rock formations. It\'s crucial for geothermal productivity as it affects fluid flow rates and heat extraction efficiency.' },
                    { q: 'what is scaling and corrosion', a: 'Scaling is the deposition of minerals from geothermal fluids, while corrosion is chemical degradation of equipment. Both are managed through chemical treatment, material selection, and regular maintenance.' },
                    { q: 'what are exploration methods', a: 'Geothermal exploration uses geological surveys, geophysical techniques, test well drilling, and thermal gradient measurements to identify and assess potential resources.' }
                    { q: 'what is geothermal well logging', a: 'Well logging records temperature, pressure, and rock properties in geothermal wells to assess resource quality.' }
                    { q: 'what is geothermal brine', a: 'Geothermal brine is hot, mineral-rich water extracted from deep underground, used for energy or minerals.' }
                    { q: 'what is geothermal scaling prevention', a: 'Scaling prevention uses chemical additives and regular cleaning to avoid mineral buildup in pipes and equipment.' }
                    { q: 'what is geothermal direct use', a: 'Direct use applies geothermal heat for bathing, greenhouse heating, aquaculture, and industrial processes.' },
                    { q: 'what is geothermal binary cycle efficiency', a: 'Binary cycle efficiency depends on heat exchanger design, working fluid properties, and resource temperature.' }
                    { q: 'what is geothermal exploration drilling', a: 'Exploration drilling tests subsurface conditions and confirms geothermal resource availability.' },
                    { q: 'what is geothermal heat rejection', a: 'Heat rejection is the process of disposing unused heat from geothermal plants, often via cooling towers.' }
                    { q: 'what is geothermal reservoir modeling', a: 'Reservoir modeling simulates fluid flow and heat transfer to optimize geothermal production and sustainability.' },
                    { q: 'what is geothermal induced subsidence', a: 'Induced subsidence is ground sinking caused by fluid extraction; managed by reinjection and monitoring.' }
                    { q: 'what is geothermal mineral recovery', a: 'Mineral recovery extracts valuable elements (like lithium or silica) from geothermal brines as a byproduct.' }
                ]
            }
        // Lightweight chatbot UI wiring and knowledge-base backed bot
        class SimpleBot {
            constructor() {
                // Minimal, well-structured knowledge base. Keep it concise to avoid large in-memory blocks.
                this.knowledgeBase = {
                    'activity1': {
                        title: 'Tidal Energy Conversion System',
                        qa: [
                            { q: 'what is tidal energy', a: 'Tidal energy is renewable energy harnessed from the rise and fall of sea levels caused by the gravitational interaction between the Earth, Moon and Sun.' },
                            { q: 'what causes tides', a: 'Tides are caused mainly by the Moon\'s gravitational pull and, to a lesser extent, the Sun.' },
                            { q: 'how does tidal energy work', a: 'Tidal systems capture potential or kinetic energy from tides using barrages or tidal stream turbines.' }
                        ]
                    },
                    'activity2': {
                        title: 'Biomass Energy System',
                        qa: [
                            { q: 'what is biomass energy', a: 'Biomass energy is produced by converting organic materials into heat, electricity, or biofuels.' },
                            { q: 'what is anaerobic digestion', a: 'Anaerobic digestion breaks down organic matter to produce biogas (methane and CO2).' }
                        ]
                    },
                    'activity3': {
                        title: 'Geothermal System',
                        qa: [
                            { q: 'what is geothermal energy', a: 'Geothermal energy taps heat from the Earth for power generation or direct heating.' },
                            { q: 'what is EGS', a: 'Enhanced Geothermal Systems (EGS) create permeability in hot rock to extract heat where natural reservoirs do not exist.' }
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
                // Lightweight chatbot UI wiring and knowledge-base backed bot
                class SimpleBot {
                    constructor() {
                        // Minimal, well-structured knowledge base. Keep it concise to avoid large in-memory blocks.
                        this.knowledgeBase = {
                            'activity1': {
                                title: 'Tidal Energy Conversion System',
                                qa: [
                                    { q: 'what is tidal energy', a: 'Tidal energy is renewable energy harnessed from the rise and fall of sea levels caused by the gravitational interaction between the Earth, Moon and Sun.' },
                                    { q: 'what causes tides', a: 'Tides are caused mainly by the Moon\'s gravitational pull and, to a lesser extent, the Sun.' },
                                    { q: 'how does tidal energy work', a: 'Tidal systems capture potential or kinetic energy from tides using barrages or tidal stream turbines.' }
                                ]
                            },
                            'activity2': {
                                title: 'Biomass Energy System',
                                qa: [
                                    { q: 'what is biomass energy', a: 'Biomass energy is produced by converting organic materials into heat, electricity, or biofuels.' },
                                    { q: 'what is anaerobic digestion', a: 'Anaerobic digestion breaks down organic matter to produce biogas (methane and CO2).' }
                                ]
                            },
                            'activity3': {
                                title: 'Geothermal System',
                                qa: [
                                    { q: 'what is geothermal energy', a: 'Geothermal energy taps heat from the Earth for power generation or direct heating.' },
                                    { q: 'what is EGS', a: 'Enhanced Geothermal Systems (EGS) create permeability in hot rock to extract heat where natural reservoirs do not exist.' }
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
                        // Clean, single-file chatbot implementation with hover tooltip and click-to-pin
                        class SimpleBot {
                            constructor() {
                                this.knowledgeBase = {
                                    activity1: {
                                        title: 'Tidal Energy Conversion System',
                                        qa: [
                                            { q: 'what is tidal energy', a: 'Tidal energy is renewable energy harnessed from the rise and fall of sea levels caused by the gravitational interaction between the Earth, Moon and Sun.' },
                                            { q: 'how does tidal energy work', a: 'Tidal systems capture potential or kinetic energy from tides using barrages or tidal stream turbines.' },
                                            { q: 'what are tidal barrages', a: 'Tidal barrages are dam-like structures that capture water at high tide and release it through turbines.' }
                                        ]
                                    },
                                    activity2: {
                                        title: 'Biomass Energy System',
                                        qa: [
                                            { q: 'what is biomass energy', a: 'Biomass energy is produced by converting organic materials into heat, electricity, or biofuels.' },
                                            { q: 'what is anaerobic digestion', a: 'Anaerobic digestion breaks down organic matter to produce biogas (methane and CO2).' }
                                        ]
                                    },
                                    activity3: {
                                        title: 'Geothermal System',
                                        qa: [
                                            { q: 'what is geothermal energy', a: 'Geothermal energy taps heat from the Earth for power generation or direct heating.' },
                                            { q: 'what is EGS', a: 'Enhanced Geothermal Systems (EGS) create permeability in hot rock to extract heat where natural reservoirs do not exist.' }
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

                        // Wire chat UI for every .chat-wrapper on the page
                        document.addEventListener('DOMContentLoaded', () => {
                            const bot = new SimpleBot();
                            const wrappers = document.querySelectorAll('.chat-wrapper');
                            if (!wrappers || wrappers.length === 0) return;

                            wrappers.forEach(wrapper => {
                                const chatIcon = wrapper.querySelector('.chat-bot-icon');
                                const chatContainer = wrapper.querySelector('.chat-container');
                                const chatBody = wrapper.querySelector('.chat-body');
                                // Lightweight chatbot implementation (clean, minimal) for activity pages
                                class SimpleBot {
                                    constructor() {
                                        this.knowledgeBase = {
                                            activity1: {
                                                title: 'Tidal Energy Conversion System',
                                                qa: [
                                                    { q: 'what is tidal energy', a: 'Tidal energy is renewable energy harnessed from the rise and fall of sea levels caused by the gravitational interaction between the Earth, Moon and Sun.' },
                                                    { q: 'how does tidal energy work', a: 'Tidal systems capture potential or kinetic energy from tides using barrages or tidal stream turbines.' }
                                                ]
                                            },
                                            activity2: {
                                                title: 'Biomass Energy System',
                                                qa: [
                                                    { q: 'what is biomass energy', a: 'Biomass energy is produced by converting organic materials into heat, electricity, or biofuels.' },
                                                    { q: 'what is anaerobic digestion', a: 'Anaerobic digestion breaks down organic matter to produce biogas.' }
                                                ]
                                            },
                                            activity3: {
                                                title: 'Geothermal System',
                                                qa: [
                                                    { q: 'what is geothermal energy', a: 'Geothermal energy taps heat from the Earth for power generation or direct heating.' },
                                                    { q: 'what is EGS', a: 'Enhanced Geothermal Systems (EGS) create permeability in hot rock to extract heat where natural reservoirs do not exist.' }
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

                                // Wire chat UI for every .chat-wrapper on the page
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

                                        // Determine activity from URL
                                        const path = window.location.pathname.toLowerCase();
                                        const currentActivity = path.includes('activity1') ? 'activity1' : path.includes('activity2') ? 'activity2' : path.includes('activity3') ? 'activity3' : 'activity1';

                                        let pinned = false;

                                        if (chatIcon) {
                                            chatIcon.addEventListener('click', (e) => {
                                                pinned = !pinned;
                                                wrapper.classList.toggle('pinned', pinned);
                                                if (pinned) chatContainer.style.display = 'flex';
                                                else chatContainer.style.display = '';
                                                e.stopPropagation();
                                            });
                                        }

                                        // Clicking outside unpins
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

                                        // Welcome
                                        setTimeout(() => {
                                            appendMessage(`Welcome! I'm your assistant for ${bot.knowledgeBase[currentActivity].title}. Ask me questions about the topic.`, 'bot-message');
                                        }, 600);
                                    });
                                });