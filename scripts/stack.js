function pushVal() {
  let val = document.querySelector("#pushdata").value;
  if(val == "") {
    alert('Enter some value');
    return;
  }
  console.log(val);
  stackarr.push(new stackelement(val));
  document.querySelector("#pushdata").value = "";
  document.querySelector("#pushdata").focus();
}

function popTop() {
  if(stackarr.length > 0) {
    stackarr.pop();
  } else {
    alert("Nothing to pop!");
  }
}

class stackelement {
  constructor(val) {
    this.val = val;
    this.drawn = false;
  }
}


let e1 = new stackelement(21);
let stackarr = [];
// stackarr.push(e1);

//assuming 500x500 canvas, and drawing at center
let stacksketch = function(p) {

  p.STACKStartPixelY = 450; //initially at bottom
  p.animvar = 0;
  p.borderRadius = 20;

  let {STACKStartPixelY,animvar,borderRadius} = p;

  p.setup = function() {
    const c = p.createCanvas(500,500);
    c.style('border-radius','20px');
    p.rectMode(p.CENTER);
    p.textAlign(p.CENTER);  
  }

  p.draw = function() {
    p.background(0);
    p.noStroke();
    let pos = STACKStartPixelY;

    for(let i=0 ; i<stackarr.length-1 ; i++) {
      p.rect(250,pos,100,40,borderRadius);
      p.text(stackarr[i].val,250,pos+5);
      pos -= 45;
    }

    if(stackarr.length > 0) {
      if(!stackarr[stackarr.length-1].drawn) {
        p.rect(250,animvar,100,40,borderRadius);
        p.text(stackarr[stackarr.length-1].val,250,animvar+5);

        if(animvar < pos)
          animvar += 20;
        if(animvar >= pos) {
          stackarr[stackarr.length-1].drawn = true;
          animvar = 0;
          pos -= 45;
        }
      } else {
          p.rect(250,pos,100,40,borderRadius);
          p.text(stackarr[stackarr.length-1].val,250,pos+5);
          pos -= 45;
      }
    }
  }
};

let stacksketchp5 = new p5(stacksketch,'stacksketch');