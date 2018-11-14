var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: 'canvas',
  width: width,
  height: height
});

var layer = new Konva.Layer();

let hydrogens = [];

// Hidrogeno de la izquierda
let hydrogen1 = hydrogen(100, 200, false);

// Hidrogenos de arriba
let hydrogen2 = hydrogen(200, 300, false);
let hydrogen3 = hydrogen(400, 300, false);

// Hidrogeno de la derecha
let hydrogen4 = hydrogen(500, 200, false);

// Hidrogenos de abajo
let hydrogen5 = hydrogen(200, 300, false);
let hydrogen6 = hydrogen(300, 300, false);
let hydrogen7 = hydrogen(400, 300, false);

// Hidrogeno del oxigeno
let hydrogen8 = hydrogen(400, 70, false);

hydrogens.push(hydrogen1);
hydrogens.push(hydrogen2);
hydrogens.push(hydrogen3);
hydrogens.push(hydrogen4);
hydrogens.push(hydrogen5);
hydrogens.push(hydrogen6);
hydrogens.push(hydrogen7);
hydrogens.push(hydrogen8);

let carbons = [];

// Carbonos
let carbon1 = carbon(200, 200, false);
let carbon2 = carbon(300, 200, false);
let carbon3 = carbon(400, 200, false);

carbons.push(carbon1);
carbons.push(carbon2);
carbons.push(carbon3);

// Oxigeno del carbono
let oxygen1 = oxygen(300, 70, false);

// Oxigeno solitario
let oxygen2 = oxygen(700, 100, false);

// Crear enlaces

let bonds = [];

bonds.push(singleBond(hydrogen1, carbon1)); // 0
bonds.push(singleBond(hydrogen2, carbon1)); // 1
bonds.push(singleBond(hydrogen3, carbon3)); // 2
bonds.push(singleBond(hydrogen4, carbon3)); // 3
bonds.push(singleBond(hydrogen5, carbon1)); // 4
bonds.push(singleBond(hydrogen6, carbon2)); // 5
bonds.push(singleBond(hydrogen7, carbon3)); // 6
bonds.push(singleBond(hydrogen8, oxygen1)); // 7
bonds.push(singleBond(carbon1, carbon2)); // 8
bonds.push(singleBond(carbon2, carbon3)); // 9
bonds.push(singleBond(carbon2, oxygen1)); // 10

bonds.map((bond) => {
  bond.on('mouseout touchend', (e) => {
    e.target.stroke('black');
    layer.draw();
  });

  bond.on('mouseover', (e) => {
    e.target.stroke('red');
    layer.draw();
  });
});

bonds[5].on('click', (e) => {
  e.target.destroy();
  layer.draw();
  hydrogen6.draggable(true);
  hydrogen6.on('mouseover', (e) => {
    document.body.style.cursor = 'grab';
  });
  hydrogen6.on('mouseout touchend', (e) => {
    document.body.style.cursor = 'default';
  });
});

bonds[7].on('click', (e) => {
  e.target.destroy();
  hydrogen8.draggable(true);
  hydrogen8.on('mouseover', (e) => {
    document.body.style.cursor = 'grab';
  });
  hydrogen8.on('mouseout touchend', (e) => {
    document.body.style.cursor = 'default';
  });

  bonds[10].destroy();
  let db = doubleBond(oxygen1, carbon2);
  layer.add(db);
  db.moveToBottom();
  layer.draw();
});

hydrogen8.on('dragmove', (e) => {
  if(haveIntersection(e.target, oxygen2)) {
    oxygen2.children[0].fill('purple');
  } else {
    oxygen2.children[0].fill('#f00');
  }
  layer.draw();
});

hydrogen8.on('dragend', (e) => {
  if(haveIntersection(e.target, oxygen2)) {
    hydrogen8.draggable(false);
    let b = singleBond(hydrogen8, oxygen2);
    layer.add(b);
    b.moveToBottom();
  }
  layer.draw();
});

hydrogen6.on('dragmove', (e) => {
  if(haveIntersection(e.target, oxygen2)) {
    oxygen2.children[0].fill('purple');
  } else {
    oxygen2.children[0].fill('#f00');
  }
  layer.draw();
});

hydrogen6.on('dragend', (e) => {
  if(haveIntersection(e.target, oxygen2)) {
    hydrogen6.draggable(false);
    let b = singleBond(hydrogen6, oxygen2);
    layer.add(b);
    b.moveToBottom();
  }
  layer.draw();
});

function haveIntersection(atom1, atom2) {
  console.log(atom1.children[0].position());
  console.log(atom2.children[0].position());
  console.log("---------------");
  let dist = Math.pow(atom1.position().x - atom2.position().x, 2) + Math.pow(atom1.position().y - atom2.position().y, 2);
  dist = Math.sqrt(dist);
  return dist - 20 < atom1.children[0].radius() + atom2.children[0].radius();
}

bonds.map((b) => {
  layer.add(b);
})

carbons.map((c) => {
  layer.add(c);
});

layer.add(oxygen1);

hydrogens.map((h) => {
  layer.add(h);
});

layer.add(oxygen2);

stage.add(layer);
