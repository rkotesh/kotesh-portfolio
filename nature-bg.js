(() => {
    const MODE_SEQUENCE = {
        hero: 'rain',
        about: 'rain',
        clouds: 'rain',
        rain: 'rain',
        skills: 'rain',
        projects: 'rain',
        education: 'rain',
        achievements: 'rain',
        contact: 'rain'
    };

    const PALETTES = {
        morning: {
            skyTop: '#8fc4ea',
            skyBottom: '#eef5f8',
            fog: '#d7e4ee',
            sun: '#fff5cf',
            accent: '#9dc8e6',
            cloud: '#ffffff',
            bird: '#1a1a1a',
            glow: '#f8fbff'
        },
        summer: {
            skyTop: '#78afd8',
            skyBottom: '#f7e7bd',
            fog: '#e2cb9c',
            sun: '#ffd9a0',
            accent: '#e8bc73',
            cloud: '#ffffff',
            bird: '#171717',
            glow: '#f6e0b0'
        },
        rain: {
            skyTop: '#27313d',
            skyBottom: '#05070c',
            fog: '#2f3946',
            sun: '#c8d7e8',
            accent: '#8c98a8',
            cloud: '#e1e7ef',
            bird: '#f8fbff',
            glow: '#dfe8f3'
        },
        night: {
            skyTop: '#020408',
            skyBottom: '#09111c',
            fog: '#0a1220',
            sun: '#f9fbff',
            accent: '#9eaac1',
            cloud: '#d9dfec',
            bird: '#f4f7fb',
            glow: '#dfe8ff'
        }
    };

    const clamp01 = (value) => Math.min(1, Math.max(0, value));
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function color(hex) {
        return new THREE.Color(hex);
    }

    function lerpColor(a, b, t) {
        return a.clone().lerp(b, t);
    }

    function createGlowPoints(count, config) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const phase = new Float32Array(count);
        const drift = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * config.spread.x;
            positions[i * 3 + 1] = (Math.random() - 0.5) * config.spread.y;
            positions[i * 3 + 2] = (Math.random() - 0.5) * config.spread.z;
            phase[i] = Math.random() * Math.PI * 2;
            drift[i * 3] = (Math.random() - 0.5) * config.drift;
            drift[i * 3 + 1] = (Math.random() - 0.5) * config.drift;
            drift[i * 3 + 2] = (Math.random() - 0.5) * config.drift;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
        geometry.setAttribute('aDrift', new THREE.BufferAttribute(drift, 3));

        const material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: { value: color(config.color) },
                uTime: { value: 0 },
                uOpacity: { value: config.opacity },
                uSize: { value: config.size }
            },
            vertexShader: `
                attribute float aPhase;
                attribute vec3 aDrift;
                uniform float uTime;
                uniform float uSize;
                varying float vTwinkle;
                void main() {
                    vec3 p = position + aDrift * sin(uTime * 0.35 + aPhase);
                    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
                    gl_PointSize = uSize * (140.0 / max(1.0, -mvPosition.z));
                    gl_Position = projectionMatrix * mvPosition;
                    vTwinkle = 0.55 + 0.45 * sin(uTime * 2.1 + aPhase);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform float uOpacity;
                varying float vTwinkle;
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    float alpha = smoothstep(0.5, 0.0, d);
                    alpha *= uOpacity * (0.45 + 0.55 * vTwinkle);
                    gl_FragColor = vec4(uColor, alpha);
                }
            `
        });

        return new THREE.Points(geometry, material);
    }

    function createCloud(scale = 1) {
        const group = new THREE.Group();
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.22,
            depthWrite: false
        });

        const pieces = [
            [-1.3, 0.0, 0.0, 0.95],
            [-0.4, 0.35, 0.0, 1.1],
            [0.7, 0.1, 0.0, 1.0],
            [1.4, -0.05, 0.0, 0.86],
            [0.2, -0.25, 0.0, 1.2]
        ];

        pieces.forEach(([x, y, z, r]) => {
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(r * scale, 18, 18), cloudMaterial);
            sphere.position.set(x * scale, y * scale, z);
            group.add(sphere);
        });

        return group;
    }

    function createBird() {
        const bird = new THREE.Group();
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x101010, transparent: true, opacity: 0.95 })
        );
        const wingMaterial = new THREE.MeshBasicMaterial({
            color: 0x101010,
            transparent: true,
            opacity: 0.88,
            side: THREE.DoubleSide
        });

        const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.14), wingMaterial);
        leftWing.position.set(-0.25, 0.05, 0);
        leftWing.rotation.z = -0.5;

        const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.14), wingMaterial);
        rightWing.position.set(0.25, 0.05, 0);
        rightWing.rotation.z = 0.5;

        bird.add(body, leftWing, rightWing);
        bird.userData = {
            body,
            leftWing,
            rightWing,
            flapPhase: Math.random() * Math.PI * 2,
            speed: 0.35 + Math.random() * 0.35,
            radius: 24 + Math.random() * 22,
            height: 10 + Math.random() * 14,
            depth: -12 + Math.random() * 8,
            offset: Math.random() * Math.PI * 2
        };
        return bird;
    }

    function createLightningPlane() {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(320, 180),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0,
                depthWrite: false
            })
        );
        plane.position.z = -55;
        return plane;
    }

    function createHeatMirage() {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(260, 120, 40, 18),
            new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uTime: { value: 0 },
                    uOpacity: { value: 0.14 },
                    uColor: { value: color('#ffffff') }
                },
                vertexShader: `
                    uniform float uTime;
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        vec3 p = position;
                        float wave = sin((uv.x * 18.0 + uTime * 0.9) + uv.y * 6.0) * 0.42;
                        p.y += wave * (1.0 - uv.y) * 0.45;
                        p.x += sin((uv.y * 12.0 + uTime * 1.2)) * 0.12;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float uOpacity;
                    uniform vec3 uColor;
                    varying vec2 vUv;
                    void main() {
                        float band = sin(vUv.y * 24.0 + vUv.x * 8.0) * 0.5 + 0.5;
                        float fade = smoothstep(0.02, 0.35, vUv.y) * smoothstep(0.98, 0.65, vUv.y);
                        float alpha = band * fade * uOpacity;
                        gl_FragColor = vec4(uColor, alpha);
                    }
                `
            })
        );
    }

    window.initNatureBackground = function initNatureBackground() {
        if (window.__natureBackgroundInitialized) return;
        const canvas = document.getElementById('three-bg');
        if (!canvas || typeof THREE === 'undefined') return;
        window.__natureBackgroundInitialized = true;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x121a25, 0.0018);

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 400);
        camera.position.set(0, 2.5, 32);
        const clock = new THREE.Clock();

        const skyUniforms = {
            uTopColor: { value: color(PALETTES.morning.skyTop) },
            uBottomColor: { value: color(PALETTES.morning.skyBottom) },
            uGlowColor: { value: color(PALETTES.morning.glow) },
            uMix: { value: 0 },
            uTime: { value: 0 }
        };

        const sky = new THREE.Mesh(
            new THREE.SphereGeometry(220, 48, 48),
            new THREE.ShaderMaterial({
                side: THREE.BackSide,
                depthWrite: false,
                uniforms: skyUniforms,
                vertexShader: `
                    varying vec3 vPosition;
                    void main() {
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vPosition;
                    uniform vec3 uTopColor;
                    uniform vec3 uBottomColor;
                    uniform vec3 uGlowColor;
                    uniform float uMix;
                    uniform float uTime;
                    void main() {
                        float h = normalize(vPosition).y * 0.5 + 0.5;
                        float horizon = smoothstep(0.1, 0.95, h);
                        vec3 base = mix(uBottomColor, uTopColor, pow(horizon, 1.35));
                        float glow = pow(max(0.0, 1.0 - abs(h - 0.72) * 2.0), 2.7);
                        float shimmer = 0.014 * sin(vPosition.x * 0.04 + uTime * 0.35) + 0.014 * sin(vPosition.z * 0.03 + uTime * 0.2);
                        vec3 colorOut = base + uGlowColor * glow * (0.12 + uMix * 0.1) + shimmer;
                        gl_FragColor = vec4(colorOut, 1.0);
                    }
                `
            })
        );
        scene.add(sky);

        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(4.1, 36, 36),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
        );
        sun.position.set(-36, 22, -110);
        scene.add(sun);

        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(3.5, 36, 36),
            new THREE.MeshBasicMaterial({ color: 0xf6f7fb, transparent: true, opacity: 0.9 })
        );
        moon.position.set(40, 26, -100);
        scene.add(moon);

        const clouds = new THREE.Group();
        const cloudConfigs = [
            [-32, 24, -30, 2.3, 0.55],
            [-8, 28, -26, 2.9, 0.38],
            [24, 22, -34, 2.5, 0.46],
            [46, 18, -28, 2.0, 0.58]
        ];
        cloudConfigs.forEach(([x, y, z, scale, speed], index) => {
            const cloud = createCloud(scale);
            cloud.position.set(x, y, z);
            cloud.userData = {
                speed,
                drift: 0.35 + index * 0.05,
                homeX: x,
                homeY: y,
                homeZ: z,
                phase: Math.random() * Math.PI * 2
            };
            clouds.add(cloud);
        });
        scene.add(clouds);

        const birds = new THREE.Group();
        for (let i = 0; i < 12; i++) {
            const bird = createBird();
            birds.add(bird);
        }
        scene.add(birds);

        const glowWarm = createGlowPoints(180, {
            spread: { x: 150, y: 75, z: 120 },
            color: '#ffb86b',
            opacity: 0.64,
            size: 7,
            drift: 0.8
        });
        scene.add(glowWarm);

        const stars = createGlowPoints(1400, {
            spread: { x: 340, y: 260, z: 180 },
            color: '#ffffff',
            opacity: 0.78,
            size: 4.2,
            drift: 0.08
        });
        scene.add(stars);

        const fireflies = createGlowPoints(70, {
            spread: { x: 70, y: 40, z: 50 },
            color: '#f8ffb8',
            opacity: 0.74,
            size: 7.8,
            drift: 1.4
        });
        fireflies.position.set(0, -10, 0);
        scene.add(fireflies);

        const heatMirage = createHeatMirage();
        heatMirage.position.set(0, -2, -70);
        scene.add(heatMirage);

        const rainCount = 1400;
        const rainGeometry = new THREE.BufferGeometry();
        const rainPositions = new Float32Array(rainCount * 2 * 3);
        const rainData = Array.from({ length: rainCount }, () => ({
            x: (Math.random() - 0.5) * 220,
            y: Math.random() * 140,
            z: (Math.random() - 0.5) * 140,
            len: 1.8 + Math.random() * 2.6,
            speed: 1.5 + Math.random() * 3.2,
            sway: (Math.random() - 0.5) * 0.22
        }));
        const rainMaterial = new THREE.LineBasicMaterial({
            color: 0xdbe7f5,
            transparent: true,
            opacity: 0.62,
            depthWrite: false
        });
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
        const rainLines = new THREE.LineSegments(rainGeometry, rainMaterial);
        rainLines.position.z = -10;
        scene.add(rainLines);

        const lightning = createLightningPlane();
        scene.add(lightning);

        const geomPalette = [
            new THREE.IcosahedronGeometry(2.4, 0),
            new THREE.OctahedronGeometry(2.1, 0),
            new THREE.TetrahedronGeometry(2.0, 0),
            new THREE.TorusKnotGeometry(1.3, 0.42, 100, 16)
        ];
        const floatShapes = [];
        for (let i = 0; i < 8; i++) {
            const geometry = geomPalette[i % geomPalette.length].clone();
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.045
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 130,
                (Math.random() - 0.5) * 70,
                -20 - Math.random() * 80
            );
            mesh.userData = {
                rotX: (Math.random() - 0.5) * 0.004,
                rotY: (Math.random() - 0.5) * 0.005,
                floatSpeed: 0.5 + Math.random() * 0.7,
                floatOffset: Math.random() * Math.PI * 2,
                baseY: mesh.position.y,
                baseX: mesh.position.x
            };
            scene.add(mesh);
            floatShapes.push(mesh);
        }

        const sectionModes = MODE_SEQUENCE;
        const sections = Array.from(document.querySelectorAll('section'));
        let targetMode = 'morning';
        let activeMode = 'morning';
        let modeBlend = 1;
        let lightningFlash = 0;
        let lightningCooldown = 0;

        function setTargetMode(mode) {
            if (!PALETTES[mode] || mode === targetMode) return;
            activeMode = modeBlend >= 1 ? targetMode : activeMode;
            targetMode = mode;
            modeBlend = 0;
        }

        function updateTargetModeFromScroll() {
            if (!sections.length) return;
            const viewportCenter = window.scrollY + window.innerHeight * 0.42;
            let bestMode = targetMode;
            let bestDistance = Infinity;

            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                const sectionTop = window.scrollY + rect.top;
                const sectionCenter = sectionTop + rect.height / 2;
                const distance = Math.abs(sectionCenter - viewportCenter);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestMode = sectionModes[section.id] || 'morning';
                }
            }

            setTargetMode(bestMode);
        }

        let scrollFrame = null;
        function onScroll() {
            if (scrollFrame) return;
            scrollFrame = requestAnimationFrame(() => {
                scrollFrame = null;
                updateTargetModeFromScroll();
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            updateTargetModeFromScroll();
        });

        updateTargetModeFromScroll();

        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        document.addEventListener('mousemove', (event) => {
            mouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (event.clientY / window.innerHeight - 0.5) * 2;
        });

        function updateRain(delta, intensity) {
            const positions = rainGeometry.attributes.position.array;
            for (let i = 0; i < rainData.length; i++) {
                const drop = rainData[i];
                drop.y -= drop.speed * delta * 68 * intensity;
                drop.x += Math.sin((drop.y + i) * 0.02) * drop.sway * delta * 20;
                if (drop.y < -70) {
                    drop.y = 85 + Math.random() * 45;
                    drop.x = (Math.random() - 0.5) * 220;
                    drop.z = (Math.random() - 0.5) * 140;
                }
                const idx = i * 6;
                positions[idx] = drop.x;
                positions[idx + 1] = drop.y;
                positions[idx + 2] = drop.z;
                positions[idx + 3] = drop.x;
                positions[idx + 4] = drop.y - drop.len;
                positions[idx + 5] = drop.z;
            }
            rainGeometry.attributes.position.needsUpdate = true;
        }

        function chooseTheme(mode) {
            return PALETTES[mode] || PALETTES.morning;
        }

        function triggerLightning() {
            lightningFlash = 1;
            lightningCooldown = 1.6 + Math.random() * 2.1;
        }

        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            const delta = Math.min(clock.getDelta(), 0.033);
            time += delta;

            mouse.x += (mouse.tx - mouse.x) * 0.05;
            mouse.y += (mouse.ty - mouse.y) * 0.05;

            if (modeBlend < 1) {
                modeBlend = clamp01(modeBlend + delta * 0.55);
                if (modeBlend >= 1) {
                    activeMode = targetMode;
                }
            }

            const blend = easeInOutCubic(modeBlend);
            const themeA = chooseTheme(activeMode);
            const themeB = chooseTheme(targetMode);

            const skyTop = lerpColor(color(themeA.skyTop), color(themeB.skyTop), blend);
            const skyBottom = lerpColor(color(themeA.skyBottom), color(themeB.skyBottom), blend);
            const fogColor = lerpColor(color(themeA.fog), color(themeB.fog), blend);
            const glowColor = lerpColor(color(themeA.glow), color(themeB.glow), blend);

            skyUniforms.uTopColor.value.copy(skyTop);
            skyUniforms.uBottomColor.value.copy(skyBottom);
            skyUniforms.uGlowColor.value.copy(glowColor);
            skyUniforms.uMix.value = blend;
            skyUniforms.uTime.value = time;
            scene.fog.color.copy(fogColor);

            const nightFactor = blend * (targetMode === 'night' ? 1 : activeMode === 'night' ? 1 : 0);
            const rainFactor = blend * (targetMode === 'rain' ? 1 : activeMode === 'rain' ? 1 : 0);
            const summerFactor = blend * (targetMode === 'summer' ? 1 : activeMode === 'summer' ? 1 : 0);
            const morningFactor = blend * (targetMode === 'morning' ? 1 : activeMode === 'morning' ? 1 : 0);

            sun.position.set(lerp(-38, -28, summerFactor + morningFactor * 0.2), lerp(24, 18, summerFactor), -110);
            moon.position.set(lerp(44, 36, nightFactor), lerp(26, 30, nightFactor), -100);
            sun.material.opacity = clamp01(0.18 + morningFactor * 0.9 + summerFactor * 0.95 - nightFactor * 0.9 - rainFactor * 0.55);
            moon.material.opacity = clamp01(0.95 * nightFactor + 0.2 * rainFactor);

            clouds.children.forEach((cloud, index) => {
                cloud.position.x += cloud.userData.speed * delta * 4;
                cloud.position.y = cloud.userData.homeY + Math.sin(time * 0.18 + cloud.userData.phase) * cloud.userData.drift;
                if (cloud.position.x > 92) {
                    cloud.position.x = -98 - index * 12;
                }
                const cloudOpacity = clamp01(morningFactor * 1.0 + summerFactor * 0.82 + rainFactor * 0.92 - nightFactor * 0.55);
                cloud.traverse((child) => {
                    if (child.isMesh) {
                        child.material.opacity = lerp(0.12, 0.42, cloudOpacity);
                        child.material.color.copy(color(themeB.cloud));
                    }
                });
            });

            birds.children.forEach((bird, index) => {
                const ud = bird.userData;
                bird.position.x = Math.sin(time * ud.speed + ud.offset + index) * ud.radius;
                bird.position.y = 15 + Math.cos(time * 0.7 + ud.offset * 2) * 3 + ud.height * 0.25;
                bird.position.z = ud.depth + Math.sin(time * 0.5 + index) * 4;
                bird.rotation.y = Math.sin(time * 0.35 + index) * 0.1;
                const flap = Math.sin(time * 9.0 * ud.speed + ud.flapPhase) * 0.55;
                ud.leftWing.rotation.z = -0.55 + flap;
                ud.rightWing.rotation.z = 0.55 - flap;
                const birdOpacity = clamp01(morningFactor * 1.15 + summerFactor * 0.98 + rainFactor * 0.28);
                ud.body.material.opacity = birdOpacity;
                ud.leftWing.material.opacity = birdOpacity * 0.92;
                ud.rightWing.material.opacity = birdOpacity * 0.92;
                ud.body.material.color.copy(color(themeA.bird));
                ud.leftWing.material.color.copy(color(themeA.bird));
                ud.rightWing.material.color.copy(color(themeA.bird));
                bird.visible = birdOpacity > 0.05;
            });

            glowWarm.material.uniforms.uTime.value = time;
            glowWarm.material.uniforms.uOpacity.value = 0.45 * summerFactor + 0.25 * morningFactor;
            glowWarm.visible = morningFactor > 0.05 || summerFactor > 0.05;

            stars.material.uniforms.uTime.value = time;
            stars.material.uniforms.uOpacity.value = 0.95 * nightFactor + 0.12 * rainFactor;
            stars.visible = nightFactor > 0.08 || rainFactor > 0.25;

            fireflies.material.uniforms.uTime.value = time;
            fireflies.material.uniforms.uOpacity.value = 0.92 * nightFactor;
            fireflies.visible = nightFactor > 0.06;

            heatMirage.material.uniforms.uTime.value = time;
            heatMirage.material.uniforms.uOpacity.value = 0.2 * summerFactor;
            heatMirage.visible = summerFactor > 0.05;

            rainMaterial.opacity = 0.06 + 0.82 * rainFactor;
            updateRain(delta, rainFactor);
            rainLines.visible = rainFactor > 0.05;

            lightning.material.opacity = Math.max(0, lightningFlash) * rainFactor * 0.92;
            if (rainFactor > 0.55) {
                lightningCooldown -= delta;
                if (lightningCooldown <= 0 && Math.random() < 0.06) {
                    triggerLightning();
                }
            }
            lightningFlash *= 0.8;

            floatShapes.forEach((shape) => {
                shape.rotation.x += shape.userData.rotX + delta * 0.15;
                shape.rotation.y += shape.userData.rotY + delta * 0.2;
                shape.position.y = shape.userData.baseY + Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 3;
                shape.position.x = shape.userData.baseX + Math.cos(time * 0.7 + shape.userData.floatOffset) * 1.5;
                shape.material.opacity = 0.03 + 0.035 * (0.45 + morningFactor * 0.25 + summerFactor * 0.18 + nightFactor * 0.22);
            });

            scene.rotation.y = mouse.x * 0.03;
            scene.rotation.x = mouse.y * 0.018;
            camera.position.x += (mouse.x * 1.6 - camera.position.x) * 0.015;
            camera.position.y += (-mouse.y * 1.0 - camera.position.y + 2.5) * 0.015;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }

        animate();
    };
})();
