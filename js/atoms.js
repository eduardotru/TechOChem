// Generic function to draw an atom with a letter
const atom = (id, x, y, draggable, color, stroke, radius, name, textColor) => {
  let group = new Konva.Group({
    id: id,
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
const carbon = (id, x, y, draggable) => {
  return atom(id, x, y, draggable, '#333', '#000', 5*4 + 20, 'C', '#fff');
};

const oxygen = (id, x, y, draggable) => {
  return atom(id, x, y, draggable, '#f00', '#a00', 7*4 + 20, 'O', '#000');
};

const hydrogen = (id, x, y, draggable) => {
  return atom(id, x, y, draggable, '#999', '#777', 1*4 + 20, 'H', '#000');
};

const bromium = (id, x, y, draggable) => {
  return atom(id, x, y, draggable, '#A52A2A', '#831414', 7*4 + 20, 'Br', '#fff');
}

// Bonds between atoms
const singleBond = (atom1, atom2) => {
  return new Konva.Line({
    points: [atom1.children[0].x(), atom1.children[0].y(),
             atom2.children[0].x(), atom2.children[0].y()],
    stroke: '#000',
    strokeWidth: 8,
    lineCap: 'round'
  });
}

const doubleBond = (atomId1, atomId2) => {
  let g = new Konva.Group({
    draggable: false
  });

  let line1 = singleBond(atomId1, atomId2);
  let line2 = singleBond(atomId1, atomId2);

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

// Objects/Dictionaries of functions that can create specific atoms and bonds.
const atomCreation = {
  carbon: carbon,
  oxygen: oxygen,
  hydrogen: hydrogen,
  bromium: bromium
};

const bondCreation = {
  single: singleBond,
  double: doubleBond
}

// Functions that can create atoms and bonds in a layer from arrays that contain objects with info
// to create the atoms or bonds.
const createAtomsInLayer = (atomsInfo, layer) => {
  atomsInfo.map((atom) => {
    let draggable = false;
    if (atom.hasOwnProperty('draggable'))
      draggable = atom.draggable;
    let atomNode = atomCreation[atom.type](atom.id, atom.x, atom.y, draggable);
    layer.add(atomNode);
  });
}

const createBondsInLayer = (bondsInfo, layer) => {
  bondsInfo.map((bondInfo) => {
    let atom1 = layer.findOne(`#${bondInfo.atom1}`);
    let atom2 = layer.findOne(`#${bondInfo.atom2}`);
    let bondNode = bondCreation[bondInfo.type](atom1, atom2);
    layer.add(bondNode);
    bondNode.moveToBottom();
  });
}

export { createAtomsInLayer, createBondsInLayer };