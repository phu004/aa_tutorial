class Stage3Class {
    constructor() {
       
        this.reset();
    }

    doSomething() {
        if(this.progressNum == 0){
            if(!this.startImageLoaded)
                return;
            if(this.startTime == 0)
                this.startTime = Date.now();
            const currentTime = Date.now();
            const elapsed = currentTime - this.startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const easedProgress = easeInOutCubic(progress);
        
            const distance = canvas.width; // Pixels to move
            const targetX = -distance * easedProgress;

            ctx.drawImage(this.stage3Img, targetX, originY);

            ctx.fillStyle = `rgb(163,216,239)`;
            ctx.fillRect(targetX+distance, 0, canvas.width, canvas.height);
            if(targetX == -distance){
                this.progressNum = 1;
            }
        }

        if(this.progressNum == 1){

            this.drawBackground();
            this.drawGrid(20,32);
        }

        if(this.progressNum == 2){
            this.drawBackground();
            if(this.triangle == null){
                var vertex1 = { x: 0.390625*canvas.width, y: 0.11458333333333333*canvas.height};
                var vertex2 = { x: 0.22786458333333334*canvas.width, y: 0.78125*canvas.height };
                var vertex3 = { x: 0.8072916666666666*canvas.width, y: 0.7291666666666666*canvas.height };
        
                this.triangle = new Triangle_MSAA(vertex1, vertex2, vertex3, 32, 20);
                this.triangle.outlineAlpha = 0;
            }
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            if(this.MSAA_title == null){
                this.MSAA_title = new Title(50,50,305,65, "多重采样抗锯齿 (MSAA)");
            }
            this.MSAA_title.draw();
        }

        if(this.progressNum == 3){
            this.drawBackground();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.triangle.intensifyCenters();
            this.triangle.drawPixelCenter();
            this.MSAA_title.draw();
        }

        if(this.progressNum == 4){
            this.drawBackground();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.triangle.lowResPixels[338].drawHighLightBorder();
            this.triangle.drawPixelCenter();
            this.MSAA_title.draw();
        }

        if(this.progressNum == 5){
            this.drawBackground();
            drawOutline(this.triangle);
            this.triangle.lowResPixels[338].drawAppearingPixel('#FF8000');
            this.triangle.drawPixelCenter();
            this.MSAA_title.draw();
            this.drawGrid(20,32);
        }

        if(this.progressNum == 6){
            this.drawBackground();
            this.triangle.lowResPixels[338].drawAppearingPixel('#FF8000');
            this.drawGrid(20,32);
            this.triangle.lowResPixels[341].drawHighLightBorder();
            this.triangle.drawPixelCenter();
            this.MSAA_title.draw();
            drawOutline(this.triangle);
        }

        if(this.progressNum == 7){
            this.drawBackground();
            this.triangle.lowResPixels[338].drawAppearingPixel('#FF8000');
            this.triangle.lowResPixels[341].drawAppearingPixel('RGB(209, 172, 119');
            this.drawGrid(20,32);
            this.triangle.drawPixelCenter();
            this.MSAA_title.draw();
            drawOutline(this.triangle);
        }

        if(this.progressNum == 8){
            this.drawBackground();
            this.triangle.lowResPixels[338].drawAppearingPixel('#FF8000');
            this.triangle.lowResPixels[341].drawAppearingPixel('RGB(209, 172, 119');
            this.triangle.drawProcessedPixels();
            this.drawGrid(20,32);
            if(this.triangle.StartingIndex == this.triangle.processedPixels.length)
                
            
                this.triangle.fadeCenters();

            this.triangle.drawPixelCenter();
            this.MSAA_title.draw();
            drawOutline(this.triangle);
        }

    }

    drawBackground(){
        ctx.fillStyle = `rgb(163,216,239)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawGrid(h,w){
        ctx.save(); // Save the current canvas state
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.globalAlpha = 0.35;
        var gridDuration = 20;
        var deltaX = canvas.width/gridDuration;
        var deltaY = canvas.height/gridDuration;
        for(let i = 0; i < h; i ++){
            ctx.beginPath();
            const startX = 0;
            const startY = canvas.height/h*i;
            const endX = deltaX*this.gridTimer;
            const endY = canvas.height/h*i;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        for(let i = 0; i < w; i ++){
            ctx.beginPath();
            const startX = canvas.width/w*i;
            const startY = 0;
            const endX = canvas.width/w*i;
            const endY = deltaY*this.gridTimer;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        ctx.restore();
        if(this.gridTimer < gridDuration)
            this.gridTimer++;
    }

    reset(){
        originX = 0;
        originY = 0;
        this.startTime = 0;
        this.duration = 800;

        this.startImageLoaded = false;
        this.capturedDataURL = canvas.toDataURL('stage3/png'); 
        this.stage3Img = new Image();
        this.stage3Img.src = this.capturedDataURL;
        this.progressNum = 0;
        this.stage3Img.onload = () => {
            this.startImageLoaded = true;
        };
        this.gridTimer = 0;
        this.triangle = null;
    }

    progress(){
        if(this.progressNum == 8){
            stage++;
            stageInstance = "stage4Instance";
            window[stageInstance].reset();
            return;
        }
       
        this.progressNum++;
    }
}


// Export the class instance to the global scope
window.stage3Instance = new Stage3Class();