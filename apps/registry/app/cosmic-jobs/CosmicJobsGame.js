'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3-force';
import {
  Zap,
  Sparkles,
  Rocket,
  Star,
  Heart,
  Cat,
  Atom,
  Orbit,
  Gamepad2,
  RotateCcw,
} from 'lucide-react';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PARTICLE_COUNT = 100;

// Cosmic cat names for fun
const COSMIC_CAT_NAMES = [
  'Nebula',
  'Stardust',
  'Cosmic',
  'Quantum',
  'Photon',
  'Neutron',
  'Galaxy',
  'Pulsar',
  'Quasar',
  'Supernova',
  'Blackhole',
  'Comet',
  'Asteroid',
  'Meteor',
  'Solar',
  'Lunar',
  'Stellar',
  'Cosmic',
];

// Job particle types with different physics properties
const PARTICLE_TYPES = {
  FRONTEND: { color: '#3B82F6', mass: 1, charge: 1, icon: '🎨' },
  BACKEND: { color: '#10B981', mass: 1.5, charge: -1, icon: '⚙️' },
  FULLSTACK: { color: '#8B5CF6', mass: 2, charge: 0, icon: '🔧' },
  DEVOPS: { color: '#F59E0B', mass: 1.2, charge: 1, icon: '🚀' },
  DATA: { color: '#EF4444', mass: 1.8, charge: -1, icon: '📊' },
  MOBILE: { color: '#06B6D4', mass: 1.1, charge: 1, icon: '📱' },
  AI: { color: '#EC4899', mass: 2.5, charge: 2, icon: '🤖' },
  COSMIC_CAT: { color: '#FFD700', mass: 0.8, charge: 3, icon: '🐱' },
};

function getParticleType(job) {
  const title = (job.title || '').toLowerCase();
  if (
    title.includes('frontend') ||
    title.includes('react') ||
    title.includes('vue')
  )
    return 'FRONTEND';
  if (
    title.includes('backend') ||
    title.includes('api') ||
    title.includes('server')
  )
    return 'BACKEND';
  if (title.includes('fullstack') || title.includes('full stack'))
    return 'FULLSTACK';
  if (title.includes('devops') || title.includes('infrastructure'))
    return 'DEVOPS';
  if (title.includes('data') || title.includes('analytics')) return 'DATA';
  if (
    title.includes('mobile') ||
    title.includes('ios') ||
    title.includes('android')
  )
    return 'MOBILE';
  if (
    title.includes('ai') ||
    title.includes('machine learning') ||
    title.includes('ml')
  )
    return 'AI';
  return 'FRONTEND'; // default
}

