import React, { useEffect, useRef } from 'react';

const ParticleVortex = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Formal palette: Blues and Slate Grays
    const colors = ['#2563eb', '#3b82f6', '#94a3b8', '#cbd5e1', '#64748b'];

    let mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.reset();
        this.x = this.centerX + Math.cos(this.angle) * this.radius;
        this.y = this.centerY + Math.sin(this.angle) * this.radius;
      }

      reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * (Math.max(canvas.width, canvas.height) / 2);
        this.speed = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1);
        this.size = Math.random() * 1.5 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
      }

      update() {
        this.angle += this.speed * 0.005;
        this.radius += Math.sin(this.angle) * 0.5;
        
        let targetX = this.centerX + Math.cos(this.angle) * this.radius;
        let targetY = this.centerY + Math.sin(this.angle) * this.radius;

        let dx = mouse.x - targetX;
        let dy = mouse.y - targetY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          // Attract towards mouse
          const force = (mouse.radius - distance) / mouse.radius;
          const pullX = (dx / distance) * force * 60; 
          const pullY = (dy / distance) * force * 60;
          
          this.x += (targetX + pullX - this.x) * 0.1;
          this.y += (targetY + pullY - this.y) * 0.1;
        } else {
          // Smoothly return to normal orbit
          this.x += (targetX - this.x) * 0.05;
          this.y += (targetY - this.y) * 0.05;
        }

        if (this.radius > Math.max(canvas.width, canvas.height) / 2 + 50 || this.radius < 0) {
            this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 5000); 
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // Light formal background fill for trail effect
      ctx.fillStyle = 'rgba(248, 250, 252, 0.3)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ background: '#f8fafc', pointerEvents: 'auto' }}
    />
  );
};

export default ParticleVortex;
