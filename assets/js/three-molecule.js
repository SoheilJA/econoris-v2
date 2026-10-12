/**
 * Econoris — three-molecule.js
 * Interactive 3D ball-and-stick molecule (drag to rotate) for laboratory hero.
 * Plus bubbling flask effect via CSS.
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const canvas = document.getElementById('moleculeCanvas');
    if (!canvas) return;
    let renderer, scene, camera, clock;
    let molecule;
    let isDragging = false, lastX = 0, lastY = 0;
    let velocity = { x: 0.003, y: 0.001 };
    let running = true, observer;

    function setup() {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 14);
      clock = new THREE.Clock();

      molecule = new THREE.Group();
      scene.add(molecule);

      // Build a caffeine-like molecule (stylized)
      // Positions approximated
      const atoms = [
        { p: [0, 0, 0], c: 0x2F6BFF, r: 0.5 }, // N
        { p: [2, 1, 0], c: 0xB6F23A, r: 0.4 }, // C
        { p: [3, -0.5, 0.5], c: 0x2F6BFF, r: 0.4 }, // N
        { p: [2, -2, 0], c: 0xB6F23A, r: 0.4 }, // C
        { p: [0, -2.5, 0], c: 0x2F6BFF, r: 0.5 }, // N
        { p: [-1.5, -1.5, 0], c: 0xB6F23A, r: 0.4 }, // C
        { p: [-1.5, 0.5, 0], c: 0x00D4C2, r: 0.35 }, // O
        { p: [2, 2.5, 0], c: 0xFF4FA3, r: 0.3 }, // CH3
        { p: [4, -1, 0], c: 0xFF4FA3, r: 0.3 }, // CH3
        { p: [-0.5, -3.5, 0], c: 0xFF4FA3, r: 0.3 }, // CH3
        { p: [0, 1.5, 0.5], c: 0xFFB938, r: 0.25 }, // H
        { p: [4.2, 0.5, 0], c: 0x00D4C2, r: 0.35 }, // O
      ];
      const bonds = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [1, 7], [2, 8], [4, 9], [0, 10], [2, 11], [1, 11],
      ];

      atoms.forEach(a => {
        const geo = new THREE.SphereGeometry(a.r * 0.6, 24, 24);
        const mat = new THREE.MeshBasicMaterial({ color: a.c });
        const s = new THREE.Mesh(geo, mat);
        s.position.set(...a.p);
        molecule.add(s);

        // Glow
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        const hex = '#' + a.c.toString(16).padStart(6, '0');
        g.addColorStop(0, hex + 'cc');
        g.addColorStop(1, hex + '00');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
        const tex = new THREE.CanvasTexture(c);
        const spMat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
        const sp = new THREE.Sprite(spMat);
        sp.scale.set(a.r * 3.5, a.r * 3.5, 1);
        sp.position.copy(s.position);
        molecule.add(sp);
      });

      bonds.forEach(([i, j]) => {
        const a = new THREE.Vector3(...atoms[i].p);
        const b = new THREE.Vector3(...atoms[j].p);
        const len = a.distanceTo(b);
        const geo = new THREE.CylinderGeometry(0.06, 0.06, len, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0xC7D0F5, transparent: true, opacity: 0.6 });
        const cyl = new THREE.Mesh(geo, mat);
        const mid = a.clone().lerp(b, 0.5);
        cyl.position.copy(mid);
        cyl.lookAt(b);
        cyl.rotateX(Math.PI / 2);
        molecule.add(cyl);
      });

      // Background particles
      const N = isTouch ? 100 : 250;
      const pgeo = new THREE.BufferGeometry();
      const ppos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        ppos[i*3] = (Math.random() - 0.5) * 40;
        ppos[i*3+1] = (Math.random() - 0.5) * 25;
        ppos[i*3+2] = (Math.random() - 0.5) * 20 - 5;
      }
      pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
      const pmat = new THREE.PointsMaterial({ color: 0x00D4C2, size: 0.05, transparent: true, opacity: 0.5 });
      const particles = new THREE.Points(pgeo, pmat);
      scene.add(particles);
      molecule.userData.particles = particles;
    }

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      if (!isDragging) {
        molecule.rotation.x += velocity.y;
        molecule.rotation.y += velocity.x;
        velocity.x *= 0.99;
        velocity.y *= 0.99;
        // Maintain slow drift
        if (Math.abs(velocity.x) < 0.001) velocity.x = 0.003;
        if (Math.abs(velocity.y) < 0.0005) velocity.y = 0.001;
      }
      const t = clock.getElapsedTime();
      if (molecule.userData.particles) molecule.userData.particles.rotation.y = t * 0.02;
      renderer.render(scene, camera);
    }

    // Drag rotation
    function onDown(e) {
      isDragging = true;
      lastX = (e.touches?.[0] || e).clientX;
      lastY = (e.touches?.[0] || e).clientY;
      canvas.style.cursor = 'grabbing';
    }
    function onMove(e) {
      if (!isDragging) return;
      const x = (e.touches?.[0] || e).clientX;
      const y = (e.touches?.[0] || e).clientY;
      velocity.x = (x - lastX) * 0.005;
      velocity.y = (y - lastY) * 0.005;
      molecule.rotation.y += velocity.x;
      molecule.rotation.x += velocity.y;
      lastX = x; lastY = y;
    }
    function onUp() { isDragging = false; canvas.style.cursor = 'grab'; }

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('touchend', onUp);

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
