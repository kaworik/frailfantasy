function setup() {
  createCanvas(windowWidth, windowHeight); // холст на весь экран
  background(30); // тёмный фон
}

function draw() {
  // рисуем случайные "звёзды"
  noStroke();
  fill(random(150,255), random(150,255), random(150,255), 150);
  ellipse(random(width), random(height), random(2,8));
}