/**
 * Econoris — three-room.js
 * Rotating isometric "private research room" — low-poly cube/cage with
 * glowing door, desk, screens, flasks. Slowly rotates; speeds up on scroll.
 */
(function () {
  const THREE = window.THREE;
  if (!THREE) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const canvas = document.getElementById('roomCanvas');
    if (!canvas) return;
    let renderer, scene, camera, clock;
    let room, particles;
    let mouseX = 0, mouseY = 0;
    let running = true, observer;

    function setup() {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(8, 6, 8);
      camera.lookAt(0, 0, 0);
      clock = new THREE.Clock();

      room = new THREE.Group();
      scene.add(room);

      // Floor (glowing plane)
      const floorGeo = new THREE.PlaneGeometry(6, 6, 6, 6);
      const floorMat = new THREE.MeshBasicMaterial({ color: 0xFF4FA3, wireframe: true, transparent: true, opacity: 0.4 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      room.add(floor);

      // Cage/walls (4 wireframe walls)
      const wallMat = new THREE.MeshBasicMaterial({ color: 0x7C4DFF, wireframe: true, transparent: true, opacity: 0.3 });
      [
        { p: [0, 1.5, -3], r: [0, 0, 0] },
        { p: [0, 1.5, 3], r: [0, Math.PI, 0] },
        { p: [-3, 1.5, 0], r: [0, Math.PI / 2, 0] },
        { p: [3, 1.5, 0], r: [0, -Math.PI / 2, 0] },
      ].forEach(w => {
        const g = new THREE.PlaneGeometry(6, 3);
        const m = new THREE.Mesh(g, wallMat);
        m.position.set(...w.p);
        m.rotation.set(...w.r);
        room.add(m);
      });

      // Desk (box)
      const deskGeo = new THREE.BoxGeometry(2.5, 0.15, 1.2);
      const deskMat = new THREE.MeshBasicMaterial({ color: 0x2F6BFF, transparent: true, opacity: 0.7 });
      const desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.set(0, 1, 0);
      room.add(desk);

      // Screens (planes)
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x00D4C2, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
      [-0.7, 0, 0.7].forEach((x, i) => {
        const s = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.5), screenMat);
        s.position.set(x, 1.4, -0.5);
        room.add(s);
      });

      // Flasks (cones)
      const flaskMat = new THREE.MeshBasicMaterial({ color: 0xB6F23A, transparent: true, opacity: 0.7 });
      [
        { p: [1.5, 0.6, 0.5] },
        { p: [-1.5, 0.6, 0.5] },
      ].forEach(f => {
        const fl = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.7, 8), flaskMat);
        fl.position.set(...f.p);
        fl.rotation.x = Math.PI;
        room.add(fl);
      });

      // Glowing door (frame)
      const doorMat = new THREE.MeshBasicMaterial({ color: 0xFF4FA3, transparent: true, opacity: 0.9 });
      const door = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.5), doorMat);
      door.position.set(0, 0.75, 3);
      door.userData.door = true;
      room.add(door);

      // Light beams from door
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xFF4FA3, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
      const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 4), beamMat);
      beam.position.set(0, 0.75, 4);
      beam.rotation.x = Math.PI / 2;
      room.add(beam);

      // Background particles
      const N = isTouch ? 80 : 200;
      const pgeo = new THREE.BufferGeometry();
      const ppos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        ppos[i*3] = (Math.random() - 0.5) * 30;
        ppos[i*3+1] = (Math.random() - 0.5) * 20;
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
      // Slow rotation, with mouse parallax
      room.rotation.y = t * 0.15 + mouseX * 0.5;
      room.rotation.x = mouseY * 0.2;
      // Door pulse
      room.children.forEach(c => {
        if (c.userData.door) {
          c.material.opacity = 0.6 + 0.4 * Math.sin(t * 1.5);
        }
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
