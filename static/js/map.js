document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map.
    const map = L.map('attack-map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: false
    });

    // Add dark theme map tiles.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd'
    }).addTo(map);

    // Global variables.
    let attackCounter = 0;
    let attacksPerSecond = 0;
    const maxAttackHistory = 100;
    const attackHistory = [];
    const markers = {};

    // DOM elements.
    const attackCounterElement = document.getElementById('attack-counter');
    const attacksPerSecondElement = document.getElementById('attacks-per-second');
    const topTargetElement = document.getElementById('top-target');
    const topSourceElement = document.getElementById('top-source');
    const attackListElement = document.getElementById('attack-list');
    const attackTypeFilterElement = document.getElementById('attack-type-filter');
    const severityFilterElement = document.getElementById('severity-filter');

    // Major countries with their approximate latitude and longitude.
    const COUNTRIES = {
        "United States": { "lat": 38.0902, "lng": 95.7129 },
        "China": { "lat": 35.8617, "lng": 104.1954 },
        "Russia": { "lat": 61.5240, "lng": 105.3188 },
        "India": { "lat": 20.5937, "lng": 78.9629 },
        "Brazil": { "lat": 14.2350, "lng": 51.9253 },
        "United Kingdom": { "lat": 55.3781, "lng": 3.4360 },
        "Germany": { "lat": 51.1657, "lng": 10.4515 },
        "Japan": { "lat": 36.2048, "lng": 138.2529 },
        "Canada": { "lat": 56.1304, "lng": 106.3468 },
        "Australia": { "lat": 25.2744, "lng": 133.7751 },
        "France": { "lat": 46.2276, "lng": 2.2137 },
        "South Korea": { "lat": 35.9078, "lng": 127.7669 },
        "Israel": { "lat": 31.0461, "lng": 34.8516 },
        "Iran": { "lat": 32.4279, "lng": 53.6880 },
        "North Korea": { "lat": 40.3399, "lng": 127.5101 },
    };

    // Major attack types.
    const ATTACK_TYPES = ["DDOS", "MALWARE", "PHISHING", "BRUTE FORCE"];

    // Stats tracking.
    const countryAttackCounts = {
        sources: {},
        targets: {}
    };

    // Fetch initial attacks for the map.
    fetchInitialAttacks();

    // Simulate regular attacks.
    setInterval(simulateAttack, 500);  // 2 attacks per second.

    function fetchInitialAttacks() {
        fetch('/api/attacks/?count=20')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    data.attacks.forEach(attack => {
                        processAttack(attack);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching initial attacks:', error);
            });
    }

    // Generate a random attack.
    function simulateAttack() {

        // Create a random attack.
        const sourceCountry = getRandomKey(COUNTRIES);

        // Choose a different country for the target.
        let targetCountry;
        do {
            targetCountry = getRandomKey(COUNTRIES);
        } while (targetCountry === sourceCountry);

        const attackType = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
        const severityLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
        const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];

        // Add some random variability to the country coordinates.
        const sourceLat = COUNTRIES[sourceCountry].lat + (Math.random() * 6 - 3);
        const sourceLng = COUNTRIES[sourceCountry].lng + (Math.random() * 6 - 3);
        const targetLat = COUNTRIES[targetCountry].lat + (Math.random() * 6 - 3);
        const targetLng = COUNTRIES[targetCountry].lng + (Math.random() * 6 - 3);

        const attack = {
            id: Math.floor(Math.random() * 9000000) + 1000000,
            timestamp: Math.floor(Date.now() / 1000),
            source_country: sourceCountry,
            source_lat: sourceLat,
            source_lng: sourceLng,
            target_country: targetCountry,
            target_lat: targetLat,
            target_lng: targetLng,
            attack_type: attackType,
            severity: severity
        };

        processAttack(attack);
    }

    function getRandomKey(obj) {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    // Process an attack and update the UI.
    function processAttack(attack) {

        // Update counter.
        attackCounter++;

        // Update attack rate calculation.
        attacksPerSecond = 2;

        // Update country statistics.
        updateCountryStats(attack.source_country, attack.target_country);

        // Add attack to history.
        addAttackToHistory(attack);

        // Add marker to map.
        addAttackMarker(attack);

        // Update DOM.
        attackCounterElement.textContent = attackCounter;
        attacksPerSecondElement.textContent = attacksPerSecond.toFixed(1);
    }

    function updateCountryStats(source, target) {

        // Update source counts.
        countryAttackCounts.sources[source] = (countryAttackCounts.sources[source] || 0) + 1;

        // Update target counts.
        countryAttackCounts.targets[target] = (countryAttackCounts.targets[target] || 0) + 1;

        // Find top source.
        let topSource = '';
        let topSourceCount = 0;
        for (const country in countryAttackCounts.sources) {
            if (countryAttackCounts.sources[country] > topSourceCount) {
                topSource = country;
                topSourceCount = countryAttackCounts.sources[country];
            }
        }

        // Find top target.
        let topTarget = '';
        let topTargetCount = 0;
        for (const country in countryAttackCounts.targets) {
            if (countryAttackCounts.targets[country] > topTargetCount) {
                topTarget = country;
                topTargetCount = countryAttackCounts.targets[country];
            }
        }

        // Update DOM.
        topSourceElement.textContent = topSource;
        topTargetElement.textContent = topTarget;
    }

    function addAttackToHistory(attack) {

        // Add to beginning of array.
        attackHistory.unshift(attack);

        // Trim the array if needed.
        if (attackHistory.length > maxAttackHistory) {
            attackHistory.pop();
        }

        // Update attack list UI.
        updateAttackList();
    }

    function updateAttackList() {

        // Get filter values.
        const typeFilter = attackTypeFilterElement.value;
        const severityFilter = severityFilterElement.value;

        // Clear current list.
        attackListElement.innerHTML = '';

        // Add filtered attacks to list.
        attackHistory.forEach(attack => {

            // Apply filters.
            if ((typeFilter === 'ALL' || attack.attack_type === typeFilter) &&
                (severityFilter === 'ALL' || attack.severity === severityFilter)) {

                // Create attack item.
                const attackItem = document.createElement('div');
                attackItem.className = 'attack-item';

                // Format time.
                const attackTime = new Date(attack.timestamp * 1000);
                const timeStr = attackTime.toLocaleTimeString();

                // Build HTML.
                attackItem.innerHTML = `
                    <div class="attack-info">
                        <span class="attack-type ${attack.attack_type}">${attack.attack_type}</span>
                        <div class="attack-meta">
                            <span>${attack.source_country} → ${attack.target_country}</span>
                            <span>${timeStr}</span>
                        </div>
                    </div>
                    <div class="attack-severity ${attack.severity}">${attack.severity}</div>
                `;

                attackListElement.appendChild(attackItem);
            }
        });
    }

    function addAttackMarker(attack) {

        // Create a custom marker.
        const markerElement = document.createElement('div');
        markerElement.className = `attack-marker ${attack.attack_type}`;

        // Add marker to map at source location.
        const marker = L.marker([attack.source_lat, attack.source_lng], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: markerElement,
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            })
        }).addTo(map);

        // Store marker reference.
        const markerId = `marker-${attack.id}`;
        markers[markerId] = marker;

        // Remove marker after animation completes.
        setTimeout(() => {
            map.removeLayer(marker);
            delete markers[markerId];
        }, 2000);
    }

    // Set up filter change events.
    attackTypeFilterElement.addEventListener('change', updateAttackList);
    severityFilterElement.addEventListener('change', updateAttackList);
});