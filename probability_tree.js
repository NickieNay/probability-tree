var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.font = "15px Arial";

var reds = parseInt(document.getElementById("red").value);
var blues = parseInt(document.getElementById("blue").value);
var depth = parseInt(document.getElementById("depth").value);
var withReplacement = document.getElementById("withRepl").checked;
// all branch objects are stored in the branches array.
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

// Branch object. A branch knows its starting vertex, the number of balls at
//that point, its current rank (depth), and the history of the probabilities of
//the ball choices leading up to that point.
function branch(initX, initY, numReds, numBlues, currentRank, history){
    this.xi = initX;
    this.yi = initY;
    this.reds = numReds;
    this.blues = numBlues;
    this.rank = currentRank;
    //history array - array of probabilities along the path leading to this
    //branch.
    this.hist = history;

    // probabilities of choosing red and blue in this branch.
    this.pRed = (numReds / (numReds + numBlues)).toFixed(2);
    this.pBlue = (numBlues / (numReds + numBlues)).toFixed(2);

    // helper variables for the drawing logic.
    var deltaY = canvas.height / (2 * Math.pow(2, this.rank));
    var deltaX = 160;
    var lineFinalX = initX + 20 + deltaX;
    var centX = lineFinalX + 20;

    // This function draws the branch lines, the probability of each choice,
    //and the balls.
    this.drawBranches = function(){
      //draw upper line
      context.fillStyle = "#000000";
      context.beginPath();
      context.moveTo(initX + 20, initY);
      context.lineTo(lineFinalX, initY - deltaY);
      context.stroke();

      //draw probability for upper line
      var tx = initX + 20 + (deltaX / 2);
      var ty = initY - (deltaY / 2);
      ty = parseInt(ty) - 10;
      tx = parseInt(tx) - 30;
      context.fillText(this.pRed, tx, ty);

      //draw lower line
      context.beginPath();
      context.moveTo(initX + 20, initY);
      context.lineTo(initX + 20 + deltaX, initY + deltaY);
      context.stroke();

      //draw probability for lower line
      ty = initY + (deltaY / 2);
      ty = parseInt(ty) + 20;
      context.fillText(this.pBlue, tx, ty);

      //draw red circle with gradient
      var centY = initY - deltaY;
      var redGrd = context.createRadialGradient(centX + 3, centY - 3, 0, centX + 3, centY - 3, 10);
      redGrd.addColorStop(0, "#f44242");
      redGrd.addColorStop(1, "red");
      context.beginPath();
      context.arc(centX, centY, 15, 0, 2*Math.PI);
      context.fillStyle=redGrd;
      context.fill();

      //draw blue circle with gradient
      var centY = initY + deltaY;
      var grdBlue = context.createRadialGradient(centX + 3, centY - 3, 0, centX + 3, centY - 3, 10);
      grdBlue.addColorStop(0, "#4144f4");
      grdBlue.addColorStop(1, "blue");
      context.beginPath();
      context.arc(centX, centY, 15, 0, 2*Math.PI);
      context.fillStyle=grdBlue;
      context.fill();
    }
    // returns the coordinates of the starting point for the next branch from
    //the red choice
    this.nextRedCoords = function() {
      return [lineFinalX + 20, initY - deltaY];
    }
    // returns the coordinates of the starting point for the next branch from
    //the blue choice
    this.nextBlueCoords = function() {
      return [lineFinalX + 20, initY + deltaY];
    }

    // this function is used on the last rank to be printed. It calculates the
    //accumulated probability of that particular path based on the probability
    //stored in the hist array. Once calculated, the probability is printed
    //next to the final ball.
    this.printProbability = function() {
      function multiply(total, num){
        return total*num;
      }
      var finalPRed = this.hist.length > 0 ? this.hist.reduce(multiply) * this.pRed : parseFloat(this.pRed);
      var finalPBlue = this.hist.length > 0 ? this.hist.reduce(multiply) * this.pBlue : parseFloat(this.pBlue);

      context.fillStyle = "#000000";
      context.fillText("P = " + finalPRed.toFixed(2), this.nextRedCoords()[0] + 20, this.nextRedCoords()[1] + 5);

      context.fillText("P = " + finalPBlue.toFixed(2), this.nextBlueCoords()[0] + 20, this.nextBlueCoords()[1] + 5);
    }
}

//This function initializes all of the branch objects that will be used. The number of branches is based on the chosen rank.
function init(){
  var initBranch = new branch(0,canvas.height/2,reds, blues, 1, []);
  branches.push(initBranch);

  if(depth > 1){
    for(var i = 1; i < depth; ++i){
      // for each rank, create new branches until the desired rank is reached.
      var filterBranches = branches.filter(function(branch){if(branch.rank == i){return branch}});
      for(key in filterBranches){
        var curBranch = filterBranches[key];
        if(curBranch.rank == i){
          // for each new branch, the history array is copied and appended with //the
          //probability of the choice before the new branch. For example, if
          //the branch starts from a red ball, then the history array is
          //appended with the probability of choosing that red ball.
          var redArray = curBranch.hist.slice();
          redArray.push(curBranch.pRed);
          var blueArray = curBranch.hist.slice();
          blueArray.push(curBranch.pBlue);

          var numRedforRedBranch;
          var numBluesforBlueBranch;
          if(withReplacement){
            // if replacement is used, then the probabilities don't change.
            numRedforRedBranch = curBranch.reds;
            numBluesforBlueBranch = curBranch.blues;
          } else {
            //without replacement, the number of balls should be reduced by one, depending on the choice.
            numRedforRedBranch = curBranch.reds - 1;
            numBluesforBlueBranch = curBranch.blues - 1;
          }
          // new branch based off of a red ball.
          branches.push(new branch(curBranch.nextRedCoords()[0],curBranch.nextRedCoords()[1], numRedforRedBranch, curBranch.blues, curBranch.rank + 1, redArray));
          // new branch based off of a blue ball.
          branches.push(new branch(curBranch.nextBlueCoords()[0],curBranch.nextBlueCoords()[1], curBranch.reds, numBluesforBlueBranch, curBranch.rank + 1, blueArray));
        }
      }
    }
  }
}

//draws all branches created and prints the final probability for the final rank
function draw(){
  for(key in branches){
    branches[key].drawBranches();
  }
  var filterBranches = branches.filter(function(branch){if(branch.rank == depth){branch.printProbability()}});
}

init();
draw();
