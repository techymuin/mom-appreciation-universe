const birthDate = '2003-01-01';

const memoryStars = [
  {
    title: 'The First Safe Place',
    kicker: 'Memory Star 01',
    image: 'assets/sample-memory-1.png',
    text:
      'Sample memory: You were the first person who made the world feel safe. Replace this with a real memory from childhood.'
  },
  {
    title: 'Every Quiet Sacrifice',
    kicker: 'Memory Star 02',
    image: 'assets/sample-memory-2.png',
    text:
      'Sample memory: This star is for every sacrifice you made without asking anyone to notice.'
  },
  {
    title: 'The Warmest Voice',
    kicker: 'Memory Star 03',
    image: 'assets/sample-memory-3.png',
    text:
      'Sample memory: Your voice has always been the sound of home. Add a personal note or voice-message idea here.'
  },
  {
    title: 'A Universe Of Thank You',
    kicker: 'Memory Star 04',
    image: 'assets/sample-memory-4.png',
    text:
      'Sample memory: This one is for everything I still do not know how to thank you for.'
  }
];

const canvas = document.getElementById('starCanvas');
const context = canvas.getContext('2d');
const welcomeScreen = document.getElementById('welcomeScreen');
const enterButton = document.getElementById('enterButton');
const musicToggle = document.getElementById('musicToggle');
const music = document.getElementById('backgroundMusic');
const amazingDays = document.getElementById('amazingDays');
const memoryModal = document.getElementById('memoryModal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalKicker = document.getElementById('modalKicker');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');

let stars = [];
let musicEnabled = false;
let lastFocusedElement = null;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createStars();
}

function createStars() {
  const count = Math.min(170, Math.floor((window.innerWidth * window.innerHeight) / 6800));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.6 + 0.35,
    alpha: Math.random() * 0.7 + 0.25,
    speed: Math.random() * 0.18 + 0.04,
    twinkle: Math.random() * Math.PI * 2
  }));
}

function drawStars() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((star) => {
    star.y += star.speed;
    star.twinkle += 0.018;

    if (star.y > window.innerHeight + 8) {
      star.y = -8;
      star.x = Math.random() * window.innerWidth;
    }

    const glow = star.alpha + Math.sin(star.twinkle) * 0.18;
    context.beginPath();
    context.fillStyle = `rgba(255, 248, 238, ${Math.max(0.12, glow)})`;
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(drawStars);
}

function updateAmazingDays() {
  const start = new Date(`${birthDate}T00:00:00`);
  const today = new Date();
  const diff = today - start;
  const days = Math.max(0, Math.floor(diff / 86400000));
  amazingDays.textContent = new Intl.NumberFormat('en-US').format(days);
}

async function playMusic() {
  try {
    await music.play();
    musicEnabled = true;
    musicToggle.textContent = 'Music On';
    musicToggle.classList.add('is-on');
    musicToggle.setAttribute('aria-pressed', 'true');
  } catch {
    musicEnabled = false;
  }
}

function pauseMusic() {
  music.pause();
  musicEnabled = false;
  musicToggle.textContent = 'Music Off';
  musicToggle.classList.remove('is-on');
  musicToggle.setAttribute('aria-pressed', 'false');
}

function openMemory(index) {
  const memory = memoryStars[index];
  if (!memory) return;

  lastFocusedElement = document.activeElement;
  modalImage.src = memory.image;
  modalImage.alt = memory.title;
  modalKicker.textContent = memory.kicker;
  modalTitle.textContent = memory.title;
  modalText.textContent = memory.text;
  memoryModal.classList.add('is-open');
  memoryModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  modalClose.focus();
}

function closeMemory() {
  memoryModal.classList.remove('is-open');
  memoryModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

enterButton.addEventListener('click', () => {
  welcomeScreen.classList.add('is-hidden');
  playMusic();
});

musicToggle.addEventListener('click', () => {
  if (musicEnabled) {
    pauseMusic();
  } else {
    playMusic();
  }
});

document.querySelectorAll('.memory-star').forEach((button) => {
  button.addEventListener('click', () => openMemory(Number(button.dataset.memory)));
});

modalClose.addEventListener('click', closeMemory);

memoryModal.addEventListener('click', (event) => {
  if (event.target === memoryModal) {
    closeMemory();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && memoryModal.classList.contains('is-open')) {
    closeMemory();
  }
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
drawStars();
updateAmazingDays();
