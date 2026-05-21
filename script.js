/* ==========================================================================
   SASKIA'S 26TH BIRTHDAY WEBSITE - INTERACTIVE SCRIPTS (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Target Birthday Date: May 22, 2026 00:00:00 Local Time
  const TARGET_DATE = new Date('May 22, 2026 00:00:00').getTime();
  
  // DOM Elements
  const curtainCover = document.getElementById('curtain-cover');
  const countdownContainer = document.getElementById('countdown-container');
  const countdownMessage = document.getElementById('countdown-message');
  const unlockBtn = document.getElementById('unlock-btn');
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  // Music Player DOM Elements
  const songTitleEl = document.getElementById('song-title');
  const songArtistEl = document.getElementById('song-artist');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressFill = document.getElementById('progress-fill');
  const progressTrack = document.getElementById('progress-track');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');
  const vinylCenterLabel = document.getElementById('vinyl-label');
  const tonearm = document.getElementById('tonearm');
  
  // Audio Player Data & State
  const audioTracks = [
    {
      title: "Candy",
      artist: "Baekhyun (EXO)",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Sweet placeholder track
      cover: "assets/baekhyun_1.jpg"
    },
    {
      title: "UN Village",
      artist: "Baekhyun (EXO)",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      cover: "assets/baekhyun_2.jpg"
    },
    {
      title: "Bambi",
      artist: "Baekhyun (EXO)",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      cover: "assets/baekhyun_3.jpg"
    }
  ];
  
  let currentTrackIndex = 0;
  let isPlaying = false;
  const audio = new Audio();
  audio.volume = 0.5;
  
  // Set initial track
  updatePlayerDetails();

  // Scroll Reveal Implementation
  const revealElements = document.querySelectorAll('section');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('revealed');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  // Initial run in case elements are already in view
  setTimeout(revealOnScroll, 100);

  /* ==========================================================================
     COUNTDOWN TIMER LOGIC
     ========================================================================== */
  const daysVal = document.getElementById('days');
  const hoursVal = document.getElementById('hours');
  const minutesVal = document.getElementById('minutes');
  const secondsVal = document.getElementById('seconds');

  const updateCountdown = () => {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
      // It is Saskia's Birthday! (May 22, 2026 or later)
      clearInterval(countdownInterval);
      if (countdownContainer) countdownContainer.style.display = 'none';
      if (countdownMessage) {
        countdownMessage.innerHTML = "✨ Hari Istimewa Telah Tiba! ✨<br><span style='font-family: var(--font-romantic); font-size: 3rem; color: var(--vibrant-pink);'>Happy 26th Birthday, Saskia!</span>";
      }
      unlockBtn.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        Buka Kejutan Terindah
      `;
      // Start a subtle infinite confetti curtain effect
      triggerConfettiRain(30);
    } else {
      // Still counting down
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (daysVal) daysVal.innerText = String(days).padStart(2, '0');
      if (hoursVal) hoursVal.innerText = String(hours).padStart(2, '0');
      if (minutesVal) minutesVal.innerText = String(minutes).padStart(2, '0');
      if (secondsVal) secondsVal.innerText = String(seconds).padStart(2, '0');
    }
  };

  // Run immediately and then every second
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Unlock Website
  unlockBtn.addEventListener('click', () => {
    // Play transition sounds if allowed, then slide up cover
    curtainCover.classList.add('unlocked');
    
    // Auto-play music (browsers block auto-play until click interaction, so this is perfect)
    togglePlay(true);

    // Blast massive welcome confetti
    setTimeout(() => {
      triggerConfettiRain(150);
      revealOnScroll();
    }, 1200);
  });

  /* ==========================================================================
     BACKGROUND CANVAS HEART PARTICLES
     ========================================================================== */
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const heartShapes = [];

  class HeartParticle {
    constructor(x, y, size, speedX, speedY, opacity, color) {
      this.x = x || Math.random() * width;
      this.y = y || height + 20;
      this.size = size || Math.random() * 15 + 8;
      this.speedX = speedX || (Math.random() - 0.5) * 1.5;
      this.speedY = speedY || -(Math.random() * 1.5 + 0.8);
      this.opacity = opacity || Math.random() * 0.5 + 0.3;
      this.color = color || `rgba(255, ${Math.floor(Math.random() * 60 + 150)}, ${Math.floor(Math.random() * 40 + 180)}, ${this.opacity})`;
      this.rotation = Math.random() * Math.PI;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      
      // Heart path
      const d = this.size;
      ctx.moveTo(0, d / 4);
      ctx.bezierCurveTo(-d / 2, -d / 2, -d, -d / 4, -d, d / 4);
      ctx.bezierCurveTo(-d, d * 0.7, -d / 4, d, 0, d * 1.2);
      ctx.bezierCurveTo(d / 4, d, d, d * 0.7, d, d / 4);
      ctx.bezierCurveTo(d, -d / 4, d / 2, -d / 2, 0, d / 4);
      
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      
      // Drift slightly
      this.speedX += (Math.random() - 0.5) * 0.05;

      // Wrap-around or recycle
      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.y = height + 20;
        this.x = Math.random() * width;
        this.speedY = -(Math.random() * 1.5 + 0.8);
        this.speedX = (Math.random() - 0.5) * 1.5;
      }
    }
  }

  // Pre-populate background particles
  for (let i = 0; i < 40; i++) {
    particles.push(new HeartParticle(null, Math.random() * height));
  }

  // Click-to-create particle burst
  window.addEventListener('click', (e) => {
    // Exclude button clicks to avoid interference
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a') || e.target.closest('.candle') || e.target.closest('input') || e.target.closest('textarea')) return;
    
    const colors = [
      'rgba(255, 183, 197, 0.7)',
      'rgba(255, 101, 132, 0.7)',
      'rgba(255, 238, 242, 0.7)',
      'rgba(212, 175, 55, 0.6)'
    ];

    for (let i = 0; i < 8; i++) {
      const size = Math.random() * 12 + 6;
      const speedX = (Math.random() - 0.5) * 4;
      const speedY = -(Math.random() * 3 + 1);
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new HeartParticle(e.clientX, e.clientY, size, speedX, speedY, 0.8, color));
      
      // Limit total particles to 120
      if (particles.length > 120) particles.shift();
    }
  });

  // Canvas Animation loop
  const animateParticles = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  };
  animateParticles();

  /* ==========================================================================
     VIRTUAL CAKE SYSTEM (26 CANDLES)
     ========================================================================== */
  const candlesLayer = document.getElementById('candles-layer');
  const cakeTitle = document.getElementById('cake-title');
  const cakeInstructions = document.getElementById('cake-instructions');
  const cakeResetBtn = document.getElementById('cake-reset-btn');
  
  const TOTAL_CANDLES = 26;
  let extinguishedCount = 0;

  const generateCandles = () => {
    candlesLayer.innerHTML = '';
    extinguishedCount = 0;
    
    // Create 26 candles beautifully nested on the cake top
    for (let i = 0; i < TOTAL_CANDLES; i++) {
      const candle = document.createElement('div');
      candle.classList.add('candle');
      candle.id = `candle-${i}`;

      // Distribute them evenly or with slightly random heights/offsets
      const heightOffset = Math.sin((i / (TOTAL_CANDLES - 1)) * Math.PI) * 12; // curve placement
      candle.style.transform = `translateY(${-heightOffset}px)`;
      
      // Multi-colored stripes
      const colors = ['#ff6584', '#ffb7c5', '#ffd43f', '#a8e6cf', '#ffd3b6'];
      const themeColor = colors[i % colors.length];
      const secondColor = '#ffffff';
      candle.style.backgroundImage = `repeating-linear-gradient(45deg, ${themeColor}, ${themeColor} 5px, ${secondColor} 5px, ${secondColor} 10px)`;
      
      candle.innerHTML = `
        <div class="candle-wick"></div>
        <div class="candle-flame"></div>
        <div class="smoke"></div>
      `;

      // Candle click extinguishing mechanism
      candle.addEventListener('click', () => {
        if (!candle.classList.contains('extinguished')) {
          extinguishCandle(candle);
        }
      });

      candlesLayer.appendChild(candle);
    }

    if (cakeTitle) cakeTitle.innerText = "Tiup Lilin Ulang Tahun Saskia!";
    if (cakeInstructions) cakeInstructions.innerText = `Klik setiap lilin untuk meniupnya secara perlahan. Tiup semua ${TOTAL_CANDLES} lilin untuk melengkapi perayaan!`;
    if (cakeResetBtn) cakeResetBtn.style.display = 'none';
  };

  const extinguishCandle = (candle) => {
    candle.classList.add('extinguished');
    extinguishedCount++;
    
    // Splash of localized sparks/hearts
    const rect = candle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    for (let i = 0; i < 4; i++) {
      const size = Math.random() * 8 + 4;
      const speedX = (Math.random() - 0.5) * 2;
      const speedY = -(Math.random() * 2 + 0.5);
      particles.push(new HeartParticle(x, y, size, speedX, speedY, 0.7, 'rgba(255, 101, 132, 0.6)'));
    }

    // Check if all are extinguished
    if (extinguishedCount === TOTAL_CANDLES) {
      setTimeout(celebrateAllCandlesExtinguished, 600);
    }
  };

  const celebrateAllCandlesExtinguished = () => {
    // Beautiful full confetti burst
    triggerConfettiRain(200);

    // Sparkle hearts burst
    for (let i = 0; i < 30; i++) {
      particles.push(new HeartParticle(width / 2, height / 2, Math.random() * 15 + 8, (Math.random() - 0.5) * 8, -(Math.random() * 6 + 2), 0.9));
    }

    if (cakeTitle) cakeTitle.innerText = "✨ Semua Lilin Telah Ditiup! ✨";
    if (cakeInstructions) {
      cakeInstructions.innerHTML = `
        <span style="font-size: 1.25rem; font-weight: 700; color: var(--vibrant-pink); display: block; margin-bottom: 0.5rem;">
          Selamat Ulang Tahun ke-26, Sayang! ❤️
        </span>
        Semoga semua doa, impian, dan harapan terbaikmu dikabulkan di tahun yang baru ini. Selalu bahagia, sehat, dan dipenuhi berkah di setiap langkahmu!
      `;
    }
    if (cakeResetBtn) {
      cakeResetBtn.innerText = "Nyalakan Lilin Kembali";
      cakeResetBtn.style.display = 'inline-block';
    }
  };

  if (cakeResetBtn) {
    cakeResetBtn.addEventListener('click', generateCandles);
  }

  // Generate initial candles
  generateCandles();

  /* ==========================================================================
     INTERACTIVE MUSIC PLAYER LOGIC (BAEKHYUN SPECIAL)
     ========================================================================== */

  function updatePlayerDetails() {
    const track = audioTracks[currentTrackIndex];
    if (songTitleEl) songTitleEl.innerText = track.title;
    if (songArtistEl) songArtistEl.innerText = track.artist;
    
    // Set actual audio src
    audio.src = track.src;
    
    // Sync vinyl center image
    if (vinylCenterLabel) {
      // Using CSS inline variables or background images
      vinylCenterLabel.style.backgroundImage = `url('${track.cover}')`;
    }
  }

  function togglePlay(forcePlay = null) {
    if (forcePlay !== null) {
      isPlaying = !forcePlay;
    }

    if (!isPlaying) {
      // Play Track
      audio.play().then(() => {
        isPlaying = true;
        if (playPauseBtn) {
          playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        }
        vinylCenterLabel.classList.add('vinyl-spinning');
        vinylCenterLabel.classList.remove('vinyl-paused');
        if (tonearm) tonearm.classList.add('active');
      }).catch(err => {
        console.log("Audio play blocked by browser. Awaiting user interaction.", err);
      });
    } else {
      // Pause Track
      audio.pause();
      isPlaying = false;
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      }
      vinylCenterLabel.classList.add('vinyl-paused');
      if (tonearm) tonearm.classList.remove('active');
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', () => togglePlay());

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;
      updatePlayerDetails();
      isPlaying = false;
      togglePlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
      updatePlayerDetails();
      isPlaying = false;
      togglePlay();
    });
  }

  // Audio Time Updates
  audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime;
    const duration = audio.duration || 0;
    
    // Seek Fill percentage
    const fillPercent = duration > 0 ? (current / duration) * 100 : 0;
    if (progressFill) progressFill.style.width = `${fillPercent}%`;
    
    // Timestamps
    if (currentTimeEl) currentTimeEl.innerText = formatTime(current);
    if (totalTimeEl && duration > 0) totalTimeEl.innerText = formatTime(duration);
  });

  // Track ended auto next
  audio.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
    updatePlayerDetails();
    isPlaying = false;
    togglePlay();
  });

  // Click seek track
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const duration = audio.duration || 0;
      
      if (duration > 0) {
        audio.currentTime = (clickX / width) * duration;
      }
    });
  }

  // Volume control Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /* ==========================================================================
     INTERACTIVE BAEKHYUN GALLERY WITH ZOOM LIGHTBOX
     ========================================================================= */
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryCards.forEach(card => {
    // Click card to open lightbox
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.gallery-caption').innerText;
      
      if (lightboxImg) lightboxImg.src = img.src;
      if (lightboxCaption) lightboxCaption.innerText = caption;
      if (lightboxModal) lightboxModal.classList.add('active');
      
      // Floating heart burst on image click
      const rect = card.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        particles.push(new HeartParticle(rect.left + rect.width/2, rect.top + rect.height/2, Math.random() * 10 + 6, (Math.random() - 0.5) * 3, -(Math.random()*3 + 1)));
      }
    });

    // Heart React Count click
    const heartBtn = card.querySelector('.gallery-heart-count');
    if (heartBtn) {
      heartBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop from opening lightbox
        
        const countSpan = heartBtn.querySelector('.heart-val');
        let currentVal = parseInt(countSpan.innerText);
        countSpan.innerText = currentVal + 1;
        
        // Burst local heart particle
        const rect = heartBtn.getBoundingClientRect();
        particles.push(new HeartParticle(rect.left + rect.width/2, rect.top, Math.random() * 12 + 6, (Math.random() - 0.5) * 2, -2, 0.9, 'rgba(255, 101, 132, 0.8)'));
      });
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     WISHES WALL & FORM STORE LOGIC (LOCALSTORAGE PERSISTENCE)
     ========================================================================== */
  const wishForm = document.getElementById('wish-form');
  const senderInput = document.getElementById('wish-sender');
  const messageInput = document.getElementById('wish-message');
  const boardEl = document.getElementById('wishes-board');

  // Pre-seed mock beautiful messages so board is never empty
  const SEED_WISHES = [
    {
      sender: "Ade Maulana",
      message: "Selamat ulang tahun istri tercintaku, Saskia! ❤️ Di usiamu yang ke-26 ini, aku berdoa agar kamu selalu diberikan kesehatan, kelimpahan rezeki, dan kebahagiaan tiada tara. Terima kasih telah melengkapi hidupku dan selalu ada untukku. I love you so much, sweetie! 🎂💕",
      date: "22 Mei 2026"
    },
    {
      sender: "Sahabatmu, Bella",
      message: "Happy 26th Birthday Saskia! 🥳 Semoga selalu menjadi wanita hebat yang kuat dan ceria. Semoga keluarga kecil kalian selalu dilindungi dan dipenuhi kebahagiaan! Aamiin.",
      date: "22 Mei 2026"
    },
    {
      sender: "EXO-L Community",
      message: "Saengil chukha hamnida, Saskia Eonni! 🎂✨ Semoga lancar selalu rezekinya dan semoga segera bisa nonton Baekhyun langsung yaa! Candy is playing for you today! 🍭🍭",
      date: "22 Mei 2026"
    }
  ];

  function getWishes() {
    const saved = localStorage.getItem('saskia_birthday_wishes');
    if (saved) return JSON.parse(saved);
    return SEED_WISHES;
  }

  function saveWishes(wishes) {
    localStorage.setItem('saskia_birthday_wishes', JSON.stringify(wishes));
  }

  function renderWishes() {
    const wishes = getWishes();
    boardEl.innerHTML = '';
    
    if (wishes.length === 0) {
      boardEl.innerHTML = `
        <div class="board-empty-state">
          <svg viewBox="0 0 24 24"><path d="M20.24 11.37a5 5 0 0 1 0 7.07l-7.07 7.07a1 1 0 0 1-1.41 0l-7.07-7.07a5 5 0 0 1 7.07-7.07l.71.71.71-.71a5 5 0 0 1 7.07 0z"/></svg>
          <p>Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>
        </div>
      `;
      return;
    }

    wishes.forEach(item => {
      const sticky = document.createElement('div');
      sticky.classList.add('wish-sticky');
      
      // Random tilt for natural look
      const tilt = (Math.random() - 0.5) * 4;
      sticky.style.transform = `rotate(${tilt}deg)`;

      sticky.innerHTML = `
        <p class="wish-sticky-text">"${item.message}"</p>
        <div class="wish-sticky-meta">
          <span class="wish-sticky-sender">✨ ${item.sender}</span>
          <span class="wish-sticky-date">${item.date}</span>
        </div>
      `;
      
      boardEl.appendChild(sticky);
    });
  }

  // Handle Form Submission
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const sender = senderInput.value.trim();
      const message = messageInput.value.trim();
      
      if (!sender || !message) return;

      const newWish = {
        sender: sender,
        message: message,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      const wishes = getWishes();
      wishes.unshift(newWish); // Add to beginning
      saveWishes(wishes);
      renderWishes();

      // Clear inputs
      senderInput.value = '';
      messageInput.value = '';

      // Soft heart burst on submit
      for (let i = 0; i < 15; i++) {
        particles.push(new HeartParticle(width / 2, height, Math.random() * 12 + 6, (Math.random() - 0.5) * 4, -(Math.random() * 4 + 2)));
      }
    });
  }

  // Render initial wishes on board
  renderWishes();

  /* ==========================================================================
     CONFETTI RAIN UTILITY FUNCTION
     ========================================================================== */
  function triggerConfettiRain(count = 50) {
    const colors = ['#ff6584', '#ffb7c5', '#ffd43f', '#a8e6cf', '#ffd3b6', '#a4b0f5', '#d4af37'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Random style details
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = `scale(${Math.random() * 0.8 + 0.4})`;
      
      // Animation times
      const duration = Math.random() * 3 + 2.5; // 2.5s - 5.5s
      const delay = Math.random() * 1.5;
      
      confetti.style.animation = `confetti-fall ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1) ${delay}s forwards`;
      
      document.body.appendChild(confetti);
      
      // Cleanup DOM
      setTimeout(() => {
        confetti.remove();
      }, (duration + delay) * 1000);
    }
  }

  /* ==========================================================================
     INTERACTIVE LOVE LETTER FLIP OPEN/CLOSE
     ========================================================================== */
  const envelope = document.getElementById('envelope');
  const letterCloseBtn = document.getElementById('letter-close');

  if (envelope) {
    envelope.addEventListener('click', (e) => {
      // Prevent opening click if close button is clicked
      if (e.target.closest('#letter-close')) return;
      
      if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        // Sparkles on open
        const rect = envelope.getBoundingClientRect();
        for (let i = 0; i < 15; i++) {
          particles.push(new HeartParticle(rect.left + rect.width / 2, rect.top, Math.random() * 10 + 6, (Math.random() - 0.5) * 4, -(Math.random() * 3 + 1)));
        }
      }
    });
  }

  if (letterCloseBtn) {
    letterCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering envelope click to open
      if (envelope) envelope.classList.remove('open');
    });
  }
});
