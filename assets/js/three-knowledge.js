/**
 * Econoris — three-knowledge.js
 * 3D knowledge graph for research-desk hero: glowing nodes labeled with
 * source types (PubMed, Scopus, Web of Science, ژورنال‌ها، پتنت‌ها، کارآزمایی‌های بالینی، رگولاتوری)
 * connected by lines that light up on scroll/hover.
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', init);

  const LABELS = [
    { t: 'PubMed', c: 0x2F6BFF },
    { t: 'Scopus', c: 0x7C4DFF },
    { t: 'Web of Science', c: 0x00D4C2 },
    { t: 'ژورنال‌ها', c: 0xFFB938 },
    { t: 'پتنت‌ها', c: 0xFF4FA3 },
    { t: 'کارآزمایی‌های بالینی', c: 0xFF6B6B },
    { t: 'رگولاتوری', c: 0xB6F23A },
  ];

  function init() {
    const canvas = document.getElementById('knowledgeCanvas');
    if (!canvas) return;
    let renderer, scene, camera, clock;
    let group, nodes = [], lines = [], particles;
    let mouseX = 0, mouseY = 0;
    let running = true, observer;

    function setup() {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 16);
      clock = new THREE.Clock();

      group = new THREE.Group();
      scene.add(group);

      // Build nodes around a circle
      const N = LABELS.length;
      const R = 5.5;
      const positions = [];
      LABELS.forEach((label, i) => {
        const ang = (i / N) * Math.PI * 2;
        const x = Math.cos(ang) * R;
        const y = Math.sin(ang) * R * 0.7;
        const z = (Math.random() - 0.5) * 2;
        positions.push(new THREE.Vector3(x, y, z));

        // Sphere node
        const geo = new THREE.SphereGeometry(0.32, 18, 18);
        const mat = new THREE.MeshBasicMaterial({ color: label.c });
        const sphere = new THREE.Mesh(geo, mat);
        sphere.position.set(x, y, z);
        sphere.userData = { label: label.t, color: label.c, basePos: sphere.position.clone(), index: i };
        group.add(sphere);
        nodes.push(sphere);

        // Glow sprite
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        const hex = '#' + label.c.toString(16).padStart(6, '0');
        g.addColorStop(0, hex);
        g.addColorStop(1, hex + '00');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
        const tex = new THREE.CanvasTexture(c);
        const spMat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
        const sp = new THREE.Sprite(spMat);
        sp.scale.set(2.2, 2.2, 1);
        sp.position.copy(sphere.position);
        group.add(sp);
        sphere.userData.glow = sp;
      });

      // Lines between adjacent nodes + to center
      const center = new THREE.Vector3(0, 0, 0);
      positions.forEach((p, i) => {
        const next = positions[(i + 1) % positions.length];
        // Connection to next
        const g1 = new THREE.BufferGeometry().setFromPoints([p, next]);
        const m1 = new THREE.LineBasicMaterial({ color: 0x7C4DFF, transparent: true, opacity: 0.35 });
        const l1 = new THREE.Line(g1, m1);
        group.add(l1);
        lines.push({ line: l1, a: p, b: next, index: i });
        // Connection to center
        const g2 = new THREE.BufferGeometry().setFromPoints([p, center]);
        const m2 = new THREE.LineBasicMaterial({ color: 0x2F6BFF, transparent: true, opacity: 0.25 });
        const l2 = new THREE.Line(g2, m2);
        group.add(l2);
      });

      // Central "desk" plane (paper-like)
      const planeGeo = new THREE.PlaneGeometry(2, 2.6);
      const planeMat = new THREE.MeshBasicMaterial({ color: 0x0C1233, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.position.set(0, 0, -0.5);
      group.add(plane);

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
      const pmat = new THREE.PointsMaterial({ color: 0xC7D0F5, size: 0.05, transparent: true, opacity: 0.5 });
      particles = new THREE.Points(pgeo, pmat);
      scene.add(particles);
    }

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.08 + mouseX * 0.4;
      group.rotation.x = mouseY * 0.25;

      // Pulse node glow based on sin wave (light up sequential)
      nodes.forEach((n, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 0.5);
        const scale = 2.2 + pulse * 1.2;
        if (n.userData.glow) {
          n.userData.glow.scale.set(scale, scale, 1);
          n.userData.glow.material.opacity = 0.4 + pulse * 0.5;
        }
        n.scale.setScalar(0.9 + pulse * 0.2);
      });

      // Lines opacity fluctuates
      lines.forEach((l, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.8 + i * 0.7);
        l.line.material.opacity = 0.2 + pulse * 0.4;
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
