// Global variables
let scene, camera, renderer, globe, attacksCount = 0;
let attacks = [];
const attackColors = {
    'DDOS': 0xff3333,      // Red
    'MALWARE': 0x33ff33,   // Green
    'PHISHING': 0x3333ff,  // Blue
    'BRUTE_FORCE': 0xffff33 // Yellow
};

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera with perspective
    camera = new THREE.PerspectiveCamera(
        60, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.z = 200;

    // Create WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('globe-container').appendChild(renderer.domElement);

    // Create globe
    createGlobe();

    // Add ambient light to the scene
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light to the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point light inside the globe
    const pointLight = new THREE.PointLight(0x3366ff, 0.8, 300);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();

    // Start fetching attacks
    fetchAttacks();
}

// Create the 3D globe
function createGlobe() {
    // Create Earth sphere
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);

    // Create Earth material with continents
    const continentsMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        emissive: 0x112244,
        emissiveIntensity: 0.4,
        shininess: 5,
        wireframe: false,
        transparent: false
    });

    // Create the Earth mesh
    globe = new THREE.Mesh(earthGeometry, continentsMaterial);
    scene.add(globe);

    // Add continents as grid lines at specific latitudes/longitudes
    addContinentsOutlines();

    // Add a subtle glow effect
    addGlowEffect();
}

// Add continent outlines using line segments
function addContinentsOutlines() {
    // Create a sphere slightly larger than the globe for the grid
    const gridGeometry = new THREE.SphereGeometry(100.1, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0x3366ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });

    const gridSphere = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(gridSphere);

    // Add latitude lines (parallels)
    for (let lat = -80; lat <= 80; lat += 20) {
        addLatitudeLine(lat);
    }

    // Add longitude lines (meridians)
    for (let lng = -180; lng < 180; lng += 20) {
        addLongitudeLine(lng);
    }
}

// Add a latitude line to the globe
function addLatitudeLine(latitude) {
    const points = [];
    const radius = 100.5; // Slightly above globe surface

    for (let lng = -180; lng <= 180; lng += 5) {
        const phi = (90 - latitude) * (Math.PI / 180);
        const theta = lng * (Math.PI / 180);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x3366ff,
        transparent: true,
        opacity: 0.2
    });

    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

// Add a longitude line to the globe
function addLongitudeLine(longitude) {
    const points = [];
    const radius = 100.5; // Slightly above globe surface

    for (let lat = -90; lat <= 90; lat += 5) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = longitude * (Math.PI / 180);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x3366ff,
        transparent: true,
        opacity: 0.2
    });

    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

// Add a subtle glow effect to the globe
function addGlowEffect() {
    const glowGeometry = new THREE.SphereGeometry(102, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x3366ff,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
    });

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);
}

// Convert lat/lng coordinates to 3D position
function latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Add attack pulse to the globe
function addAttack(attack) {
    const position = latLngToVector3(attack.latitude, attack.longitude, 100);

    // Create the ping geometry
    const pingGeometry = new THREE.SphereGeometry(0.5, 8, 8);

    // Get color based on attack type
    const color = attackColors[attack.attack_type] || 0xffffff;

    // Create the ping material with glow
    const pingMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1
    });

    // Create the ping mesh
    const ping = new THREE.Mesh(pingGeometry, pingMaterial);
    ping.position.copy(position);
    scene.add(ping);

    // Add to attacks array with creation timestamp
    attacks.push({
        mesh: ping,
        createdAt: Date.now(),
        color: color,
        scale: 1,
        opacity: 1
    });

    // Update the attack counter
    attacksCount++;
    document.getElementById('attacks-count').textContent = attacksCount;
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the globe
    if (globe) {
        globe.rotation.y += 0.001;
    }

    // Update attack animations
    updateAttacks();

    // Render the scene
    renderer.render(scene, camera);
}

// Update attack animations
function updateAttacks() {
    const now = Date.now();
    const attacksToRemove = [];

    for (let i = 0; i < attacks.length; i++) {
        const attack = attacks[i];
        const age = now - attack.createdAt;

        if (age < 3000) {
            // Expand and fade out over 3 seconds
            attack.scale = 1 + (age / 300);
            attack.opacity = 1 - (age / 3000);

            attack.mesh.scale.set(attack.scale, attack.scale, attack.scale);
            attack.mesh.material.opacity = attack.opacity;
        } else {
            // Mark for removal
            attacksToRemove.push(i);
            scene.remove(attack.mesh);
        }
    }

    // Remove old attacks
    for (let i = attacksToRemove.length - 1; i >= 0; i--) {
        attacks.splice(attacksToRemove[i], 1);
    }
}

// Fetch attack data from API
function fetchAttacks() {
    // Fetch 2 attacks every second (aiming for 3000/day ~ 2/sec)
    setInterval(() => {
        fetch('/api/attacks/?count=2')
            .then(response => response.json())
            .then(data => {
                // Update attacks rate display
                document.getElementById('attacks-rate').textContent = '2';

                // Add each attack to the globe
                data.attacks.forEach(attack => {
                    addAttack(attack);
                });
            })
            .catch(error => {
                console.error('Error fetching attacks:', error);
            });
    }, 1000);
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', init);