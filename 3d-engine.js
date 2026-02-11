
// 3D Engine for Portfolio - Non-Module Version
// Depends on global THREE and gsap variables loaded in index.html

// --- Configuration ---
const CONFIG = {
    // Switch between local model and public test model
    modelPath: 'assets/model.glb',
    // modelPath: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', 

    usePlaceholder: false,
    scrollSpeed: 0.5,
    cameraPos: { x: 0, y: 0, z: 5 },
    bikeScale: 0.8 // 0.8 Scale (Visible size)
};

// Check dependecies
if (typeof THREE === 'undefined') {
    console.error("❌ 3D ENGINE ERROR: Three.js library not loaded! Check index.html script tags.");
} else {
    // Check for local file protocol issue
    if (window.location.protocol === 'file:') {
        alert("⚠️ SECURITY WARNING: You are opening this file directly.\n\nBrowsers block 3D models in this mode (CORS Error).\n\nPlease use a Local Server (e.g., Live Server in VS Code) to see the model.");
    }
    console.log("🚀 3D ENGINE: Starting...");
    initEngine();
}

function initEngine() {
    // --- Scene Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(CONFIG.cameraPos.x, CONFIG.cameraPos.y, CONFIG.cameraPos.z);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Append to container
    const container = document.getElementById('three-container');
    if (container) {
        container.innerHTML = ''; // Clear any existing canvas
        container.appendChild(renderer.domElement);
    } else {
        console.warn("⚠️ Container #three-container not found. Appending to body.");
        document.body.appendChild(renderer.domElement);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '10'; // High Z-Index for Overlay
        renderer.domElement.style.pointerEvents = 'none'; // Click-through
        renderer.domElement.id = 'three-canvas';
    }

    // --- Lights ---
    // Bright Omni Light to ensure visibility everywhere
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Rim light for cool effect
    const rimLight = new THREE.SpotLight(0xff00ff, 3);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    // --- Object Variables ---
    let bikeGroup = new THREE.Group();
    scene.add(bikeGroup);

    // --- Load Model ---
    if (CONFIG.usePlaceholder) {
        createPlaceholderBike();
    } else {
        const loader = new THREE.GLTFLoader();
        console.log("🔄 3D ENGINE: Loading model from " + CONFIG.modelPath);

        loader.setCrossOrigin('anonymous');

        loader.load(
            CONFIG.modelPath,
            (gltf) => {
                const model = gltf.scene;

                // Center & Scale
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                console.log("✅ 3D ENGINE: Model Loaded. Size relative to self:", size);

                model.position.sub(center);
                model.scale.set(CONFIG.bikeScale, CONFIG.bikeScale, CONFIG.bikeScale);

                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                bikeGroup.add(model);
                animateIntro();
            },
            (xhr) => {
                // Progress
            },
            (error) => {
                console.error('❌ 3D ENGINE ERROR loading model:', error);
                console.warn("Falling back to placeholder.");
                createPlaceholderBike();
            }
        );
    }

    // --- Helpers ---
    function createPlaceholderBike() {
        const geometry = new THREE.Group();
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.5, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2, metalness: 0.8 })
        );
        geometry.add(body);
        bikeGroup.add(geometry);
        animateIntro();
    }

    function animateIntro() {
        if (typeof gsap !== 'undefined') {
            gsap.from(bikeGroup.position, {
                y: -10,
                duration: 2,
                ease: "power2.out"
            });
        }
    }

    // --- Scroll Logic ---
    let scrollY = 0;
    let targetScrollY = 0;

    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Main Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Smooth Scroll Damping (Lerp)
        scrollY += (targetScrollY - scrollY) * 0.05;

        // Calculate Scroll Progress (0 to 1)
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const scrollProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;

        // --- ANIMATION MAPPING ---

        // 1. POSITION (Right Side Fixed)
        // x = 2.5 (Right side, safer than 3.5). 
        // 0 is center. +2.5 is right.
        bikeGroup.position.x = 2.5;

        // 2. VERTICAL MOVEMENT (Scroll Down -> Model Moves Down)
        // Travels from Y=+2 (Top) to Y=-4 (Bottom)
        bikeGroup.position.y = 2.0 - (scrollProgress * 6.0);

        // 3. DEPTH MOVEMENT (Zoom in/out)
        // Moves from Z=0 (far) to Z=2 (close)
        bikeGroup.position.z = scrollProgress * 2;

        // 4. ROTATION (Spin)
        // Continuous slow spin + scroll spin
        bikeGroup.rotation.y = (scrollProgress * Math.PI) + (time * 0.1);

        // Idle wobble
        bikeGroup.rotation.z = Math.sin(time) * 0.05;

        renderer.render(scene, camera);
    }

    animate();
}
