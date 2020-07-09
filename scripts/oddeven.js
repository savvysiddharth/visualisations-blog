//GLOBAL VARS
let arr = [43,21,34,27,31,19,8,32];

const initialPosX = 50;
const boxWidth = 50;
const boxHeight = 40;
const boxSpacing = 5;
let numBoxes = [];

let outerLoopCounter = 0;
let i = 0; //innerLoop

let animating = false;
let sorted = false;
let start = false;

const EVEN = 1;
const ODD = 0;

let phase = EVEN; //0 for even phase, 1 for odd phase

let swapSpeed = 0.5; //pixel move per frame


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
      p.background(0);
      p.noStroke();
      p.frameRate(0.5);
      // console.log("zinda he kya??");
      // console.log('here..');
      //draw
      for(let k in numBoxes) {
        numBoxes[k].draw();
      }

      if(!animating) {
        console.log('new phase');
        if(i == numBoxes.length) {
          console.log('Sorted!');
          start = false;
          return;
        }
  
        for(let k=phase ; k<numBoxes.length-1 ; k+=2) {
          let col = {
            r:Math.floor(Math.random()*200),
            g:Math.floor(Math.random()*200),
            b:Math.floor(Math.random()*200)
          };
          let colorstr = `rgba(${col.r},${col.g},${col.b},0.5)`;
          // console.log(colorstr);
          p.fill(colorstr);
          p.rect(numBoxes[k].x, numBoxes[k].y, boxWidth, boxHeight, 20);
          p.rect(numBoxes[k+1].x, numBoxes[k+1].y, boxWidth, boxHeight, 20);

          if(numBoxes[k].val > numBoxes[k+1].val) {
            numBoxes[k].targetval = numBoxes[k+1].x;
            animating = true;
          }
          console.log("comparing",numBoxes[k].val,">",numBoxes[k+1].val,"=",numBoxes[k].val > numBoxes[k+1].val);
        }

        p.fill(255);
        p.textSize(25);
        if(phase == EVEN) {
          p.text("even phase", width/2, 60);
          phase = ODD; //swap phase
        } else {
          p.text("odd phase", width/2, 60);
          phase = EVEN; //swap phase
        }
        i++;
      } else {
        //now our i is i+1, so we gotta swap, i-1 & i
        // console.log(i);
        p.frameRate(60);

        let prevPhase = (phase==EVEN)?ODD:EVEN;

        if(prevPhase == EVEN)
          p.text("even phase", width/2, 60);
        else
          p.text("odd phase", width/2, 60);

        //finding first one with target val
        let firstOneWithTarget;
        for(let k=prevPhase ; k<numBoxes.length-1 ; k+=2) {
          if(numBoxes[k].targetval != undefined) {
            firstOneWithTarget = k;
            break;
          }
        }

        for(let k=prevPhase ; k<numBoxes.length-1 ; k+=2) {
          if(numBoxes[k].targetval != undefined) {
            numBoxes[k].x += swapSpeed;
            numBoxes[k+1].x -= swapSpeed;
          }
        }

        if(numBoxes[firstOneWithTarget].x >= numBoxes[firstOneWithTarget].targetval) {
          animating = false;
          for(let k=prevPhase ; k<numBoxes.length-1 ; k+=2) {
            if(numBoxes[k].targetval != undefined) {
              let temp = numBoxes[k];
              numBoxes[k] = numBoxes[k+1];
              numBoxes[k+1] = temp;
              numBoxes[k].targetval = undefined;
              numBoxes[k+1].targetval = undefined;
            }
          }
        }

      }
    }
  };

};

let mysketch = new p5(sketch,"sketchbox");

// function setup() {
//   let c = createCanvas(600,200);
//   c.style('border-radius','20px');
//   background(0);
//   rectMode(CENTER);
//   textAlign(CENTER);

