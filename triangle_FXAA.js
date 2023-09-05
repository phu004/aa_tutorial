class Triangle_FXAA {
    constructor(vertex1, vertex2, vertex3, w, h) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.vertex3 = vertex3;

        this.centerX = (this.vertex1.x + this.vertex2.x + this.vertex3.x) / 3;
        this.centerY = (this.vertex1.y + this.vertex2.y + this.vertex3.y) / 3;

        this.currentFrame = [];
        this.fadeCenter = false;
        this.w = w;
        this.h = h;

        for(let i = 0; i < this.h; i++){
            for(let j = 0; j < this.w; j++){
                this.currentFrame.push(new Pixel(j*canvas.width/this.w, i* canvas.height/this.h, canvas.width/this.w, canvas.height/this.h, this.currentCenterIndex));
            }
        }
        this.currentStartingIndex = 0;
        this.edges = [];

        this.drawEdge = false;
        this.applyFilter = false;
    }

    drawProcessedPixels_simple(){
        for(let i = 0; i < this.currentFrame.length; i++){
            if(isPointInside(this.currentFrame[i].centerX, this.currentFrame[i].centerY, this)){
                this.currentFrame[i].pixelColor = '#FF8000';
            }else
                this.currentFrame[i].pixelColor = "#A3D8EF";
            this.currentFrame[i].draw_simple();   
        }

        this.detectEdges( this.currentFrame, this.w, this.h);

        const kernel = [
            { dx: -1, dy: -1, weight: 1/1.44 }, // Top-left
            { dx: -1, dy: 0, weight: 1.5 },  // Left
            { dx: -1, dy: 1, weight: 1/1.44 },  // Bottom-left
            { dx: 0, dy: -1, weight: 1.5 },  // Top
            { dx: 0, dy: 1, weight: 1.5 },   // Bottom
            { dx: 1, dy: -1, weight: 1/1.44 },  // Top-right
            { dx: 1, dy: 0, weight: 1.5 },   // Right
            { dx: 1, dy: 1, weight: 1 /1.44}    // Bottom-right
        ];

        for(let i = 0; i < this.edges.length; i++){
                
            let index = this.edges[i].endPoint;
            let R = hexToRgb(this.currentFrame[index].pixelColor).r*5;
            let G = hexToRgb(this.currentFrame[index].pixelColor).g*5;
            let B = hexToRgb(this.currentFrame[index].pixelColor).b*5;
            for(let j = 0; j < 8; j++){
                let color =  hexToRgb(this.currentFrame[index + kernel[j].dx + kernel[j].dy*this.w].pixelColor);
                R+=(color.r*kernel[j].weight);
                G+=(color.g*kernel[j].weight);
                B+=(color.b*kernel[j].weight);
            }
            let scale = 13.6667;
            let c = rgbToHex({r:  Math.round(R/scale), g:  Math.round(G/scale), b:  Math.round(B/scale)});
            this.currentFrame[index].pixelColor = c;
            this.currentFrame[index].draw_simple();                
        }

    }

    drawCurrentFrame(){
        if(this.currentStartingIndex < this.currentFrame.length){
            this.currentStartingIndex+=4;
        }

        for(let i = 0; i < this.currentStartingIndex; i++){
            var inside = false;
            if(isPointInside(this.currentFrame[i].centerX, this.currentFrame[i].centerY, this)){
                inside = true;
            }else if(i == this.currentStartingIndex -1 && this.currentStartingIndex < this.currentFrame.length){
                this.currentStartingIndex+=4;
            }

            if(inside){
                this.currentFrame[i].pixelColor = '#FF8000';
                this.currentFrame[i].draw();
            }else{
                this.currentFrame[i].pixelColor = "#A3D8EF";
                this.currentFrame[i].draw();
            }
        }   
        if(this.currentStartingIndex == this.currentFrame.length){
            this.detectEdges( this.currentFrame, this.w, this.h);      
        }

        if(this.drawEdge){
            for(let i = 0; i < this.edges.length; i++){
                //this.currentFrame[this.edges[i].startPoint].drawBlendingPixel("#00FF00");
                this.currentFrame[this.edges[i].endPoint].drawBlendingPixel("#00FF00");
            }
        }

        if(this.applyFilter){
            const kernel = [
                { dx: -1, dy: -1, weight: 1/1.44 }, // Top-left
                { dx: -1, dy: 0, weight: 1.5 },  // Left
                { dx: -1, dy: 1, weight: 1/1.44 },  // Bottom-left
                { dx: 0, dy: -1, weight: 1.5 },  // Top
                { dx: 0, dy: 1, weight: 1.5 },   // Bottom
                { dx: 1, dy: -1, weight: 1/1.44 },  // Top-right
                { dx: 1, dy: 0, weight: 1.5 },   // Right
                { dx: 1, dy: 1, weight: 1 /1.44}    // Bottom-right
            ];
            
            for(let i = 0; i < this.edges.length; i++){
                
                let index = this.edges[i].endPoint;
                let R = hexToRgb(this.currentFrame[index].pixelColor).r*5;
                let G = hexToRgb(this.currentFrame[index].pixelColor).g*5;
                let B = hexToRgb(this.currentFrame[index].pixelColor).b*5;
                for(let j = 0; j < 8; j++){
                    let color =  hexToRgb(this.currentFrame[index + kernel[j].dx + kernel[j].dy*this.w].pixelColor);
                    R+=(color.r*kernel[j].weight);
                    G+=(color.g*kernel[j].weight);
                    B+=(color.b*kernel[j].weight);
                }
                let scale = 13.6667;
                let c = rgbToHex({r:  Math.round(R/scale), g:  Math.round(G/scale), b:  Math.round(B/scale)});
                this.currentFrame[index].drawAppearingPixel(c);                
            }
        }

       
    }

    detectEdges(screen, w, h, threshold = 30) {
        this.edges = [];
    
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const currentPixel = screen[y * w + x];
                const currentColor = hexToRgb(currentPixel.pixelColor);
    
                const directions = [
                    { dx: 0, dy: -1 }, // Top
                    { dx: -1, dy: 0 }, // Left
                    { dx: -1, dy: -1 },
                    
                ];
                
                for (const direction of directions) {
                    const nx = x + direction.dx;
                    const ny = y + direction.dy;
                
                    if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                        const neighborPixel = screen[ny * w + nx];
                        const neighborColor = hexToRgb(neighborPixel.pixelColor);
                
                        // Calculate color difference
                        const diff = colorDifference(currentColor, neighborColor);
                
                        if (diff >= threshold) {
                            this.edges.push({
                                startPoint: y * w + x,
                                endPoint: ny * w + nx
                            });
                        }
                    }
                }
                
            }
        }
    }
}