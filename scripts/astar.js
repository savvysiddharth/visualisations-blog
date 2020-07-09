let columns = 10, rows = 10;
let openList = [], closedList = [];
let start,end;
let w,h;
let path = [];
let stop = false; // stop drawing (used for play pause)
let hrus = 0; //heuristic
let finished = false;
let ctr = 0;
let grid = new Array(columns);


//this needs to be refactored for using minkowski distance
function heuristic(a,b) { //educated guess
  if(hrus == 0) {
    return mysketch.dist(a.i, a.j, b.i, b.j); //euclidian distance
  } else if(hrus == 1) {
    return abs(a.i - b.i) + abs(a.j - b.j); //manhatten distance
  }
}

class Spot {
  constructor(i,j) {
    this.i = i;
    this.j = j;

    this.f=0;
    this.g=0;
    this.h=0;
    this.neighbours =[];
    this.previous = undefined;
    this.wall = false;
    if(mysketch.random(1) < 0.4) {
      this.wall = true;
    }
  }

  reset() {
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  show(col) {
    mysketch.stroke(255);
    mysketch.strokeWeight(1);
    mysketch.fill(col);
    mysketch.ellipse(this.i * w+w/2, this.j * h+w/2, w/2, h/2, w/2, h/2);
    if(this.wall) {
      mysketch.fill(0);
      mysketch.stroke(50);
      mysketch.rect(this.i * w, this.j * h, w, h);
    }
  }

  addNeighbours(grid) {
    let column = this.i;
    let row = this.j;

    if(column < columns-1)
      this.neighbours.push(grid[column+1][row]); //right
    if(column > 0)
      this.neighbours.push(grid[column-1][row]); //left
    if(row < rows-1)
      this.neighbours.push(grid[column][row+1]); //down
    if(row > 0)
      this.neighbours.push(grid[column][row-1]); //up

    //corners
    if(column < columns-1 && row < rows-1)
      this.neighbours.push(grid[column+1][row+1]);
    if(column > 0 && row > 0)
      this.neighbours.push(grid[column-1][row-1]);
    if(column > 0 && row < rows-1)
      this.neighbours.push(grid[column-1][row+1]);
    if(column < columns-1 && row > 0)
      this.neighbours.push(grid[column+1][row-1]);
  }
}

let sketch = (p) => {
  p.setup = () => {

    p.createCanvas(500,500);

    const {width,height} = p;

    w = width / columns;
    h = height / rows;

    //making 2D array
    for(var i = 0 ; i < columns ; i++) {
      grid[i] = new Array(rows);
    }

    for(var i = 0 ; i < columns ; i++) {
      for(var j = 0 ; j < rows ; j++) {
        grid[i][j] = new Spot(i,j);
      }
    }


    for(var i = 0 ; i < columns ; i++) {
      for(var j = 0 ; j < rows ; j++) {
        grid[i][j].addNeighbours(grid);
      }
    }

    start = grid[0][0];
    end = grid[columns-1][rows-1];
    start.wall = false;
    end.wall = false;

    openList.push(start);
    start.h = heuristic(start,end);
    p.background('rgba(255,255,255,0.1)');
  };

  p.draw = () => {
    if(!stop) {
      p.frameRate(1);
      ctr++;
      let current;
      if(openList.length > 0) {
        //keep going
        let bestNode = 0; //for the best node from openset
        for(let i=0; i < openList.length; i++) {
          if(openList[i].f < openList[bestNode].f) {
            bestNode = i;
          }
        }

        current = openList[bestNode];

        if(current === end) {
          stop = true; //stopping the draw loop to iterate nothing

          //resetting things to initial values
          for(let i=0;i<columns;i++) {
            for(let j=0;j<rows;j++) {
              grid[i][j].reset();
            }
          }
          console.log('cost is '+path.length);
          console.log('finished');
          finished = true;
        }

        removeFromArray(openList,current);
        closedList.push(current);

        //calc g
        let neighbours = current.neighbours;
        for(let i = 0 ; i < neighbours.length ; i++) {
          let neighbour = neighbours[i];
          if(!closedList.includes(neighbour) && !neighbour.wall) {
            let temp_g = current.g + 1;

            let newPath=false;
            if(openList.includes(neighbour)) {
              if(temp_g < neighbour.g) {
                neighbour.g = temp_g;
                newPath=true;
              }
            }
            else {
              neighbour.g = temp_g;
              openList.push(neighbour);
              newPath=true;
            }

            //calc h
            if(newPath) {
              neighbour.h = heuristic(neighbour,end);
              neighbour.f = neighbour.g + neighbour.h;
              neighbour.previous = current;
            }
          }
        }
      }
      else {
        console.log('CANNOT FIND!')
        stop = true;
        return;
      }

      //DRAW THINGS
      p.background(50);

      p.strokeWeight(1);
      for(let i = 0 ; i < columns ; i++) {
        for(let j = 0 ; j < rows ; j++) {
          grid[i][j].show(p.color(255));
        }
      }
      p.fill('rgba(0,0,240,0.5)');
      p.rect(start.i * w, start.j * h, w, h);
      p.fill('rgba(0,240,0,0.5)');
      p.rect(end.i * w, end.j * h, w, h);

      for(let i = 0; i < closedList.length ; i++) {
        closedList[i].show(p.color(226, 45, 45)); //red
      }

      for(let i = 0; i < openList.length ; i++) {
        openList[i].show(p.color(58, 206, 41)); //green
      }

      path = [];
      let temp = current;
      path.push(temp);

      while(temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }


      for(let i = 0 ; i < path.length - 1 ; i++) {
        p.strokeWeight(6);
        p.stroke(108, 161, 247); //line color
        p.line(path[i].i*w +w/2, path[i].j*h +h/2,path[i+1].i*w +w/2, path[i+1].j*h+h/2);
      }
    }
  };
};

function removeFromArray(arr,elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if(arr[i] == elt) {
      arr.splice(i,1); // remove(where,how many)
    }
  }
}

let mysketch = new p5(sketch,"sketchbox");


function playPause(btn) {
  if(finished) {
    resetSketch();
  }
  else {
    stop = !stop;
    if(stop) {
      btn.innerHTML = "Play";
    } else {
      btn.innerHTML = "Pause";
    }
  }
}

function resetSketch() {

  const {width,height} = mysketch;

  stop = false;

  const btn = document.querySelector("#playbtn");
  if(stop) {
    btn.innerHTML = "Play";
  } else {
    btn.innerHTML = "Pause";
  }

  openList = [];
  closedList = [];
  path = [];

  w = width / columns;
  h = height / rows;

  //making 2D array
  for(let i = 0 ; i < columns ; i++) {
    grid[i] = new Array(rows);
  }

  for(let i = 0 ; i < columns ; i++) {
    for(let j = 0 ; j < rows ; j++) {
      grid[i][j] = new Spot(i,j);
    }
  }


  for(let i = 0 ; i < columns ; i++) {
    for(let j = 0 ; j < rows ; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

  start = grid[0][0];
  end = grid[columns-1][rows-1];
  start.wall=false;
  end.wall = false;

  openList.push(start);
  start.h = heuristic(start,end);

  finished = false;
}

/**
* Design inspired from - https://github.com/CodingTrain/AStar
*/