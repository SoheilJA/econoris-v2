/**
 * Econoris — three-about.js
 * Calmer Three.js molecule field for the about hero — just glowing drifting nodes
 * connected by faint lines, no morphing. Optimized for calm.
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;
    let renderer, scene, camera, clock;
    let nodes = [], particles;
    let mouseX = 0, mouseY = 0;
    let running = true, observer;

    function setup() {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 18);
      clock = new THREE.Clock();

      // Calmer node cluster
      const group = new THREE.Group();
      scene.add(group);
      const palette = [0x2F6BFF, 0x7C4DFF, 0x00D4C2, 0xFFB938];
      const N = isTouch ? 12 : 20;
      const pos = [];
      for (let i = 0; i < N; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 4 + Math.random() * 5;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
        const z = r * Math.cos(phi) * 0.6;
        pos.push(new THREE.Vector3(x, y, z));
        const color = palette[i % palette.length];
        const geo = new THREE.SphereGeometry(0.18 + Math.random() * 0.18, 16, 16);
        const mat = new THREE.MeshBasicMaterial({ color });
        const s = new THREE.Mesh(geo, mat);
        s.position.copy(pos[i]);
        s.userData.base = pos[i].clone();
        group.add(s);
        nodes.push(s);
        // glow
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        const hex = '#' + color.toString(16).padStart(6, '0');
        g.addColorStop(0, hex);
        g.addColorStop(1, hex + '00');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
        const tex = new THREE.CanvasTexture(c);
        const spMat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
        const sp = new THREE.Sprite(spMat);
        sp.scale.set(2.4, 2.4, 1);
        sp.position.copy(pos[i]);
        group.add(sp);
        s.userData.glow = sp;
      }
      // Connect close nodes with very faint lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const d = pos[i].distanceTo(pos[j]);
          if (d < 4.5) {
            const geo = new THREE.BufferGeometry().setFromPoints([pos[i], pos[j]]);
            const mat = new THREE.LineBasicMaterial({ color: 0x7C4DFF, transparent: true, opacity: 0.18 });
            const line = new THREE.Line(geo, mat);
            group.add(line);
          }
        }
      }

      // Background particles
      const Np = isTouch ? 150 : 400;
      const pgeo = new THREE.BufferGeometry();
      const ppos = new Float32Array(Np * 3);
      for (let i = 0; i < Np; i++) {
        ppos[i*3] = (Math.random() - 0.5) * 50;
        ppos[i*3+1] = (Math.random() - 0.5) * 30;
        ppos[i*3+2] = (Math.random() - 0.5) * 25 - 5;
      }
      pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
      const pmat = new THREE.PointsMaterial({ color: 0xC7D0F5, size: 0.04, transparent: true, opacity: 0.4 });
      particles = new THREE.Points(pgeo, pmat);
      scene.add(particles);
    }

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      scene.rotation.y = t * 0.04 + mouseX * 0.2;
      scene.rotation.x = mouseY * 0.1;
      nodes.forEach((n, i) => {
        const base = n.userData.base;
        n.position.x = base.x + Math.sin(t * 0.3 + i) * 0.3;
        n.position.y = base.y + Math.cos(t * 0.4 + i) * 0.3;
        if (n.userData.glow) n.userData.glow.position.copy(n.position);
      });
      if (particles) particles.rotation.y = t * 0.02;
      renderer.render(scene, camera);
    }

    function onMove(e) {
      mouseX = (e.clientX || 0) / window.innerWidth - 0.5;
      mouseY = (e.clientY || 0) / window.innerHeight - 0.5;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    function onResize() {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) running = false;
      else if (observer?.isIntersecting !== false) { running = true; animate(); }
    });

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        const en = entries[0];
        if (en.isIntersecting) { running = true; animate(); }
        else running = false;
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    setup();
    if (reduced) renderer.render(scene, camera);
    else animate();

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
