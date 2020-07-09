//GLOBAL VARS
const initialPosX = 40;
let boxWidth = 70;
let boxSpacing = 5;
let arr = ["chandler","joey","ross","racheal","pheobe","monica","richard","gilfoyle","jared"];
let i = 0;
let pause = true;
let key = undefined;



let sketch = (p) => {

  p.setup = () => {
    const {width, height, CENTER} = p;

    let c = p.createCanvas(700,200);
    c.style('border-radius','20px');
    p.rectMode(CENTER);
    p.textAlign(CENTER);
    p.background(0);

    let pos = initialPosX;
    for(let i in arr) {
      p.fill(255);
      p.rect(pos, height/2, boxWidth, 40, 20);
      p.fill(0);
      p.text(arr[i], pos, (height/2)+5);
      pos += boxWidth + boxSpacing;
    }
  };

  p.draw = () => {
    const {width, height} = p;

    if(!pause) {
      p.frameRate(1);

      p.fill(0);
      p.rect(width/2,40,700,60); //a black box to erase previous text

      let found = false;
      
      if(arr[i] == key) {
        p.fill('rgba(0,255,0,0.5)');
        p.rect(pos, height/2, boxWidth, 40, 20);
        p.fill(255);
        p.textSize(32);
        p.text(arr[i]+' == '+key + ' ? Yes :D',width/2,40);
        found = true;
        p.noLoop();
      } else {
        p.fill('rgba(255,0,0,0.5)');
        p.rect(pos, height/2, boxWidth, 40, 20);
        p.fill(255);
        p.textSize(32);
        p.text(arr[i]+' == '+key + ' ? No :(',width/2,40);

        pos += boxWidth + boxSpacing;

        if(i == (arr.length-1) && !found) {
          console.log('not found!');
          p.fill(0);
          p.rect(width/2,40,700,60); //a black box to erase previous text
          p.fill(255);
          p.textSize(32);
          p.text('Sorry, could not find, "'+key+'"',width/2,40);
          p.noLoop();
          return;
        }
        
        i++;
      }
    }
  };
}

let mysketch = new p5(sketch,"sketchbox");


function resetAnim() {
  mysketch.background(0);
  i=0;
  pause=true;
  pos=initialPosX;
  mysketch.setup();
  mysketch.loop();
}

function searchNow() {
  let searchentry = document.querySelector("#searchbox").value;
  if(searchentry == "") {
    alert("Enter some text..");
    return;
  }
  resetAnim();
  key = searchentry;
  pause = false;
}

function addNewList() {
  let istr = document.querySelector("#newlist").value;
  if(istr == "") {
    alert("empty list..");
    return;
  }
  arr = istr.replace(/ /g,'').split(',');
  resetAnim();
}