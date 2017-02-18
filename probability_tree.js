var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.font = "15px Arial";

var reds = parseInt(document.getElementById("red").value);
var blues = parseInt(document.getElementById("blue").value);
var pRed_0 = (reds/(reds + blues)).toFixed(2);
var pBlue_0 = (blues/(reds + blues)).toFixed(2);
var depth = parseInt(document.getElementById("depth").value);

function inputChange(){
    reds = parseInt(document.getElementById("red").value);
    blues = parseInt(document.getElementById("blue").value);
    
    pRed_0 = (reds/(reds + blues)).toFixed(2);
    pBlue_0 = (blues/(reds + blues)).toFixed(2);
    
    context.clearRect(0,0,canvas.width, canvas.height);
    drawStructure();
}

function drawStructure(){
    // First rank
    drawLine(0,300,200,180);//1
    drawLine(0,300,200,420);//2 
    
    // Second rank
    drawLine(240,180,440,120);//3
    drawLine(240,180,440,240);//4 
    drawLine(240,420,440,380);//5
    drawLine(240,420,440,480);//6
    
    // Third rank
    drawLine(480,120,680,80);//7
    drawLine(480,120,680,160);//8
    drawLine(480,240,680,200);//9
    drawLine(480,240,680,280);//10
    drawLine(480,380,680,320);//11
    drawLine(480,380,680,400);//12
    drawLine(480,480,680,440);//13
    drawLine(480,480,680,520);//14
    
    function drawLine(x_0, y_0, x_f, y_f){
        context.moveTo(x_0, y_0);
        context.lineTo(x_f, y_f);
        context.fillStyle = "#000000";
        context.stroke();
        
        if(y_f < y_0){
            //If drawing an upper line, then draw a red circle and text to the upper left.
            var cx = (x_f - x_0)/2 + x_0;
            var cy = (y_f - y_0)/2 + y_0;
            cy = parseInt(cy) - 10;
            cx = parseInt(cx) - 20;

            context.fillText(pRed_0, cx, cy);
            
            context.beginPath();
            context.arc(x_f + 20, y_f, 15, 0, 2*Math.PI);
            context.fillStyle="#FF0000";
            context.fill();
        } else {
            //Drawing a lower line, blue circle, text below.
            var cx = (x_f - x_0)/2 + x_0;
            var cy = (y_f - y_0)/2 + y_0;
            cy = parseInt(cy) + 20;
            cx = parseInt(cx) - 20;

            context.fillText(pBlue_0, cx, cy);

            context.beginPath();
            context.arc(x_f + 20, y_f, 15, 0, 2*Math.PI);
            context.fillStyle="#0000FF";
            context.fill();
        }
    }
}

drawStructure();
