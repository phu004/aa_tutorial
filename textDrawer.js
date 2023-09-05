// textDrawer.js
class TextDrawer {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
    }
  
    drawText(text, x, y, color = 'black', fontSize = 16) {
      this.ctx.fillStyle = color;
      this.ctx.font = `${fontSize}px Arial`;
      this.ctx.fillText(text, x, y);
    }
  }
  