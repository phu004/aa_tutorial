class Pixel {
    constructor(xPos, yPos, width, height) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height
        this.borderX =this.xPos;
        this.borderY =this.yPos;

        this.centerX = this.xPos + this.width / 2;
        this.centerY = this.yPos + this.height / 2;

        this.centerAlpha = 0;
        this.alpha = 1;
        this.pixelColor = "#A3D8EF";

        var centers = [];
        centers[0] = { x: xPos + width / 8 * 5, y: yPos + height / 8 };
        centers[1] = { x: xPos + width / 8, y: yPos + height / 8 * 3 };
        centers[2] = { x: xPos + width / 8 * 7, y: yPos + height / 8 * 5 };
        centers[3] = { x: xPos + width / 8 * 3, y: yPos + height / 8 * 7 };
        
        this.centers = centers;

        this.highlightBorderAlpha = 0;
        this.appearingPixelPosition = 0;
        this.blendingStage = 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha =  this.alpha;
        ctx.fillStyle = this.pixelColor;
        if(scale != 1)
            ctx.fillRect((this.xPos + originX)*scale, (this.yPos + originY)*scale, this.width*scale+1, this.height*scale+1);
        else
            ctx.fillRect((this.xPos + originX)*scale, (this.yPos + originY)*scale, this.width*scale, this.height*scale);
        ctx.restore();
    }

    draw_simple(){
        if(this.pixelColor == "#A3D8EF")
            return;
        ctx.fillStyle = this.pixelColor;
        ctx.fillRect((this.xPos + originX)*scale, (this.yPos + originY)*scale, this.width*scale+0.65, this.height*scale+0.65);
    }

    drawCenter(){
        if(this.centerAlpha <0.6)
            this.centerAlpha +=0.1;
        if(this.centerAlpha > this.alpha)
            this.centerAlpha = this.alpha;
        ctx.save();
        ctx.globalAlpha = this.centerAlpha;
        const radius = 2.5; // Radius of the dot
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, radius, 0, 2 * Math.PI); // Draw a circle at (x, y) with the specified radius
        ctx.fillStyle = "blue"; // Set the fill color to black
        ctx.fill(); // Fill the circle with the specified color
        ctx.closePath();
        ctx.restore();
    }

    drawCenters(){
        
        ctx.save();
        ctx.globalAlpha = this.centerAlpha;
        const radius = 2.5; // Radius of the dot
        for(let i = 0; i < 4; i ++){
            ctx.beginPath();
            ctx.arc(this.centers[i].x, this.centers[i].y, radius, 0, 2 * Math.PI); // Draw a circle at (x, y) with the specified radius
            ctx.fillStyle = "blue"; // Set the fill color to black
            ctx.fill(); // Fill the circle with the specified color
            ctx.closePath();
        }
        ctx.restore();
    }
    
    intensifyCenters(){
        //console.log(this.centerAlpha)
        if(this.centerAlpha < 0.6)
            this.centerAlpha +=0.1;
    }

    fadeCenters(){
        if(this.centerAlpha > 0)
            this.centerAlpha -=0.03;
        if(this.centerAlpha < 0)
            this.centerAlpha =0;
    }


    drawBorder(){
        const borderThickness = 2;
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = borderThickness;

        ctx.strokeRect(
            this.xPos,
            this.yPos,
            this.width ,
            this.height
        );
        ctx.restore();
    }

    drawHighLightBorder(){
        if(this.highlightBorderAlpha < 0.85)
            this.highlightBorderAlpha +=0.03;
        const borderThickness = 3;
        ctx.save();
        ctx.strokeStyle = "RGB(224, 0, 0)";
        ctx.globalAlpha = this.highlightBorderAlpha;
        ctx.lineWidth = borderThickness;

        ctx.strokeRect(
            this.borderX,
            this.borderY,
            this.width,
            this.height
        );
        ctx.restore();
    }

    drawAppearingPixel(color){
        if(this.appearingPixelPosition < 1)
            this.appearingPixelPosition+=0.05;
        if(this.appearingPixelPosition > 1)
            this.appearingPixelPosition = 1;
        ctx.save();
        ctx.globalAlpha =  1;
        ctx.fillStyle = color;
        ctx.fillRect(this.xPos, this.yPos, this.width*this.appearingPixelPosition, this.height);
        ctx.restore();
    }

    drawBlendingPixel(color){
        if(this.blendingStage < 1)
            this.blendingStage+=0.05;
        if(this.blendingStage > 1)
            this.blendingStage = 1;
        ctx.save();
        ctx.globalAlpha =  this.blendingStage;
        ctx.fillStyle = color;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        ctx.restore();
    }



}