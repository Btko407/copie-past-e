import { r as reactExports, j as jsxRuntimeExports, m as motion } from "./index-CAvEfu6s.js";
function LightningAnimation({ active }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let frame = 0;
    let rafId;
    function drawBolt(x1, y1, x2, y2, roughness) {
      if (!ctx) return;
      if (roughness < 4) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        return;
      }
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness;
      drawBolt(x1, y1, midX, midY, roughness / 2);
      drawBolt(midX, midY, x2, y2, roughness / 2);
    }
    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const flashAlpha = Math.max(0, 0.85 - frame * 0.06);
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const numBolts = 3;
      for (let b = 0; b < numBolts; b++) {
        const startX = canvas.width * (0.3 + b * 0.2);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${Math.max(0, 1 - frame * 0.04)})`;
        ctx.lineWidth = Math.max(0.5, 3 - b);
        ctx.shadowColor = "#00d4ff";
        ctx.shadowBlur = 20;
        drawBolt(
          startX,
          0,
          startX + (Math.random() - 0.5) * 60,
          canvas.height,
          80
        );
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 237, 78, ${Math.max(0, 1 - frame * 0.05)})`;
      ctx.lineWidth = 4;
      ctx.shadowColor = "#ffed4e";
      ctx.shadowBlur = 30;
      drawBolt(canvas.width / 2, 0, canvas.width / 2, canvas.height, 100);
      ctx.stroke();
      frame++;
      if (frame < 24) {
        rafId = requestAnimationFrame(render);
      }
    }
    render();
    return () => cancelAnimationFrame(rafId);
  }, [active]);
  if (!active) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed inset-0 z-[9999] pointer-events-none",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "w-full h-full" })
    }
  );
}
export {
  LightningAnimation as L
};
