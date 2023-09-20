//inject library
var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js';
document.body.appendChild(js);

// 

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}


function confettiFirework(){
  const animationStart = Date.now();
  let interval = setInterval(function() {
    const duration = 3 * 1000
    const timeLeft = animationStart + duration - Date.now();
  
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
  
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
    const particleCount = 50 * (timeLeft / duration);
  
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(1, 1.2), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}

