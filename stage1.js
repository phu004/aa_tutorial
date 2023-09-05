// stage1.js

class Stage1Class {
    constructor() {
       
        this.reset();
    }
    

    doSomething() {
        this.drawText({text: '浅入深出，带你了解抗锯齿', x: 525, y:200, color: 'black', size: 44, alpha: 1});
        this.drawText({text: '作者： phu004', x: 700, y: 280, color: 'black', size: 26, alpha: 1});

        for(let i = 0; i < this.texts.length; i++){
            if(this.texts[i].alpha !=0 && this.texts[i].alpha < 1){
                this.texts[i].alpha+=0.05;
            }
            this.drawText(this.texts[i]);
        }
    }

    drawText(text) {
        ctx.save(); // Save the current canvas state
        ctx.globalAlpha = text.alpha
        ctx.fillStyle = text.color;
        ctx.font = `${text.size}px Arial`;
        ctx.fillText(text.text, text.x + originX, text.y + originY);
        ctx.restore();
    }

    reset(){
        originX = 0;
        originY = 0;
        this.texts = [
            {text: "● 计算机图形中为什么会出现锯齿状边缘", x: 570, y: 400, color: 'black', size: 26, alpha: 0},
            {text: "● 介绍几款常用的抗锯齿技术", x: 570, y: 470, color: 'black', size: 26, alpha: 0},
            {text: "● 对比不同抗锯齿技术的优缺点", x: 570, y: 540, color: 'black', size: 26, alpha: 0}
        ];
        this.progressNum = 0;

    }

    progress(){

        if(this.progressNum == 3){
            stage++;
            stageInstance = "stage2Instance";
            window[stageInstance].reset();
            return;
        }
        this.drawText(this.texts[this.progressNum].alpha = 0.05);
        this.progressNum++;

        
    }
  }
  
// Export the class instance to the global scope
window.stage1Instance = new Stage1Class();
  