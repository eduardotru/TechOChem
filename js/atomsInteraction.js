import { singleBond } from './atoms.js';

let currentWinConditions = 0;
let totalWinConditions = 0;
let winMessage = '';

/**
 * Enables the draggable property of a Konva.js element and, in case it has the futurePair property,
 * checks whether the element is near to the one indicated by that property, creating a bond
 * between the two if it certainly is.
 * @param {Konva.Group} element Konva.js element who is going to be made draggable. 
 * @param {Konva.Layer} layer Layer in which the element is found.
 * @param {Konva.Stage} stage Stage in which the layer is found.
 */
const makeDraggable = (element, layer, stage) => {
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

  if (element.hasOwnProperty('futurePair')) {
    let element2 = layer.findOne(`#${element.futurePair}`);
    let scale = stage.scale().x;
    element2.cache();
    element2.filters([Konva.Filters.Brighten]);
    
    element.on('dragmove', (e) => {
      if (element2.isEnabledToPair && areNear(element, element2, scale)) {
        element2.brightness(0.5);
      } else {
        element2.brightness(0);
      }
    });

    element.on('dragend', (e) => {
      if (element2.isEnabledToPair && areNear(element, element2, scale)) {
        element2.brightness(0);
        element.draggable(false);
        let newBond = singleBond(e.target, element2);
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
}

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

/**
 * Adds the 'isEnabledToPair' property to two previously bonded atoms, so that they can now be
 * tested with the areNear() method, to check whether specific atoms are near them.
 * @param {Konva.Group} atom1 First atom node of bond.
 * @param {Konva.Group} atom2 Second atom node of bond.
 */
const enableBondAtoms = (atom1, atom2) => {
  atom1.isEnabledToPair = true;
  atom2.isEnabledToPair = true;
}

/**
 * Processes functions to be called when specific interactions are made with Konva.js elements.
 * @param {string} funcName Name of the function to be called. 
 * @param {Konva.Layer} layer Layer in which the Konva.js elements are found. 
 * @param {Konva.Group} atom1 First atom node of an interaction. 
 * @param {Konva.Group} atom2 Second atom node an interaction.
 */
const processCallbacks = (funcName, layer, atom1, atom2) => {
  switch (funcName) {
    case 'enableBondAtoms':
      enableBondAtoms(atom1, atom2);
      break;
  }
}

/** 
  * Sets the number of conditions to meet in order to win (successfully solve a reaction mechanism).
  * @param {Object[]} atomsInfo - An array of objects containing information about each atom in the
  * current reaction mechanism.
  * @param {string} [atomsInfo[].futurePair] - Optional attribute of an object within the atomsInfo
  * array. This attribute represents a winning condition if present.
  * @param {string} message A message to be displayed when all the winning conditions are met.
  */
const setWinConditions = (atomsInfo, message) => {
  atomsInfo.map((atomInfo) => {
    if (atomInfo.hasOwnProperty('futurePair'))
      totalWinConditions++;
  });
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

/**
 * Applies all interactive features given by Konva names (similar to CSS classes) to the elements
 * found in a specific layer within a stage.
 * @param {Konva.Layer} layer Layer in which to apply the interactive features to elements.
 * @param {Konva.Stage} stage Stage in which the layer is found. It is used for scaling features if
 * needed.
 */
const beginInteractionInLayer = (layer, stage) => {
  layer.find('.clickableBond').map((bond) => {
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

  layer.find('.destroyableBond').map((bond) => {
    let callback = '';
    if (bond.hasOwnProperty('customCallbacks')) {
      if (bond.customCallbacks.hasOwnProperty('destroyableBond')) {
        callback = bond.customCallbacks['destroyableBond'];
      }
    }
    bond.on('click', (e) => {
      processCallbacks(callback, layer, bond.atom1, bond.atom2);
      e.target.destroy();
      layer.draw();
    });
  });

  layer.find('.destroyableBond2').map((bond) => {
    bond.on('click', (e) => {
      makeDraggable(bond.atom1, layer, stage);
      makeDraggable(bond.atom2, layer, stage);
      e.target.destroy();
      layer.draw();
    });
  });
}

export { beginInteractionInLayer, setWinConditions };