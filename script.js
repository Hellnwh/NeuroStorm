// SETUP 3D SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('brainCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;

// LIGHTING
const light = new THREE.PointLight(0x00ffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// NEURON NODES
const neuronMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const sparks = [];
for (let i = 0; i < 50; i++) {
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), neuronMaterial);
  sphere.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
  scene.add(sphere);
  sparks.push(sphere);
}

// ANIMATE NEURONS
function animate() {
  requestAnimationFrame(animate);
  sparks.forEach((s, i) => {
    s.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + i) * 0.2);
  });
  renderer.render(scene, camera);
}
animate();

// TOGGLE ELECTRICAL SHOCK
let shockMode = false;
document.getElementById('toggleShock').addEventListener('click', () => {
  shockMode = !shockMode;
  if (shockMode) triggerShock();
});

const shockSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2c8d2920b6.mp3'); // Free zap SFX

function triggerShock() {
  if (!shockMode) return;
  for (let i = 0; i < sparks.length; i++) {
    sparks[i].material.color.set(Math.random() > 0.5 ? 0xff0000 : 0xffff00);
  }
  shockSound.play();
  setTimeout(() => {
    sparks.forEach(s => s.material.color.set(0x00ffff));
    if (shockMode) setTimeout(triggerShock, 1500);
  }, 300);
}

// EEG BRAINWAVE CHART
const eegChart = new Chart(document.getElementById('eegChart'), {
  type: 'line',
  data: {
    labels: Array(30).fill(''),
    datasets: [{
      label: 'Brainwave Activity',
      data: Array(30).fill(0),
      borderColor: '#0ff',
      borderWidth: 2,
      fill: false
    }]
  },
  options: {
    animation: false,
    scales: { y: { suggestedMin: -1, suggestedMax: 1 } },
    plugins: { legend: { display: false } }
  }
});

setInterval(() => {
  const waveData = Math.sin(Date.now() * 0.005) + (shockMode ? Math.random() * 1.5 : Math.random() * 0.3);
  eegChart.data.datasets[0].data.shift();
  eegChart.data.datasets[0].data.push(waveData);
  eegChart.update();
}, 100);
a
