import { singleBond, doubleBond } from './atoms.js';

let currentWinConditions = 0;
let totalWinConditions = 0;
let winMessage = '';

/**
 * Checks whether two atoms are near each other.
 * @param {Konva.Group} atom1 First atom node.
 * @param {Konva.Group} atom2 Second atom node.
 * @param {number} scale Scale of the Konva.js stage the two atoms are in.
 */
const areNear = (atom1, atom2, scale) => {
  let x = atom1.children[0].getAbsolutePosition().x - atom2.children[0].getAbsolutePosition().x;
  let y = atom1.children[0].getAbsolutePosition().y - atom2.children[0].getAbsolutePosition().y;
  let dist = Math.pow(x, 2) + Math.pow(y, 2);
  dist = Math.sqrt(dist);
  return dist < (atom1.children[0].radius() + 2 * atom2.children[0].radius()) * scale;
}

const addPropertiesToAtomCallback = (paramsObj, layer, stage) => {
  let atom = layer.findOne(`#${paramsObj.atom}`);
  paramsObj.properties.map((property) => {
    atom[property] = true;
  });
}

const createDoubleBondCallback = (paramsObj, layer, stage) => {
  let atom1 = layer.findOne(`#${paramsObj.atom1}`);
  let atom2 = layer.findOne(`#${paramsObj.atom2}`);
  let scale = stage.scale().x;
  let newBond = doubleBond(atom1, atom2);
  newBond.scale({x: 1 / scale, y: 1 / scale});
  newBond.children.map((singleBond) => {
    singleBond.strokeWidth(singleBond.strokeWidth() * scale);
  });
  layer.add(newBond);
  newBond.moveToBottom();
  layer.draw();
}

const destroyElementCallback = (paramsObj, layer, stage) => {
  let element = layer.find(`#${paramsObj.element}`);
  element.destroy();
  layer.draw();
}

const makeDraggableCallback = (paramsObj, layer, stage) => {
  let element = layer.find(`#${paramsObj.element}`);
  element.draggable(true);
  
  element.on('mouseover mouseup', (_) => {
    document.body.style.cursor = 'grab';
  });

  element.on('mousedown', (_) => {
    document.body.style.cursor = 'grabbing';
  });

  element.on('mouseout touchend', (e) => {
    document.body.style.cursor = 'default';
  });
}

const searchForPairOnDragCallback = (paramsObj, layer, stage) => {
  let atom1 = layer.findOne(`#${paramsObj.atom1}`);
  let atom2 = layer.findOne(`#${paramsObj.atom2}`);
  let scale = stage.scale().x;
  atom2.cache();
  atom2.filters([Konva.Filters.Brighten]);
    
  atom1.on('dragmove', (e) => {
    if (atom2.isEnabledToPair && areNear(atom1, atom2, scale)) {
      atom2.brightness(0.5);
    } else {
      atom2.brightness(0);
    }
  });

  atom1.on('dragend', (e) => {
    if (atom2.isEnabledToPair && areNear(atom1, atom2, scale)) {
      atom2.brightness(0);
      atom2.draggable(false);
      let newBond = singleBond(atom1, atom2);
      newBond.scale({x: 1 / scale, y: 1 / scale});
      newBond.strokeWidth(newBond.strokeWidth() * scale);
      layer.add(newBond);
      newBond.moveToBottom();
      layer.draw();
      currentWinConditions++;
      validateWin();
    }
  });
}


let availableCallbacks = {
  addPropertiesToAtom: addPropertiesToAtomCallback,
  createDoubleBond: createDoubleBondCallback,
  destroyElement: destroyElementCallback,
  makeDraggable: makeDraggableCallback,
  searchForPairOnDrag: searchForPairOnDragCallback
}

/**
 * Processes functions to be called when specific interactions are made with Konva.js elements.
 */
const processCallbacks = (callbacks, layer, stage) => {
  callbacks.map((func) => {
    availableCallbacks[func.funcName](func.params, layer, stage);
  });
}

/** 
  * Sets the number of conditions to meet in order to win (successfully solve a reaction mechanism).
  */
const setWinConditions = (numConditions, message) => {
  totalWinConditions = numConditions;
  winMessage = message;
}

/**
 * Validates whether all of the winning conditions have been meet, in which case displays a success
 * alert message.
*/
const validateWin = () => {
  if (currentWinConditions == totalWinConditions) {
    swal('¡Buen trabajo!', winMessage, 'success');
  }
}

const getCustomCallbacks = (bond, bondClass) => {
  let customCallbacks = [];
  if (bond.hasOwnProperty('customCallbacks') && bond.customCallbacks.hasOwnProperty(bondClass)) {
    customCallbacks = bond.customCallbacks[bondClass];
  }

  return customCallbacks;
}


/**
 * Applies all interactive features given by Konva names (similar to CSS classes) to the elements
 * found in a specific layer within a stage.
 * @param {Konva.Layer} layer Layer in which to apply the interactive features to elements.
 * @param {Konva.Stage} stage Stage in which the layer is found. It is used for scaling features if
 * needed.
 */
const beginInteractionInLayer = (layer, stage) => {
  let bondClass;
  
  bondClass = 'clickableBond';
  layer.find(`.${bondClass}`).map((bond) => {
    bond.on('mouseover', (e) => {
      e.target.stroke('red');
      document.body.style.cursor = 'pointer';
      layer.draw();
    });

    bond.on('mouseout touchend', (e) => {
      e.target.stroke('black');
      document.body.style.cursor = 'default';
      layer.draw();
    });
  });

  bondClass = 'destroyableBond';
  layer.find(`.${bondClass}`).map((bond) => {
    let callbacks = getCustomCallbacks(bond, bondClass);
    bond.on('click', (e) => {
      processCallbacks(callbacks, layer, stage);
      e.target.destroy();
      layer.draw();
    });
  });
}

export { beginInteractionInLayer, setWinConditions };