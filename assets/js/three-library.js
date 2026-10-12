/**
 * Econoris — three-library.js
 * Floating 3D library: orbiting journal/database cards around a glowing center.
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const canvas = document.getElementById('libraryCanvas');
    if (!canvas) return;
    let renderer, scene, camera, clock;
    let group;
    let running = true, observer;

    function setup() {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 14);
      clock = new THREE.Clock();

      group = new THREE.Group();
      scene.add(group);

      // Central glowing core
      const coreGeo = new THREE.SphereGeometry(0.8, 24, 24);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00D4C2 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);
      // Core glow
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, '#00D4C2'); g.addColorStop(1, '#00D4C200');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.CanvasTexture(c);
      const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      coreGlow.scale.set(4, 4, 1);
      group.add(coreGlow);

      // Orbiting cards (small flat planes representing journals)
      const labels = ['PubMed', 'Scopus', 'Web of Science', 'SciFinder', 'Reaxys', 'SpringerLink', 'ScienceDirect', 'ClinicalTrials'];
      const colors = [0x2F6BFF, 0x7C4DFF, 0x00D4C2, 0xFFB938, 0xFF4FA3, 0xB6F23A, 0xFF6B6B, 0x2F6BFF];
      const N = isTouch ? 6 : labels.length;
      for (let i = 0; i < N; i++) {
        const radius = 3 + (i % 3) * 1.2;
        const speed = 0.2 + Math.random() * 0.3;
        const ang = (i / N) * Math.PI * 2;
        const yOffset = (Math.random() - 0.5) * 3;
        const cardGeo = new THREE.PlaneGeometry(1, 1.3);
        const cardMat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        const card = new THREE.Mesh(cardGeo, cardMat);
        card.position.set(Math.cos(ang) * radius, yOffset, Math.sin(ang) * radius);
        card.userData = { radius, speed, ang, yOffset, color: colors[i] };
        group.add(card);

        // Glow on card
        const c2 = document.createElement('canvas');
        c2.width = c2.height = 64;
        const ctx2 = c2.getContext('2d');
        const g2 = ctx2.createRadialGradient(32, 32, 0, 32, 32, 32);
        const hex = '#' + colors[i].toString(16).padStart(6, '0');
        g2.addColorStop(0, hex); g2.addColorStop(1, hex + '00');
        ctx2.fillStyle = g2; ctx2.fillRect(0, 0, 64, 64);
        const tex2 = new THREE.CanvasTexture(c2);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex2, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        glow.scale.set(2.5, 2.5, 1);
        card.userData.glow = glow;
        group.add(glow);
      }

      // Background particles
      const Np = isTouch ? 80 : 200;
      const pgeo = new THREE.BufferGeometry();
      const ppos = new Float32Array(Np * 3);
      for (let i = 0; i < Np; i++) {
        ppos[i*3] = (Math.random() - 0.5) * 40;
        ppos[i*3+1] = (Math.random() - 0.5) * 25;
        ppos[i*3+2] = (Math.random() - 0.5) * 20 - 5;
      }
      pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
      const pmat = new THREE.PointsMaterial({ color: 0xC7D0F5, size: 0.04, transparent: true, opacity: 0.5 });
      const particles = new THREE.Points(pgeo, pmat);
      scene.add(particles);
      group.userData.particles = particles;
    }

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.08;
      group.children.forEach(c => {
        if (c.userData.radius) {
          const ang = c.userData.ang + t * c.userData.speed;
          c.position.x = Math.cos(ang) * c.userData.radius;
          c.position.z = Math.sin(ang) * c.userData.radius;
          c.position.y = c.userData.yOffset + Math.sin(t + c.userData.ang) * 0.3;
          c.lookAt(0, c.position.y, 0);
          if (c.userData.glow) c.userData.glow.position.copy(c.position);
        }
      });
      if (group.userData.particles) group.userData.particles.rotation.y = t * 0.02;
      renderer.render(scene, camera);
    }

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
