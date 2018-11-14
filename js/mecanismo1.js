var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: 'canvas',
  width: width,
  height: height
});


var layer = new Konva.Layer();


// Generic function to draw an atom with a letter
function atom(x, y, draggable, color, stroke, radius, name, textColor) {
  let group = new Konva.Group({
    draggable: draggable
  });

  let t = new Konva.Text({
    x: x-11,
    y: y-11,
    text: name,
    fontSize: 30,
    fill: textColor,
  });

  let a = new Konva.Circle({
    x: x,
    y: y,
    radius: radius,
    fill: color,
    stroke: stroke,
    strokeWidth: 4,
  });

  group.add(a);
  group.add(t);
  return group;
}

// Atom that can be created.
function carbon(x, y, draggable) {
  return atom(x, y, draggable, '#333', '#000', 5*4 + 20, 'C', '#fff');
}

function oxygen(x, y, draggable) {
  return atom(x, y, draggable, '#f00', '#a00', 7*4 + 20, 'O', '#000');
}

function hydrogen(x, y, draggable) {
  return atom(x, y, draggable, '#999', '#777', 1*4 + 20, 'H', '#000');
}

// Bonds between atoms
function singleBond(atom1, atom2) {
  return new Konva.Line({
    points: [atom1.children[0].attrs.x, atom1.children[0].attrs.y, atom2.children[0].attrs.x, atom2.children[0].attrs.y],
    stroke: '#000',
    strokeWidth: 8,
    lineCap: 'round'
  });
}

function doubleBond(atom1, atom2) {
  let g = new Konva.Group({
    draggable: false
  });
  let line1 = singleBond(atom1, atom2);
  let line2 = singleBond(atom1, atom2);
  line1.move({
    x: -8,
    y: -8,
  });

  line2.move({
    x: 8,
    y: 8
  });

  g.add(line1);
  g.add(line2);
  return g;
}

// Actions in events
function destroy(e) {
  e.target.destroy();
  layer.draw();
}

let hydrogen1 = hydrogen(100, 200, false);
let hydrogen2 = hydrogen(300, 200, false);
let hydrogen3 = hydrogen(200, 100, false);
let hydrogen4 = hydrogen(200, 300, false);
let carbon1 = carbon(200, 200, false);

let ch4 = new Konva.Group({
  draggable: true
});

let bond1 = singleBond(hydrogen1, carbon1);
let bond2 = singleBond(hydrogen2, carbon1);
let bond3 = singleBond(hydrogen3, carbon1);
let bond4 = singleBond(hydrogen4, carbon1);

bond1.on('click', destroy);

ch4.add(bond1);
ch4.add(hydrogen1);
ch4.add(bond2);
ch4.add(hydrogen2);
ch4.add(bond2);
ch4.add(hydrogen2);
ch4.add(bond3);
ch4.add(hydrogen3);
ch4.add(bond4);
ch4.add(hydrogen4);
ch4.add(carbon1);

let oxygen1 = oxygen(400, 100, false);
let oxygen2 = oxygen(700, 100, false);
let carbon2 = carbon(550, 100, false);

let doubleBond1 = doubleBond(oxygen1, carbon2);
let doubleBond2 = doubleBond(oxygen2, carbon2);

let co2 = new Konva.Group({
  draggable: true
});

co2.add(doubleBond1);
co2.add(doubleBond2);
co2.add(oxygen1);
co2.add(oxygen2);
co2.add(carbon2);

layer.add(co2);
layer.add(ch4);
stage.add(layer);
