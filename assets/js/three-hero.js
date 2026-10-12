/**
 * Econoris — three-hero.js
 * Three.js molecular network for the home hero.
 * - Glowing nodes (ball-and-stick cluster) that slowly orbit
 * - Reacts to mouse/touch parallax
 * - Bloom-like glow via additive sprites
 * - Idea (lightbulb point cloud) ↔ capsule morph on a slow loop
 * - Pause when off-screen / tab hidden; cap pixel ratio
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    let renderer, scene, camera, clock;
    let nodes = [], sticks = [], capsules = [], hexes = [], particles;
    let mouseX = 0, mouseY = 0;
    let running = true;
    let observer;

    // ---------- Setup ----------
    function setup() {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
      renderer.setSize(window.innerWidth, canvas.clientHeight, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, window.innerWidth / canvas.clientHeight, 0.1, 200);
      camera.position.set(0, 0, 18);

      clock = new THREE.Clock();

      buildCluster();
      buildCapsules();
      buildHexes();
      buildParticles();
    }

    // ---------- Ball-and-stick molecular cluster ----------
    function buildCluster() {
      const group = new THREE.Group();
      scene.add(group);

      const palette = [0x2F6BFF, 0x7C4DFF, 0x00D4C2, 0xFF4FA3, 0xFFB938];
      const N = isTouch ? 18 : 28;
      const pos = [];

      for (let i = 0; i < N; i++) {
        // Spherical-ish cluster
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 + Math.random() * 3.5;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi) * 0.7;
        pos.push(new THREE.Vector3(x, y, z));

        const color = palette[i % palette.length];
        const geo = new THREE.SphereGeometry(0.22 + Math.random() * 0.18, 18, 18);
        const mat = new THREE.MeshBasicMaterial({ color });
        const sphere = new THREE.Mesh(geo, mat);
        sphere.position.copy(pos[i]);
        sphere.userData.base = pos[i].clone();
        sphere.userData.color = color;
        group.add(sphere);
        nodes.push(sphere);

        // Glow sprite
        const glow = makeGlowSprite(color, 2);
        glow.position.copy(pos[i]);
        group.add(glow);
        sphere.userData.glow = glow;
      }

      // Sticks — connect nearby nodes
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const d = pos[i].distanceTo(pos[j]);
          if (d < 3.2) {
            const geo = new THREE.CylinderGeometry(0.025, 0.025, d, 8);
            const mat = new THREE.MeshBasicMaterial({ color: 0x7C4DFF, transparent: true, opacity: 0.45 });
            const cyl = new THREE.Mesh(geo, mat);
            const mid = pos[i].clone().lerp(pos[j], 0.5);
            cyl.position.copy(mid);
            cyl.lookAt(pos[j]);
            cyl.rotateX(Math.PI / 2);
            group.add(cyl);
            sticks.push({ mesh: cyl, a: i, b: j });
          }
        }
      }
      group.userData.pos = pos;
      scene.userData.cluster = group;
    }

    function makeGlowSprite(color, scale) {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      const hex = '#' + color.toString(16).padStart(6, '0');
      grad.addColorStop(0, hex);
      grad.addColorStop(0.3, hex + 'aa');
      grad.addColorStop(1, hex + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
      const spr = new THREE.Sprite(mat);
      spr.scale.set(scale, scale, 1);
      return spr;
    }

    // ---------- Drifting capsule shapes ----------
    function buildCapsules() {
      const group = new THREE.Group();
      scene.add(group);
      const colors = [0x2F6BFF, 0xFF4FA3, 0xFFB938, 0x00D4C2];
      const N = isTouch ? 4 : 8;
      for (let i = 0; i < N; i++) {
        const g = new THREE.CapsuleGeometry(0.18, 0.55, 8, 16);
        const m = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true, opacity: 0.85 });
        const cap = new THREE.Mesh(g, m);
        cap.position.set(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 12,
          -4 - Math.random() * 6
        );
        cap.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        cap.userData.drift = new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, 0);
        cap.userData.spin = new THREE.Vector3(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5);
        group.add(cap);
        capsules.push(cap);
      }
      scene.userData.capsules = group;
    }

    // ---------- Floating hexagons ----------
    function buildHexes() {
      const group = new THREE.Group();
      scene.add(group);
      const N = isTouch ? 6 : 14;
      const shape = new THREE.Shape();
      const r = 0.4;
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      shape.closePath();
      const geo = new THREE.ShapeGeometry(shape);
      const colors = [0x00D4C2, 0xB6F23A, 0x7C4DFF];
      for (let i = 0; i < N; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true, opacity: 0.18, side: THREE.DoubleSide });
        const hex = new THREE.Mesh(geo, mat);
        hex.position.set(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 14,
          -6 - Math.random() * 5
        );
        hex.rotation.z = Math.random() * Math.PI;
        hex.userData.spin = (Math.random() - 0.5) * 0.4;
        hex.userData.drift = new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, 0);
        group.add(hex);
        hexes.push(hex);
      }
      scene.userData.hexes = group;
    }

    // ---------- Background particles ----------
    function buildParticles() {
      const N = isTouch ? 200 : 600;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 60;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: 0xC7D0F5, size: 0.05, transparent: true, opacity: 0.55 });
      particles = new THREE.Points(geo, mat);
      scene.add(particles);
    }

    // ---------- Animate ----------
    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const cluster = scene.userData.cluster;
      const caps = scene.userData.capsules;
      const hxs = scene.userData.hexes;

      if (cluster) {
        cluster.rotation.y = t * 0.06 + mouseX * 0.3;
        cluster.rotation.x = mouseY * 0.2;
        // Morph between sphere cluster and capsule-like vertical line
        const morph = 0.5 + 0.5 * Math.sin(t * 0.18); // 0..1 over ~35s
        nodes.forEach((n, i) => {
          const base = n.userData.base;
          // Capsule morph: stretch along Y when morph ~1
          const capsule = morph > 0.5;
          const stretch = morph;
          n.position.x = base.x * (1 - 0.4 * stretch);
          n.position.y = base.y * (1 + 0.8 * stretch) * (capsule ? 1.4 : 1);
          n.position.z = base.z * (1 - 0.2 * stretch);
          // Pulse glow
          if (n.userData.glow) {
            const pulse = 2 + 0.3 * Math.sin(t * 1.5 + i);
            n.userData.glow.scale.set(pulse, pulse, 1);
            n.userData.glow.position.copy(n.position);
          }
        });
        // Update sticks
        sticks.forEach(s => {
          const a = nodes[s.a].position;
          const b = nodes[s.b].position;
          s.mesh.position.copy(a).lerp(b, 0.5);
          s.mesh.lookAt(b);
          s.mesh.rotateX(Math.PI / 2);
          s.mesh.scale.y = a.distanceTo(b);
        });
      }

      if (caps) {
        caps.children.forEach((c, i) => {
          c.position.x += c.userData.drift.x * 0.01;
          c.position.y += c.userData.drift.y * 0.01;
          c.rotation.x += c.userData.spin.x * 0.01;
          c.rotation.y += c.userData.spin.y * 0.01;
          c.rotation.z += c.userData.spin.z * 0.01;
          // Wrap
          if (c.position.x > 12) c.position.x = -12;
          if (c.position.x < -12) c.position.x = 12;
          if (c.position.y > 8) c.position.y = -8;
          if (c.position.y < -8) c.position.y = 8;
        });
      }

      if (hxs) {
        hxs.children.forEach((h) => {
          h.rotation.z += h.userData.spin * 0.005;
          h.position.x += h.userData.drift.x * 0.008;
          h.position.y += h.userData.drift.y * 0.008;
          if (h.position.x > 14) h.position.x = -14;
          if (h.position.x < -14) h.position.x = 14;
          if (h.position.y > 10) h.position.y = -10;
          if (h.position.y < -10) h.position.y = 10;
        });
      }

      if (particles) {
        particles.rotation.y = t * 0.02;
      }

      renderer.render(scene, camera);
    }

    // ---------- Mouse parallax ----------
    function onMove(e) {
      const x = (e.clientX || (e.touches && e.touches[0].clientX) || 0) / window.innerWidth - 0.5;
      const y = (e.clientY || (e.touches && e.touches[0].clientY) || 0) / window.innerHeight - 0.5;
      mouseX = x; mouseY = y;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    // ---------- Resize ----------
    function onResize() {
      const h = canvas.clientHeight;
      renderer.setSize(window.innerWidth, h, false);
      camera.aspect = window.innerWidth / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // ---------- Pause when off-screen / tab hidden ----------
    function visibility() {
      if (document.hidden) { running = false; }
      else if (observer && observer.isIntersecting !== false) { running = true; animate(); }
    }
    document.addEventListener('visibilitychange', visibility);

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        const en = entries[0];
        if (en.isIntersecting) { running = true; animate(); }
        else { running = false; }
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    // ---------- Init ----------
    setup();
    if (reduced) {
      // Just render one frame
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // Cleanup on pagehide
    window.addEventListener('pagehide', () => {
      running = false;
      renderer.dispose();
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
          else o.material.dispose();
        }
      });
    });
  }
})();
