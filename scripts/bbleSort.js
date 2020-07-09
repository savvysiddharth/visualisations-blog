//GLOBAL VARS
let arr = [74,67,42];

const initialPosX = 50;
const boxWidth = 50;
const boxHeight = 40;
const boxSpacing = 5;

let outerLoopCounter = 0;
let i = 0; //innerLoop
let animating = false;
let sorted = false;
let start = false;

let numBoxes = [];


class Box {
  constructor(val,x,y) {
    this.val = val;
    this.x = x;
    this.y = y;
    this.targetval = undefined;
  }

  draw() {
    mysketch.fill(255);
    mysketch.rect(this.x, this.y, boxWidth, boxHeight, 20);
    mysketch.fill(0);
    mysketch.textSize(16);
    mysketch.text(this.val, this.x, this.y+5);
  }
}

let sketch = (p) => {
  p.setup = () => {
    const {height,CENTER} = p;

    let c = p.createCanvas(600,200);
    c.style('border-radius','20px');
    p.background(0);
    p.rectMode(CENTER);
    p.textAlign(CENTER);

    let pos = initialPosX;
    for(let i in arr) {
      numBoxes.push(new Box(arr[i], pos, height-40));
      pos += boxWidth + boxSpacing;
    }
  };

  p.draw = () => {
    const {width} = p;

    if(start) {
      p.noStroke();
      p.background(0);
      p.frameRate(0.5);

      for(let k in numBoxes) {
        numBoxes[k].draw();
      }

      if(!animating) {
        if(i == numBoxes.length-1) {
          i = 0; //reset to 0
          outerLoopCounter++;
          if(outerLoopCounter > numBoxes.length) {
            p.text("Sorted! :D",width/2,60);
            console.log('Sorted!');
            sorted=true;
            start = false;
            document.querySelector("#resetbutton").style.display = "block";
            return;
          }
        }

        p.fill('rgba(0,0,200,0.4)');
        p.rect(numBoxes[i].x, numBoxes[i].y, boxWidth, boxHeight, 20);
        p.rect(numBoxes[i+1].x, numBoxes[i+1].y, boxWidth, boxHeight, 20);

        p.fill(255);
        p.textSize(25);
        p.text("Is "+numBoxes[i].val+" > "+numBoxes[i+1].val+" ?", width/2, 60);

        console.log('i=',i);
        console.log('comparing',numBoxes[i].val,'>',numBoxes[i+1].val,'=',numBoxes[i].val > numBoxes[i+1].val);
        if(numBoxes[i].val > numBoxes[i+1].val) {
          p.text("Yes, swap it..", width/2, 100);
          animating = true;
          numBoxes[i].targetval = numBoxes[i+1].x;
        } else {
          p.text("No, go ahead..", width/2, 100);
        }
        i++;
      } else {
        //now our i is i+1, so we gotta swap, i-1 & i
        p.frameRate(120);
        p.fill('rgba(0,0,200,0.4)');
        p.rect(numBoxes[i].x, numBoxes[i].y, boxWidth, boxHeight, 20);
        p.rect(numBoxes[i-1].x, numBoxes[i-1].y, boxWidth, boxHeight, 20);
        numBoxes[i-1].x += 1;
        numBoxes[i].x -= 1;
        if(numBoxes[i-1].x >= numBoxes[i-1].targetval) {
          animating = false;
          let temp = numBoxes[i-1];
          numBoxes[i-1] = numBoxes[i];
          numBoxes[i] = temp;
        }
      }
    }
  };
};

let mysketch = new p5(sketch,"sketchbox");

function resetSketch() {
  const {height} = mysketch;
  start=false;
  sorted = false;
  mysketch.background(0);
  i=0;
  outerLoopCounter=0;
  numBoxes = [];
  let pos = initialPosX;
  for(let i in arr) {
    numBoxes.push(new Box(arr[i], pos, height-40));
    pos += boxWidth + boxSpacing;
  }
  document.querySelector("#resetbutton").style.display = "none";
}

function sortInput() {
  let ival = document.querySelector("#nums").value;

  if(ival == "") {
    console.log("SHOWING DEFAULT!");
    start = true;
    return;
  }

  console.log(ival.split(','));

  arr =  ival.replace(/ /g,'').split(',');
  for(k in arr) {
    arr[k] = parseInt(arr[k]);
  }

  numBoxes = [];
  resetSketch();
  start = true;
}

function playPause() {
  start = !start;
  if(start)
    console.log('Played..');
  else
    console.log('Paused!');
}