var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.font = "15px Arial";

var reds = parseInt(document.getElementById("red").value);
var blues = parseInt(document.getElementById("blue").value);
var depth = parseInt(document.getElementById("depth").value);
var withReplacement = document.getElementById("withRepl").checked;
var branches = [];

function inputChange(){
    reds = parseInt(document.getElementById("red").value);
    blues = parseInt(document.getElementById("blue").value);
    depth = parseInt(document.getElementById("depth").value);
    withReplacement = document.getElementById("withRepl").checked;
    branches = [];

    context.clearRect(0,0,canvas.width, canvas.height);
    init();
    draw();
}

function branch(initX, initY, numReds, numBlues, currentRank, history){
    this.xi = initX;
    this.yi = initY;
    this.reds = numReds;
    this.blues = numBlues;
    this.rank = currentRank;
    this.hist = history;

    this.pRed = (numReds / (numReds + numBlues)).toFixed(2);
    this.pBlue = (numBlues / (numReds + numBlues)).toFixed(2);

    var deltaY = canvas.height / (2 * Math.pow(2, this.rank));
    var deltaX = 160;
    var lineFinalX = initX + 20 + deltaX;
    var centX = lineFinalX + 20;

    this.drawBranches = function(){
      //upper line
      context.fillStyle = "#000000";
      context.moveTo(initX + 20, initY);
      context.lineTo(lineFinalX, initY - deltaY);
      context.stroke();

      //text: probability for upper line
      var tx = initX + 20 + (deltaX / 2);
      var ty = initY - (deltaY / 2);
      ty = parseInt(ty) - 10;
      tx = parseInt(tx) - 30;
      context.fillText(this.pRed, tx, ty);

      //lower line
      context.moveTo(initX + 20, initY);
      context.lineTo(initX + 20 + deltaX, initY + deltaY);
      context.stroke();

      //text: probability for lower line
      ty = initY + (deltaY / 2);
      ty = parseInt(ty) + 20;
      context.fillText(this.pBlue, tx, ty);

      //red circle
      var centY = initY - deltaY;
      var redGrd = context.createRadialGradient(centX + 3, centY - 3, 0, centX + 3, centY - 3, 10);
      redGrd.addColorStop(0, "#f44242");
      redGrd.addColorStop(1, "red");
      context.beginPath();
      context.arc(centX, centY, 15, 0, 2*Math.PI);
      context.fillStyle=redGrd;
      context.fill();

      //blue circle
      var centY = initY + deltaY;
      var grdBlue = context.createRadialGradient(centX + 3, centY - 3, 0, centX + 3, centY - 3, 10);
      grdBlue.addColorStop(0, "#4144f4");
      grdBlue.addColorStop(1, "blue");
      context.beginPath();
      context.arc(centX, centY, 15, 0, 2*Math.PI);
      context.fillStyle=grdBlue;
      context.fill();
    }
    this.nextRedCoords = function() {
      return [lineFinalX + 20, initY - deltaY];
    }

    this.nextBlueCoords = function() {
      return [lineFinalX + 20, initY + deltaY];
    }

    this.printProbability = function() {
      function multiply(total, num){
        return total*num;
      }
      var finalPRed = this.hist.length > 0 ? this.hist.reduce(multiply) * this.pRed : parseFloat(this.pRed);
      var finalPBlue = this.hist.length > 0 ? this.hist.reduce(multiply) * this.pBlue : parseFloat(this.pBlue);

      context.fillStyle = "#000000";
      context.fillText(finalPRed.toFixed(2), this.nextRedCoords()[0] + 20, this.nextRedCoords()[1] + 5);

      context.fillText(finalPBlue.toFixed(2), this.nextBlueCoords()[0] + 20, this.nextBlueCoords()[1] + 5);
    }
}

function init(){
  var initBranch = new branch(0,canvas.height/2,reds, blues, 1, []);
  branches.push(initBranch);

  if(depth > 1){
    for(var i = 1; i < depth; ++i){
      var filterBranches = branches.filter(function(branch){if(branch.rank == i){return branch}});
      for(key in filterBranches){
        var curBranch = filterBranches[key];
        if(curBranch.rank == i){
          var redArray = curBranch.hist.slice();
          redArray.push(curBranch.pRed);
          var blueArray = curBranch.hist.slice();
          blueArray.push(curBranch.pBlue);

          var numRedforRedBranch;
          var numBluesforBlueBranch;
          if(withReplacement){
            numRedforRedBranch = curBranch.reds;
            numBluesforBlueBranch = curBranch.blues;
          } else {
            numRedforRedBranch = curBranch.reds - 1;
            numBluesforBlueBranch = curBranch.blues - 1;
          }

          branches.push(new branch(curBranch.nextRedCoords()[0],curBranch.nextRedCoords()[1], numRedforRedBranch, curBranch.blues, curBranch.rank + 1, redArray));
          branches.push(new branch(curBranch.nextBlueCoords()[0],curBranch.nextBlueCoords()[1], curBranch.reds, numBluesforBlueBranch, curBranch.rank + 1, blueArray));
        }
      }
    }
  }
}

function draw(){
  for(key in branches){
    branches[key].drawBranches();
  }
  var filterBranches = branches.filter(function(branch){if(branch.rank == depth){branch.printProbability()}});
}

init();
draw();
