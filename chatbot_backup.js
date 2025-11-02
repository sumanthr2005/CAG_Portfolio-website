class SimpleBot {
    constructor() {
        // Main knowledge base for each activity
        this.knowledgeBase = {
            'activity1': {
                'title': 'Tidal Energy Conversion System',
                'core_concepts': [
                    { 'q': 'What is tidal energy?', 'a': 'Tidal energy is a renewable energy source that harnesses power from ocean tides caused by gravitational forces of the moon and sun. It captures energy from the daily rise and fall of tides to generate electricity.' },
                    { 'q': 'How does tidal energy work?', 'a': 'Tidal energy works in several ways:\n1. Tidal Barrages: Dams built across estuaries that capture and release water with tides\n2. Tidal Stream Generators: Underwater turbines that capture energy from tidal currents\n3. Tidal Range Systems: Use difference in water height between high and low tides\n4. Dynamic Tidal Power: Long dams extending into the ocean' },
                    { 'q': 'What are tidal barrages?', 'a': 'Tidal barrages are dam-like structures built across estuaries or tidal basins. They work by:\n1. Allowing water to flow in during high tide\n2. Trapping water when tide begins to fall\n3. Releasing water through turbines during low tide\n4. Generating electricity from both incoming and outgoing water flow' },
                    { 'q': 'What are the components of a tidal energy system?', 'a': 'Key components include:\n1. Tidal barrage or dam structure\n2. Sluice gates to control water flow\n3. Turbines (typically bulb or Kaplan type)\n4. Generators for electricity conversion\n5. Transmission systems\n6. Control systems for operation' },
                    { 'q': 'What are the types of tidal turbines?', 'a': 'Main types of tidal turbines:\n1. Bulb Turbines: Most common in barrages\n2. Horizontal Axis: Similar to underwater windmills\n3. Vertical Axis: Good for bi-directional flow\n4. Cross-Flow: Efficient in variable conditions\n5. Venturi Devices: Use flow acceleration' }
                ],
                'efficiency_and_performance': [
                    { 'q': 'How efficient is tidal energy?', 'a': 'Tidal energy efficiency metrics:\n1. Overall system efficiency: 80-90%\n2. Turbine efficiency: 85-95%\n3. Power output depends on:\n   - Tidal range (minimum 5m ideal)\n   - Basin area\n   - Water flow rate\n   - Turbine design' },
                    { 'q': 'What affects tidal power generation?', 'a': 'Factors affecting generation:\n1. Tidal range and amplitude\n2. Basin geometry and volume\n3. Turbine efficiency\n4. Water flow rates\n5. Weather conditions\n6. Seasonal variations\n7. Maintenance schedule' }
                ],
                'environmental_impacts': [
                    { 'q': 'What are the environmental impacts?', 'a': 'Environmental impacts include:\n1. Changes to marine ecosystems\n2. Effects on fish migration patterns\n3. Altered sediment transport\n4. Impact on marine mammals\n5. Changes in water quality\n\nMitigation measures:\n1. Fish-friendly turbine designs\n2. Environmental monitoring\n3. Sediment management plans\n4. Marine life passages' },
                    { 'q': 'How does it affect marine life?', 'a': 'Effects on marine life:\n1. Physical barriers to movement\n2. Changes in water levels\n3. Turbine collision risks\n4. Habitat modification\n\nProtective measures:\n1. Fish-friendly turbines\n2. Migration passages\n3. Monitoring systems\n4. Seasonal operation adjustments' }
                ],
                'cost_and_economics': [
                    { 'q': 'What are the costs?', 'a': 'Cost breakdown:\n1. Initial Construction: $150-300 million/MW\n2. Operation & Maintenance: $18-25/MWh\n3. Levelized Cost: $100-280/MWh\n\nFactors affecting cost:\n1. Location and accessibility\n2. Grid connection requirements\n3. Environmental studies\n4. Technology selection' },
                    { 'q': 'Is tidal energy economically viable?', 'a': 'Economic viability depends on:\n1. Location characteristics\n2. Power demand\n3. Grid infrastructure\n4. Government support\n5. Environmental regulations\n\nAdvantages:\n1. Long operational life (50-100 years)\n2. Predictable power generation\n3. Low operational costs' }
                ],
                'challenges_and_solutions': [
                    { 'q': 'What are the main challenges?', 'a': 'Key challenges:\n1. High initial costs\n2. Limited suitable locations\n3. Environmental concerns\n4. Grid integration\n5. Technical complexity\n\nSolutions:\n1. Advanced materials\n2. Improved designs\n3. Better environmental protection\n4. Government support\n5. Research and development' }
                ],
                'future_prospects': [
                    { 'q': 'What is the future of tidal energy?', 'a': 'Future developments:\n1. Advanced turbine designs\n2. Improved materials\n3. Better environmental protection\n4. Cost reduction\n5. Integration with other renewables\n6. Energy storage solutions\n7. Smart grid integration' }
                ]
            },
            'activity2': {
                'title': 'Biomass Energy System',
                'core_concepts': [
                    { 'q': 'What is biomass energy?', 'a': 'Biomass energy is renewable energy from organic materials such as:\n1. Wood and forest residues\n2. Agricultural crops and waste\n3. Municipal solid waste\n4. Animal manure\n5. Food processing waste' },
                    { 'q': 'How does biomass energy work?', 'a': 'Biomass energy conversion methods:\n1. Direct Combustion: Burning for heat/power\n2. Gasification: Converting to syngas\n3. Anaerobic Digestion: Producing biogas\n4. Fermentation: Creating biofuels\n5. Pyrolysis: Thermal decomposition' }
                ],
                'types_and_sources': [
                    { 'q': 'What are the types of biomass?', 'a': 'Biomass types include:\n1. Woody biomass (trees, sawdust)\n2. Agricultural biomass (crop residues)\n3. Animal waste (manure)\n4. Municipal waste (food, paper)\n5. Energy crops (switchgrass)\n6. Aquatic biomass (algae)' }
                ],
                'conversion_processes': [
                    { 'q': 'How is biomass converted to energy?', 'a': 'Conversion processes:\n1. Thermochemical:\n   - Combustion\n   - Gasification\n   - Pyrolysis\n2. Biochemical:\n   - Anaerobic digestion\n   - Fermentation\n3. Chemical:\n   - Transesterification\n   - Fischer-Tropsch' }
                ],
                'efficiency_factors': [
                    { 'q': 'What affects biomass efficiency?', 'a': 'Efficiency factors:\n1. Moisture content\n2. Energy density\n3. Conversion technology\n4. Feedstock quality\n5. Process conditions\n\nTypical efficiencies:\n- Direct combustion: 20-40%\n- Gasification: 60-80%\n- Combined heat & power: 80-90%' }
                ],
                'applications': [
                    { 'q': 'What are biomass applications?', 'a': 'Applications include:\n1. Electricity generation\n2. Heating systems\n3. Transportation fuels\n4. Industrial processes\n5. Combined heat and power\n6. Cooking fuel\n7. Waste management' }
                ]
            },
            'activity3': {
                'title': 'Geothermal System',
                'core_concepts': [
                    { 'q': 'What is geothermal energy?', 'a': 'Geothermal energy harnesses heat from:\n1. Hot water reservoirs\n2. Steam deposits\n3. Hot dry rocks\n4. Magma resources\n5. Ground source heat' },
                    { 'q': 'How does geothermal power work?', 'a': 'Geothermal power generation:\n1. Production wells extract hot water/steam\n2. Steam drives turbines\n3. Generators convert mechanical energy\n4. Injection wells return water\n5. Heat exchangers for direct use' }
                ],
                'types_of_systems': [
                    { 'q': 'What types of geothermal systems exist?', 'a': 'Geothermal system types:\n1. Hydrothermal systems\n2. Enhanced geothermal systems (EGS)\n3. Ground source heat pumps\n4. Direct use systems\n5. Combined heat and power' }
                ],
                'applications': [
                    { 'q': 'What are geothermal applications?', 'a': 'Applications include:\n1. Electricity generation\n2. District heating\n3. Greenhouse heating\n4. Industrial processes\n5. Aquaculture\n6. Space heating/cooling\n7. Spa and therapeutic uses' }
                ],
                'environmental_impact': [
                    { 'q': 'What are environmental impacts?', 'a': 'Environmental considerations:\n1. Minimal greenhouse gases\n2. Land use requirements\n3. Water consumption\n4. Induced seismicity risk\n5. Surface subsidence\n\nMitigation:\n1. Proper site selection\n2. Monitoring systems\n3. Water management\n4. Seismic monitoring' }
                ]
            }
        };
    }

    findBestMatch(input, questions) {
        input = input.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;

        for (let item of questions) {
            const score = this.calculateSimilarity(input, item.q.toLowerCase());
            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        }

        return highestScore > 0.3 ? bestMatch : null;
    }

    calculateSimilarity(str1, str2) {
        const words1 = str1.split(/\W+/);
        const words2 = str2.split(/\W+/);
        let matches = 0;

        for (let word of words1) {
            if (words2.includes(word)) matches++;
        }

        return matches / Math.max(words1.length, words2.length);
    }

    getResponse(input, activity) {
        input = input.toLowerCase();
        const activityContent = this.knowledgeBase[activity];
        let bestMatch = null;
        let highestScore = 0;
        
        // Search through all categories in the activity
        for (let category in activityContent) {
            if (Array.isArray(activityContent[category])) {
                const match = this.findBestMatch(input, activityContent[category]);
                if (match) {
                    const score = this.calculateSimilarity(input, match.q.toLowerCase());
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = match;
                    }
                }
            }
        }

        if (bestMatch && highestScore > 0.3) {
            return bestMatch.a;
        }

        // If no match found, provide a helpful response
        return `I can help you learn about ${activityContent.title}. You can ask about:\n` +
               '1. Basic concepts and working principles\n' +
               '2. System components and types\n' +
               '3. Efficiency and performance\n' +
               '4. Environmental impacts\n' +
               '5. Applications and uses\n' +
               '6. Costs and economics\n' +
               '7. Future developments';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bot = new SimpleBot();
    const chatIcon = document.querySelector('.chat-bot-icon');
    const chatContainer = document.querySelector('.chat-container');
    const chatBody = document.querySelector('.chat-body');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');

    // Get current activity from the page URL
    const currentActivity = window.location.pathname.includes('activity1') ? 'activity1' : 
                          window.location.pathname.includes('activity2') ? 'activity2' : 
                          window.location.pathname.includes('activity3') ? 'activity3' : 'activity1';

    // Toggle chat window
    chatIcon.addEventListener('click', () => {
        chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            appendMessage(message, 'user-message');
            
            // Get bot response
            const response = bot.getResponse(message, currentActivity);
            
            // Add bot response with a small delay
            setTimeout(() => {
                appendMessage(response, 'bot-message');
            }, 500);

            chatInput.value = '';
        }
    }

    // Append message to chat
    function appendMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add welcome message
    setTimeout(() => {
        appendMessage(`Welcome! I'm your teaching assistant for ${bot.knowledgeBase[currentActivity].title}. I can help you understand the concepts, answer questions, and provide detailed explanations. What would you like to know?`, 'bot-message');
    }, 1000);
});