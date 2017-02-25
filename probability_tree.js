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
    drawLine(0,300,180,180);//1
    drawLine(0,300,180,420);//2

    // Second rank
    drawLine(220,180,380,120);//3
    drawLine(220,180,380,240);//4
    drawLine(220,420,380,380);//5
    drawLine(220,420,380,480);//6

    // Third rank
    drawLine(420,120,580,80);//7
    drawLine(420,120,580,160);//8
    drawLine(420,240,580,200);//9
    drawLine(420,240,580,280);//10
    drawLine(420,380,580,320);//11
    drawLine(420,380,580,400);//12
    drawLine(420,480,580,440);//13
    drawLine(420,480,580,520);//14

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

            var centX = x_f + 20;
            var centY = y_f;
            var grd = context.createRadialGradient(centX + 3, centY - 3, 0, centX + 3, centY - 3, 10);
            grd.addColorStop(0, "#f44242");
            grd.addColorStop(1, "red");
            context.beginPath();
            context.arc(centX, centY, 15, 0, 2*Math.PI);
            context.fillStyle=grd;
            context.fill();
        } else {
            //Drawing a lower line, blue circle, text below.
            var cx = (x_f - x_0)/2 + x_0;
            var cy = (y_f - y_0)/2 + y_0;
            cy = parseInt(cy) + 20;
            cx = parseInt(cx) - 20;
            context.fillText(pBlue_0, cx, cy);

            var centX = x_f + 20;
            var centY = y_f;
            var grd = context.createRadialGradient(centX + 3, centY - 3, 0, centX + 3, centY - 3, 10);
            grd.addColorStop(0, "#4144f4");
            grd.addColorStop(1, "blue");
            context.beginPath();
            context.arc(centX, centY, 15, 0, 2*Math.PI);
            context.fillStyle=grd;
            context.fill();
        }
    }
}

drawStructure();
