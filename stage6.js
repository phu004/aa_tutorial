class Stage6Class {
    constructor() {
        this.myScale = 0.3;
        this.heightOffset = canvas.height/this.myScale/5*2;
        this.titleOffset = canvas.height/5;
        this.screen_w = 128;
        this.screen_h = 80;

        this.reset();
       
    }

    doSomething() {
        this.timer++;
        let angle = Math.cos(this.timer * 0.02) * Math.PI*0.5;
       
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

            ctx.drawImage(this.stage6Img, targetX, originY);

            ctx.fillStyle = `rgb(163,216,239)`;
            ctx.fillRect(targetX+distance, 0, canvas.width, canvas.height);
            if(targetX == -distance){
                this.progressNum = 1;
            }
        }

        if(this.progressNum == 1){
            this.drawBackground();
        }

        if(this.progressNum == 2){
            this.drawBackground();
            if(this.triangle_noAA == null){
                let s = 0.7;
                let h = 145;
                var vertex1 = { x: 0.390625*canvas.width*s, y: 0.08458333333333333*canvas.height*s + h};
                var vertex2 = { x: 0.22786458333333334*canvas.width*s, y: 0.78125*canvas.height*s + h};
                var vertex3 = { x: 0.9072916666666666*canvas.width*s, y: 0.7291666666666666*canvas.height*s +h};
                this.triangle_noAA = new Triangle_SSAA(vertex1, vertex2, vertex3, this.screen_w, this.screen_h);
                this.noAA_title = new Title(canvas.width/10 - 50,this.titleOffset,100,65, "无AA");
            }
            this.drawNoAA(angle);
        }

        if(this.progressNum == 3){
            this.drawBackground();

            if(this.triangle_SSAA == null){
                var vertex1 = { ...this.triangle_noAA.vertex1 };
                var vertex2 = { ...this.triangle_noAA.vertex2 };
                var vertex3 = { ...this.triangle_noAA.vertex3 };
                this.triangle_SSAA = new Triangle_SSAA(vertex1, vertex2, vertex3, this.screen_w, this.screen_h);
                this.SSAA_title = new Title(canvas.width/10*3 - 55,this.titleOffset,105,65, "SSAA");
            }

            this.drawNoAA(angle);
            this.drawSSAA(angle);
        }

        if(this.progressNum == 4){
            this.drawBackground();
            if(this.triangle_MSAA == null){
                var vertex1 = { ...this.triangle_noAA.vertex1 };
                var vertex2 = { ...this.triangle_noAA.vertex2 };
                var vertex3 = { ...this.triangle_noAA.vertex3 };
                this.triangle_MSAA = new Triangle_MSAA(vertex1, vertex2, vertex3, this.screen_w, this.screen_h);
                this.MSAA_title = new Title(canvas.width/10*5 - 55,this.titleOffset,105,65, "MSAA");
            }

            this.drawNoAA(angle);
            this.drawSSAA(angle);
            this.drawMSAA(angle);
        }

        if(this.progressNum == 5){
            this.drawBackground();
            if(this.triangle_TAA == null){
                var vertex1 = { ...this.triangle_noAA.vertex1 };
                var vertex2 = { ...this.triangle_noAA.vertex2 };
                var vertex3 = { ...this.triangle_noAA.vertex3 };
                this.triangle_TAA = new Triangle_TAA(vertex1, vertex2, vertex3, this.screen_w, this.screen_h);
                this.TAA_title = new Title(canvas.width/10*7 - 55,this.titleOffset,90,65, "TAA");
            }

            this.drawNoAA(angle);
            this.drawSSAA(angle);
            this.drawMSAA(angle);
            this.drawTAA(angle);
        }

        if(this.progressNum == 6){
            this.drawBackground();
            if(this.triangle_FXAA == null){
                var vertex1 = { ...this.triangle_noAA.vertex1 };
                var vertex2 = { ...this.triangle_noAA.vertex2 };
                var vertex3 = { ...this.triangle_noAA.vertex3 };
                this.triangle_FXAA = new Triangle_FXAA(vertex1, vertex2, vertex3, this.screen_w, this.screen_h);
                this.FXAA_title = new Title(canvas.width/10*9 - 55,this.titleOffset,105,65, "FXAA");
            }

            this.drawNoAA(angle);
            this.drawSSAA(angle);
            this.drawMSAA(angle);
            this.drawTAA(angle);
            this.drawFXAA(angle);
        }
    }

    drawFXAA(angle){
        rotate(angle,this.triangle_FXAA);
        let scale_temp = scale;
        let originX_temp = originX;
        let originY_temp = originY;
        scale = this.myScale;
        originY+=this.heightOffset;
        originX+=canvas.width/scale/5*4;
        this.triangle_FXAA.drawProcessedPixels_simple();
        scale = scale_temp;
        originX = originX_temp;
        originY = originY_temp;
        this.FXAA_title.draw();
    }

    drawTAA(angle){
        rotate(angle,this.triangle_TAA);
        let scale_temp = scale;
        let originX_temp = originX;
        let originY_temp = originY;
        scale = this.myScale;
        originY+=this.heightOffset;
        originX+=canvas.width/scale/5*3;
        this.triangle_TAA.modulationFactor = 0.15;
        this.triangle_TAA.drawProcessedPixels_simple(-angle);
        scale = scale_temp;
        originX = originX_temp;
        originY = originY_temp;
        this.TAA_title.draw();
    }

    drawMSAA(angle){
        rotate(angle,this.triangle_MSAA);
        let scale_temp = scale;
        let originX_temp = originX;
        let originY_temp = originY;
        scale = this.myScale;
        originY+=this.heightOffset;
        originX+=canvas.width/scale/5*2;
        this.triangle_MSAA.drawProcessedPixels_simple(angle);
        scale = scale_temp;
        originX = originX_temp;
        originY = originY_temp;
        this.MSAA_title.draw();

    }

    drawNoAA(angle){
        rotate(angle,this.triangle_noAA);
        let scale_temp = scale;
        let originX_temp = originX;
        let originY_temp = originY;
        scale = this.myScale;
        originY+=this.heightOffset;
        originX-=20;
        this.triangle_noAA.draw_simple();
        scale = scale_temp;
        originX = originX_temp;
        originY = originY_temp;
        this.noAA_title.draw();
    }

    drawSSAA(angle){
        rotate(angle,this.triangle_SSAA);
        let scale_temp = scale;
        let originX_temp = originX;
        let originY_temp = originY;
        scale = this.myScale;
        originY+=this.heightOffset;
        originX+=canvas.width/scale/5*1;
        this.triangle_SSAA.drawHighRes_simple();
        this.triangle_SSAA.downsample();
        this.triangle_SSAA.drawAntiAliasedPixels_simple();
        scale = scale_temp;
        originX = originX_temp;
        originY = originY_temp;
        this.SSAA_title.draw();
    }

    reset(){
        originX = 0;
        originY = 0;
        this.startTime = 0;
        this.duration = 800;
       
        this.startImageLoaded = false;
        this.capturedDataURL = canvas.toDataURL('stage6/png'); 
        this.stage6Img = new Image();
        this.stage6Img.src = this.capturedDataURL;
        this.progressNum = 0;
        this.stage6Img.onload = () => {
            this.startImageLoaded = true;
        };
        this.triangle_MSAA = null;
        this.triangle_noAA = null;
        this.triangle_SSAA = null;
        this.triangle_TAA = null;
        this.triangle_FXAA = null;
        this.timer = 0;
      
    }

    drawBackground(){
        ctx.fillStyle = `rgb(163,216,239)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    progress(){
        if(this.progressNum < 6)
            this.progressNum++;
    }
}

// Export the class instance to the global scope
window.stage6Instance = new Stage6Class();