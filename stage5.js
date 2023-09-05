class Stage5Class {
    constructor() {
       
        this.reset();
       
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

    drawBackground(){
        ctx.fillStyle = `rgb(163,216,239)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    reset(){
        originX = 0;
        originY = 0;
        this.startTime = 0;
        this.duration = 800;

        this.startImageLoaded = false;
        this.capturedDataURL = canvas.toDataURL('stage5/png'); 
        this.stage5Img = new Image();
        this.stage5Img.src = this.capturedDataURL;
        this.progressNum = 0;
        this.stage5Img.onload = () => {
            this.startImageLoaded = true;
        };
        this.gridTimer = 0;
        this.triangle = null;
        this.TAA_title = null;
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

            ctx.drawImage(this.stage5Img, targetX, originY);

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
        
                this.triangle = new Triangle_FXAA(vertex1, vertex2, vertex3, 32, 20);
                this.triangle.outlineAlpha = 0;
            }
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            if(this.FXAA_title == null){
                this.FXAA_title = new Title(50,50,300,65, "快速近似抗锯齿 (FXAA)");
            }
            this.FXAA_title.draw();
        }

        if(this.progressNum == 3){
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.FXAA_title.draw();
        }

        if(this.progressNum == 4){
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.triangle.drawEdge = true;
            this.FXAA_title.draw();
        }

        if(this.progressNum == 5){
            this.drawBackground();
            this.triangle.applyFilter = true;
            this.triangle.drawEdge = false;
            this.triangle.drawCurrentFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.FXAA_title.draw();
        } 
    }

    progress(){
        if(this.progressNum == 5){
            stage++;
            stageInstance = "stage6Instance";
            window[stageInstance].reset();
            return;
        }
        this.progressNum++;
    }
}


// Export the class instance to the global scope
window.stage5Instance = new Stage5Class();
    