import { singleBond, doubleBond } from './atoms.js';

let currentWinConditions = 0;
let totalWinConditions = 0;
let winMessage = '';

// HELPER FUNCTIONS

/**
 * Checks whether two atoms are near each other.
 * @param {Konva.Group} atom1 First atom node.
 * @param {Konva.Group} atom2 Second atom node.
 * @param {number} scale Scale of the Konva.js stage the two atoms are in.
 * @returns {boolean} True if the atoms are close to each other. False otherwise.
 */
const areNear = (atom1, atom2, scale) => {
  let x = atom1.children[0].getAbsolutePosition().x - atom2.children[0].getAbsolutePosition().x;
  let y = atom1.children[0].getAbsolutePosition().y - atom2.children[0].getAbsolutePosition().y;
  let dist = Math.pow(x, 2) + Math.pow(y, 2);
  dist = Math.sqrt(dist);
  return dist < (atom1.children[0].radius() + 2 * atom2.children[0].radius()) * scale;
}

/**
  * Sets the number of conditions to meet in order to win (successfully solve a reaction mechanism).
  * @param {number} numConditions Number of conditions to be met in order to win.
  * @param {string} message Success message to be displayed when all the win conditions are met.
  */
 const setWinConditions = (numConditions, message) => {
  totalWinConditions = numConditions;
  winMessage = message;
}

/**
 * Validates whether all of the winning conditions have been met, in which case displays a success
 * alert message.
*/
const validateWin = () => {
  if (currentWinConditions == totalWinConditions) {
    swal('¡Buen trabajo!', winMessage, 'success');
  }
}

/**
 * Retrieves the customCallback array for a class within a specific bond. The customCallback array
 * basically contains objects that specify the names of functions and their parameters (which will
 * be called when the action associated with the class of the specific bond occurs).
 * @param {Konva.Node} bond The bond from which the customCallback array will be retrieved.
 * @param {string} bondClass The name of the class for which the customCallback array will be
 * retrieved from the bond.
 * @returns {Array.<Object>} The customCallback array.
 */
const getCustomCallbacks = (bond, bondClass) => {
  let customCallbacks = [];
  if (bond.hasOwnProperty('customCallbacks') && bond.customCallbacks.hasOwnProperty(bondClass)) {
    customCallbacks = bond.customCallbacks[bondClass];
  }

  return customCallbacks;
}


// FUNCTIONS THAT ACT AS CALLBACKS