export default function CosmicJobsGame({ jobs = [], resumes = [] }) {
  const canvasRef = useRef(null);
  const simulationRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [selectedParticle, setSelectedParticle] = useState(null);
  const [attractorMode, setAttractorMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initialize particles from jobs and resumes
  const initializeParticles = useCallback(() => {
    const particles = [];

    // Create job particles
    jobs.slice(0, 30).forEach((job, index) => {
      const type = getParticleType(job);
      const typeData = PARTICLE_TYPES[type];

      particles.push({
        id: `job-${index}`,
        type: 'job',
        particleType: type,
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 8 + typeData.mass * 2,
        mass: typeData.mass,
        charge: typeData.charge,
        color: typeData.color,
        icon: typeData.icon,
        data: job,
        energy: Math.random() * 100,
        trail: [],
      });
    });

    // Create cosmic cat particles from resumes
    resumes.slice(0, 10).forEach((resume, index) => {
      const catName = COSMIC_CAT_NAMES[index % COSMIC_CAT_NAMES.length];
      const typeData = PARTICLE_TYPES.COSMIC_CAT;

      particles.push({
        id: `cat-${index}`,
        type: 'cat',
        particleType: 'COSMIC_CAT',
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 12,
        mass: typeData.mass,
        charge: typeData.charge,
        color: typeData.color,
        icon: typeData.icon,
        data: { ...resume, cosmicName: catName },
        energy: Math.random() * 150,
        trail: [],
        purring: Math.random() > 0.7,
      });
    });

    // Add some random energy particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        id: `energy-${i}`,
        type: 'energy',
        particleType: 'ENERGY',
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 3,
        mass: 0.1,
        charge: Math.random() > 0.5 ? 1 : -1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        icon: '✨',
        energy: Math.random() * 50,
        trail: [],
      });
    }

    return particles;
  }, [jobs, resumes]);

  // Initialize physics simulation
  useEffect(() => {
    const particles = initializeParticles();
    particlesRef.current = particles;

    // Create D3 force simulation
    simulationRef.current = d3
      .forceSimulation(particles)
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength((d) => d.charge * -30)
          .distanceMin(10)
          .distanceMax(200)
      )
      .force(
        'collision',
        d3
          .forceCollide()
          .radius((d) => d.radius + 2)
          .strength(0.7)
      )
      .force(
        'center',
        d3.forceCenter(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2).strength(0.1)
      )
      .force('x', d3.forceX(CANVAS_WIDTH / 2).strength(0.02))
      .force('y', d3.forceY(CANVAS_HEIGHT / 2).strength(0.02))
      .alphaDecay(0.001)
      .velocityDecay(0.4);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [initializeParticles]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let lastTime = 0;

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Clear canvas with cosmic background
      const gradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        0,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        CANVAS_WIDTH / 2
      );
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.5, '#1a0a2e');
      gradient.addColorStop(1, '#000000');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % CANVAS_WIDTH;
        const y = (i * 73.2) % CANVAS_HEIGHT;
        const size = Math.sin(currentTime * 0.001 + i) * 0.5 + 1;
        ctx.globalAlpha = Math.sin(currentTime * 0.002 + i) * 0.3 + 0.7;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 10) {
          particle.trail.shift();
        }

        // Draw trail
        if (particle.trail.length > 1) {
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Draw particle glow
        const glowGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 2
        );
        glowGradient.addColorStop(0, particle.color + '80');
        glowGradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(
          particle.x - particle.radius * 2,
          particle.y - particle.radius * 2,
          particle.radius * 4,
          particle.radius * 4
        );

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle icon
        ctx.fillStyle = 'white';
        ctx.font = `${particle.radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particle.icon, particle.x, particle.y);

        // Special effects for cosmic cats
        if (particle.type === 'cat' && particle.purring) {
          const purrRadius =
            particle.radius + Math.sin(currentTime * 0.01 + index) * 3;
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, purrRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Boundary collision
        if (
          particle.x < particle.radius ||
          particle.x > CANVAS_WIDTH - particle.radius
        ) {
          particle.vx *= -0.8;
          particle.x = Math.max(
            particle.radius,
            Math.min(CANVAS_WIDTH - particle.radius, particle.x)
          );
        }
        if (
          particle.y < particle.radius ||
          particle.y > CANVAS_HEIGHT - particle.radius
        ) {
          particle.vy *= -0.8;
          particle.y = Math.max(
            particle.radius,
            Math.min(CANVAS_HEIGHT - particle.radius, particle.y)
          );
        }
      });

      // Draw attractor if active
      if (attractorMode) {
        const attractorGradient = ctx.createRadialGradient(
          mousePos.x,
          mousePos.y,
          0,
          mousePos.x,
          mousePos.y,
          50
        );
        attractorGradient.addColorStop(0, '#FF6B6B80');
        attractorGradient.addColorStop(1, '#FF6B6B00');
        ctx.fillStyle = attractorGradient;
        ctx.fillRect(mousePos.x - 50, mousePos.y - 50, 100, 100);

        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 30, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [attractorMode, mousePos]);

  // Handle mouse interactions
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (attractorMode && simulationRef.current) {
      // Add attractor force
      simulationRef.current.force('attractor', d3.forceX(x).strength(0.1));
      simulationRef.current.force('attractorY', d3.forceY(y).strength(0.1));
      simulationRef.current.alpha(0.3).restart();
    }
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked particle
    const clickedParticle = particlesRef.current.find((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) < p.radius + 5;
    });

    if (clickedParticle) {
      setSelectedParticle(clickedParticle);
      setScore((prev) => prev + 10);

      // Add explosion effect
      if (simulationRef.current) {
        simulationRef.current.force(
          'explosion',
          d3.forceManyBody().strength(500).distanceMin(1).distanceMax(100)
        );
        setTimeout(() => {
          simulationRef.current.force('explosion', null);
        }, 200);
      }
    }
  };

  const resetSimulation = () => {
    const particles = initializeParticles();
    particlesRef.current = particles;
    if (simulationRef.current) {
      simulationRef.current.nodes(particles).alpha(1).restart();
    }
    setScore(0);
    setSelectedParticle(null);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Game UI */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Cosmic Jobs Simulator
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              Score: {score}
            </div>
            <div className="flex items-center gap-1">
              <Atom className="w-4 h-4" />
              Particles: {particlesRef.current.length}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
          <div className="flex gap-2">
            <button
              onClick={() => setAttractorMode(!attractorMode)}
              className={`p-2 rounded-lg transition-colors ${
                attractorMode
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Toggle Gravity Well"
            >
              <Orbit className="w-5 h-5" />
            </button>
            <button
              onClick={resetSimulation}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />

      {/* Particle Info Panel */}
      <AnimatePresence>
        {selectedParticle && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 text-white max-w-sm"
          >
            <button
              onClick={() => setSelectedParticle(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ×
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{selectedParticle.icon}</span>
              <h3 className="font-bold">
                {selectedParticle.type === 'cat'
                  ? `${selectedParticle.data.cosmicName} Cat`
                  : selectedParticle.data.title || 'Energy Particle'}
              </h3>
            </div>

            {selectedParticle.type === 'job' && (
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Company:</strong> {selectedParticle.data.company}
                </p>
                <p>
                  <strong>Location:</strong> {selectedParticle.data.location}
                </p>
                <p>
                  <strong>Type:</strong> {selectedParticle.particleType}
                </p>
                <p>
                  <strong>Charge:</strong> {selectedParticle.charge}
                </p>
                <p>
                  <strong>Mass:</strong> {selectedParticle.mass}
                </p>
              </div>
            )}

            {selectedParticle.type === 'cat' && (
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Human:</strong> {selectedParticle.data.name}
                </p>
                <p>
                  <strong>Role:</strong> {selectedParticle.data.label}
                </p>
                <p>
                  <strong>Cosmic Power:</strong>{' '}
                  {selectedParticle.energy.toFixed(1)}
                </p>
                <p>
                  <strong>Purring:</strong>{' '}
                  {selectedParticle.purring ? '🔊' : '🔇'}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Cosmic Cat Energy</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 text-white text-sm max-w-xs">
        <h4 className="font-bold mb-2 flex items-center gap-1">
          <Gamepad2 className="w-4 h-4" />
          Controls
        </h4>
        <ul className="space-y-1 text-xs">
          <li>• Click particles to interact</li>
          <li>• Toggle gravity well with orbit button</li>
          <li>• Watch cosmic cats purr with energy</li>
          <li>• Jobs have different physics properties</li>
          <li>• Reset to regenerate the universe</li>
        </ul>
      </div>
    </div>
  );
}
