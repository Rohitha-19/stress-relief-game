let lastClick = Date.now();
let bubbleSpeed = 2000;
let clicks = 0;
let gameInterval;

const gameArea = document.getElementById('game-area');
const emotionText = document.getElementById('emotion');
const messageText = document.getElementById('message');

function getBubbleSize() {
  return Math.min(window.innerWidth * 0.08, 50);
}

function createBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  
  const gameAreaRect = gameArea.getBoundingClientRect();
  const size = getBubbleSize();
  
  bubble.style.left = (Math.random() * (gameAreaRect.width - size)) + 'px';
  bubble.style.top = (Math.random() * (gameAreaRect.height - size)) + 'px';

  const handleBubbleClick = (e) => {
    e.preventDefault();
    const reaction = (Date.now() - lastClick) / 1000;
    clicks++;

    fetch('/emotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction: reaction, clicks: clicks })
    })
      .then(res => res.json())
      .then(data => adaptGame(data.emotion))
      .catch(err => console.error('Fetch error:', err));

    lastClick = Date.now();
    bubble.removeEventListener('click', handleBubbleClick);
    bubble.removeEventListener('touchstart', handleBubbleClick);
    bubble.style.transition = 'all 0.3s ease';
    bubble.style.transform = 'scale(0)';
    setTimeout(() => bubble.remove(), 300);
  };

  // Support both click and touch events for mobile
  bubble.addEventListener('click', handleBubbleClick);
  bubble.addEventListener('touchstart', handleBubbleClick, { passive: false });

  gameArea.appendChild(bubble);
  
  // Responsive bubble lifetime
  const lifetime = Math.max(1500, bubbleSpeed);
  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.remove();
    }
  }, lifetime);
}

function adaptGame(emotion) {
  emotionText.innerText = `Emotion: ${emotion} ${getEmoji(emotion)}`;

  const calmMessages = [
    'You are doing great 🌿',
    'Stay relaxed and enjoy the moment 😊',
    'Perfect balance, keep going ✨',
    'Beautiful calm energy 🌸'
  ];

  const stressMessages = [
    'Take a deep breath 💙',
    'Slow down, there is no rush 🌱',
    'Relax your mind and continue calmly 🌊',
    'Breathe deeply and relax 🧘'
  ];

  const boredMessages = [
    'Let’s add a little fun ✨',
    'Try popping bubbles faster 🎯',
    'Stay focused, you’ve got this 💪',
    'Come on, pop some bubbles! 🫧'
  ];

  const messages = {
    'Calm': calmMessages,
    'Stressed': stressMessages,
    'Bored': boredMessages
  };

  function randomMsg(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const backgrounds = {
    'Calm': 'linear-gradient(135deg, #c7f9cc, #80ed99)',
    'Stressed': 'linear-gradient(135deg, #e0fbfc, #cdb4db)',
    'Bored': 'linear-gradient(135deg, #ffe5d9, #ffcad4)'
  };

  // Update visuals
  document.body.style.background = backgrounds[emotion];
  messageText.innerText = randomMsg(messages[emotion]);

  // Adjust bubble speed
  if (emotion === 'Stressed') {
    bubbleSpeed = 3000;
  } else if (emotion === 'Bored') {
    bubbleSpeed = 1500;
  } else {
    bubbleSpeed = 2000;
  }
}

function getEmoji(emotion) {
  const emojis = {
    'Calm': '😊',
    'Stressed': '😰',
    'Bored': '😴'
  };
  return emojis[emotion] || '😊';
}

// Responsive initialization
function initGame() {
  // Clear existing interval
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  
  // Responsive bubble spawn rate
  const spawnRate = Math.max(1000, window.innerWidth < 480 ? 1400 : 1200);
  gameInterval = setInterval(createBubble, spawnRate);
}

// Handle orientation change and resize
window.addEventListener('resize', () => {
  // Small debounce
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(initGame, 250);
});

window.addEventListener('orientationchange', () => {
  setTimeout(initGame, 500);
});

// Start the game
initGame();
