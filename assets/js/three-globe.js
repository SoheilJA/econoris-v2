/**
 * Econoris — three-globe.js
 * Three.js globe of glowing connection arcs with data packets flying to a point.
 * Decorative only (no real speed numbers).
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas) return;
    let renderer, scene, camera, clock;
    let globe, arcs = [];
    let mouseX = 0, mouseY = 0;
    let running = true, observer;

    function setup() {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 14);
      clock = new THREE.Clock();

      // Globe wireframe
      const radius = 5;
      const geo = new THREE.SphereGeometry(radius, 32, 24);
      const mat = new THREE.MeshBasicMaterial({ color: 0x2F6BFF, wireframe: true, transparent: true, opacity: 0.35 });
      globe = new THREE.Mesh(geo, mat);
      scene.add(globe);

      // Glowing nodes on globe surface
      const colors = [0x00D4C2, 0xFF4FA3, 0xFFB938, 0xB6F23A, 0x7C4DFF];
      const numNodes = isTouch ? 6 : 12;
      const nodes = [];
      for (let i = 0; i < numNodes; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        const c = colors[i % colors.length];
        const sGeo = new THREE.SphereGeometry(0.15, 12, 12);
        const sMat = new THREE.MeshBasicMaterial({ color: c });
        const s = new THREE.Mesh(sGeo, sMat);
        s.position.set(x, y, z);
        globe.add(s);
        nodes.push({ pos: new THREE.Vector3(x, y, z), color: c });
      }

      // Connection arcs (3D curves between random pairs)
      const numArcs = isTouch ? 4 : 10;
      for (let i = 0; i < numArcs; i++) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a === b) continue;
        const midPoint = a.pos.clone().lerp(b.pos, 0.5).multiplyScalar(1.5);
        const curve = new THREE.QuadraticBezierCurve3(a.pos, midPoint, b.pos);
        const points = curve.getPoints(50);
        const g = new THREE.BufferGeometry().setFromPoints(points);
        const m = new THREE.LineBasicMaterial({ color: a.color, transparent: true, opacity: 0.6 });
        const line = new THREE.Line(g, m);
        globe.add(line);
        arcs.push({ curve, color: a.color });
      }

      // Data packet particles
      arcs.forEach((arc, i) => {
        const pGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: arc.color });
        const p = new THREE.Mesh(pGeo, pMat);
        p.userData.t = Math.random();
        p.userData.speed = 0.002 + Math.random() * 0.003;
        p.userData.curve = arc.curve;
        globe.add(p);
        arcs[i].packet = p;
      });

      // Background particles
      const Np = isTouch ? 100 : 250;
      const pgeo = new THREE.BufferGeometry();
      const ppos = new Float32Array(Np * 3);
      for (let i = 0; i < Np; i++) {
        ppos[i*3] = (Math.random() - 0.5) * 40;
        ppos[i*3+1] = (Math.random() - 0.5) * 25;
        ppos[i*3+2] = (Math.random() - 0.5) * 20 - 5;
      }
      pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
      const pmat = new THREE.PointsMaterial({ color: 0xC7D0F5, size: 0.04, transparent: true, opacity: 0.4 });
      const particles = new THREE.Points(pgeo, pmat);
      scene.add(particles);
      globe.userData.particles = particles;
    }

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      globe.rotation.y = t * 0.1 + mouseX * 0.3;
      globe.rotation.x = mouseY * 0.2;
      arcs.forEach(a => {
        if (a.packet) {
          a.packet.userData.t += a.packet.userData.speed;
          if (a.packet.userData.t > 1) a.packet.userData.t = 0;
          const p = a.curve.getPoint(a.packet.userData.t);
          a.packet.position.copy(p);
        }
      });
      if (globe.userData.particles) globe.userData.particles.rotation.y = t * 0.02;
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
