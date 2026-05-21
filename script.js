/* ==========================================================================
   SASKIA'S 26TH BIRTHDAY WEBSITE - script.js (Fixed & Robust Version)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ── Target Birthday: 22 Mei 2026 pukul 00:00:00 waktu lokal ──
  // Gunakan konstruktor numerik — LEBIH AMAN di semua browser
  // new Date(year, monthIndex, day, hour, min, sec)
  // monthIndex: 0=Jan, 1=Feb, ..., 4=May
  var TARGET_DATE = new Date(2026, 4, 22, 0, 0, 0).getTime();

  // ── Semua DOM Elements (dideklarasikan di atas agar tidak ada ReferenceError) ──
  var curtainCover     = document.getElementById('curtain-cover');
  var countdownContainer = document.getElementById('countdown-container');
  var countdownMessage = document.getElementById('countdown-message');
  var unlockBtn        = document.getElementById('unlock-btn');
  var canvas           = document.getElementById('particle-canvas');

  // Music Player elements
  var songTitleEl      = document.getElementById('song-title');
  var songArtistEl     = document.getElementById('song-artist');
  var playPauseBtn     = document.getElementById('play-pause-btn');
  var prevBtn          = document.getElementById('prev-btn');
  var nextBtn          = document.getElementById('next-btn');
  var progressFill     = document.getElementById('progress-fill');
  var progressTrack    = document.getElementById('progress-track');
  var currentTimeEl    = document.getElementById('current-time');
  var totalTimeEl      = document.getElementById('total-time');
  var volumeSlider     = document.getElementById('volume-slider');
  var vinylCenterLabel = document.getElementById('vinyl-label');
  var tonearm          = document.getElementById('tonearm');

  // Countdown elements
  var daysVal    = document.getElementById('days');
  var hoursVal   = document.getElementById('hours');
  var minutesVal = document.getElementById('minutes');
  var secondsVal = document.getElementById('seconds');

  // ── Audio Setup ──
  var audioTracks = [
    { title: "Candy",      artist: "Baekhyun (EXO)", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "assets/baekhyun_1.jpg" },
    { title: "UN Village", artist: "Baekhyun (EXO)", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "assets/baekhyun_2.jpg" },
    { title: "Bambi",      artist: "Baekhyun (EXO)", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "assets/baekhyun_3.jpg" }
  ];

  var currentTrackIndex = 0;
  var isPlaying = false;
  var audio = new Audio();
  audio.volume = 0.5;

  // ── Canvas Setup (guard jika canvas tidak ada) ──
  var ctx = null;
  var particles = [];
  var canvasWidth = 0;
  var canvasHeight = 0;

  if (canvas) {
    ctx = canvas.getContext('2d');
    canvasWidth  = canvas.width  = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;

    window.addEventListener('resize', function () {
      canvasWidth  = canvas.width  = window.innerWidth;
      canvasHeight = canvas.height = window.innerHeight;
    });
  }

  /* ==========================================================================
     COUNTDOWN TIMER
     ========================================================================== */
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    var now  = new Date().getTime();
    var diff = TARGET_DATE - now;

    if (diff <= 0) {
      // 🎉 Hari Ulang Tahun sudah tiba!
      clearInterval(countdownInterval);

      if (countdownContainer) countdownContainer.style.display = 'none';

      if (countdownMessage) {
        countdownMessage.innerHTML =
          '✨ Hari Istimewa Telah Tiba! ✨<br>' +
          '<span style="font-family:var(--font-romantic);font-size:3rem;color:var(--vibrant-pink);">' +
          'Happy 26th Birthday, Saskia!</span>';
      }

      if (unlockBtn) {
        unlockBtn.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 ' +
          '2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 ' +
          '22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
          ' Buka Kejutan Terindah';
      }

      triggerConfettiRain(30);

    } else {
      var days    = Math.floor(diff / 86400000);
      var hours   = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000)  / 60000);
      var seconds = Math.floor((diff % 60000)    / 1000);

      if (daysVal)    daysVal.innerText    = pad(days);
      if (hoursVal)   hoursVal.innerText   = pad(hours);
      if (minutesVal) minutesVal.innerText = pad(minutes);
      if (secondsVal) secondsVal.innerText = pad(seconds);
    }
  }

  updateCountdown();
  var countdownInterval = setInterval(updateCountdown, 1000);

  /* ==========================================================================
     UNLOCK BUTTON
     ========================================================================== */
  if (unlockBtn) {
    unlockBtn.addEventListener('click', function () {
      if (curtainCover) curtainCover.classList.add('unlocked');
      togglePlay(true);
      setTimeout(function () {
        triggerConfettiRain(150);
        revealOnScroll();
      }, 1200);
    });
  }

  /* ==========================================================================
     SCROLL REVEAL
     ========================================================================== */
  var revealElements = document.querySelectorAll('section');

  function revealOnScroll() {
    var triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(function (el) {
      if (el.getBoundingClientRect().top < triggerBottom) {
        el.classList.add('revealed');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  setTimeout(revealOnScroll, 100);

  /* ==========================================================================
     CANVAS HEART PARTICLES
     ========================================================================== */
  function HeartParticle(x, y, size, speedX, speedY, opacity, color) {
    this.x       = (x !== null && x !== undefined) ? x : Math.random() * canvasWidth;
    this.y       = (y !== null && y !== undefined) ? y : canvasHeight + 20;
    this.size    = size   || (Math.random() * 15 + 8);
    this.speedX  = speedX || ((Math.random() - 0.5) * 1.5);
    this.speedY  = speedY || (-(Math.random() * 1.5 + 0.8));
    this.opacity = opacity|| (Math.random() * 0.5 + 0.3);
    this.color   = color  || 'rgba(255,' + (Math.floor(Math.random()*60+150)) + ',' + (Math.floor(Math.random()*40+180)) + ',' + this.opacity + ')';
    this.rotation      = Math.random() * Math.PI;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }

  HeartParticle.prototype.draw = function () {
    if (!ctx) return;
    var d = this.size;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, d / 4);
    ctx.bezierCurveTo(-d/2, -d/2, -d, -d/4, -d, d/4);
    ctx.bezierCurveTo(-d, d*0.7, -d/4, d, 0, d*1.2);
    ctx.bezierCurveTo(d/4, d, d, d*0.7, d, d/4);
    ctx.bezierCurveTo(d, -d/4, d/2, -d/2, 0, d/4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  HeartParticle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.speedX += (Math.random() - 0.5) * 0.05;
    if (this.y < -20 || this.x < -20 || this.x > canvasWidth + 20) {
      this.y = canvasHeight + 20;
      this.x = Math.random() * canvasWidth;
      this.speedY = -(Math.random() * 1.5 + 0.8);
      this.speedX = (Math.random() - 0.5) * 1.5;
    }
  };

  // Prepopulate particles
  for (var i = 0; i < 40; i++) {
    particles.push(new HeartParticle(null, Math.random() * canvasHeight));
  }

  // Click burst
  window.addEventListener('click', function (e) {
    var t = e.target;
    if (t.tagName === 'BUTTON' || t.closest('button') || t.closest('a') ||
        t.closest('.candle') || t.closest('input') || t.closest('textarea')) return;
    var colors = ['rgba(255,183,197,0.7)','rgba(255,101,132,0.7)','rgba(255,238,242,0.7)','rgba(212,175,55,0.6)'];
    for (var j = 0; j < 8; j++) {
      particles.push(new HeartParticle(
        e.clientX, e.clientY,
        Math.random()*12+6,
        (Math.random()-0.5)*4,
        -(Math.random()*3+1),
        0.8,
        colors[Math.floor(Math.random()*colors.length)]
      ));
      if (particles.length > 120) particles.shift();
    }
  });

  function animateParticles() {
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      particles.forEach(function (p) { p.update(); p.draw(); });
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ==========================================================================
     VIRTUAL CAKE – 26 CANDLES
     ========================================================================== */
  var candlesLayer    = document.getElementById('candles-layer');
  var cakeTitle       = document.getElementById('cake-title');
  var cakeInstructions= document.getElementById('cake-instructions');
  var cakeResetBtn    = document.getElementById('cake-reset-btn');
  var TOTAL_CANDLES   = 26;
  var extinguishedCount = 0;

  function generateCandles() {
    if (!candlesLayer) return;
    candlesLayer.innerHTML = '';
    extinguishedCount = 0;
    var colors = ['#ff6584','#ffb7c5','#ffd43f','#a8e6cf','#ffd3b6'];

    for (var k = 0; k < TOTAL_CANDLES; k++) {
      var candle = document.createElement('div');
      candle.classList.add('candle');
      candle.id = 'candle-' + k;
      var heightOffset = Math.sin((k / (TOTAL_CANDLES - 1)) * Math.PI) * 12;
      candle.style.transform = 'translateY(' + (-heightOffset) + 'px)';
      var tc = colors[k % colors.length];
      candle.style.backgroundImage = 'repeating-linear-gradient(45deg,' + tc + ',' + tc + ' 5px,#fff 5px,#fff 10px)';
      candle.innerHTML = '<div class="candle-wick"></div><div class="candle-flame"></div><div class="smoke"></div>';

      (function (c) {
        c.addEventListener('click', function () {
          if (!c.classList.contains('extinguished')) extinguishCandle(c);
        });
      })(candle);

      candlesLayer.appendChild(candle);
    }

    if (cakeTitle)        cakeTitle.innerText = 'Tiup Lilin Ulang Tahun Saskia!';
    if (cakeInstructions) cakeInstructions.innerText = 'Klik setiap lilin untuk meniupnya. Tiup semua ' + TOTAL_CANDLES + ' lilin untuk melengkapi perayaan!';
    if (cakeResetBtn)     cakeResetBtn.style.display = 'none';
  }

  function extinguishCandle(candle) {
    candle.classList.add('extinguished');
    extinguishedCount++;
    var rect = candle.getBoundingClientRect();
    for (var m = 0; m < 4; m++) {
      particles.push(new HeartParticle(
        rect.left + rect.width/2, rect.top,
        Math.random()*8+4,
        (Math.random()-0.5)*2, -(Math.random()*2+0.5),
        0.7, 'rgba(255,101,132,0.6)'
      ));
    }
    if (extinguishedCount === TOTAL_CANDLES) {
      setTimeout(celebrateAllCandles, 600);
    }
  }

  function celebrateAllCandles() {
    triggerConfettiRain(200);
    for (var n = 0; n < 30; n++) {
      particles.push(new HeartParticle(
        canvasWidth/2, canvasHeight/2,
        Math.random()*15+8, (Math.random()-0.5)*8, -(Math.random()*6+2), 0.9
      ));
    }
    if (cakeTitle)        cakeTitle.innerText = '✨ Semua Lilin Telah Ditiup! ✨';
    if (cakeInstructions) cakeInstructions.innerHTML =
      '<span style="font-size:1.25rem;font-weight:700;color:var(--vibrant-pink);display:block;margin-bottom:.5rem;">Selamat Ulang Tahun ke-26, Sayang! ❤️</span>' +
      'Semoga semua doa, impian, dan harapan terbaikmu dikabulkan di tahun yang baru ini!';
    if (cakeResetBtn) {
      cakeResetBtn.innerText = 'Nyalakan Lilin Kembali';
      cakeResetBtn.style.display = 'inline-block';
    }
  }

  if (cakeResetBtn) cakeResetBtn.addEventListener('click', generateCandles);
  generateCandles();

  /* ==========================================================================
     MUSIC PLAYER
     ========================================================================== */
  function updatePlayerDetails() {
    var track = audioTracks[currentTrackIndex];
    if (songTitleEl)      songTitleEl.innerText  = track.title;
    if (songArtistEl)     songArtistEl.innerText = track.artist;
    audio.src = track.src;
    if (vinylCenterLabel) vinylCenterLabel.style.backgroundImage = "url('" + track.cover + "')";
  }

  function togglePlay(forcePlay) {
    if (forcePlay === true)  isPlaying = false;
    if (forcePlay === false) isPlaying = true;

    if (!isPlaying) {
      audio.play().then(function () {
        isPlaying = true;
        if (playPauseBtn) playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        if (vinylCenterLabel) { vinylCenterLabel.classList.add('vinyl-spinning'); vinylCenterLabel.classList.remove('vinyl-paused'); }
        if (tonearm) tonearm.classList.add('active');
      }).catch(function () {});
    } else {
      audio.pause();
      isPlaying = false;
      if (playPauseBtn) playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      if (vinylCenterLabel) vinylCenterLabel.classList.add('vinyl-paused');
      if (tonearm) tonearm.classList.remove('active');
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', function () { togglePlay(); });

  if (prevBtn) prevBtn.addEventListener('click', function () {
    currentTrackIndex = (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;
    updatePlayerDetails(); isPlaying = false; togglePlay(true);
  });

  if (nextBtn) nextBtn.addEventListener('click', function () {
    currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
    updatePlayerDetails(); isPlaying = false; togglePlay(true);
  });

  audio.addEventListener('timeupdate', function () {
    var cur = audio.currentTime, dur = audio.duration || 0;
    if (progressFill) progressFill.style.width = (dur > 0 ? (cur/dur*100) : 0) + '%';
    if (currentTimeEl) currentTimeEl.innerText = formatTime(cur);
    if (totalTimeEl && dur > 0) totalTimeEl.innerText = formatTime(dur);
  });

  audio.addEventListener('ended', function () {
    currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
    updatePlayerDetails(); isPlaying = false; togglePlay(true);
  });

  if (progressTrack) {
    progressTrack.addEventListener('click', function (e) {
      var rect = progressTrack.getBoundingClientRect();
      var dur  = audio.duration || 0;
      if (dur > 0) audio.currentTime = ((e.clientX - rect.left) / rect.width) * dur;
    });
  }

  if (volumeSlider) volumeSlider.addEventListener('input', function (e) { audio.volume = e.target.value; });

  function formatTime(secs) {
    var m = Math.floor(secs / 60), s = Math.floor(secs % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Init player AFTER functions are defined
  updatePlayerDetails();

  /* ==========================================================================
     GALLERY LIGHTBOX
     ========================================================================== */
  var galleryCards   = document.querySelectorAll('.gallery-card');
  var lightboxModal  = document.getElementById('lightbox-modal');
  var lightboxImg    = document.getElementById('lightbox-img');
  var lightboxCaption= document.getElementById('lightbox-caption');
  var lightboxClose  = document.getElementById('lightbox-close');

  galleryCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var img     = card.querySelector('img');
      var caption = card.querySelector('.gallery-caption');
      if (lightboxImg)     lightboxImg.src         = img ? img.src : '';
      if (lightboxCaption) lightboxCaption.innerText= caption ? caption.innerText : '';
      if (lightboxModal)   lightboxModal.classList.add('active');
      var rect = card.getBoundingClientRect();
      for (var i = 0; i < 5; i++) {
        particles.push(new HeartParticle(
          rect.left + rect.width/2, rect.top + rect.height/2,
          Math.random()*10+6, (Math.random()-0.5)*3, -(Math.random()*3+1)
        ));
      }
    });

    var heartBtn = card.querySelector('.gallery-heart-count');
    if (heartBtn) {
      heartBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var countSpan = heartBtn.querySelector('.heart-val');
        if (countSpan) countSpan.innerText = parseInt(countSpan.innerText) + 1;
        var r = heartBtn.getBoundingClientRect();
        particles.push(new HeartParticle(r.left+r.width/2, r.top, Math.random()*12+6, (Math.random()-0.5)*2, -2, 0.9, 'rgba(255,101,132,0.8)'));
      });
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', function () { if (lightboxModal) lightboxModal.classList.remove('active'); });
  if (lightboxModal) lightboxModal.addEventListener('click', function (e) { if (e.target === lightboxModal) lightboxModal.classList.remove('active'); });

  /* ==========================================================================
     WISHES WALL
     ========================================================================== */
  var wishForm      = document.getElementById('wish-form');
  var senderInput   = document.getElementById('wish-sender');
  var messageInput  = document.getElementById('wish-message');
  var boardEl       = document.getElementById('wishes-board');

  var SEED_WISHES = [
    {
      sender: "Ade Maulana",
      message: "Selamat ulang tahun istri tercintaku, Saskia! ❤️ Di usiamu yang ke-26 ini, aku berdoa agar kamu selalu diberikan kesehatan, kelimpahan rezeki, dan kebahagiaan tiada tara. Terima kasih telah melengkapi hidupku. I love you so much, sweetie! 🎂💕",
      date: "22 Mei 2026"
    },
    {
      sender: "Sahabatmu, Bella",
      message: "Happy 26th Birthday Saskia! 🥳 Semoga selalu menjadi wanita hebat yang kuat dan ceria. Semoga keluarga kecil kalian selalu dilindungi dan dipenuhi kebahagiaan! Aamiin.",
      date: "22 Mei 2026"
    },
    {
      sender: "EXO-L Community",
      message: "Saengil chukha hamnida, Saskia Eonni! 🎂✨ Semoga lancar selalu rezekinya dan semoga segera bisa nonton Baekhyun langsung! Candy is playing for you today! 🍭🍭",
      date: "22 Mei 2026"
    }
  ];

  function getWishes() {
    try {
      var saved = localStorage.getItem('saskia_birthday_wishes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SEED_WISHES;
  }

  function saveWishes(wishes) {
    try { localStorage.setItem('saskia_birthday_wishes', JSON.stringify(wishes)); } catch (e) {}
  }

  function renderWishes() {
    if (!boardEl) return;
    var wishes = getWishes();
    boardEl.innerHTML = '';
    if (wishes.length === 0) {
      boardEl.innerHTML = '<div class="board-empty-state"><p>Belum ada ucapan. Jadilah yang pertama!</p></div>';
      return;
    }
    wishes.forEach(function (item) {
      var sticky = document.createElement('div');
      sticky.classList.add('wish-sticky');
      sticky.style.transform = 'rotate(' + ((Math.random()-0.5)*4) + 'deg)';
      sticky.innerHTML =
        '<p class="wish-sticky-text">"' + item.message + '"</p>' +
        '<div class="wish-sticky-meta">' +
          '<span class="wish-sticky-sender">✨ ' + item.sender + '</span>' +
          '<span class="wish-sticky-date">'   + item.date    + '</span>' +
        '</div>';
      boardEl.appendChild(sticky);
    });
  }

  if (wishForm) {
    wishForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var sender  = senderInput  ? senderInput.value.trim()  : '';
      var message = messageInput ? messageInput.value.trim() : '';
      if (!sender || !message) return;
      var newWish = { sender: sender, message: message, date: new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) };
      var wishes = getWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();
      if (senderInput)  senderInput.value  = '';
      if (messageInput) messageInput.value = '';
      for (var q = 0; q < 15; q++) {
        particles.push(new HeartParticle(canvasWidth/2, canvasHeight, Math.random()*12+6, (Math.random()-0.5)*4, -(Math.random()*4+2)));
      }
    });
  }
  renderWishes();

  /* ==========================================================================
     CONFETTI
     ========================================================================== */
  function triggerConfettiRain(count) {
    var colors = ['#ff6584','#ffb7c5','#ffd43f','#a8e6cf','#ffd3b6','#a4b0f5','#d4af37'];
    for (var r = 0; r < (count || 50); r++) {
      var confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = (Math.random()*100) + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
      confetti.style.transform = 'scale(' + (Math.random()*0.8+0.4) + ')';
      var duration = Math.random()*3 + 2.5;
      var delay    = Math.random()*1.5;
      confetti.style.animation = 'confetti-fall ' + duration + 's cubic-bezier(0.1,0.8,0.3,1) ' + delay + 's forwards';
      document.body.appendChild(confetti);
      setTimeout(function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; }(confetti), (duration + delay) * 1000);
    }
  }

  /* ==========================================================================
     LOVE LETTER ENVELOPE
     ========================================================================== */
  var envelope      = document.getElementById('envelope');
  var letterCloseBtn= document.getElementById('letter-close');

  if (envelope) {
    envelope.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#letter-close')) return;
      if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        var rect = envelope.getBoundingClientRect();
        for (var s = 0; s < 15; s++) {
          particles.push(new HeartParticle(
            rect.left + rect.width/2, rect.top,
            Math.random()*10+6, (Math.random()-0.5)*4, -(Math.random()*3+1)
          ));
        }
      }
    });
  }

  if (letterCloseBtn) {
    letterCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (envelope) envelope.classList.remove('open');
    });
  }

}); // end DOMContentLoaded
