console.log(document.getElementById("p1").value);
            
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.font = "15px Arial";

function p1InputChange(){
    var p1 = document.getElementById("p1").value;
    var newp2 = 1.0-p1;
    document.getElementById("p2").value = newp2.toFixed(2);
    context.clearRect(0,0,canvas.width, canvas.height);
    drawStructure();
}

function p2InputChange(){
    var p2 = document.getElementById("p2").value;
    var newp1 = 1.0-p2;
    document.getElementById("p1").value = newp1.toFixed(2);
    context.clearRect(0,0,canvas.width, canvas.height);
    drawStructure();
}



function drawStructure(){
    
    drawUpperLine(0,300,200,180);//1
    drawUpperLine(240,180,440,120);//3
    drawUpperLine(240,420,440,380);//5
    drawUpperLine(480,120,680,80);//7
    drawUpperLine(480,240,680,200);//9
    drawUpperLine(480,380,680,320);//11
    drawUpperLine(480,480,680,440);//13
    
    drawLowerLine(0,300,200,420);//2    
    drawLowerLine(240,180,440,240);//4  
    drawLowerLine(240,420,440,480);//6
    drawLowerLine(480,120,680,160);//8
    drawLowerLine(480,240,680,280);//10
    drawLowerLine(480,380,680,400);//12
    drawLowerLine(480,480,680,520);//14
    
    var p1 = document.getElementById("p1").value;
    
    
    function drawUpperLine(x_0, y_0, x_f, y_f){
        context.moveTo(x_0, y_0);
        context.lineTo(x_f, y_f);
        context.fillStyle = "#000000";
        context.stroke();
        
        var cx = (x_f - x_0)/2 + x_0;
        var cy = (y_f - y_0)/2 + y_0;
        cy = parseInt(cy) - 10;
        cx = parseInt(cx) - 20;
        
        var p1 = document.getElementById("p1").value;
        context.fillText(p1, cx, cy);
        
        context.beginPath();
        context.arc(x_f + 20, y_f, 15, 0, 2*Math.PI);
        context.fillStyle="#FF0000";
        context.fill();
    }
    
    function drawLowerLine(x_0, y_0, x_f, y_f){
        context.moveTo(x_0, y_0);
        context.lineTo(x_f, y_f);
        context.fillStyle = "#000000";
        context.stroke();
        
        var cx = (x_f - x_0)/2 + x_0;
        var cy = (y_f - y_0)/2 + y_0;
        cy = parseInt(cy) + 20;
        cx = parseInt(cx) - 20;
        
        var p2 = document.getElementById("p2").value;
        context.fillText(p2, cx, cy);
        
        context.beginPath();
        context.arc(x_f + 20, y_f, 15, 0, 2*Math.PI);
        context.fillStyle="#0000FF";
        context.fill();
    }
}

drawStructure();
