// Scroll reveal effect for .video-block elements in swipe/scroll area
// Uses Intersection Observer API

document.addEventListener('DOMContentLoaded', function() {
  const blocks = document.querySelectorAll('.video-block');
  const revealClass = 'reveal-scroll';

  // Initial state: hide blocks
  blocks.forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(60px) scale(0.96)';
    block.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)';
  });

  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(revealClass);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  blocks.forEach(block => {
    observer.observe(block);
  });
});
