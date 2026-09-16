import { useEffect, useRef, useCallback } from 'react';

interface DollarBill {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  vRotation: number;
  flipAngle: number;
  vFlip: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmount: number;
  alpha: number;
  life: number;
  maxLife: number;
  denomination: string;
  themeColor: {
    bgGrad1: string;
    bgGrad2: string;
    border: string;
    text: string;
    accent: string;
  };
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  radius: number;
  color: string;
  life: number;
}

interface TouchDollarBillsCanvasProps {
  interactive?: boolean;
}

export function TouchBubblesCanvas({ interactive = true }: TouchDollarBillsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const billsRef = useRef<DollarBill[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  const createDollarBill = useCallback((x: number, y: number, isAmbient = false): DollarBill => {
    // Proporciones de billete de dólar miniatura (aprox 2.35:1)
    const baseW = isAmbient ? 22 + Math.random() * 8 : 24 + Math.random() * 10;
    const baseH = baseW * 0.48;

    const denominations = ['100', '100', '100', '$', '50', '100'];
    const denomination = denominations[Math.floor(Math.random() * denominations.length)];

    // Temas de billetes: verde clásico de reserva federal y verde-oro con reflejo
    const themes = [
      {
        bgGrad1: '#0f3922',
        bgGrad2: '#1b5e39',
        border: '#86efac',
        text: '#dcfce7',
        accent: '#22c55e'
      },
      {
        bgGrad1: '#0d321d',
        bgGrad2: '#164e2d',
        border: '#a7f3d0',
        text: '#ecfdf5',
        accent: '#10b981'
      },
      {
        bgGrad1: '#133e29',
        bgGrad2: '#205c3c',
        border: '#fde047',
        text: '#fef08a',
        accent: '#eab308'
      }
    ];
    const themeColor = themes[Math.floor(Math.random() * themes.length)];

    const maxLife = isAmbient ? 190 + Math.random() * 120 : 130 + Math.random() * 90;

    return {
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      w: baseW,
      h: baseH,
      vx: (Math.random() - 0.5) * (isAmbient ? 0.7 : 1.8),
      vy: isAmbient ? (0.6 + Math.random() * 0.8) : (0.8 + Math.random() * 1.8), // fluyen con gravedad suave hacia abajo
      rotation: (Math.random() - 0.5) * 0.8,
      vRotation: (Math.random() - 0.5) * 0.04,
      flipAngle: Math.random() * Math.PI * 2,
      vFlip: 0.035 + Math.random() * 0.055, // efecto de volteo papel 3D
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.03 + Math.random() * 0.04,
      swayAmount: 0.8 + Math.random() * 1.6,
      alpha: 0.05,
      life: 0,
      maxLife,
      denomination,
      themeColor
    };
  }, []);

  const spawnSparkles = useCallback((x: number, y: number) => {
    const count = 4 + Math.floor(Math.random() * 4);
    const colors = ['#34d399', '#fde047', '#22d3ee', '#6ee7b7'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 0.8 + Math.random() * 2.0;
      sparklesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.9,
        radius: 1 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0
      });
    }
  }, []);

  const handlePointerMovement = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const now = performance.now();
      const dx = x - lastSpawnRef.current.x;
      const dy = y - lastSpawnRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Despliega pequeños billetes al deslizar el dedo
      if (dist > 18 || now - lastSpawnRef.current.time > 90) {
        lastSpawnRef.current = { x, y, time: now };
        const spawnCount = Math.min(3, Math.max(1, Math.floor(dist / 24)));
        for (let i = 0; i < spawnCount; i++) {
          billsRef.current.push(createDollarBill(x, y, false));
        }
        if (Math.random() > 0.6) {
          spawnSparkles(x, y);
        }
      }
    },
    [createDollarBill, spawnSparkles]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let ambientTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Generación ambiente periódica de billetes cayendo suavemente
      ambientTimer++;
      if (ambientTimer % 45 === 0 && billsRef.current.length < 24) {
        const ambientX = Math.random() * width;
        const ambientY = -20;
        billsRef.current.push(createDollarBill(ambientX, ambientY, true));
      }

      // Actualizar y renderizar pequeños billetes de dólar
      for (let i = billsRef.current.length - 1; i >= 0; i--) {
        const bill = billsRef.current[i];
        bill.life++;

        const progress = bill.life / bill.maxLife;
        if (progress < 0.15) {
          bill.alpha = Math.min(0.9, progress / 0.15);
        } else if (progress > 0.75) {
          bill.alpha = Math.max(0, (1 - progress) / 0.25);
        }

        // Física de vuelo: balanceo aerodinámico y rotación
        bill.swayPhase += bill.swaySpeed;
        const swayX = Math.sin(bill.swayPhase) * bill.swayAmount;

        bill.x += bill.vx + swayX;
        bill.y += bill.vy;
        bill.rotation += bill.vRotation;
        bill.flipAngle += bill.vFlip;

        // Escala vertical proyectada para simular el volteo 3D en el aire
        const flipScale = Math.cos(bill.flipAngle);
        const absFlip = Math.abs(flipScale);

        if (bill.alpha > 0.02 && absFlip > 0.08) {
          ctx.save();
          ctx.translate(bill.x, bill.y);
          ctx.rotate(bill.rotation);
          ctx.scale(1, flipScale);

          const halfW = bill.w / 2;
          const halfH = bill.h / 2;

          // Sombra tenue y resplandor verde esmeralda / dorado
          ctx.shadowColor = bill.themeColor.accent;
          ctx.shadowBlur = 6 * bill.alpha;

          // Cuerpo del billete
          const grad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
          grad.addColorStop(0, bill.themeColor.bgGrad1);
          grad.addColorStop(1, bill.themeColor.bgGrad2);

          ctx.fillStyle = grad;
          ctx.globalAlpha = bill.alpha;

          // Rectángulo redondeado miniatura
          ctx.beginPath();
          ctx.roundRect(-halfW, -halfH, bill.w, bill.h, 1.8);
          ctx.fill();

          ctx.shadowBlur = 0;

          // Borde fino exterior
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = bill.themeColor.border;
          ctx.stroke();

          // Marco interior ornamental (filigrana de billete)
          ctx.beginPath();
          ctx.roundRect(-halfW + 1.6, -halfH + 1.4, bill.w - 3.2, bill.h - 2.8, 1);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = bill.themeColor.text;
          ctx.globalAlpha = bill.alpha * 0.7;
          ctx.stroke();

          // Medallón ovalado central del billete
          ctx.beginPath();
          ctx.ellipse(0, 0, bill.w * 0.22, bill.h * 0.36, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.fill();
          ctx.lineWidth = 0.4;
          ctx.strokeStyle = bill.themeColor.border;
          ctx.stroke();

          // Símbolo o denominación central ("$" o "100")
          ctx.fillStyle = bill.themeColor.text;
          ctx.globalAlpha = bill.alpha * 0.95;
          ctx.font = `bold ${Math.max(6, Math.floor(bill.h * 0.65))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bill.denomination, 0, 0.5);

          // Micro-números en esquinas para realismo extremo
          ctx.font = `${Math.max(4, Math.floor(bill.h * 0.32))}px sans-serif`;
          ctx.fillText('$', -halfW + 3.2, -halfH + 3.2);
          ctx.fillText('$', halfW - 3.2, halfH - 2.8);

          // Reflejo brillante diagonal al voltear
          if (absFlip > 0.4 && absFlip < 0.8) {
            ctx.beginPath();
            ctx.moveTo(-halfW * 0.5, -halfH);
            ctx.lineTo(-halfW * 0.1, -halfH);
            ctx.lineTo(halfW * 0.3, halfH);
            ctx.lineTo(-halfW * 0.1, halfH);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.fill();
          }

          ctx.restore();
        }

        // Expiración
        if (bill.life >= bill.maxLife || bill.y > height + 30 || bill.alpha <= 0.01) {
          if (bill.life >= bill.maxLife && Math.random() > 0.5) {
            spawnSparkles(bill.x, bill.y);
          }
          billsRef.current.splice(i, 1);
        }
      }

      // Render de micro-destellos
      for (let j = sparklesRef.current.length - 1; j >= 0; j--) {
        const s = sparklesRef.current[j];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.alpha = Math.max(0, 0.9 - s.life / 24);

        if (s.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * (1 - s.life / 28), 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.restore();
        }

        if (s.life >= 24) {
          sparklesRef.current.splice(j, 1);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
    };
  }, [createDollarBill, spawnSparkles]);

  // Escuchadores táctiles y de puntero
  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement || canvas;

    const onPointerMove = (e: PointerEvent) => {
      handlePointerMovement(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        handlePointerMovement(e.touches[i].clientX, e.touches[i].clientY);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      handlePointerMovement(e.clientX, e.clientY);
      // Ráfaga de pequeños billetes y chispas al tocar la pantalla
      for (let i = 0; i < 4; i++) {
        const canvasEl = canvasRef.current;
        if (!canvasEl) break;
        const rect = canvasEl.getBoundingClientRect();
        billsRef.current.push(createDollarBill(e.clientX - rect.left, e.clientY - rect.top, false));
      }
      const canvasEl = canvasRef.current;
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        spawnSparkles(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    parent.addEventListener('pointermove', onPointerMove, { passive: true });
    parent.addEventListener('touchmove', onTouchMove, { passive: true });
    parent.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('touchmove', onTouchMove);
      parent.removeEventListener('pointerdown', onPointerDown);
    };
  }, [interactive, handlePointerMovement, createDollarBill, spawnSparkles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}

