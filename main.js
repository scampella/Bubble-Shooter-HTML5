window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  // --- Размер канваса под экран ---
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // --- Базовые параметры игры ---
  let bubbles = [];
  let bubbleRadius = 20;
  let shooterX = canvas.width / 2;
  let shooterY = canvas.height - 50;
  let currentBubble = createBubble();

  function createBubble() {
    const colors = ["red", "green", "blue", "yellow", "purple"];
    return {
      x: shooterX,
      y: shooterY,
      color: colors[Math.floor(Math.random() * colors.length)],
      dx: 0,
      dy: 0,
      active: false,
    };
  }

  function drawBubble(bubble) {
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubbleRadius, 0, Math.PI * 2);
    context.fillStyle = bubble.color;
    context.fill();
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();
  }

  // --- Управление: мышь или палец ---
  function shootBubble(targetX, targetY) {
    if (!currentBubble.active) {
      const angle = Math.atan2(targetY - shooterY, targetX - shooterX);
      currentBubble.dx = Math.cos(angle) * 5;
      currentBubble.dy = Math.sin(angle) * 5;
      currentBubble.active = true;
    }
  }

  canvas.addEventListener("click", (e) => {
    shootBubble(e.clientX, e.clientY);
  });

  canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    shootBubble(touch.clientX, touch.clientY);
  });

  // --- Игровой цикл ---
  function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // отрисовать текущий шарик
    if (currentBubble.active) {
      currentBubble.x += currentBubble.dx;
      currentBubble.y += currentBubble.dy;

      // столкновение со стенами
      if (currentBubble.x - bubbleRadius < 0 || currentBubble.x + bubbleRadius > canvas.width) {
        currentBubble.dx *= -1;
      }
      if (currentBubble.y - bubbleRadius < 0) {
        bubbles.push(currentBubble);
        currentBubble = createBubble();
      }
      drawBubble(currentBubble);
    } else {
      drawBubble(currentBubble);
    }

    // отрисовать все шарики
    bubbles.forEach(drawBubble);

    requestAnimationFrame(update);
  }

  update();
};
