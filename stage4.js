class Stage4Class {
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
        this.capturedDataURL = canvas.toDataURL('stage4/png'); 
        this.stage4Img = new Image();
        this.stage4Img.src = this.capturedDataURL;
        this.progressNum = 0;
        this.stage4Img.onload = () => {
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

            ctx.drawImage(this.stage4Img, targetX, originY);

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
        
                this.triangle = new Triangle_TAA(vertex1, vertex2, vertex3, 32, 20);
                this.triangle.outlineAlpha = 0;
            }
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            if(this.TAA_title == null){
                this.TAA_title = new Title(50,50,260,65, "时间性抗锯齿 (TAA)");
            }
            this.TAA_title.draw();
        }

        if(this.progressNum == 3){
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.height = 105;
            this.TAA_title.text2 = "当前帧数: 1"
            this.TAA_title.draw();
            if(this.triangle.currentStartingIndex == this.triangle.currentFrame.length){
                this.triangle.copyFrame();
                this.progressNum = 4;
            }
        }

        if(this.progressNum == 4){
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }

        if(this.progressNum == 5){
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }

        if(this.progressNum == 6){
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            this.triangle.drawBlendFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }

        if(this.progressNum == 7){
            if(this.counter%60 == 0){
                this.triangle.copyBlendFrame();
                this.triangle.currentStartingIndex = 0;
                this.triangle.currentCenterIndex.value++;
                this.triangle.currentCenterIndex.value%=16;
                this.TAA_title.text2 = "当前帧数: " + (this.triangle.currentCenterIndex.value + 1);
            }
            
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            
            if(this.counter%60 == 20){
                this.triangle.blend();
            }
            if(this.counter%60 >= 20 && this.counter%60 <= 59){
                this.triangle.drawBlendFrame();
            }

            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
            if(this.counter < 830)
                this.counter++;
        }

        if(this.progressNum == 8){
            this.drawBackground();
            if(this.counter < 40){
                rotate(0.5, this.triangle);
                this.triangle.drawBlendFrame();
            }
            if(this.counter == 40){
                this.triangle.copyBlendFrame();
                this.triangle.currentStartingIndex = 0;
                this.triangle.currentCenterIndex.value++;
                this.triangle.currentCenterIndex.value%=16;
            }
            if(this.counter >= 40){
                this.triangle.drawCurrentFrame();
            }
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
            this.counter++;
        }

        if(this.progressNum == 9){
            this.drawBackground();
            this.triangle.drawBlendFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }

        if(this.progressNum == 10){
            this.drawBackground();
            this.triangle.drawBlendFrame();
            this.drawGrid(20,32);
            this.triangle.blendFrame[111].drawHighLightBorder();
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }

        if(this.progressNum == 11){
            this.drawBackground();
            this.triangle.drawBlendFrame();
            if(this.counter < 40){
                rotatePointDegrees(this.triangle.blendFrame[111], this.triangle, -0.5);
            }
            this.drawGrid(20,32);
            this.triangle.blendFrame[111].drawHighLightBorder();
            drawOutline(this.triangle);
            this.TAA_title.draw();
            this.counter++;
        }

        if(this.progressNum == 12){
            this.drawBackground();
            this.triangle.drawBlendFrame();
            let color =  this.triangle.getColorAt(this.triangle.blendFrame[111].borderX, this.triangle.blendFrame[111].borderY);
            this.triangle.blendFrame[111].drawAppearingPixel(color);
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }

        if(this.progressNum == 13){
            this.drawBackground();
            this.triangle.drawBlendFrame();
            this.drawGrid(20,32);
            this.triangle.blendFrame[108].drawHighLightBorder();
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }

        if(this.progressNum == 14){
            this.drawBackground();
            this.triangle.drawBlendFrame();
            this.triangle.blendFrame[108].drawAppearingPixel("#A3D8EF");
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }
        if(this.progressNum == 15){
            this.drawBackground();
            this.triangle.drawCurrentFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }
        if(this.progressNum == 16){
            this.drawBackground();
            this.triangle.drawBlendFrame();
            this.drawGrid(20,32);
            drawOutline(this.triangle);
            this.TAA_title.draw();
        }
    }

    progress(){
        if(this.progressNum == 4){
            this.triangle.currentStartingIndex = 0;
            this.triangle.currentCenterIndex.value = 1;
            this.TAA_title.text2 = "当前帧数: 2"
        }
        if(this.progressNum == 5){
            this.triangle.blend();
        }
        if(this.progressNum == 6){
            this.counter = 0;
        }
        if(this.progressNum == 7){
            this.counter = 0;
            this.TAA_title.text2 = "当前帧数: 17"
        }
        if(this.progressNum == 8){
            this.triangle.blend();
        }
        if(this.progressNum == 10){
            this.counter = 0;
        }
        if(this.progressNum == 12){
            let color =  this.triangle.getColorAt(this.triangle.blendFrame[111].borderX, this.triangle.blendFrame[111].borderY);
            this.triangle.blendFrame[111].pixelColor = color;
            this.triangle.currentStartingIndex = 0;
        }
        if(this.progressNum == 15){
            this.triangle.blendDynamicFrame(-20);
        }

        if(this.progressNum == 16){
            stage++;
            stageInstance = "stage5Instance";
            window[stageInstance].reset();
            return;
        }
        this.progressNum++;
    }
}

// Export the class instance to the global scope
window.stage4Instance = new Stage4Class();