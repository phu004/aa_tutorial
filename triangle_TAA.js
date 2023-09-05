class Triangle_TAA {
    constructor(vertex1, vertex2, vertex3, w, h) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.vertex3 = vertex3;

        this.centerX = (this.vertex1.x + this.vertex2.x + this.vertex3.x) / 3;
        this.centerY = (this.vertex1.y + this.vertex2.y + this.vertex3.y) / 3;

        this.currentFrame = [];
        this.currentCenterIndex = {value: 0};
        this.fadeCenter = false;
        this.modulationFactor = 0.2;
        this.w = w;
        this.h = h;

        this.motion_threshold = 175
        this.stillness_threshold  = 50;

        this.firstFrame = true;

        for(let i = 0; i < this.h; i++){
            for(let j = 0; j < this.w; j++){
                this.currentFrame.push(new Pixel_TAA(j*canvas.width/this.w, i* canvas.height/this.h, canvas.width/this.w, canvas.height/this.h, this.currentCenterIndex));
            }
        }
        this.currentStartingIndex = 0;

        this.previousFrame = [];
        for(let i = 0; i < this.h; i++){
            for(let j = 0; j < this.w; j++){
                this.previousFrame.push(new Pixel(j*canvas.width/this.w, i* canvas.height/this.h, canvas.width/this.w, canvas.height/this.h));
            }
        }

        this.blendFrame = [];
        for(let i = 0; i < this.h; i++){
            for(let j = 0; j < this.w; j++){
                this.blendFrame.push(new Pixel(j*canvas.width/this.w, i* canvas.height/this.h, canvas.width/this.w, canvas.height/this.h));
            }
        }
    }

    copyFrame(){
        for(let i = 0; i < this.previousFrame.length; i++)
            this.previousFrame[i].pixelColor = this.currentFrame[i].pixelColor;
    }

    copyBlendFrame(){
        for(let i = 0; i < this.previousFrame.length; i++)
            this.previousFrame[i].pixelColor = this.blendFrame[i].pixelColor;
    }


    blend(){
        for(let i = 1; i < this.h -1; i++){
            for(let j = 1; j < this.w -1; j++){
                let sampleColor = this.getColorAt(j*canvas.width / this.w,  i*canvas.height / this.h);
                this.blendFrame[j + i * this.w].pixelColor = "#" + lerpColor(sampleColor.slice(1), this.currentFrame[j + i * this.w].pixelColor.slice(1), this.modulationFactor);
                this.blendFrame[j + i * this.w].blendingStage = 0;
            }
         
        }
        
    }

    drawProcessedPixels_simple(degree){

        for(let i = 0; i < this.currentFrame.length; i++){
            if(isPointInside(this.currentFrame[i].getSamplePoint().x, this.currentFrame[i].getSamplePoint().y, this)){
                this.currentFrame[i].pixelColor = '#FF8000';
            }else{
                this.currentFrame[i].pixelColor = "#A3D8EF";
            }
        }

        if(this.firstFrame){
            for(let i = 0; i < this.currentFrame.length; i++){
                this.previousFrame[i].pixelColor = this.currentFrame[i].pixelColor;
            }
            this.firstFrame = false;
        }

        this.blendDynamicFrame(degree);

        for(let i = 0; i < this.blendFrame.length; i++){
            this.previousFrame[i].pixelColor = this.blendFrame[i].pixelColor;
            this.blendFrame[i].draw_simple();
            this.blendFrame[i].pixelColor = "#A3D8EF";
        }

        this.currentCenterIndex.value++;
        this.currentCenterIndex.value%=16;
    }

    blendDynamicFrame(degree){
        for(let k = 1; k < this.h -1; k++){
            for(let j = 2; j < this.w - 2; j++){
                var i = j + k * this.w;
                var intersect = false;
                var inside = false;
                if(isPointInside(this.currentFrame[i].getSamplePoint().x, this.currentFrame[i].getSamplePoint().y, this))
                    inside = true;
                if(doesRectangleIntersect(this.currentFrame[i].xPos, this.currentFrame[i].yPos, this.currentFrame[i].width, this.currentFrame[i].height, this))
                    intersect = true;

               
                if(inside || intersect){
                    let sample = rotatePointDegrees2(this.currentFrame[i].xPos, this.currentFrame[i].yPos, this, degree);
                    let historyColor = this.getColorAt(sample.x,  sample.y);
                    let currentColor = this.currentFrame[i].pixelColor;
                    let nearColorsHex  = [this.currentFrame[i + 1].pixelColor, this.currentFrame[i + this.w].pixelColor, this.currentFrame[i - 1].pixelColor, this.currentFrame[i - this.w].pixelColor]
                    historyColor = getClampedColor(currentColor, nearColorsHex, historyColor);
                    //const distance = colorDistance(historyColor, currentColor);
                    //if(distance > this.motion_threshold)
                    //    historyColor = currentColor;
                    this.blendFrame[i].pixelColor = "#" + lerpColor(historyColor.slice(1), currentColor.slice(1), this.modulationFactor);
                    this.blendFrame[i].blendingStage = 0;
                }else{
                    /*let historyColor = this.previousFrame[i].pixelColor;
                    let currentColor = this.currentFrame[i].pixelColor;
                    if(historyColor == "#A3D8EF" && currentColor == "#A3D8EF"){
                        this.blendFrame[i].blendingStage = 0;
                        this.blendFrame[i].pixelColor = "#A3D8EF";
                        continue;
                    }
                    let nearColorsHex  = [this.currentFrame[i + 1].pixelColor, this.currentFrame[i + this.w].pixelColor, this.currentFrame[i - 1].pixelColor, this.currentFrame[i - this.w].pixelColor]
                    historyColor = getClampedColor(currentColor, nearColorsHex, historyColor);
                    const distance = colorDistance(historyColor, currentColor);
                    if(distance > this.stillness_threshold)
                        historyColor = currentColor;
                    this.blendFrame[i].pixelColor = "#" + lerpColor(historyColor.slice(1), currentColor.slice(1), this.modulationFactor);
                    this.blendFrame[i].blendingStage = 0;*/
                }

            }
        }
    }

    drawBlendFrame(){
        for(let i = 0; i < this.blendFrame.length; i++){
            this.blendFrame[i].drawBlendingPixel(this.blendFrame[i].pixelColor);
                
        }
    }

    drawCurrentFrame(){
        if(this.currentStartingIndex < this.currentFrame.length){
            this.currentStartingIndex+=8;
        }

        for(let i = 0; i < this.currentStartingIndex; i++){
            var intersect = false;
            var inside = false;

            if(doesRectangleIntersect(this.currentFrame[i].xPos, this.currentFrame[i].yPos, this.currentFrame[i].width, this.currentFrame[i].height, this)){
                intersect = true;
            }

            if(isPointInside(this.currentFrame[i].getSamplePoint().x, this.currentFrame[i].getSamplePoint().y, this)){
                inside = true;
            }else if(i == this.currentStartingIndex -1 && this.currentStartingIndex < this.currentFrame.length){
                this.currentStartingIndex+=8;
            }

            if(inside){
                this.currentFrame[i].pixelColor = '#FF8000';
                this.currentFrame[i].draw();
            }else{
                this.currentFrame[i].pixelColor = "#A3D8EF";
            }
            if(inside || intersect){
                this.currentFrame[i].drawCenter();
            }
            
        }    
    }

    getColorAt(sampleX, sampleY) {
        const gridX = Math.floor(sampleX / (canvas.width / this.w));
        const gridY = Math.floor(sampleY / (canvas.height / this.h));
    
        const topLeftPixel = this.previousFrame[gridY * this.w + gridX];
        const topRightPixel = this.previousFrame[gridY * this.w + gridX + 1];
        const bottomLeftPixel = this.previousFrame[(gridY + 1) * this.w + gridX];
        const bottomRightPixel = this.previousFrame[(gridY + 1) * this.w + gridX + 1];
    
        const offsetX = (sampleX - gridX * (canvas.width / this.w)) / (canvas.width / this.w);
        const offsetY = (sampleY - gridY * (canvas.height / this.h)) / (canvas.height / this.h);
    
        const topInterpolatedColor = "#" + lerpColor(topLeftPixel.pixelColor.slice(1), topRightPixel.pixelColor.slice(1), offsetX);
        const bottomInterpolatedColor = "#" + lerpColor(bottomLeftPixel.pixelColor.slice(1), bottomRightPixel.pixelColor.slice(1), offsetX);
    
        const interpolatedColor = "#" + lerpColor(topInterpolatedColor.slice(1), bottomInterpolatedColor.slice(1), offsetY);
    
        return interpolatedColor;
    }

}