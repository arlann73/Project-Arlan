// import * as THREE from 'three';


function copyEmail() {
    navigator.clipboard.writeText('').then(() => {
        const btn = document.querySelector('.sidebar-email-copy');
        btn.style.color = '#FFFF23';
        setTimeout(() => { btn.style.color = ''; }, 1500);
    });
}

function toggleFaq(id) {
    const item = document.getElementById(id);
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('is-open'));
    if (!isOpen) item.classList.add('is-open');
}

function initCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    if (!items.length) return;

    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = Math.floor(items.length / 2);

    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');

            // Calculate circular distance
            const diff = (index - currentIndex + items.length) % items.length;

            if (diff === 0) {
                item.classList.add('active');
            } else if (diff === 1) {
                item.classList.add('next');
            } else if (diff === 2) {
                item.classList.add('next-2');
            } else if (diff === items.length - 1) {
                item.classList.add('prev');
            } else if (diff === items.length - 2) {
                item.classList.add('prev-2');
            }
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });


    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    updateCarousel();
}

document.addEventListener("DOMContentLoaded", (event) => {
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
        // Removed scrollTrigger to ensure hero intro plays reliably once on load without resetting
    });

    // Nav items simple fade in
    heroTl.from(".hero-editorial-nav .nav-left, .nav-center .hero-nav-item, .hero-editorial-nav .nav-right", {
        opacity: 0,
        duration: 0.6,
        ease: "power1.out",
        delay: 0.1,
        clearProps: "all"
    })
        // Main logo scale and fade
        .from(".hero-anim-logo", {
            scale: 0.8,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        }, "-=0.3") // overlap with navbar
        // Elegant Subtitle Fade & Slide Up
        .from(".hero-anim-text", {
            y: 25,
            opacity: 0,
            scale: 0.95,
            duration: 2.0,
            ease: "power3.out"
        }, "-=1.0");

    // Ensure Lenis is available before using it.
    function initializeAllWithLenis() {
        // Create Lenis instance with optimized parameters for ultra-smooth scrolling
        window.lenis = new Lenis({
            lerp: 0.04, // Lower value = smoother, more premium deceleration (was 0.08)
            wheelMultiplier: 1.2, // Slightly faster wheel response so it feels lighter
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 1.5,
            infinite: false
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

        // 2. Sidebar visibility & per-card color inversion – scroll event
        const sidebarEl = document.getElementById('sidebar');
        const heroSection = document.getElementById('hero');

        if (sidebarEl && heroSection) {
            const projectSection = document.getElementById('projects');
            const sidebarCards = document.querySelectorAll('.sidebar-card');

            function updateSidebarVisibility() {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                if (heroBottom > 0) {
                    sidebarEl.classList.add('sidebar--hidden');
                } else {
                    sidebarEl.classList.remove('sidebar--hidden');
                }

                // Individually invert sidebar cards when they cross into the projects section
                if (projectSection) {
                    const projRect = projectSection.getBoundingClientRect();
                    sidebarCards.forEach(card => {
                        const cardRect = card.getBoundingClientRect();
                        const cardCenter = cardRect.top + (cardRect.height / 2);
                        if (cardCenter >= projRect.top && cardCenter <= projRect.bottom) {
                            card.classList.add('is-inverted');
                        } else {
                            card.classList.remove('is-inverted');
                        }
                    });
                }
            }
            updateSidebarVisibility();
            window.addEventListener('scroll', updateSidebarVisibility);
        }

        // 3. Hero nav link visibility (single centered bar)
        const heroNav = document.getElementById('hero-nav');

        // Load animation config (if present) and provide helper
        var _animCfg = { heroNav: { xLeft: -100, xRight: 100, duration: 0.5 }, curve: { scrub: 1 }, transform: { scrub: true }, swiper: { slidesPerView: 'auto', spaceBetween: 30, grabCursor: true, paginationClickable: true } };
        function getAnim(path, fallback) {
            try {
                var parts = path.split('.');
                var v = _animCfg;
                for (var i = 0; i < parts.length; i++) { v = v[parts[i]]; if (v === undefined) return fallback; }
                return v;
            } catch (e) { return fallback; }
        }
        // Disabled animations.json fetch to prevent 404
        ScrollTrigger.create({
            trigger: "#about",
            start: "top top",
            onEnter: () => {
                if (heroNav) gsap.to(heroNav, { y: getAnim('heroNav.hideY', -30), opacity: 0, duration: getAnim('heroNav.duration', 0.5) });
            },
            onLeaveBack: () => {
                if (heroNav) gsap.to(heroNav, { y: 0, opacity: 1, duration: getAnim('heroNav.duration', 0.5) });
            }
        });
        // 4. Active nav state
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.sidebar-nav-item');

        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveNav(section.id),
                onEnterBack: () => setActiveNav(section.id),
            });
        });

        function setActiveNav(id) {
            navItems.forEach(item => {
                item.classList.remove('is-active');
                if (item.dataset.section === id) item.classList.add('is-active');
            });
            // keep hero links in sync
            document.querySelectorAll('.hero-nav-link').forEach(link => {
                link.classList.remove('is-active');
                const ds = link.dataset.section;
                const hrefId = (link.getAttribute('href') || '').replace('#', '');
                if (ds === id || hrefId === id) link.classList.add('is-active');
            });
        }

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                // if (targetSection && typeof lenis.scrollTo === 'function') lenis.scrollTo(targetSection);
            });
        });

        document.querySelectorAll('.hero-nav-link').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (!targetSection) return;

                // if (typeof lenis.scrollTo === 'function') lenis.scrollTo(targetSection);

                try {
                    setActiveNav(targetSection.id);
                } catch (err) {
                    const sidebarMatch = document.querySelector('.sidebar-nav-item[data-section="' + targetSection.id + '"]') || document.querySelector('.sidebar-nav-item[href="' + targetId + '"]');
                    if (sidebarMatch && typeof navItems !== 'undefined') {
                        navItems.forEach(i => i.classList.remove('is-active'));
                        sidebarMatch.classList.add('is-active');
                    }
                }
            });
        });

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
            if (!timeline || !svg || !curveBase || tCards.length === 0) return;
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
            const ISLAND_EDGE_PROFILES = [
                { enter: { x: 0.50, y: 0.04, dirX: 1, dirY: 1 }, exit: { x: 0.50, y: 0.96, dirX: -1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.50, y: 0.05, dirX: -1, dirY: 1 }, exit: { x: 0.50, y: 0.96, dirX: 1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.49, y: 0.07, dirX: 1, dirY: 1 }, exit: { x: 0.49, y: 0.95, dirX: -1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.50, y: 0.07, dirX: -1, dirY: 1 }, exit: { x: 0.50, y: 0.93, dirX: 1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.52, y: 0.16, dirX: 1, dirY: 1 }, exit: { x: 0.52, y: 0.92, dirX: -1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.50, y: 0.17, dirX: -1, dirY: 1 }, exit: { x: 0.50, y: 0.85, dirX: 1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.50, y: 0.20, dirX: 1, dirY: 1 }, exit: { x: 0.50, y: 0.79, dirX: -1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.50, y: 0.06, dirX: -1, dirY: 1 }, exit: { x: 0.50, y: 0.94, dirX: 1, dirY: 1 }, curvatureFactor: 0.35 },
                { enter: { x: 0.50, y: 0.04, dirX: 1, dirY: 1 }, exit: { x: 0.50, y: 0.96, dirX: 0, dirY: 1 }, curvatureFactor: 0.35 }
            ];

            const normalizeVector = (dx, dy) => {
                const len = Math.hypot(dx, dy) || 1;
                return { x: dx / len, y: dy / len };
            };
            
            svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);

            const anchors = cardData.map((c, i) => {
                const p = ISLAND_EDGE_PROFILES[i] || ISLAND_EDGE_PROFILES[0];
                return {
                    enter: {
                        x: c.ix + c.iw * p.enter.x,
                        y: c.iy + c.ih * p.enter.y,
                        dir: normalizeVector(p.enter.dirX, p.enter.dirY)
                    },
                    exit: {
                        x: c.ix + c.iw * p.exit.x,
                        y: c.iy + c.ih * p.exit.y,
                        dir: normalizeVector(p.exit.dirX, p.exit.dirY)
                    },
                    curvatureFactor: p.curvatureFactor || 0.35,
                    cardHeight: c.ih,
                    cardCenterY: c.iy + c.ih / 2
                };
            });

            // Clean up existing debug markers
            document.querySelectorAll('.debug-anchor').forEach(e => e.remove());

            const ns = "http://www.w3.org/2000/svg";

            if (DEBUG_TIMELINE_ANCHORS) {
                anchors.forEach((a, i) => {
                    const enterDot = document.createElementNS(ns, 'circle');
                    enterDot.setAttribute('class', 'debug-anchor');
                    enterDot.setAttribute('cx', a.enter.x);
                    enterDot.setAttribute('cy', a.enter.y);
                    enterDot.setAttribute('r', '8');
                    enterDot.setAttribute('fill', 'red');
                    enterDot.setAttribute('stroke', '#fff');
                    enterDot.setAttribute('stroke-width', '2');
                    
                    const titleE = document.createElementNS(ns, 'title');
                    titleE.textContent = `Island ${i+1} ENTER`;
                    enterDot.appendChild(titleE);
                    svg.appendChild(enterDot); // Append directly to the main SVG since it's on top now

                    if (i < anchors.length - 1) {
                        const exitDot = document.createElementNS(ns, 'circle');
                        exitDot.setAttribute('class', 'debug-anchor');
                        exitDot.setAttribute('cx', a.exit.x);
                        exitDot.setAttribute('cy', a.exit.y);
                        exitDot.setAttribute('r', '8');
                        exitDot.setAttribute('fill', 'blue');
                        exitDot.setAttribute('stroke', '#fff');
                        exitDot.setAttribute('stroke-width', '2');
                        
                        const titleX = document.createElementNS(ns, 'title');
                        titleX.textContent = `Island ${i+1} EXIT`;
                        exitDot.appendChild(titleX);
                        svg.appendChild(exitDot);
                    }
                });
            }

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

            // Segment 0: Intro
            const firstEnter = anchors[0].enter;
            const introStartY = Math.max(0, firstEnter.y - 110);
            const introDist = firstEnter.y - introStartY;
            const introCP2 = { x: firstEnter.x - firstEnter.dir.x * (introDist * 0.4), y: firstEnter.y - firstEnter.dir.y * (introDist * 0.4) };
            const introCP1 = { x: firstEnter.x, y: introStartY + introDist * 0.2 };
            addSegment(`M ${(firstEnter.x - 18).toFixed(1)} ${introStartY.toFixed(1)} C ${introCP1.x.toFixed(1)} ${introCP1.y.toFixed(1)}, ${introCP2.x.toFixed(1)} ${introCP2.y.toFixed(1)}, ${firstEnter.x.toFixed(1)} ${firstEnter.y.toFixed(1)}`);

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
            const outroDist = 80;
            const outroP3 = { x: lastExit.x + lastExit.dir.x * outroDist, y: lastExit.y + lastExit.dir.y * outroDist };
            addSegment(`M ${lastExit.x.toFixed(1)} ${lastExit.y.toFixed(1)} Q ${lastExit.x.toFixed(1)} ${(lastExit.y + outroP3.y)/2}, ${outroP3.x.toFixed(1)} ${outroP3.y.toFixed(1)}`);

            const fullPathD = combinedPathStrings.join(" ");
            curveBase.setAttribute('d', fullPathD);
            
            // 4. Build the Phase State Machine
            const phases = [];
            let currentScrollWeight = 0;
            let cumulativePathLength = 0; // Not strictly needed for logic now, but kept for reference

            const pushPhase = (type, scrollWeight, dockPoint, segIndex) => {
                phases.push({
                    type,
                    startWeight: currentScrollWeight,
                    endWeight: currentScrollWeight + scrollWeight,
                    baseLength: cumulativePathLength, 
                    dockPoint,
                    segIndex
                });
                currentScrollWeight += scrollWeight;
            };

            // Phase 0: Intro
            pushPhase('travel', 200, null, 0);
            cumulativePathLength += segmentLengths[0];

            for (let i = 0; i < anchors.length; i++) {
                if (i > 0) {
                    const dockWeight = Math.max(anchors[i].cardHeight, 250);
                    pushPhase('dock', dockWeight, anchors[i].enter, -1);
                }

                if (i < anchors.length - 1) {
                    const nextAnchor = anchors[i + 1];
                    const currAnchor = anchors[i];
                    const travelWeight = Math.max(nextAnchor.cardCenterY - currAnchor.cardCenterY - 250, 300);
                    pushPhase('travel', travelWeight, null, i + 1);
                    cumulativePathLength += segmentLengths[i + 1];
                } else {
                    pushPhase('travel', 300, null, i + 1); // Outro
                    cumulativePathLength += segmentLengths[i + 1];
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

        } // <-- CLOSE updateTimelinePath()

        // 5. Setup ScrollTrigger
        if (tCards.length > 0) {
            const firstCard = tCards[0];
            const lastCard = tCards[tCards.length - 1];

            ScrollTrigger.create({
                trigger: firstCard,
                endTrigger: lastCard,
                start: "top 65%",
                end: "bottom 35%",
                scrub: 0.8,
                onUpdate: (self) => {
                    timelineCurrentProgress = self.progress;
                    
                    const phases = window.timelinePhases;
                    const pathElements = window.timelineActivePathElements;
                    const lengths = window.timelineSegmentLengths;
                    let signalDot = document.getElementById('timeline-signal');

                    if (!phases || !pathElements) return;

                    let activePhase = phases[phases.length - 1];
                    for (let p of phases) {
                        if (self.progress >= p.startProgress && self.progress <= p.endProgress) {
                            activePhase = p;
                            break;
                        }
                    }

                    let dotPoint = null;
                    const activeSegIndex = activePhase.segIndex;

                    // Update ALL segments independently
                    pathElements.forEach((pathEl, idx) => {
                        const len = lengths[idx];
                        if (idx < activeSegIndex) {
                            // Fully drawn (before active phase)
                            pathEl.style.strokeDashoffset = 0;
                        } else if (idx > activeSegIndex) {
                            // Fully hidden (after active phase)
                            pathEl.style.strokeDashoffset = len;
                        } else {
                            // This is the active segment!
                            if (activePhase.type === 'dock') {
                                pathEl.style.strokeDashoffset = len; // The segment is hidden while docking
                            } else {
                                const phaseRange = activePhase.endProgress - activePhase.startProgress;
                                const localProgress = phaseRange > 0 ? (self.progress - activePhase.startProgress) / phaseRange : 1;
                                const localLength = len * localProgress;
                                pathEl.style.strokeDashoffset = len - localLength;
                                
                                // Exact sync directly from this path segment
                                dotPoint = pathEl.getPointAtLength(localLength);
                            }
                        }
                    });

                    // If docking, the dot point is the dock point
                    if (activePhase.type === 'dock') {
                        dotPoint = activePhase.dockPoint;
                    }

                    if (signalDot && dotPoint) {
                        if (self.progress > 0.005) {
                            signalDot.style.visibility = 'visible';
                            signalDot.setAttribute('transform', `translate(${dotPoint.x}, ${dotPoint.y})`);
                        } else {
                            signalDot.style.visibility = 'hidden';
                        }
                    }
                }
            });
        }

        // Initial path computation on load & dynamic observation
        updateTimelinePath();
        window.addEventListener('resize', updateTimelinePath);
        window.addEventListener('load', () => {
            updateTimelinePath();
            ScrollTrigger.refresh();
        });
        ScrollTrigger.addEventListener('refresh', updateTimelinePath);

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
                            scrub: getAnim('transform.scrub', true)
                        }
                    });
                });
            }
        });
        // 7. Swiper
        const swiper = new Swiper('.testimonials-swiper', {
            slidesPerView: getAnim('swiper.slidesPerView', 'auto'),
            spaceBetween: getAnim('swiper.spaceBetween', 30),
            grabCursor: getAnim('swiper.grabCursor', true),
            pagination: {
                el: '.testimonials-pagination',
                clickable: getAnim('swiper.paginationClickable', true),
            },
        });

        const swiperWrap = document.querySelector('.testimonials-swiper-wrap');
        const dragCursor = document.getElementById('drag-cursor');
        if (swiperWrap && dragCursor) {
            swiperWrap.addEventListener('mouseenter', () => {
                gsap.to(dragCursor, { opacity: 1, scale: 1, duration: 0.3 });
            });
            swiperWrap.addEventListener('mouseleave', () => {
                gsap.to(dragCursor, { opacity: 0, scale: 0.5, duration: 0.3 });
            });
            swiperWrap.addEventListener('mousemove', (e) => {
                gsap.to(dragCursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: "power2.out"
                });
            });
            swiperWrap.addEventListener('mousedown', () => {
                gsap.to(dragCursor, { scale: 0.8, duration: 0.2 });
            });
            swiperWrap.addEventListener('mouseup', () => {
                gsap.to(dragCursor, { scale: 1, duration: 0.2 });
            });
        }

        // 6) Project Section Horizontal Scroll
        const projectsSection = document.getElementById('projects');
        const workTrack = document.getElementById('work-track');
        const firstCard = document.getElementById('work-card-1');

        if (projectsSection && workTrack && firstCard) {
            const pinWrapper = projectsSection.parentElement;

            const getScrollAmount = () => {
                const lastCard = workTrack.lastElementChild;
                const lastCardRightEdge = lastCard.offsetLeft + lastCard.offsetWidth;
                const paddingRight = window.innerWidth * 0.1125;
                const offsetBuffer = 187.5;
                const totalTargetWidth = lastCardRightEdge + paddingRight + offsetBuffer;
                return totalTargetWidth - document.documentElement.clientWidth;
            };

            const horizontalTween = gsap.to(workTrack, {
                x: () => -getScrollAmount(),
                ease: 'none'
            });

            ScrollTrigger.create({
                trigger: workTrack,
                start: 'center center',
                end: () => `+=${Math.round(Math.abs(getScrollAmount()))}`,
                pin: true,
                scrub: true,
                animation: horizontalTween,
                invalidateOnRefresh: true,
                refreshPriority: 1,
                onEnterBack: () => setActiveNav('projects')
            });
        }

        ScrollTrigger.refresh();
        if (typeof integrateData === 'function') integrateData();
    }

    // Helper: integrate external JSON data (images, branding) into the page
    async function integrateData() {
        try {
            let images = [];
            let branding = null;

            // 1) Populate work cards backgrounds (projects section)
            if (images.length) {
                const workCards = document.querySelectorAll('.work-card');
                workCards.forEach((card, i) => {
                    const url = images[i % images.length];
                    const imgWrap = card.querySelector('.work-card-image');
                    if (imgWrap) imgWrap.style.backgroundImage = `url('${url}')`;
                });

                // 2) Sidebar partners marquee — replace text items with logo images
                const marquee = document.querySelector('.sidebar-marquee');
                if (marquee) {
                    const logoCandidates = images.filter(u => /transparent|logo|favicon|client|Client/i.test(u));
                    const use = logoCandidates.length ? logoCandidates.slice(0, 20) : images.slice(0, 20);
                    marquee.innerHTML = '';
                    use.forEach(src => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = 'partner';
                        img.className = 'sidebar-marquee-item sidebar-marquee-logo';
                        marquee.appendChild(img);
                    });
                }

                // 3) Testimonials avatars — replace avatars if placeholders exist
                const avatars = document.querySelectorAll('.testimonial-avatar');
                if (avatars.length) {
                    const testimonialImgs = images.filter(u => /testimonial|danette|marko|chrissy|bart/i.test(u));
                    avatars.forEach((av, idx) => {
                        const src = testimonialImgs[idx] || images[idx % images.length];
                        av.src = src;
                    });
                }
            }

            // 4) Apply branding colors to CSS variables
            if (branding && branding.colors) {
                const c = branding.colors;
                if (c.accent) document.documentElement.style.setProperty('--yellow', c.accent);
                if (c.textPrimary) document.documentElement.style.setProperty('--text-primary', c.textPrimary);
                if (c.primary) document.documentElement.style.setProperty('--card-bg', c.primary);
            }

            // 5) Update CTA and logo images if present in branding
            if (branding && branding.images) {
                if (branding.images.logo) {
                    const logoEls = document.querySelectorAll('.sidebar-logo-badge, .hero-logo, .site-logo');
                    logoEls.forEach(el => {
                        const img = el.querySelector('img');
                        if (img) img.src = branding.images.logo;
                        else {
                            const i = document.createElement('img');
                            i.src = branding.images.logo;
                            i.alt = branding.images.logoAlt || 'logo';
                            el.appendChild(i);
                        }
                    });
                }
            }

            console.log('Data integration complete');
        } catch (err) {
            console.error('Error integrating data:', err);
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



});

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
const navLinksMega = document.querySelectorAll('.nav-center .hero-nav-item');
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
    const currentLink = document.querySelector(`.nav-center .hero-nav-item[data-mega="${targetId}"]`);
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
        const target = e.target.getAttribute('data-mega');
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






