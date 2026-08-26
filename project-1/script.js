function initCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    if (!items.length) return;

    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const counter = document.querySelector('.carousel-counter');
    const track = document.querySelector('.carousel-track');
    const gallerySection = document.querySelector('.gallery-carousel');
    let currentIndex = Math.floor(items.length / 2);

    // Inject caption bars from data-caption attributes
    items.forEach(item => {
        const caption = item.getAttribute('data-caption');
        if (caption && !item.querySelector('.carousel-caption')) {
            const el = document.createElement('div');
            el.className = 'carousel-caption';
            el.textContent = caption;
            item.appendChild(el);
        }
        item.removeAttribute('data-caption');
    });

    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');

            // Calculate circular distance
            const diff = (index - currentIndex + items.length) % items.length;

            if (diff === 0) {
                item.classList.add('active');
                item.setAttribute('aria-hidden', 'false');
            } else {
                item.setAttribute('aria-hidden', 'true');
                if (diff === 1) {
                    item.classList.add('next');
                } else if (diff === 2) {
                    item.classList.add('next-2');
                } else if (diff === items.length - 1) {
                    item.classList.add('prev');
                } else if (diff === items.length - 2) {
                    item.classList.add('prev-2');
                }
            }
        });

        if (counter) counter.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    function goTo(index) {
        currentIndex = (index + items.length) % items.length;
        updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    items.forEach((item, index) => {
        item.addEventListener('click', () => goTo(index));
    });

    // Keyboard navigation — only while the gallery is on screen
    if (gallerySection && track) {
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goTo(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goTo(currentIndex + 1);
            }
        });

        // Touch swipe
        let touchStartX = null;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        track.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 40) goTo(currentIndex + (deltaX < 0 ? 1 : -1));
            touchStartX = null;
        }, { passive: true });
    }

    updateCarousel();
}

