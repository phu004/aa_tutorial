class Title {
    constructor(xPos, yPos, width, height, text) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.text = text;
        this.text2 = null;
        this.backgroundAlpha = 0;
        this.textAlpha = 0;
    }

    draw(){
        var width = this.width;
        var height = this.height;
        var cornerRadius = 10;

        // Set the position of the rectangle
        var xPos = this.xPos;
        var yPos = this.yPos;

        // Draw the rounded rectangle at the specified position
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xPos + cornerRadius, yPos);
        ctx.lineTo(xPos + width - cornerRadius, yPos);
        ctx.arcTo(xPos + width, yPos, xPos + width, yPos + cornerRadius, cornerRadius);
        ctx.lineTo(xPos + width, yPos + height - cornerRadius);
        ctx.arcTo(xPos + width, yPos + height, xPos + width - cornerRadius, yPos + height, cornerRadius);
        ctx.lineTo(xPos + cornerRadius, yPos + height);
        ctx.arcTo(xPos, yPos + height, xPos, yPos + height - cornerRadius, cornerRadius);
        ctx.lineTo(xPos, yPos + cornerRadius);
        ctx.arcTo(xPos, yPos, xPos + cornerRadius, yPos, cornerRadius);
        ctx.closePath();

        // Set the fill and stroke styles
        
        this.backgroundAlpha+=0.09;
        if(this.backgroundAlpha > 0.72)
            this.backgroundAlpha = 0.72;
        ctx.globalAlpha = this.backgroundAlpha;
       
        ctx.fillStyle = "black";
        ctx.fill();

        this.textAlpha+=0.125;
        if(this.textAlpha > 1)
            this.textAlpha = 1;
            
        ctx.globalAlpha = this.textAlpha;
        ctx.font = "25px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, xPos + 20, yPos + 40);

        if(this.text2 != null)
            ctx.fillText(this.text2, xPos + 20, 45 + yPos + 40);

        ctx.restore();
      
    }
}