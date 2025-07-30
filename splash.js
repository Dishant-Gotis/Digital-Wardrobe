
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

  // Loader animation with slow character scramble and letter-by-letter reveal for 4 seconds
  function loaderAnimation(element, finalText, totalDuration = 4000, holdTime = 1500) {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const len = finalText.length;
    let startTime = Date.now();
    
    function getRandomChar() {
      return chars[Math.floor(Math.random() * chars.length)];
    }
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalDuration);
      
      if (progress < 1) {
        // Calculate how many letters should be revealed based on progress
        const lettersToReveal = Math.floor(progress * len);
        
        let displayText = '';
        for (let i = 0; i < len; i++) {
          if (i < lettersToReveal) {
            // Show the actual letter
            displayText += finalText[i];
          } else {
            // Show random character for remaining positions
            displayText += getRandomChar();
          }
        }
        
        element.textContent = displayText;
        
        // Continue animation with slower frame rate for more dramatic effect
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, 150); // Slower update rate (150ms instead of immediate)
      } else {
        // Animation complete, show final text
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
  
  // Start the loader animation with 4-second duration
  loaderAnimation(scrambleText, 'SELVORA', 4000, 1500);
  
  // Fallback: hide splash after 6 seconds if animation fails
  setTimeout(() => {
    if (splash.style.display !== 'none') {
      fadeToMainSite();
    }
  }, 6000);
});
