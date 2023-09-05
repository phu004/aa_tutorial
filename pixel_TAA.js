class Pixel_TAA {
    constructor(xPos, yPos, width, height, centerIndex) {
        
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;

        this.centerX = this.xPos + this.width / 2;
        this.centerY = this.yPos + this.height / 2;

        this.centerAlpha = 0;
        this.alpha = 1;
        this.pixelColor = "#A3D8EF";

        this.samplingPositions = [
            { x: 0.500000, y: 0.333333 },
            { x: 0.250000, y: 0.666667 },
            { x: 0.750000, y: 0.111111 },
            { x: 0.125000, y: 0.444444 },
            { x: 0.625000, y: 0.777778 },
            { x: 0.375000, y: 0.222222 },
            { x: 0.875000, y: 0.555556 },
            { x: 0.062500, y: 0.888889 },
            { x: 0.562500, y: 0.037037 },
            { x: 0.312500, y: 0.370370 },
            { x: 0.812500, y: 0.703704 },
            { x: 0.187500, y: 0.148148 },
            { x: 0.687500, y: 0.481481 },
            { x: 0.437500, y: 0.814815 },
            { x: 0.937500, y: 0.259259 },
            { x: 0.031250, y: 0.592593 }
        ].map(position => ({
            x: this.xPos + position.x * this.width,
            y: this.yPos + position.y * this.height
        }));

        this.centerIndex = centerIndex;
    }

    getSamplePoint(){
        return {x: this.samplingPositions[this.centerIndex.value].x, y: this.samplingPositions[this.centerIndex.value].y};
    }


    draw() {
        ctx.save();
        ctx.globalAlpha =  this.alpha;
        ctx.fillStyle = this.pixelColor;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        ctx.restore();
    }

    drawCenter(){
       
        if(this.centerAlpha <0.6)
            this.centerAlpha +=0.1;
        if(this.centerAlpha > this.alpha)
            this.centerAlpha = this.alpha;
        
        ctx.save();
        ctx.globalAlpha = this.centerAlpha;
        const radius = 2.5; 
        ctx.beginPath();
        let x = this.samplingPositions[this.centerIndex.value].x;
        let y = this.samplingPositions[this.centerIndex.value].y;
        ctx.arc(x, y, radius, 0, 2 * Math.PI); 
        ctx.fillStyle = "blue"; 
        ctx.fill(); 
        ctx.closePath();
        ctx.restore();
    }
}