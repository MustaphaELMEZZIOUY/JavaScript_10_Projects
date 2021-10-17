var c = document.getElementById("canv");
var ctx = c.getContext("2d");

var increase = document.querySelector('.increase');
var sizes = document.querySelector('.size');
var decrease = document.querySelector('.decrease');
var colors = document.querySelector('.colors');
var clear = document.querySelector('.clear');

var isPressed = false;
var color = 'black';
var size = 20;
var x = 0;
let y = 0;

clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
})

increase.addEventListener('click', () => {
  size += 5;
  if(size > 50) size = 50;
  sizes.innerHTML = size;
})

decrease.addEventListener('click', () => {
  size -= 5;
  if(size < 5) size = 5;
  sizes.innerHTML = size;
})

c.addEventListener('mousedown', (even) => {
  isPressed = true;
  x = even.offsetX;
  y = even.offsetY;
});
c.addEventListener('mouseup', (even) => {
  if (isPressed === true) {
    drawLine(ctx, x, y, even.offsetX, even.offsetY);
    x = 0;
    y = 0;
    isPressed = false;
  }
});

colors.addEventListener('change', (even) => {
  color = even.target.value;
})

c.addEventListener('mousemove', drawing);

function drawing(even){
  if(isPressed){
    drawLine(ctx, x, y, even.offsetX, even.offsetY, color, size);
    drawCircle(ctx, x, y, size, color)
    x = even.offsetX;
    y = even.offsetY;
  }
};

function drawLine(context, x1, y1, x2, y2, color, size) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = size * 2;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function drawCircle(context, x, y, size, color){
  context.beginPath();
  context.arc(x, y, size, 0, 2*Math.PI);
  context.fillStyle = color;
  context.fill();
}

