// Start loading progress at 0% and animate it to 100% over 2 seconds
window.addEventListener('load', () => {
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Animate progress bar width to 100% in 2 seconds
    loadingProgress.style.width = '100%';
  
    // Once the progress bar reaches 100%, hide the loading screen by moving it off the screen
    setTimeout(() => {
      document.querySelector('.loading').style.transform = 'translateY(-100%)';
    }, 2000); // This corresponds to the duration of the width animation
  });
  