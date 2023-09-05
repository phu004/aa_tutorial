class Triangle_SSAA {
    constructor(vertex1, vertex2, vertex3, w, h) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.vertex3 = vertex3;

        this.centerX = (this.vertex1.x + this.vertex2.x + this.vertex3.x) / 3;
        this.centerY = (this.vertex1.y + this.vertex2.y + this.vertex3.y) / 3;

        this.w = w;
        this.h = h;

        this.outlineAlpha = 0.7;
        this.lowResPixels = [];
        for(let i = 0; i < this.h; i++){
            for(let j = 0; j < this.w; j++){
                this.lowResPixels.push(new Pixel(j*canvas.width/this.w, i* canvas.height/this.h, canvas.width/this.w, canvas.height/this.h));
            }
        }

        this.highResPixels = [];
        for(let i = 0; i < this.h*2; i++){
            for(let j = 0; j < this.w*2; j++){
                this.highResPixels.push(new Pixel(j*canvas.width/(this.w*2), i* canvas.height/(this.h*2), canvas.width/(this.w*2), canvas.height/(this.h*2)));
            }
        }

        this.lowResStartingIndex = 0;
        this.highResStartingIndex = 0;
        this.drawPixelCenter = false;
        this.downsampled = false;

    }

    downsample(){
        for(let i = 0; i < this.lowResPixels.length; i++){
            var x = i % this.w;
            var y = Math.floor(i / this.w);

            var xHigh = x * 2;
            var yHigh = y * 2;
            
            const hexColors = [this.highResPixels[xHigh + yHigh * (this.w*2)].pixelColor, 
                               this.highResPixels[xHigh + 1 + yHigh * (this.w*2)].pixelColor, 
                               this.highResPixels[xHigh + (yHigh +1)* (this.w*2)].pixelColor, 
                               this.highResPixels[xHigh + 1 + (yHigh + 1) * (this.w*2)].pixelColor]; 

            if(hexColors[0] == "#A3D8EF" && hexColors[1] == "#A3D8EF" && hexColors[2] == "#A3D8EF" && hexColors[3] == "#A3D8EF")
                this.lowResPixels[i].pixelColor =  "#A3D8EF";
            else if(hexColors[0] == '#FF8000' && hexColors[1] == '#FF8000' && hexColors[2] == '#FF8000' && hexColors[3] == '#FF8000')
                this.lowResPixels[i].pixelColor = '#FF8000'
            else
                this.lowResPixels[i].pixelColor = averageColors(hexColors);
        }
        this.downsampled = true;
    }

    fadeLowRes(){
        for(let i = 0; i <  this.lowResPixels.length; i++){
            if(this.lowResPixels[i].alpha > 0)
                this.lowResPixels[i].alpha-=0.1;
            if(this.lowResPixels[i].alpha < 0)
                this.lowResPixels[i].alpha = 0;
        }
    }

    drawHighRes(){
        if(this.highResStartingIndex < this.highResPixels.length){
            this.highResStartingIndex+=4;
        }
        for(let i = 0; i < this.highResStartingIndex; i++){
          
            if(isPointInside(this.highResPixels[i].centerX, this.highResPixels[i].centerY, this)){
                this.highResPixels[i].pixelColor = '#FF8000';
                this.highResPixels[i].draw();
                this.highResPixels[i].drawBorder();
                    
            }else if(i == this.highResStartingIndex -1 && this.highResStartingIndex < this.highResPixels.length){
                this.highResStartingIndex+=4;
            }
        }    
    }

    fadeHighRes(){
        for(let i = 0; i <  this.highResPixels.length; i++){
            if(this.highResPixels[i].alpha > 0)
                this.highResPixels[i].alpha-=0.05;
            if(this.highResPixels[i].alpha < 0)
                this.highResPixels[i].alpha = 0;
        }
    }

    draw() {
        if(this.lowResStartingIndex < this.lowResPixels.length){
            this.lowResStartingIndex++;
        }
        for(let i = 0; i < this.lowResStartingIndex; i++){
            var intersect = false;
            var inside = false;

            if(doesRectangleIntersect(this.lowResPixels[i].xPos, this.lowResPixels[i].yPos, this.lowResPixels[i].width, this.lowResPixels[i].height, this)){
                this.lowResPixels[i].pixelColor = '#FF8000';
                //this.lowResPixels[i].draw();
                intersect = true;
            }

            if(isPointInside(this.lowResPixels[i].centerX, this.lowResPixels[i].centerY, this)){
                inside = true;
                this.lowResPixels[i].pixelColor = '#FF8000';
                this.lowResPixels[i].draw();
            }else if(i == this.lowResStartingIndex -1 && this.lowResStartingIndex < this.lowResPixels.length){
                this.lowResStartingIndex++;
            }

            if(this.drawPixelCenter && (intersect || inside))
                this.lowResPixels[i].drawCenter();
            
        }    
        
    }

    draw_simple(){
        for(let i = 0; i <  this.lowResPixels.length; i++){
            if(isPointInside(this.lowResPixels[i].centerX, this.lowResPixels[i].centerY, this)){
                this.lowResPixels[i].pixelColor = '#FF8000';
                this.lowResPixels[i].draw_simple();
            }
        }
    }

    drawHighRes_simple(){
        for(let i = 0; i < this.highResPixels.length; i++){
            if(isPointInside(this.highResPixels[i].centerX, this.highResPixels[i].centerY, this))
                this.highResPixels[i].pixelColor = '#FF8000';
            else
                this.highResPixels[i].pixelColor = "#A3D8EF";
        }    
    }

    drawAntiAliasedPixels_simple(){

        for(let i = 0; i < this.lowResPixels.length; i++){
           
                this.lowResPixels[i].draw_simple();
        
        }
    }

    drawAntiAliasedPixels(){
        if(this.lowResStartingIndex < this.lowResPixels.length){
            this.lowResStartingIndex++;
        }
        for(let i = 0; i < this.lowResStartingIndex; i++){

            if(doesRectangleIntersect(this.lowResPixels[i].xPos, this.lowResPixels[i].yPos, this.lowResPixels[i].width, this.lowResPixels[i].height, this)){
                this.lowResPixels[i].alpha = 1;
                this.lowResPixels[i].draw();
                this.lowResPixels[i].drawBorder();
            }

            if(isPointInside(this.lowResPixels[i].centerX, this.lowResPixels[i].centerY, this)){
                this.lowResPixels[i].alpha = 1;
                this.lowResPixels[i].draw();
                this.lowResPixels[i].drawBorder();
            }else if(i == this.lowResStartingIndex -1 && this.lowResStartingIndex < this.lowResPixels.length){
                this.lowResStartingIndex++;
            }   
        }    
    }
}