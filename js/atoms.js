// Generic function to draw an atom with a letter
const atom = (x, y, draggable, color, stroke, radius, name, textColor) => {
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
const carbon = (x, y, draggable) => {
  return atom(x, y, draggable, '#333', '#000', 5*4 + 20, 'C', '#fff');
};

const oxygen = (x, y, draggable) => {
  return atom(x, y, draggable, '#f00', '#a00', 7*4 + 20, 'O', '#000');
};

const hydrogen = (x, y, draggable) => {
  return atom(x, y, draggable, '#999', '#777', 1*4 + 20, 'H', '#000');
};

// Bonds between atoms
const singleBond = (atom1, atom2) => {
  return new Konva.Line({
    points: [atom1.children[0].getAbsolutePosition().x, atom1.children[0].getAbsolutePosition().y, atom2.children[0].getAbsolutePosition().x, atom2.children[0].getAbsolutePosition().y],
    stroke: '#000',
    strokeWidth: 8,
    lineCap: 'round'
  });
}

const doubleBond = (atom1, atom2) => {
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
