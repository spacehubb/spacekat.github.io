// ===== VIDEO PLAYER CONTROLLER =====
document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const videoContainers = document.querySelectorAll('.video-autoplay-container');
  
  // Initialize all video players
  videoContainers.forEach(container => {
    initVideoPlayer(container);
  });
});

function initVideoPlayer(container) {
  const iframe = container.querySelector('iframe');
  const muteBtn = container.querySelector('.mute-toggle');
  const spinner = container.querySelector('.spinner');
  
  // Create YouTube player instance
  const player = new YT.Player(iframe, {
    events: {
      'onReady': (e) => setupVideoObserver(e.target, container),
      'onStateChange': (e) => handlePlayerState(e.data, spinner)
    }
  });

  // Mute toggle handler
  muteBtn.addEventListener('click', () => {
    const isMuted = player.isMuted();
    toggleMuteState(player, muteBtn, isMuted);
  });
}

// ===== CORE FUNCTIONS =====
function setupVideoObserver(player, container) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        container.classList.add('loading');
        player.playVideo();
        
        // Restore user's mute preference
        if (!localStorage.getItem('spacekatVideoMuted')) {
          player.unMute();
          updateMuteButton(container, true);
        }
      } else {
        player.pauseVideo();
        container.classList.remove('loading');
      }
    });
  }, {
    threshold: 0.6,
    rootMargin: '0px 0px -100px 0px'
  });

  observer.observe(container);
}

function handlePlayerState(state, spinner) {
  if (state === YT.PlayerState.PLAYING) {
    spinner.style.opacity = '0';
  } else if (state === YT.PlayerState.BUFFERING) {
    spinner.style.opacity = '1';
  }
}

function toggleMuteState(player, muteBtn, isMuted) {
  if (isMuted) {
    player.unMute();
    localStorage.removeItem('spacekatVideoMuted');
  } else {
    player.mute();
    localStorage.setItem('spacekatVideoMuted', 'true');
  }
  updateMuteButton(muteBtn, isMuted);
}

function updateMuteButton(container, isMuted) {
  const icon = container.querySelector('.mute-toggle i');
  icon.className = isMuted ? 'icon fa-volume-up' : 'icon fa-volume-mute';
}

// ===== YOUTUBE API READY HOOK =====
function onYouTubeIframeAPIReady() {
  // This global function is called by YouTube's API script
  console.log('YouTube API ready');
}