const initApp = (event) => {
    initCarousel();

    // --- Page Transition Overlay for Navigation ---
    const transitionOverlay = document.createElement('div');
    transitionOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:var(--bg); z-index:9999; pointer-events:none; opacity:0;';
    document.body.appendChild(transitionOverlay);

    const sectionLinks = document.querySelectorAll('a[href^="#"]');
    sectionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            // Ensure it's a valid section ID (not just "#")
            if (targetId && targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    gsap.to(transitionOverlay, {
                        opacity: 1, duration: 0.4, ease: "power2.inOut",
                        onComplete: () => {
                            // Calculate absolute position robustly
                            const absoluteTop = targetEl.getBoundingClientRect().top + window.scrollY;
                            window.scrollTo(0, absoluteTop);

                            gsap.to(transitionOverlay, { opacity: 0, duration: 0.5, ease: "power2.inOut", delay: 0.1 });
                        }
                    });
                }
            }
        });
    });

    if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
    } else {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- Premium GSAP Hero Intro Animation ---
    const heroTl = gsap.timeline({
        defaults: { ease: "expo.out" }
    });

    // Nav items simple fade in
    heroTl.from(".hero-editorial-nav .nav-left, .hero-editorial-nav .nav-center, .hero-editorial-nav .nav-right", {
        opacity: 0,
        y: -10,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.1,
        stagger: 0.1,
        clearProps: "all"
    })
        // Massive Title scale and fade up
        .from(".hero-massive-title", {
            y: 100,
            opacity: 0,
            scale: 0.9,
            duration: 1.5,
            ease: "power4.out"
        }, "-=0.4")
        // Side text and button fade in
        .from(".hero-side-text, .hero-side-btn", {
            x: (index, target) => target.classList.contains('hero-side-text') ? -20 : 20,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.2
        }, "-=1.0");

    // --- White Cloud Wipe Transition (Accessibility First) ---
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
        // Hero fades out slightly and scales down
        ScrollTrigger.create({
            trigger: "body",
            start: "top top", 
            end: "100vh top",      
            scrub: true,
            animation: gsap.to("#hero", { opacity: 0.2, scale: 0.95, ease: "none" })
        });

        const cloudTl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top", 
                end: "+=150vh",
                scrub: 1.5 
            }
        });

        // Fast upward parallax for clouds (from top: 100% to far above)
        cloudTl.to("#c1", { y: "-80vh", ease: "power3.out" }, 0)
               .to("#c2", { y: "-60vh", ease: "power3.out" }, 0)
               .to("#c3", { y: "-30vh", ease: "power3.out" }, 0);
    }


    // Ensure Lenis is available before using it.
    function initializeAllWithLenis() {
        // Create Lenis instance with optimized parameters for ultra-smooth scrolling
        window.lenis = new Lenis({
            lerp: 0.0875, // Silky glide, still responsive (frame-rate independent)
            wheelMultiplier: 1.0,
            gestureOrientation: 'vertical',
            smoothWheel: true,
            syncTouch: false, // Native touch on mobile feels best
            touchMultiplier: 1.6,
            infinite: false,
            autoResize: true
        });

        const lenis = window.lenis;

        // Connect Lenis with ScrollTrigger if available
        if (typeof lenis.on === 'function') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0, 0);
        }

        // 5. Timeline SVG path dynamic generator and scroll-driven draw
        // --- TRAJECTORY GEOMETRY ENGINE ---
        const TRAJECTORY_CONFIG = {
            // Dynamic Anchor Offsets (submerged into island solid mass)
            ANCHOR_DEPTH_X: 0.28,
            ANCHOR_DEPTH_Y: 0.30,

            // Multi-factor Curvature Multipliers (Increased for maximum fluidity)
            CURVE_FACTOR_DESKTOP: 0.22,
            CURVE_FACTOR_MOBILE: 0.28,
            VERTICAL_BIAS: 0.50,

            // Curvature Budget Guardrails (min & max horizontal swing in px)
            MIN_CURVATURE_OFFSET: 25,
            MAX_CURVATURE_OFFSET_RATIO: 0.45,

            // Arrival Easing (landing tangent alignment into target waypoint)
            ARRIVAL_EASING_STRENGTH: 0.30
        };

        const timeline = document.querySelector('.timeline');
        const svg = document.querySelector('.timeline-path-svg');
        const curveBase = document.getElementById('timeline-curve-base');
        const signalDot = document.getElementById('timeline-signal');

        const tCards = gsap.utils.toArray('.timeline-card');

        let timelineCurrentProgress = 0;



        function updateTimelinePath() {
            const svgRect = svg.getBoundingClientRect();
            const svgW = svg.offsetWidth || svgRect.width;
            const svgH = svg.offsetHeight || timeline.offsetHeight;
            if (svgW <= 0 || svgH <= 0) return;

            svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);

            const scaleX = svgRect.width > 0 ? (svgW / svgRect.width) : 1;
            const scaleY = svgRect.height > 0 ? (svgH / svgRect.height) : 1;
            const isMobile = window.innerWidth < 768;

            // 1. Gather all island image measurements and centers
            const cardData = tCards.map((card) => {
                const img = card.querySelector('.timeline-island-img') || card;
                const imgRect = img.getBoundingClientRect();

                const ix = (imgRect.left - svgRect.left) * scaleX;
                const iy = (imgRect.top - svgRect.top) * scaleY;
                const iw = imgRect.width * scaleX;
                const ih = imgRect.height * scaleY;

                return {
                    card,
                    side: card.getAttribute('data-side') || 'center',
                    ix, iy, iw, ih
                };
            });

            const DEBUG_TIMELINE_ANCHORS = true;

            // 2. Island Edge Profiles (Manual terrain-contour calibration)
            // ENTER: visible upper terrain contour
            // EXIT: logical transition anchor, hidden beneath/inside the island area
            // 2. Island Edge Profiles (Manual terrain-contour calibration)
            // ENTER: visible upper terrain contour
            // EXIT: logical transition anchor, hidden beneath/inside the island area
            // Precise manual visual calibration points
            const ISLAND_EDGE_PROFILES = [
                { enter: { x: 0.5000, y: 0.1000, dirX: 0, dirY: 1 }, exit: { x: 0.2559, y: 0.8134, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2019 (Enter not used)
                { enter: { x: 0.5489, y: 0.1261, dirX: 0, dirY: 1 }, exit: { x: 0.5882, y: 0.8726, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2021
                { enter: { x: 0.5403, y: 0.1372, dirX: 0, dirY: 1 }, exit: { x: 0.5999, y: 0.8389, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2022 R
                { enter: { x: 0.2846, y: 0.1746, dirX: 0, dirY: 1 }, exit: { x: 0.6293, y: 0.8450, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2022 L Geo
                { enter: { x: 0.3252, y: 0.2675, dirX: 0, dirY: 1 }, exit: { x: 0.5129, y: 0.6205, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2022 WP
                { enter: { x: 0.4184, y: 0.2636, dirX: 0, dirY: 1 }, exit: { x: 0.6213, y: 0.6918, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2023 Undergrad
                { enter: { x: 0.5433, y: 0.2863, dirX: 0, dirY: 1 }, exit: { x: 0.6516, y: 0.6324, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2023 Lab
                { enter: { x: 0.5583, y: 0.1753, dirX: 0, dirY: 1 }, exit: { x: 0.7678, y: 0.8342, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }, // 2025
                { enter: { x: 0.4540, y: 0.2418, dirX: 0, dirY: 1 }, exit: { x: 0.5000, y: 0.9500, dirX: 0, dirY: 1 }, curvatureFactor: 0.30 }  // 2026 (Exit not used)
            ];

            const normalizeVector = (dx, dy) => {
                const len = Math.hypot(dx, dy) || 1;
                return { x: dx / len, y: dy / len };
            };

            svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);

            const anchors = cardData.map((c, i) => {
                const p = ISLAND_EDGE_PROFILES[i] || ISLAND_EDGE_PROFILES[0];

                const enterX = c.ix + c.iw * p.enter.x;
                const enterY = c.iy + c.ih * p.enter.y;
                const exitX = c.ix + c.iw * p.exit.x;
                const exitY = c.iy + c.ih * p.exit.y;

                // Vektor arah kurva sejajar dengan kemiringan antara dok enter ke dok exit pulau ini
                // Kecuali pulau terakhir di mana kita asumsikan lurus ke bawah
                let dir = normalizeVector(exitX - enterX, exitY - enterY);
                if (i === cardData.length - 1) {
                    dir = { x: 0, y: 1 };
                }

                return {
                    enter: { x: enterX, y: enterY, dir: dir },
                    exit: { x: exitX, y: exitY, dir: dir },
                    curvatureFactor: p.curvatureFactor || 0.50,
                    cardHeight: c.ih,
                    cardCenterY: c.iy + c.ih / 2
                };
            });

            // Clean up existing dock markers
            document.querySelectorAll('.timeline-dock-marker').forEach(e => e.remove());

            const ns = "http://www.w3.org/2000/svg";

            // Add UI dock markers
            anchors.forEach((a, i) => {
                // Add enter marker (except for first island which is just a starting point)
                if (i > 0) {
                    const markerEnter = document.createElementNS(ns, 'circle');
                    markerEnter.setAttribute('class', 'timeline-dock-marker timeline-dock-enter');
                    markerEnter.setAttribute('cx', a.enter.x);
                    markerEnter.setAttribute('cy', a.enter.y);
                    markerEnter.setAttribute('r', '8');
                    markerEnter.setAttribute('fill', '#1F2A44'); // Matches inactive timeline line
                    markerEnter.setAttribute('stroke', 'none');
                    markerEnter.setAttribute('data-island', i);
                    markerEnter.setAttribute('data-type', 'enter');
                    svg.appendChild(markerEnter);
                }

                // Add exit marker (except for last island where journey stops at enter)
                if (i < anchors.length - 1 || i === 0) {
                    const markerExit = document.createElementNS(ns, 'circle');
                    markerExit.setAttribute('class', 'timeline-dock-marker timeline-dock-exit');
                    markerExit.setAttribute('cx', a.exit.x);
                    markerExit.setAttribute('cy', a.exit.y);
                    markerExit.setAttribute('r', '8');
                    markerExit.setAttribute('fill', '#1F2A44'); // Matches inactive timeline line
                    markerExit.setAttribute('stroke', 'none');
                    markerExit.setAttribute('data-island', i);
                    markerExit.setAttribute('data-type', 'exit');
                    svg.appendChild(markerExit);
                }
            });

            // 3. Construct Independent Trajectory Segments
            const activeSegmentsGroup = document.getElementById('timeline-active-segments-group');
            if (activeSegmentsGroup) activeSegmentsGroup.innerHTML = '';

            const segmentLengths = [];
            const combinedPathStrings = [];
            const activePathElements = []; // Store the individual path elements

            const addSegment = (pathString) => {
                // We create an individual segment for the active cyan line
                const activeSegment = document.createElementNS(ns, "path");
                activeSegment.setAttribute('d', pathString);
                activeSegment.setAttribute('class', 'timeline-curve-active-segment');
                if (activeSegmentsGroup) activeSegmentsGroup.appendChild(activeSegment);

                const len = activeSegment.getTotalLength();
                segmentLengths.push(len);
                combinedPathStrings.push(pathString);
                activePathElements.push(activeSegment);

                // Initialize hidden
                activeSegment.style.strokeDasharray = len + ' ' + (len * 2);
                activeSegment.style.strokeDashoffset = len;
            };



            // Segments 1 to 8
            for (let i = 0; i < anchors.length - 1; i++) {
                const P0 = anchors[i].exit;
                const P3 = anchors[i + 1].enter;
                const dist = Math.hypot(P3.x - P0.x, P3.y - P0.y);
                const tension = dist * anchors[i].curvatureFactor * (isMobile ? 0.8 : 1.0);
                const CP1 = { x: P0.x + P0.dir.x * tension, y: P0.y + P0.dir.y * tension };
                const CP2 = { x: P3.x - P3.dir.x * tension, y: P3.y - P3.dir.y * tension };
                addSegment(`M ${P0.x.toFixed(1)} ${P0.y.toFixed(1)} C ${CP1.x.toFixed(1)} ${CP1.y.toFixed(1)}, ${CP2.x.toFixed(1)} ${CP2.y.toFixed(1)}, ${P3.x.toFixed(1)} ${P3.y.toFixed(1)}`);
            }

            // Outro Segment
            const lastExit = anchors[anchors.length - 1].exit;
            const outroDist = 180; // Distance to reach below the text
            const outroP3 = { x: lastExit.x + lastExit.dir.x * outroDist, y: lastExit.y + lastExit.dir.y * outroDist };
            addSegment(`M ${lastExit.x.toFixed(1)} ${lastExit.y.toFixed(1)} Q ${lastExit.x.toFixed(1)} ${(lastExit.y + outroP3.y) / 2}, ${outroP3.x.toFixed(1)} ${outroP3.y.toFixed(1)}`);

            const fullPathD = combinedPathStrings.join(" ");
            curveBase.setAttribute('d', fullPathD);

            // 4. Build the Phase State Machine
            const phases = [];
            let currentScrollWeight = 0;
            let cumulativePathLength = 0; // Not strictly needed for logic now, but kept for reference

            const pushPhase = (type, scrollWeight, dockPoint, segIndex, extra = {}) => {
                phases.push({
                    type,
                    startWeight: currentScrollWeight,
                    endWeight: currentScrollWeight + scrollWeight,
                    baseLength: cumulativePathLength,
                    dockPoint,
                    segIndex,
                    ...extra
                });
                currentScrollWeight += scrollWeight;
            };

            // Start by docking at Island 0's EXIT
            const dy0 = Math.abs(anchors[0].exit.y - anchors[0].enter.y);
            pushPhase('dock', Math.max(dy0, 100), anchors[0].exit, 0, { islandIndex: 0 });

            for (let i = 0; i < anchors.length; i++) {
                if (i > 0) {
                    // Dock at current island's ENTER (traverse island)
                    // Use vertical distance dy just like travel, so vertical scroll speed never changes!
                    const dyDock = Math.abs(anchors[i].exit.y - anchors[i].enter.y);
                    pushPhase('dock', Math.max(dyDock, 100), anchors[i].enter, i, { islandIndex: i });
                }

                if (i < anchors.length - 1) {
                    // Travel to next island
                    // INSTEAD of using total SVG pixel length, use ONLY vertical distance!
                    // This ensures horizontal paths are crossed instantly without extra scrolling.
                    const dy = Math.abs(anchors[i + 1].enter.y - anchors[i].exit.y);
                    const travelWeight = Math.max(dy, 100); // Minimum 100px weight
                    pushPhase('travel', travelWeight, null, i, { fromIslandIndex: i, toIslandIndex: i + 1 });
                    cumulativePathLength += segmentLengths[i];
                } else {
                    // Outro travel
                    const outroWeight = segmentLengths[i];
                    pushPhase('travel', outroWeight, null, i, { fromIslandIndex: i, toIslandIndex: i });
                    cumulativePathLength += segmentLengths[i];
                }
            }

            const totalWeight = currentScrollWeight;
            phases.forEach(p => {
                p.startProgress = p.startWeight / totalWeight;
                p.endProgress = p.endWeight / totalWeight;
            });

            window.timelinePhases = phases;
            window.timelineActivePathElements = activePathElements;
            window.timelineSegmentLengths = segmentLengths;
            window.timelineAnchors = anchors;
            // Expose total scroll weight so ScrollTrigger can size itself correctly
            window.timelineTotalScrollWeight = totalWeight;

        } // <-- CLOSE updateTimelinePath()

        function renderTimelineProgress(progress) {
            timelineCurrentProgress = progress;

            const phases = window.timelinePhases;
            const pathElements = window.timelineActivePathElements;
            const lengths = window.timelineSegmentLengths;
            const anchors = window.timelineAnchors;
            let signalDot = document.getElementById('timeline-signal');

            if (!phases || !pathElements || !anchors) return;

            let activePhase = phases[phases.length - 1];
            let localProgress = 1;
            for (let p of phases) {
                if (progress >= p.startProgress && progress <= p.endProgress) {
                    activePhase = p;
                    const phaseRange = activePhase.endProgress - activePhase.startProgress;
                    localProgress = phaseRange > 0 ? (progress - activePhase.startProgress) / phaseRange : 1;
                    break;
                }
            }



            let dotPoint = null;
            const activeSegIndex = activePhase.segIndex;

            // Update ALL segments independently
            pathElements.forEach((pathEl, idx) => {
                const len = lengths[idx];
                if (idx < activeSegIndex) {
                    // Fully drawn
                    pathEl.style.strokeDashoffset = 0;
                } else if (idx > activeSegIndex) {
                    // Fully hidden
                    pathEl.style.strokeDashoffset = len;
                } else {
                    // Active segment
                    if (activePhase.type === 'dock') {
                        pathEl.style.strokeDashoffset = len; // Hidden while docking
                    } else {
                        const localLength = len * localProgress;
                        pathEl.style.strokeDashoffset = len - localLength;
                        dotPoint = pathEl.getPointAtLength(localLength);
                    }
                }
            });

            // 1. Position the dot and handle inactive state
            if (activePhase.type === 'dock') {
                const island = anchors[activePhase.islandIndex];
                // Animate waypoint from enter to exit invisibly across the island
                dotPoint = {
                    x: island.enter.x + (island.exit.x - island.enter.x) * localProgress,
                    y: island.enter.y + (island.exit.y - island.enter.y) * localProgress
                };

                if (signalDot) signalDot.classList.add('is-docked');

                // Toggle docked state on cards for extended typography animations
                tCards.forEach((c, idx) => {
                    if (idx === activePhase.islandIndex) {
                        c.classList.add('is-docked');
                    } else {
                        c.classList.remove('is-docked');
                    }
                });
            } else {
                if (signalDot) signalDot.classList.remove('is-docked');
                tCards.forEach(c => c.classList.remove('is-docked'));
            }

            // Update dock markers color
            const dockMarkers = document.querySelectorAll('.timeline-dock-marker');
            dockMarkers.forEach((marker) => {
                const islandIdx = parseInt(marker.getAttribute('data-island'));
                const type = marker.getAttribute('data-type');
                const dockPhase = phases.find(p => p.type === 'dock' && p.islandIndex === islandIdx);

                let isActive = false;
                if (dockPhase) {
                    if (type === 'enter') {
                        isActive = progress >= dockPhase.startProgress;
                    } else if (type === 'exit') {
                        isActive = progress >= dockPhase.endProgress;
                    }
                }

                if (isActive) {
                    marker.setAttribute('fill', '#00e5ff');
                    marker.style.filter = 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.8))';
                    marker.setAttribute('stroke', 'none');
                } else {
                    marker.setAttribute('fill', '#1F2A44'); // Matches inactive timeline
                    marker.style.filter = 'none';
                    marker.setAttribute('stroke', 'none');
                }
            });

            if (signalDot && dotPoint) {
                if (progress > 0.005) {
                    signalDot.style.visibility = 'visible';
                    signalDot.setAttribute('transform', `translate(${dotPoint.x}, ${dotPoint.y})`);
                } else {
                    signalDot.style.visibility = 'hidden';
                }
            }

            // Save the camera point globally for the physics camera loop to use
            window.timelineDotPoint = dotPoint;
        }

        // --- STORY TIMING CONTROLS ---
        // Window width relative to one full "beat" (distance between two island dock-centers).
        // 1.0  = each story exactly fills the space between its neighbors' centers (default).
        // <1.0 = text completes sooner and holds off-screen longer (feels faster).
        // >1.0 = slower, windows slightly overlap the neighbor's text (max ~1.2).
        const STORY_SPAN = 1.0;

        // Cached per-island beat windows { islandIndex: { mid, half } } — mid = dock-center progress.
        let _storyWindows = null;
        let _storyPhasesRef = null;
        function getStoryWindows(phases) {
            if (_storyPhasesRef === phases && _storyWindows) return _storyWindows;
            const docks = phases
                .filter(p => p.type === 'dock')
                .map(p => ({ i: p.islandIndex, mid: (p.startProgress + p.endProgress) / 2 }))
                .sort((a, b) => a.i - b.i);
            const wins = {};
            for (let k = 0; k < docks.length; k++) {
                const prevMid = k > 0 ? docks[k - 1].mid : null;
                const nextMid = k < docks.length - 1 ? docks[k + 1].mid : null;
                // Half-window = distance to nearest neighbor center (falls back to the other side)
                const half = nextMid != null ? (nextMid - docks[k].mid) / 2
                    : prevMid != null ? (docks[k].mid - prevMid) / 2 : 0.05;
                wins[docks[k].i] = { mid: docks[k].mid, half };
            }
            _storyWindows = wins;
            _storyPhasesRef = phases;
            return wins;
        }

        function renderStoryProgress(progress) {
            const phases = window.timelinePhases;
            if (!phases) return;

            // --- Scrollytelling Credits-Film Animation for .timeline-extended-content ---
            // Center-anchored choreography: island N's story is EXACTLY at screen center at the
            // same scroll moment its island is centered. Text rises from below during approach,
            // crosses dead-center together with the island, exits above while sailing away.
            const vh = window.innerHeight;
            const extendedEls = document.querySelectorAll('.timeline-extended-content');
            const wins = getStoryWindows(phases);

            extendedEls.forEach((el) => {
                const card = el.closest('.timeline-card');
                if (!card) return;

                const cardIndex = tCards.indexOf(card);

                // Skip first island (index 0) and last island (index tCards.length - 1)
                if (cardIndex <= 0 || cardIndex >= tCards.length - 1) {
                    el.style.opacity = 0;
                    return;
                }

                const w = wins[cardIndex];
                if (!w || w.half <= 0) {
                    el.style.opacity = 0;
                    return;
                }

                const half = w.half * STORY_SPAN;
                const s = progress - w.mid;

                let storyProgress;
                if (s <= -half) {
                    // Island still approaching: Text waits below the screen
                    storyProgress = 0;
                } else if (s < half) {
                    // Rolling credits — linear, so scroll speed == text speed
                    storyProgress = (s + half) / (2 * half);
                } else {
                    // Island behind us: Text has rolled past the top
                    storyProgress = 1.0;
                }

                // Vertical offset: +vh (bottom) → 0 (center) → -vh (top)
                const yOffset = (1 - storyProgress * 2) * vh;

                // Apply transform (translate3d for GPU compositing)
                el.style.transform = `translate3d(0, ${yOffset}px, 0)`;

                // Fade in quickly as soon as animation starts, stay visible after
                el.style.opacity = storyProgress > 0.01 ? 1 : 0;
            });
        }

        // 5. Setup ScrollTrigger and Physics Loop
        let targetTimelineProgress = 0;
        // Render-side smoothing for the story text only. Tight factor = silky momentum while
        // scrolling fast, yet converges EXACTLY to the target at rest (center-meeting precision).
        let storySmoothProgress = 0;

        let aboutScrollTrigger = null;
        if (tCards.length > 0) {
            // End distance = total pixel journey × scale factor.
            // SCALE_FACTOR=1 means scroll pixels ≈ path pixels, keeping it tight.
            const SCALE_FACTOR = 2.0; // Enough extra scroll so camera lingers after last island
            const getEndDistance = () => {
                const tw = window.timelineTotalScrollWeight || 3000;
                return Math.round(tw * SCALE_FACTOR);
            };
            aboutScrollTrigger = ScrollTrigger.create({
                trigger: ".about-section",
                pin: true,
                anticipatePin: 1, // Pre-positions the pin so it never jumps on arrival
                end: () => `+=${getEndDistance()}`,
                scrub: true,
                invalidateOnRefresh: true,
                refreshPriority: 10, // Must refresh BEFORE projects horizontal scroll (priority 1)
                onUpdate: (self) => {
                    const phases = window.timelinePhases;
                    if (phases && phases.length > 0) {
                        const firstDock = phases.find(p => p.type === 'dock' && p.islandIndex === 0);
                        if (firstDock) {
                            const startOffset = firstDock.endProgress;
                            // Map ScrollTrigger progress to start directly from the first island's dock exit
                            targetTimelineProgress = startOffset + (self.progress * (1 - startOffset));
                            return;
                        }
                    }
                    targetTimelineProgress = self.progress;
                }
            });
        }

        // Physics Loop for Constant Speed & Cinematic Camera
        let currentCameraY = 0;
        let targetCameraY = 0;

        function physicsTick(currentTime) {
            let needsRender = false;
            // 1. Update Ship Position (Absolute Scroll Power)
            if (Math.abs(targetTimelineProgress - timelineCurrentProgress) > 0.00001) {
                // Lerp factor 1.0 makes it exactly mirror the native scroll instantly, giving absolute power to the user's scroll
                timelineCurrentProgress += (targetTimelineProgress - timelineCurrentProgress) * 1.0;
                needsRender = true;
            }

            // Update Storytelling Progress (smooth momentum, exact convergence at rest)
            if (Math.abs(targetTimelineProgress - storySmoothProgress) > 0.00001) {
                storySmoothProgress += (targetTimelineProgress - storySmoothProgress) * 0.18;
                renderStoryProgress(storySmoothProgress);
                needsRender = true;
            }

            if (needsRender) {
                renderTimelineProgress(timelineCurrentProgress);
            }

            // 2. Update Continuous Cinematic Camera
            let timelineEl = document.querySelector('.timeline');
            let dot = window.timelineDotPoint;

            if (timelineEl && dot && window.innerWidth >= 900) {
                const topMargin = window.innerHeight * 0.50; // 50% from top (Dead center)

                // DECOUPLED CAMERA: 
                // Track overall vertical scroll progression instead of dot.y.
                // This completely eliminates "camera stop" effects when the dot travels horizontally.
                const anchors = window.timelineAnchors;
                const startY = anchors[0].enter.y;
                const endY = anchors[anchors.length - 1].exit.y;
                const totalPhysicalY = endY - startY;

                targetCameraY = startY + (timelineCurrentProgress * totalPhysicalY) - topMargin;

                // Set lerp factor to 1.0 (instant) so the camera perfectly mirrors the scroll speed
                currentCameraY += (targetCameraY - currentCameraY) * 1.0;

                // Apply Transform
                timelineEl.style.transform = `translateY(${-currentCameraY}px)`;
            } else if (timelineEl && window.innerWidth < 900) {
                timelineEl.style.transform = 'none'; // Reset on mobile
            }

            requestAnimationFrame(physicsTick);
        }
        requestAnimationFrame(physicsTick);

        // Initial path computation on load & dynamic observation
        updateTimelinePath();
        renderTimelineProgress(timelineCurrentProgress);
        renderStoryProgress(timelineCurrentProgress);

        window.addEventListener('resize', () => {
            updateTimelinePath();
            renderTimelineProgress(timelineCurrentProgress);
            storySmoothProgress = timelineCurrentProgress;
            renderStoryProgress(storySmoothProgress);
        });
        window.addEventListener('load', () => {
            updateTimelinePath();
            renderTimelineProgress(timelineCurrentProgress);
            storySmoothProgress = timelineCurrentProgress;
            renderStoryProgress(storySmoothProgress);
            ScrollTrigger.refresh();
        });
        ScrollTrigger.addEventListener('refresh', () => {
            updateTimelinePath();
            renderTimelineProgress(timelineCurrentProgress);
            storySmoothProgress = timelineCurrentProgress;
            renderStoryProgress(storySmoothProgress);
        });

        if (window.ResizeObserver && timeline) {
            const ro = new ResizeObserver(() => updateTimelinePath());
            ro.observe(timeline);
            tCards.forEach(c => ro.observe(c));
        }

        document.querySelectorAll('.timeline img').forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => {
                    updateTimelinePath();
                    ScrollTrigger.refresh();
                });
            }
        });

        tCards.forEach((card) => {
            gsap.fromTo(card,
                { opacity: 0, y: 10 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // 6. Transform text effect
        const transformSections = document.querySelectorAll('section');
        transformSections.forEach(section => {
            const lines = section.querySelectorAll('.transform-line');
            if (lines.length > 0) {
                const isLightBg = section.classList.contains('projects-section');
                const targetColor = isLightBg ? "#000000" : "var(--text-primary)";

                lines.forEach((line, i) => {
                    gsap.to(line, {
                        opacity: 1,
                        color: targetColor,
                        scrollTrigger: {
                            trigger: section,
                            start: `top+=${i * 5}% center`,
                            end: `top+=${(i + 1) * 5}% center`,
                            scrub: true
                        }
                    });
                });
            }
        });

        // 6) Project Section Horizontal Scroll
        const projectsSection = document.getElementById('projects');
        const workTrack = document.getElementById('work-track');
        const firstCard = document.getElementById('work-card-1');

        if (projectsSection && workTrack && firstCard) {
            const pinWrapper = projectsSection.parentElement;

            const introTexts = projectsSection.querySelectorAll('.projects-intro-text');
            const panel1 = projectsSection.querySelector('.panel-1');
            const panel2 = projectsSection.querySelector('.panel-2');
            const panel3 = projectsSection.querySelector('.panel-3');
            gsap.set(workTrack, { x: "100vw" }); // Initial position outside the right screen

            const getScrollAmount = () => {
                if (!workTrack) return 0;
                const lastCard = workTrack.lastElementChild;
                if (!lastCard) return 0;
                const lastCardCenter = lastCard.offsetLeft + (lastCard.offsetWidth / 2);
                return lastCardCenter - (window.innerWidth / 2);
            };

            const getPinDuration = () => {
                // Zoom phase + Panel collapse + Slide in phase + Horizontal scroll phase
                return window.innerHeight * 2.0 + window.innerWidth + Math.abs(getScrollAmount());
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: projectsSection,
                    start: 'top top',
                    end: () => `+=${Math.round(getPinDuration())}`,
                    pin: true,
                    scrub: true,
                    invalidateOnRefresh: true,
                    refreshPriority: -1
                }
            });

            // 1. Shrink text without fading out
            if (introTexts.length) {
                tl.to(introTexts, {
                    scale: 0.3,
                    ease: "power2.inOut",
                    duration: window.innerHeight * 1.0
                });
            }

            // 2. Collapse panels to the left
            if (panel1 && panel2 && panel3) {
                tl.add("collapsePanels");

                // Text fades out rapidly as the panels close
                tl.to(introTexts, {
                    opacity: 0,
                    duration: window.innerHeight * 0.3,
                    ease: "power1.in"
                }, "collapsePanels");

                // Panel 3 closes
                tl.to(panel3, {
                    clipPath: 'polygon(80% 0%, 80% 0%, 80% 100%, 80% 100%)',
                    duration: window.innerHeight * 0.5,
                    ease: "power2.inOut"
                }, "collapsePanels");

                // Panel 2 closes
                tl.to(panel2, {
                    clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
                    duration: window.innerHeight * 0.5,
                    ease: "power2.inOut"
                }, "collapsePanels+=0.15");

                // Panel 1 closes
                tl.to(panel1, {
                    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                    duration: window.innerHeight * 0.5,
                    ease: "power2.inOut"
                }, "collapsePanels+=0.3");
            }

            // 2. Slide work-track in from the right
            tl.to(workTrack, {
                x: 0,
                ease: "power1.out",
                duration: window.innerWidth
            }, "-=" + (window.innerHeight * 0.15));

            // 3. Horizontal scroll through the cards
            tl.to(workTrack, {
                x: () => -getScrollAmount(),
                ease: 'none',
                duration: () => Math.abs(getScrollAmount())
            });
        }

        // --- Universal Scroll Reveal Effect (Bottom to Top) ---
        // Select all components and texts that we want to reveal across the page (including titles and subtitles)
        // Exclude the projects section because it has its own horizontal scroll pin logic which conflicts with vertical reveal animations
        const animatableElements = gsap.utils.toArray('.overview-h2, .overview-desc, .service-card-title, .tech-grid, .cert-grid, .gallery-carousel, section:not(.projects-section) .section-h2, section:not(.projects-section) .section-intro, .contact-card');

        if (animatableElements.length > 0) {
            // Initial state: shifted down and invisible
            gsap.set(animatableElements, { y: 100, opacity: 0 });

            // We use ScrollTrigger.batch to group elements that enter the viewport at the same time
            // This ensures they stagger beautifully without animating too early!
            ScrollTrigger.batch(animatableElements, {
                start: "top 85%", // Triggers when the TOP of each specific element hits 85% of the viewport height
                onEnter: (batch) => {
                    gsap.to(batch, {
                        y: 0,
                        opacity: 1,
                        duration: 1.0,
                        stagger: 0.15, // Stagger elements in the same batch
                        ease: "expo.out",
                        overwrite: "auto",
                        clearProps: "transform"
                    });
                },
                onLeaveBack: (batch) => {
                    gsap.to(batch, {
                        y: 50,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.in",
                        overwrite: "auto"
                    });
                }
            });
        }

        ScrollTrigger.refresh();
    }

    // Initialize everything now that Lenis is loaded locally
    initializeAllWithLenis();

    // --- Certificate Modal Logic ---
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalClose = document.querySelector('.cert-modal-close');
    const certModalOverlay = document.querySelector('.cert-modal-overlay');

    if (certModal && certModalImg && certModalClose && certModalOverlay) {
        document.querySelectorAll('.cert-card-vertical').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();

                const img = card.querySelector('.cert-pdf-preview');

                if (img) {
                    certModalImg.src = img.src;
                    certModal.classList.add('is-open');
                    if (window.lenis && typeof window.lenis.stop === 'function') {
                        window.lenis.stop(); // Prevent background scrolling
                    } else {
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        });

        const closeModal = () => {
            certModal.classList.remove('is-open');
            if (window.lenis && typeof window.lenis.start === 'function') {
                window.lenis.start();
            } else {
                document.body.style.overflow = '';
            }
        };

        certModalClose.addEventListener('click', closeModal);
        certModalOverlay.addEventListener('click', closeModal);
    }

    // --- Project Detail Modal Logic ---
    const PROJECTS_DATA = [
        {
            id: 'work-card-1',
            tag: 'Biostratigraphy',
            title: 'Biostratigraphy & Microfossil Analysis',
            img: 'assets/images/Background%20Project/Biostragraphy%20Analysis%20New.jpg',
            desc: 'Identified rock age zoning in Central Sumatra Basin wells using planktonic foraminifera (Blow, 1969) and nannoplankton (Martini, 1971) zonations. Prepared microfossil samples from core data and interpreted sedimentary environments based on fossil assemblages to support subsurface stratigraphic interpretation.',
            tools: ['Micropaleontology', 'Sample Preparation', 'Age Zonation', 'Core Description']
        },
        {
            id: 'work-card-2',
            tag: 'Sequence Stratigraphy',
            title: 'Sequence Stratigraphy Analysis',
            img: 'assets/images/Background%20Project/Sequence%20Stratigraphy%20Analysis%20New.jpg',
            desc: 'Executed stratigraphic sequence analysis using the transgressive–regressive method (Embry, 1993) and correlated stratigraphic sequences across wells in the study area to define depositional sequences and systems tracts.',
            tools: ['T-R Method (Embry, 1993)', 'Well Correlation', 'Systems Tracts', 'Depositional Sequences']
        },
        {
            id: 'work-card-3',
            tag: 'Petrophysics',
            title: 'Well Log & Electrofacies Analysis',
            img: 'assets/images/Background%20Project/Electrofacies%20Analysis%20New.jpg',
            desc: 'Analyzed well log data focusing on porosity, water saturation, and permeability parameters to identify potential hydrocarbon-bearing zones. Interpreted electrofacies patterns and performed core description and section measurements to support reservoir quality evaluation.',
            tools: ['Well Log Analysis', 'Electrofacies', 'Porosity & Saturation', 'Reservoir Evaluation']
        },
        {
            id: 'work-card-4',
            tag: 'Paleogeography',
            title: 'Central Sumatra Basin Paleogeographic Reconstruction',
            img: 'assets/images/Background%20Project/Paleogeography.png',
            desc: 'Reconstructed the paleogeography and depositional history of the Central Sumatra Basin based on integrated fossil, facies, and well log data — interpreting basin evolution to support exploration studies.',
            tools: ['Paleogeographic Mapping', 'Basin Analysis', 'Data Integration']
        },
        {
            id: 'work-card-5',
            tag: 'GIS & Mapping',
            title: 'Geological Mapping & 3D Terrain Modeling',
            img: 'assets/images/Background%20Project/Geological%20Mapping.png',
            desc: 'Developed thematic geological maps (lithology, geomorphology, structural geology) from digitizing and georeferencing field datasets. Performed DEM-based terrain analysis (slope, aspect, hillshade) and generated 3D terrain visualizations for geological interpretation.',
            tools: ['ArcGIS', 'QGIS', 'Global Mapper', 'DEM Analysis']
        },
        {
            id: 'work-card-6',
            tag: 'Mine Planning',
            title: 'Coal Mine Planning & Resource Estimation',
            img: 'assets/images/Background%20Project/Coal%20Mine%20Planning%20%26%20Resource%20Estimation.png',
            desc: 'Built digital terrain models and coal seam models from drilling data. Estimated coal resources (Measured, Indicated, Inferred), analyzed stripping ratios, and designed pit layouts with ultimate pit optimization, waste disposal areas, and haul road systems.',
            tools: ['Minescape', 'Resource Estimation', 'Stripping Ratio', 'Pit Optimization']
        },
        {
            id: 'work-card-7',
            tag: 'Mine Scheduling',
            title: 'Mine Scheduling & Production Optimization',
            img: 'assets/images/Background%20Project/Mine%20Schedulling.png',
            desc: 'Generated block and volume data for Ultimate Pit and waste disposal integration into scheduling workflows. Developed production calendars and mining sequences across multiple scenarios, complete with mining animation visualizations for operational planning.',
            tools: ['Spry', 'Production Scheduling', 'Scenario Planning', 'Mining Animation']
        }
    ];

    const projectModal = document.getElementById('project-modal');

    if (projectModal) {
        const pmImg = document.getElementById('project-modal-img');
        const pmTag = document.getElementById('project-modal-tag');
        const pmTitle = document.getElementById('project-modal-title');
        const pmDesc = document.getElementById('project-modal-desc');
        const pmTools = document.getElementById('project-modal-tools');
        const pmClose = projectModal.querySelector('.project-modal-close');
        const pmOverlay = projectModal.querySelector('.project-modal-overlay');
        const pmCta = projectModal.querySelector('.project-modal-cta');

        const lockScroll = () => {
            if (window.lenis && typeof window.lenis.stop === 'function') {
                window.lenis.stop();
            } else {
                document.body.style.overflow = 'hidden';
            }
        };

        const unlockScroll = () => {
            // Only resume scrolling if the certificate modal is not open on top
            if (certModal && certModal.classList.contains('is-open')) return;
            if (window.lenis && typeof window.lenis.start === 'function') {
                window.lenis.start();
            } else {
                document.body.style.overflow = '';
            }
        };

        const openProjectModal = (data) => {
            if (!data) return;
            pmImg.src = data.img;
            pmImg.alt = data.title;
            pmTag.textContent = data.tag;
            pmTitle.textContent = data.title;
            pmDesc.textContent = data.desc;
            pmTools.innerHTML = '';
            data.tools.forEach(tool => {
                const chip = document.createElement('span');
                chip.textContent = tool;
                pmTools.appendChild(chip);
            });
            projectModal.classList.add('is-open');
            projectModal.setAttribute('aria-hidden', 'false');
            lockScroll();
        };

        const closeProjectModal = () => {
            projectModal.classList.remove('is-open');
            projectModal.setAttribute('aria-hidden', 'true');
            unlockScroll();
        };

        document.querySelectorAll('.work-card').forEach(card => {
            card.addEventListener('click', () => {
                openProjectModal(PROJECTS_DATA.find(p => p.id === card.id));
            });
        });

        pmClose.addEventListener('click', closeProjectModal);
        pmOverlay.addEventListener('click', closeProjectModal);

        if (pmCta) {
            pmCta.addEventListener('click', () => closeProjectModal());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (projectModal.classList.contains('is-open')) {
                closeProjectModal();
            } else if (certModal && certModal.classList.contains('is-open')) {
                certModal.classList.remove('is-open');
                if (window.lenis && typeof window.lenis.start === 'function') {
                    window.lenis.start();
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Smooth Scroll Handlers
    document.querySelectorAll('.hero-link-scroll').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = link.getAttribute('href');
            if (!targetSelector) return;
            const target = document.querySelector(targetSelector);
            // Transition is now handled by the global GSAP overlay script
            // if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            //     window.lenis.scrollTo(target, { duration: 1.0 });
            // } else {
            //     target.scrollIntoView({ behavior: 'smooth' });
            // }
        });
    });



};

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

// Mobile Menu Logic for Editorial Navbar
const mobileMenuBtn = document.querySelector('.nav-mobile-menu-btn');
const mobileMenuCloseBtn = document.querySelector('.mobile-menu-close');
const mobileMenuOverlay = document.querySelector('.hero-mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');

if (mobileMenuBtn && mobileMenuCloseBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    mobileMenuCloseBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}


// Mega Menu Hover Logic
const navLinksMega = document.querySelectorAll('.hero-editorial-nav [data-mega]');
const megaMenuContainer = document.querySelector('.mega-menu-container');
const megaPanels = document.querySelectorAll('.mega-panel');
let megaMenuTimeout;
let isMegaMenuOpen = false;

function openMegaMenu(targetId) {
    clearTimeout(megaMenuTimeout);

    const targetPanel = document.getElementById('mega-' + targetId);
    if (!targetPanel) return;

    // Remove active class from all nav items
    navLinksMega.forEach(link => link.classList.remove('mega-active'));

    // Add active class to current nav item
    const currentLink = document.querySelector(`.hero-editorial-nav [data-mega="${targetId}"]`);
    if (currentLink) currentLink.classList.add('mega-active');

    if (!isMegaMenuOpen) {
        isMegaMenuOpen = true;
        // Kill any residual tweens to be absolutely safe
        gsap.killTweensOf(megaPanels);
        gsap.killTweensOf(megaMenuContainer);

        // Instantly hide all panels first
        gsap.set(megaPanels, { autoAlpha: 0 });
        megaPanels.forEach(p => p.classList.remove('active'));

        targetPanel.classList.add('active');

        gsap.to(megaMenuContainer, {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(targetPanel, { autoAlpha: 1, duration: 0.3 });
    } else {
        if (!targetPanel.classList.contains('active')) {
            // Kill any ongoing animations to prevent race conditions during fast hovers
            gsap.killTweensOf(megaPanels);

            megaPanels.forEach(p => {
                if (p !== targetPanel) {
                    p.classList.remove('active');
                    // Fade out all other panels
                    gsap.to(p, { autoAlpha: 0, duration: 0.15 });
                }
            });

            targetPanel.classList.add('active');
            // Delay the fade-in of the new panel until the others have faded out
            gsap.to(targetPanel, { autoAlpha: 1, duration: 0.15, delay: 0.15 });
        }
    }
}

function closeMegaMenu() {
    megaMenuTimeout = setTimeout(() => {
        isMegaMenuOpen = false;

        // Remove active class from all nav items
        navLinksMega.forEach(link => link.classList.remove('mega-active'));

        gsap.killTweensOf(megaPanels);
        gsap.killTweensOf(megaMenuContainer);

        gsap.to(megaMenuContainer, {
            autoAlpha: 0,
            y: -10,
            duration: 0.2,
            ease: "power2.in"
        });
        gsap.to(megaPanels, { autoAlpha: 0, duration: 0.2 });
        megaPanels.forEach(p => p.classList.remove('active'));
    }, 200);
}

navLinksMega.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
        const target = e.currentTarget.getAttribute('data-mega');
        if (target) {
            openMegaMenu(target);
        } else {
            closeMegaMenu();
        }
    });
    link.addEventListener('mouseleave', closeMegaMenu);
});

if (megaMenuContainer) {
    megaMenuContainer.addEventListener('mouseenter', () => {
        clearTimeout(megaMenuTimeout);
    });
    megaMenuContainer.addEventListener('mouseleave', closeMegaMenu);
}







// --- Smart Sticky Navbar Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.hero-editorial-nav');
    if (!navbar) return;

    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : 1000;

        // Handle Color & Logo Swap Effect (Only past the Hero section)
        if (scrollTop >= heroHeight - 80) { // 80px offset for smoother transition
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }

        // Handle Hide/Show Smart Scroll (Active anytime after 50px)
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up or at the top
            navbar.classList.remove('nav-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, { passive: true });
});