/**
 * Adds properties to a given atom, without assigning them a specific value, just the boolean value
 * 'true'.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.atom Identifier of the atom to which properties are to be added.
 * @param {string[]} paramsObj.properties Name of the properties to be added to the atom.
 * @param {Konva.Layer} layer Layer in which the atom is found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const addPropertiesToAtomCallback = (paramsObj, layer, stage) => {
  let atom = layer.findOne(`#${paramsObj.atom}`);
  paramsObj.properties.map((property) => {
    atom[property] = true;
  });
}

/**
 * Creates a double bond between two atoms.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.atom1 Identifier of the first atom to be included in the bond.
 * @param {string} paramsObj.atom2 Identifier of the second atom to be included in the bond.
 * @param {Konva.Layer} layer Layer in which the atoms are found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
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

/**
 * Creates a single bond between two atoms.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.atom1 Identifier of the first atom to be included in the bond.
 * @param {string} paramsObj.atom2 Identifier of the second atom to be included in the bond.
 * @param {Konva.Layer} layer Layer in which the atoms are found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const createSingleBondCallback = (paramsObj, layer, stage) => {
  let atom1 = layer.findOne(`#${paramsObj.atom1}`);
  let atom2 = layer.findOne(`#${paramsObj.atom2}`);
  let scale = stage.scale().x;
  let newBond = singleBond(atom1, atom2);
  newBond.scale({x: 1 / scale, y: 1 / scale});
  newBond.strokeWidth(newBond.strokeWidth() * scale);
  layer.add(newBond);
  newBond.moveToBottom();
  layer.draw();
}

/**
 * Destroys a Konva.js element or node.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.element Identifier of the element to be destroyed.
 * @param {Konva.Layer} layer Layer in which the element is found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const destroyElementCallback = (paramsObj, layer, stage) => {
  let element = layer.find(`#${paramsObj.element}`);
  element.destroy();
  layer.draw();
}

/**
 * Allows a Konva.js element to be draggable and also adds event listeners to it so that proper
 * grab-like cursor styles appear when interacting with it.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.element Identifier of the element to be made draggable.
 * @param {Konva.Layer} layer Layer in which the element is found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
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

/**
 * Adds an event listener to a given atom so that whenever the user drags it, the system detects
 * whether or not is close to another specific atom. If it is close, the other atom is highlighted
 * and, if the user stops dragging, a single bond is formed between both atoms and a win condition
 * is met.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.atom1 Identifier of the atom that will be dragged.
 * @param {string} paramsObj.atom2 Identifier of the atom that, if close to the first one, will be
 * highlighted.
 * @param {Konva.Layer} layer Layer in which the atoms are found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
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
      atom1.draggable(false);

      let newBond = singleBond(atom1, atom2);
      newBond.scale({x: 1 / scale, y: 1 / scale});
      newBond.strokeWidth(newBond.strokeWidth() * scale);
      layer.add(newBond);
      newBond.moveToBottom();

      // Checks if the first atom was an ion, in which case deletes the ion charge, since the atom
      // has been neutralized with the new bond.
      let atom1Ion = atom1.findOne(`#${atom1.id()}-ion`);
      if (atom1Ion != null) {
        atom1Ion.destroy();
        atom1.clearCache();
      }

      // Checks if the second atom was an ion, in which case deletes the ion charge, since the atom
      // has been neutralized with the new bond.
      let atom2Ion = atom2.findOne(`#${atom2.id()}-ion`);
      if (atom2Ion != null) {
        atom2Ion.destroy();
        atom2.clearCache();
      }

      layer.draw();
      currentWinConditions++;
      validateWin();
    }
  });
}

/**
 * Transforms an atom into an ion, meaning that it adds a positive or negative charge to it, which
 * will be displayed in the right corner of the atom's shape.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.atom Identifier of the atom that will be set to an ion.
 * @param {string} paramsObj.type Type of the ion ('positive' or 'negative').
 * @param {Konva.Layer} layer Layer in which the atom is found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const setAtomAsIonCallback = (paramsObj, layer, stage) => {
  let atom = layer.findOne(`#${paramsObj.atom}`);
  let originX = atom.children[0].getX();
  let originY = atom.children[0].getY();
  let scale = stage.scale().x;
  let atomRadius = atom.children[0].radius() * scale;
  let ionPosX = originX + atomRadius * Math.cos(Math.PI / 4);
  let ionPosY = originY - atomRadius * Math.sin(Math.PI / 4);
  let ionRadius = 10 * scale;
  let ionSymbol = (paramsObj.type == 'positive') ? '+' : '-';
  let ionColor = atom.children[0].fill();
  let ionStroke = atom.children[0].stroke();
  let ionTextColor = atom.children[1].fill();
  let ionFontSize = 18 * scale;

  let ion = new Konva.Group({
    id: `${paramsObj.atom}-ion`
  });

  let ionShape = new Konva.Circle({
    x: ionPosX,
    y: ionPosY,
    radius: ionRadius,
    fill: ionColor,
    stroke: ionStroke,
    strokeWidth: 2 * scale
  });

  let ionText = new Konva.Text({
    x: ionPosX - 5 * scale,
    y: ionPosY - 8 * scale,
    text: ionSymbol,
    fontSize: ionFontSize,
    fill: ionTextColor
  });

  ion.add(ionShape);
  ion.add(ionText);
  atom.add(ion);
  atom.cache();
  layer.draw();
}


/** @type {Object.<string, function>} A dictionary of possible callback functions to be used */
let availableCallbacks = {
  addPropertiesToAtom: addPropertiesToAtomCallback,
  createDoubleBond: createDoubleBondCallback,
  createSingleBond: createSingleBondCallback,
  destroyElement: destroyElementCallback,
  makeDraggable: makeDraggableCallback,
  searchForPairOnDrag: searchForPairOnDragCallback,
  setAtomAsIon: setAtomAsIonCallback
}

/**
 * Processes functions to be called when specific interactions are made with Konva.js elements.
 * @param {Array.<function>} callbacks Array of functions to be called sequentially.
 * @param {Konva.Layer} layer Layer in which the elements whose interactions triggered this function
 * lie.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const processCallbacks = (callbacks, layer, stage) => {
  callbacks.map((func) => {
    availableCallbacks[func.funcName](func.params, layer, stage);
  });
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
