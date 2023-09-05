class Triangle_MSAA {
    constructor(vertex1, vertex2, vertex3,  w, h) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.vertex3 = vertex3;

        this.centerX = (this.vertex1.x + this.vertex2.x + this.vertex3.x) / 3;
        this.centerY = (this.vertex1.y + this.vertex2.y + this.vertex3.y) / 3;

        this.w = w;
        this.h = h;

        this.outlineAlpha = 0;
        this.lowResPixels = [];
        for(let i = 0; i < this.h; i++){
            for(let j = 0; j < this.w; j++){
                this.lowResPixels.push(new Pixel(j*canvas.width/this.w, i* canvas.height/this.h, canvas.width/this.w, canvas.height/this.h));
            }
        }
        this.StartingIndex = 0;

        this.processedPixels = [];
        for(let i = 0; i < this.h; i++){
            for(let j = 0; j < this.w; j++){
                let myPixel = new Pixel(j*canvas.width/this.w, i* canvas.height/this.h, canvas.width/this.w, canvas.height/this.h);
                let colors = [];
                for(let k = 0; k < 4; k++){
                    if(isPointInside(myPixel.centers[k].x, myPixel.centers[k].y, this))
                        colors.push('#FF8000');
                    else
                        colors.push("#A3D8EF");
                }
                myPixel.pixelColor = averageColors(colors);
                this.processedPixels.push(myPixel);

            }
        }
    }

    drawProcessedPixels_simple(){
        for(let i = 0; i < this.lowResPixels.length; i++){
            let colors = [];
            let insdieCount = 0;
            for(let k = 0; k < 4; k++){
                if(isPointInside(this.lowResPixels[i].centers[k].x, this.lowResPixels[i].centers[k].y, this)){
                    insdieCount++;
                    colors.push('#FF8000');
                }else
                    colors.push("#A3D8EF");
            }
            if(insdieCount == 4)
                this.lowResPixels[i].pixelColor = '#FF8000';
            else if(insdieCount == 0)
                continue;
            else
                this.lowResPixels[i].pixelColor = averageColors(colors);
            this.lowResPixels[i].draw_simple();
        }
    }

    drawProcessedPixels(){
        if(this.StartingIndex < this.processedPixels.length){
            this.StartingIndex++;
        }
        for(let i = 0; i < this.StartingIndex; i++){
            var intersect = false;
            var inside = false;

            if(doesRectangleIntersect(this.processedPixels[i].xPos, this.processedPixels[i].yPos, this.processedPixels[i].width, this.processedPixels[i].height, this)){
                intersect = true;
            }

            if(isPointInside(this.processedPixels[i].centerX, this.processedPixels[i].centerY, this)){
                inside = true;
            }else if(i == this.StartingIndex -1 && this.StartingIndex < this.processedPixels.length){
                this.StartingIndex++;
            }

            if(intersect || inside)
                this.processedPixels[i].draw();
            
        }    
    }

    drawPixelCenter(){
        
        for(let i = 0; i < this.lowResPixels.length; i++){
            var intersect = false;
            var inside = false;

            if(doesRectangleIntersect(this.lowResPixels[i].xPos, this.lowResPixels[i].yPos, this.lowResPixels[i].width, this.lowResPixels[i].height, this))
                intersect = true;

            if(isPointInside(this.lowResPixels[i].centerX, this.lowResPixels[i].centerY, this))
                inside = true;

            if(intersect || inside){
                this.lowResPixels[i].alpha = 1;
                this.lowResPixels[i].drawCenters();
            }
        }
    }

    fadeCenters(){
        for(let i = 0; i < this.lowResPixels.length; i++){
            this.lowResPixels[i].fadeCenters();
        }
    }

    intensifyCenters(){
        for(let i = 0; i < this.lowResPixels.length; i++){
            this.lowResPixels[i].intensifyCenters();
        }
    }


}