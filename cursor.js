(function() {
  const OFFSET_X = 28;
  const OFFSET_Y = 4;
  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;

  // жестко прячем системный курсор (кроме полей ввода)
  const css = document.createElement('style');
  css.textContent = `
    * { cursor: none !important; }
    input, textarea, select, [contenteditable] { cursor: auto !important; }
  `;
  document.head.appendChild(css);

  // кастомный курсор
  const img = document.createElement('img');
  img.src = "cursors/cursor128.png";
  img.style.position = "fixed";
  img.style.pointerEvents = "none";
  img.style.zIndex = "9999";
  img.style.width = "128px";
  img.style.height = "128px";
  img.style.display = "block";
  document.body.appendChild(img);

  // восстановление позиции из sessionStorage
  const savedX = parseInt(sessionStorage.getItem('cursorX'), 10);
  const savedY = parseInt(sessionStorage.getItem('cursorY'), 10);
  if (!isNaN(savedX) && !isNaN(savedY)) {
    lastX = savedX;
    lastY = savedY;
    img.style.left = (lastX - OFFSET_X) + "px";
    img.style.top = (lastY - OFFSET_Y) + "px";
  } else {
    img.style.left = "50vw";
    img.style.top = "50vh";
  }

  // обновление позиции и сохранение
  document.addEventListener("mousemove", function(e) {
    lastX = e.clientX;
    lastY = e.clientY;
    img.style.left = (lastX - OFFSET_X) + "px";
    img.style.top = (lastY - OFFSET_Y) + "px";
    sessionStorage.setItem('cursorX', lastX);
    sessionStorage.setItem('cursorY', lastY);
  });

  // сохраняем позицию при mousedown
  document.addEventListener("mousedown", function() {
    sessionStorage.setItem('cursorX', lastX);
    sessionStorage.setItem('cursorY', lastY);
  });

  // подключаемся к popup-элементам внутри .nav-item
  // предполагается: <a class="nav-item"> ... <img class="nav-popup"> ... </a>
  document.querySelectorAll('.nav-gifs .nav-item').forEach(link => {
    const popup = link.querySelector('.nav-popup');
    if (!popup) return;

    // убедимся, что popup позиционируется фиксировано (стили могут уже быть в CSS)
    popup.style.position = 'fixed';
    popup.style.pointerEvents = 'none';

    let raf = null;
    function follow(e) {
      // позиционируем popup ближе к курсору (уменьшено с +18 до +25)
      const px = e.clientX + 80;
      const py = e.clientY + 100;
      popup.style.left = px + 'px';
      popup.style.top = py + 'px';
    }

    link.addEventListener('mouseenter', (e) => {
      // сразу в позицию точки появления, затем включаем видимость (масштаб из 0->1)
      follow(e);
      // force layout then add class for transition from point
      // небольшая задержка через rAF чтобы браузер применил начальные transform
      popup.classList.remove('visible');
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // ensure the element has initial transform (scale 0)
        // затем в следующем frame включаем видимый класс
        raf = requestAnimationFrame(() => {
          popup.classList.add('visible');
        });
      });
    });

    link.addEventListener('mousemove', (e) => {
      // плавно позиционируем прямо — можно throttling если нужно
      follow(e);
    });

    link.addEventListener('mouseleave', () => {
      popup.classList.remove('visible');
    });
  });

  // смена изображения при наведении на кликабельные и текстовые элементы
  document.querySelectorAll('a, button, [onclick]').forEach(el => {
    el.addEventListener('mouseenter', () => { img.src = "cursors/cursor128_pointer3.png"; });
    el.addEventListener('mouseleave', () => { img.src = "cursors/cursor128.png"; });
  });
  document.querySelectorAll('input, textarea, [contenteditable="true"]').forEach(el => {
    el.addEventListener('mouseenter', () => { img.src = "cursors/cursor128_text.png"; });
    el.addEventListener('mouseleave', () => { img.src = "cursors/cursor128.png"; });
  });
})();