// Splash Screen Animation - Dark Background with Fade to Main Site
document.addEventListener('DOMContentLoaded', function() {
  const splash = document.getElementById('splash-overlay');
  const scrambleText = document.getElementById('scramble-text');
  
  if (!splash || !scrambleText) {
    console.warn('Splash elements not found');
    return;
  }

  // Set dark background for splash
  splash.style.background = '#181824';
  splash.style.zIndex = '9999';

  // Loader animation with random characters for 4 seconds
  function loaderAnimation(element, finalText, loaderDuration = 4000, holdTime = 1500) {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const len = finalText.length;
    let startTime = Date.now();
    let isLoaderPhase = true;
    
    function getRandomChar() {
      return chars[Math.floor(Math.random() * chars.length)];
    }
    
    function animate() {
      const elapsed = Date.now() - startTime;
      
      if (isLoaderPhase && elapsed < loaderDuration) {
        // Loader phase: show random characters for 4 seconds
        let randomText = '';
        for (let i = 0; i < len; i++) {
          randomText += getRandomChar();
        }
        element.textContent = randomText;
        requestAnimationFrame(animate);
      } else if (isLoaderPhase) {
        // Loader phase complete, start reveal animation
        isLoaderPhase = false;
        startTime = Date.now();
        revealAnimation();
      }
    }
    
    function revealAnimation() {
      const elapsed = Date.now() - startTime;
      const revealDuration = 1000; // 1 second to reveal the text
      const progress = Math.min(1, elapsed / revealDuration);
      const revealCount = Math.floor(progress * len);
      
      let displayText = '';
      for (let i = 0; i < len; i++) {
        if (i < revealCount) {
          displayText += finalText[i];
        } else {
          displayText += getRandomChar();
        }
      }
      
      element.textContent = displayText;
      
      if (progress < 1) {
        requestAnimationFrame(revealAnimation);
      } else {
        element.textContent = finalText;
        setTimeout(() => {
          fadeToMainSite();
        }, holdTime);
      }
    }
    
    animate();
  }
  
  // Fade out splash to reveal main website
  function fadeToMainSite() {
    splash.style.transition = 'opacity 1.5s ease-out';
    splash.style.opacity = '0';
    
    setTimeout(() => {
      splash.style.display = 'none';
    }, 1500);
  }
  
  // Start the loader animation
  loaderAnimation(scrambleText, 'SELVORA', 4000, 1500);
  
  // Fallback: hide splash after 7 seconds if animation fails
  setTimeout(() => {
    if (splash.style.display !== 'none') {
      fadeToMainSite();
    }
  }, 7000);
}); 