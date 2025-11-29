import React, { useEffect, useRef } from 'react';

const HolographicBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true }); // Optimized context
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let animationId;

        // Optimized Physics Configuration
        const CONFIG = {
            friction: 0.95,
            springFactor: 0.015,
            mouseRepulsion: 0.5,
            mouseRadius: 250,
            floatSpeed: 0.15
        };

        const dpr = window.devicePixelRatio || 1;

        // Mouse Physics State
        const mouse = {
            x: -1000,
            y: -1000,
            targetX: -1000,
            targetY: -1000,
        };

        // Palette Configuration - RGB strings
        const PALETTE = {
            light: {
                primary: '14, 165, 233',   // Sky-500
                secondary: '13, 148, 136', // Teal-600
                accent: '126, 34, 206'     // Purple-700
            },
            dark: {
                primary: '56, 189, 248',   // Sky-400
                secondary: '45, 212, 191', // Teal-400
                accent: '168, 85, 247'     // Purple-400
            }
        };

        // --- ENTITIES ---

        class DNAStrand {
            constructor() {
                this.x = 0; this.y = 0; this.z = 0;
                this.vx = 0; this.vy = 0;
                this.baseX = 0; this.baseY = 0;
                this.length = 0;
                this.angle = 0;
                this.spinSpeed = 0;
                this.phase = 0;
                this.colorType = 'primary';
                this.opacity = 0;
                this.init(true);
            }

            init(randomY = false) {
                this.z = Math.random() * 0.8 + 0.2;
                // Optimization: Reduced segment length for smoother draw calls
                this.length = 10 + Math.random() * 10;
                this.angle = (Math.random() - 0.5) * 0.5;
                this.spinSpeed = 0.005 + Math.random() * 0.015;
                this.phase = Math.random() * Math.PI * 2;
                this.opacity = 0.1 + Math.random() * 0.4;

                this.baseX = Math.random() * width;
                this.baseY = randomY ? Math.random() * height : height + 100;
                this.x = this.baseX;
                this.y = this.baseY;

                const r = Math.random();
                if (r > 0.6) this.colorType = 'primary';
                else if (r > 0.3) this.colorType = 'secondary';
                else this.colorType = 'accent';
            }

            update() {
                this.baseY -= CONFIG.floatSpeed * this.z;

                if (this.baseY < -200) {
                    this.init(false);
                    this.y = this.baseY;
                    this.x = this.baseX;
                }

                const dx = this.baseX - this.x;
                const dy = this.baseY - this.y;
                this.vx += dx * CONFIG.springFactor;
                this.vy += dy * CONFIG.springFactor;

                // Optimization: Box check before heavy hypot calculation
                const mdx = mouse.x - this.x;
                const mdy = mouse.y - this.y;

                if (Math.abs(mdx) < CONFIG.mouseRadius && Math.abs(mdy) < CONFIG.mouseRadius) {
                    const distSq = mdx * mdx + mdy * mdy;
                    const radiusSq = CONFIG.mouseRadius * CONFIG.mouseRadius;

                    if (distSq < radiusSq) {
                        const dist = Math.sqrt(distSq);
                        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                        const angle = Math.atan2(mdy, mdx);
                        const push = force * CONFIG.mouseRepulsion * 3;
                        this.vx -= Math.cos(angle) * push;
                        this.vy -= Math.sin(angle) * push;
                        this.phase += force * 0.05;
                    }
                }

                this.vx *= CONFIG.friction;
                this.vy *= CONFIG.friction;
                this.x += this.vx;
                this.y += this.vy;

                this.phase += this.spinSpeed;
            }

            draw(isDark) {
                if (!ctx) return;

                const palette = isDark ? PALETTE.dark : PALETTE.light;
                const color = palette[this.colorType];

                const scale = this.z;
                const helixWidth = 25 * scale;
                const spacing = 10 * scale;
                const radius = 1.5 * scale;

                const baseAlpha = isDark ? 0.6 : 0.8;

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                // Optimization: Batch path creation where possible
                for (let i = 0; i < this.length; i++) {
                    const yOffset = i * spacing;
                    const progress = this.phase + (i * 0.4);

                    const xOffset = Math.sin(progress) * helixWidth;
                    const zDepth = Math.cos(progress);

                    // Simpler opacity calc
                    const alpha = baseAlpha * this.opacity * (0.6 + (zDepth * 0.3));

                    ctx.beginPath();
                    ctx.moveTo(xOffset, yOffset);
                    ctx.lineTo(-xOffset, yOffset);
                    ctx.strokeStyle = `rgba(${color}, ${alpha * 0.5})`;
                    ctx.lineWidth = 1 * scale;
                    ctx.stroke();

                    ctx.fillStyle = `rgba(${color}, ${alpha})`;

                    ctx.beginPath();
                    ctx.arc(xOffset, yOffset, radius, 0, Math.PI * 2);
                    ctx.arc(-xOffset, yOffset, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        class MolecularNode {
            constructor() {
                this.x = 0; this.y = 0;
                this.vx = 0; this.vy = 0;
                this.baseX = Math.random() * width;
                this.baseY = Math.random() * height;
                this.x = this.baseX; this.y = this.baseY;
                this.size = Math.random() * 1.5 + 0.5;

                const r = Math.random();
                if (r > 0.7) this.colorType = 'primary';
                else if (r > 0.4) this.colorType = 'secondary';
                else this.colorType = 'neutral';
            }

            update() {
                const dx = this.baseX - this.x;
                const dy = this.baseY - this.y;
                this.vx += dx * 0.015;
                this.vy += dy * 0.015;

                const mdx = mouse.x - this.x;
                const mdy = mouse.y - this.y;

                // Box check optimization
                if (Math.abs(mdx) < 200 && Math.abs(mdy) < 200) {
                    const distSq = mdx * mdx + mdy * mdy;
                    if (distSq < 40000) { // 200^2
                        const dist = Math.sqrt(distSq);
                        const force = (200 - dist) / 200;
                        const angle = Math.atan2(mdy, mdx);
                        const push = force * 0.4;
                        this.vx -= Math.cos(angle) * push;
                        this.vy -= Math.sin(angle) * push;
                    }
                }

                this.vx *= 0.94;
                this.vy *= 0.94;
                this.x += this.vx;
                this.y += this.vy;
            }

            draw(isDark) {
                if (!ctx) return;
                const palette = isDark ? PALETTE.dark : PALETTE.light;

                let color = '150, 150, 150';
                if (this.colorType !== 'neutral') {
                    color = palette[this.colorType];
                } else if (!isDark) {
                    color = '100, 116, 139';
                }

                const alpha = isDark ? 0.3 : 0.6;
                ctx.fillStyle = `rgba(${color}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const strands = [];
        const molecules = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);

            strands.length = 0;
            molecules.length = 0;

            // Optimized Density: Reduce particle count for performance
            // Cap at 15 strands max, 60 molecules max
            const dnaCount = Math.min(Math.floor(width / 120), 15);
            for (let i = 0; i < dnaCount; i++) strands.push(new DNAStrand());

            const molCount = Math.min(Math.floor((width * height) / 20000), 60);
            for (let i = 0; i < molCount; i++) molecules.push(new MolecularNode());
        };

        const animate = () => {
            // Fluid Mouse Tracking (Lerp)
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;

            const isDark = document.documentElement.classList.contains('dark');

            // Use standard clearRect
            ctx.clearRect(0, 0, width, height);

            const palette = isDark ? PALETTE.dark : PALETTE.light;
            const connColor = palette.primary;

            const activeRange = 250;
            const connectDist = 100;
            const connectDistSq = connectDist * connectDist;

            molecules.forEach((a, i) => {
                a.update();
                a.draw(isDark);

                // Fast box check for mouse proximity
                if (Math.abs(a.x - mouse.x) > activeRange || Math.abs(a.y - mouse.y) > activeRange) return;

                const distToMouseSq = (a.x - mouse.x) ** 2 + (a.y - mouse.y) ** 2;
                if (distToMouseSq > activeRange * activeRange) return;

                // Only connect to subsequent molecules to avoid double drawing
                for (let j = i + 1; j < molecules.length; j++) {
                    const b = molecules[j];

                    // Fast box check for connection
                    if (Math.abs(a.x - b.x) > connectDist || Math.abs(a.y - b.y) > connectDist) continue;

                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectDistSq) {
                        const dist = Math.sqrt(distSq);
                        const maxOpacity = isDark ? 0.2 : 0.4;
                        // Simpler opacity calc avoiding too many divs
                        const opacity = (1 - dist / connectDist) * maxOpacity;

                        if (opacity > 0.05) {
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.strokeStyle = `rgba(${connColor}, ${opacity})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                }
            });

            strands.forEach(strand => {
                strand.update();
                strand.draw(isDark);
            });

            animationId = requestAnimationFrame(animate);
        };

        const onResize = () => resize();
        const onMouseMove = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden will-change-transform">
            <canvas ref={canvasRef} className="block w-full h-full" />
            {/* Overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-[1] bg-[length:100%_3px,3px_100%] pointer-events-none mix-blend-overlay opacity-30" />
            <div
                className="absolute inset-0 z-[2]"
                style={{
                    background: 'radial-gradient(circle at center, transparent 30%, var(--vignette-color, rgba(255,255,255,0.0)) 140%)'
                }}
            />
            <style>{`
        .dark { --vignette-color: rgba(10, 15, 30, 0.85); }
      `}</style>
        </div>
    );
};

export default HolographicBackground;
