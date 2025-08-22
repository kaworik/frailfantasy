document.body.style.cursor = "none";
document.querySelectorAll("*").forEach(el => el.style.cursor = "none");
const img = document.createElement("img");
img.src = "cursors/cursor128.png"; // обычный курсор
img.style.position = "fixed";
img.style.pointerEvents = "none";
img.style.zIndex = "9999";
img.style.width = "128px";
img.style.height = "128px";
document.body.appendChild(img);

document.addEventListener("mousemove", function(e) {
  img.style.left = (e.clientX - 28) + "px";
  img.style.top = (e.clientY - 4) + "px";
});

// Для всех ссылок и кликабельных элементов
document.querySelectorAll('a, button, [onclick]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    img.src = "cursors/cursor128_pointer3.png"; // курсор для ссылок/кнопок
  });
  el.addEventListener('mouseleave', () => {
    img.src = "cursors/cursor128.png"; // обычный курсор
  });
});

// Для текстовых полей и выделяемого текста
document.querySelectorAll('input, textarea, [contenteditable="true"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    img.src = "cursors/cursor128_text.png"; // курсор для ввода текста
  });
  el.addEventListener('mouseleave', () => {
    img.src = "cursors/cursor128.png"; // обычный курсор
  });
});