//   let pos = initialPosX;
//   for(let i in arr) {
//     numBoxes.push(new Box(arr[i], pos, height-40));
//     pos += boxWidth + boxSpacing;
//   }
// }

// function draw() {

//   if(start) {
//     background(0);
//     noStroke();
//     frameRate(0.5);
//     // console.log("zinda he kya??");
//     // console.log('here..');
//     //draw
//     for(let k in numBoxes) {
//       numBoxes[k].draw();
//     }

//     if(!animating) {
//       console.log('new phase');
//       if(i == numBoxes.length) {
//         console.log('Sorted!');
//         start = false;
//         return;
//       }

//       for(let k=phase ; k<numBoxes.length-1 ; k+=2) {
//         let col = {
//           r:Math.floor(Math.random()*200),
//           g:Math.floor(Math.random()*200),
//           b:Math.floor(Math.random()*200)
//         };
//         let colorstr = `rgba(${col.r},${col.g},${col.b},0.5)`;
//         // console.log(colorstr);
//         fill(colorstr);
//         rect(numBoxes[k].x, numBoxes[k].y, boxWidth, boxHeight, 20);
//         rect(numBoxes[k+1].x, numBoxes[k+1].y, boxWidth, boxHeight, 20);

//         if(numBoxes[k].val > numBoxes[k+1].val) {
//           numBoxes[k].targetval = numBoxes[k+1].x;
//           animating = true;
//         }
//         console.log("comparing",numBoxes[k].val,">",numBoxes[k+1].val,"=",numBoxes[k].val > numBoxes[k+1].val);
//       }

//       fill(255);
//       textSize(25);
//       if(phase == 0) {
//         text("even phase", width/2, 60);
//         phase = 1;
//       } else {
//         text("odd phase", width/2, 60);
//         phase = 0;
//       }
//       i++;
//     } else {
//       //now our i is i+1, so we gotta swap, i-1 & i
//       // console.log(i);
//       frameRate(60);

//       let prevPhase = (phase==0)?1:0;

//       if(prevPhase == 0)
//         text("even phase", width/2, 60);
//       else
//         text("odd phase", width/2, 60);

//       //finding first one with target val
//       let firstOneWithTarget;
//       for(let k=prevPhase ; k<numBoxes.length-1 ; k+=2) {
//         if(numBoxes[k].targetval != undefined) {
//           firstOneWithTarget = k;
//           break;
//         }
//       }

//       for(let k=prevPhase ; k<numBoxes.length-1 ; k+=2) {
//         if(numBoxes[k].targetval != undefined) {
//           numBoxes[k].x += swapSpeed;
//           numBoxes[k+1].x -= swapSpeed;
//         }
//       }

//       if(numBoxes[firstOneWithTarget].x >= numBoxes[firstOneWithTarget].targetval) {
//         animating = false;
//         for(let k=prevPhase ; k<numBoxes.length-1 ; k+=2) {
//           if(numBoxes[k].targetval != undefined) {
//             let temp = numBoxes[k];
//             numBoxes[k] = numBoxes[k+1];
//             numBoxes[k+1] = temp;
//             numBoxes[k].targetval = undefined;
//             numBoxes[k+1].targetval = undefined;
//           }
//         }
//       }

//     }
//   }
// }

function resetSketch() {
  const {height} = mysketch;
  start=false;
  mysketch.background(0);
  i=0;
  outerLoopCounter=0;
  numBoxes = [];
  let pos = initialPosX;
  for(let i in arr) {
    numBoxes.push(new Box(arr[i], pos, height-40));
    pos += boxWidth + boxSpacing;
  }
  start = true;
}

function sortInput() {
  const {height} = mysketch;
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

  let pos = initialPosX;
  for(let i in arr) {
    numBoxes.push(new Box(arr[i], pos, height-40));
    pos += boxWidth + boxSpacing;
  }
  start = true;
}

function playPause() {
  start = !start;
  if(start)
    console.log('Played..');
  else
    console.log('Paused!');
}