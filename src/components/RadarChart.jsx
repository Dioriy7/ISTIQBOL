import React, { useEffect, useRef } from 'react';

export default function RadarChart({ scores, subjects }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 300;
        canvas.width = size;
        canvas.height = size;

        const cx = size / 2;
        const cy = size / 2;
        const R = 110;
        const n = subjects.length;
        const levels = 5;

        ctx.clearRect(0, 0, size, size);

        const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

        // Draw web levels
        for (let lv = levels; lv >= 1; lv--) {
            const r = (R * lv) / levels;
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const a = angle(i % n);
                const x = cx + r * Math.cos(a);
                const y = cy + r * Math.sin(a);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(255,255,255,${0.04 + lv * 0.015})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = `rgba(99,102,241,${0.01 * lv})`;
            ctx.fill();
        }

        // Draw spokes
        for (let i = 0; i < n; i++) {
            const a = angle(i);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw data polygon
        const dataPoints = subjects.map((s, i) => {
            const score = (scores[s.id] || 0) / 100;
            const a = angle(i);
            return {
                x: cx + R * score * Math.cos(a),
                y: cy + R * score * Math.sin(a),
            };
        });

        ctx.beginPath();
        dataPoints.forEach((p, i) => {
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        grad.addColorStop(0, 'rgba(99,102,241,0.5)');
        grad.addColorStop(1, 'rgba(6,182,212,0.2)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#6366f1';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Dots
        dataPoints.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#a5b4fc';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#6366f1';
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Labels
        const fontSize = 11;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        subjects.forEach((s, i) => {
            const a = angle(i);
            const labelR = R + 22;
            const x = cx + labelR * Math.cos(a);
            const y = cy + labelR * Math.sin(a);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(s.emoji, x, y - 7);
            ctx.font = `bold 9px Inter, sans-serif`;
            ctx.fillStyle = '#64748b';
            ctx.fillText(s.name.length > 8 ? s.name.slice(0, 8) + '…' : s.name, x, y + 7);
            ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        });
    }, [scores, subjects]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '300px', height: '300px', maxWidth: '100%' }}
        />
    );
}
