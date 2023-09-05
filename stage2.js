// stage2.js

class Stage2Class {
    constructor() {
      
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

            ctx.drawImage(this.stage2Img, targetX, originY);

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
        
                this.triangle = new Triangle_SSAA(vertex1, vertex2, vertex3, 32, 20);
                this.triangle.outlineAlpha = 0;
            }else{
                this.triangle.draw();
            }
            this.drawGrid(20,32);
            drawOutline(this.triangle);
        }

        if(this.progressNum == 3){
            this.triangle.drawPixelCenter = true;
            this.drawBackground();
            this.triangle.draw();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
        }


        if(this.progressNum == 4){
            this.triangle.fadeLowRes();
            this.drawBackground();
           
            this.triangle.draw();
            
            this.drawGrid(20,32);
            this.drawGrid2(20,32);
            if(this.gridTimer2 >= 20){
                this.triangle.drawHighRes();
            }
            drawOutline(this.triangle);
            if(this.SSAA_title == null){
                this.SSAA_title = new Title(50,50,305,65, "超级采样抗锯齿 (SSAA)");
            }
            this.SSAA_title.draw();

        }

        if(this.progressNum == 5){
            this.drawBackground();
    
            if(this.grid2Alpha > 0)
                this.grid2Alpha-=0.05;
            if(this.grid2Alpha < 0)
                this.grid2Alpha = 0;
            this.drawGrid(20,32);
            this.drawGrid2(20,32);
            this.triangle.drawHighRes();
            drawOutline(this.triangle);
            this.SSAA_title.draw();
        }

        if(this.progressNum == 6){
            if(!this.triangle.downsampled){
                this.triangle.downsample();
                this.triangle.lowResStartingIndex = 0;
            }
            this.drawBackground();
            this.drawGrid(20,32);
            this.triangle.drawHighRes();
            this.triangle.drawAntiAliasedPixels();
            drawOutline(this.triangle);
            this.SSAA_title.draw();
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

    drawGrid2(h,w){
        ctx.save(); // Save the current canvas state
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.globalAlpha = this.grid2Alpha;
        var gridDuration = 21;
        var deltaX = canvas.width/20;
        var deltaY = canvas.height/20;
        for(let i = 0; i <= h; i ++){
            ctx.beginPath();
            const startX = 0 - canvas.width/w/2;
            const startY = canvas.height/h*i - canvas.height/h/2;
            const endX = deltaX*this.gridTimer2 - canvas.width/w/2;
            const endY = canvas.height/h*i - canvas.height/h/2;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        for(let i = 0; i <= w; i ++){
            ctx.beginPath();
            const startX = canvas.width/w*i - canvas.width/w/2;
            const startY = 0 - canvas.height/h/2;
            const endX = canvas.width/w*i - canvas.width/w/2;
            const endY = deltaY*this.gridTimer2 - canvas.height/h/2;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        ctx.restore();
        if(this.gridTimer2 < gridDuration)
            this.gridTimer2++;
    }

    reset(){
        originX = 0;
        originY = 0;
        this.startTime = 0;
        this.duration = 800;

        this.startImageLoaded = false;
        this.capturedDataURL = canvas.toDataURL('stage2/png'); 
        this.stage2Img = new Image();
        this.stage2Img.src = this.capturedDataURL;
        this.progressNum = 0;
        this.stage2Img.onload = () => {
            this.startImageLoaded = true;
        };
        this.gridTimer = 0;
        this.gridTimer2 = 0;
        this.triangle = null;
        this.grid2Alpha = 0.35;
    }

    progress(){
        if(this.progressNum == 6){
            stage++;
            stageInstance = "stage3Instance";
            window[stageInstance].reset();
            return;
        }
        this.progressNum++;
    }

  }
  

// Export the class instance to the global scope
window.stage2Instance = new Stage2Class();