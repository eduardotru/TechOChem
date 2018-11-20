import { createBondInLayer, singleBond, doubleBond } from './atoms.js';

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
  let dist = distanceBetweenAtoms(atom1, atom2);
  return dist < (atom1.children[0].radius() + 2 * atom2.children[0].radius()) * scale;
}

/**
 * Finds the distance between two atoms.
 * @param {Konva.Group} atom1 First atom node. 
 * @param {Konva.Group} atom2 Second atom node.
 * @returns {number} The distance between the two atoms.
 */
const distanceBetweenAtoms = (atom1, atom2) => {
  let x = atom1.children[0].getAbsolutePosition().x - atom2.children[0].getAbsolutePosition().x;
  let y = atom1.children[0].getAbsolutePosition().y - atom2.children[0].getAbsolutePosition().y;
  let dist = Math.pow(x, 2) + Math.pow(y, 2);
  dist = Math.sqrt(dist);
  return dist;
}

/**
 * Checks whether the distance of an atom to other atoms is similar, i.e. if each distance has a
 * difference less than a certain value (in this case, the diameter of the atom taken as origin).
 * @param {Konva.Group} atomOrigin Atom taken as origin (i.e. from which the distance is calculated) 
 * @param {Konva.Group[]} atomsDest Atoms to which the distance is calculated from the atomOrigin.
 * @param {number} scale Scale of the Konva.js stage the two atoms are in.
 * @returns {boolean} True if all the calculated distances from the atomOrigin are similar. False
 * otherwise. 
 */
const haveSimilarDistance = (atomOrigin, atomsDest, scale) => {
  let distances = atomsDest.map((atomDest) => {
    return distanceBetweenAtoms(atomOrigin, atomDest);
  });

  let diameter = atomOrigin.children[0].radius() * scale * 2;

  for (let i = 0; i < distances.length - 1; i++) {
    for (let j = i + 1; j < distances.length; j++) {
      if (Math.abs(distances[i] - distances[j]) > diameter)
        return false;
    }
  }

  return true;
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
  if(paramsObj.hasOwnProperty('bondId'))
        newBond.id(paramsObj.bondId);
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

const redrawBondCallback = (paramsObj, layer, stage) => {
  let element = layer.find(`#${paramsObj.element}`);
  let atom1 = layer.find(`#${paramsObj.atom1}`);
  let atom2 = layer.find(`#${paramsObj.atom2}`);

  atom1.on('dragend', (e) => {
      layer.find(`#${paramsObj.bondId}`).destroy();
      let atom1 = layer.findOne(`#${paramsObj.atom1}`);
      let atom2 = layer.findOne(`#${paramsObj.atom2}`);
      let scale = stage.scale().x;
      let newBond = singleBond(atom1, atom2);
      newBond.scale({x: 1 / scale, y: 1 / scale});
      newBond.strokeWidth(newBond.strokeWidth() * scale);
      newBond.id(paramsObj.bondId);
      layer.add(newBond);
      newBond.moveToBottom();
      layer.draw();
  });

  atom2.on('dragend', (e) => {
      layer.find(`#${paramsObj.bondId}`).destroy();
      let atom1 = layer.findOne(`#${paramsObj.atom1}`);
      let atom2 = layer.findOne(`#${paramsObj.atom2}`);
      let scale = stage.scale().x;
      let newBond = singleBond(atom1, atom2);
      newBond.scale({x: 1 / scale, y: 1 / scale});
      newBond.strokeWidth(newBond.strokeWidth() * scale);
      newBond.id(paramsObj.bondId);
      layer.add(newBond);
      newBond.moveToBottom();
      layer.draw();
  });
  
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
 * and, if the user stops dragging, a bond is formed between both atoms and a win condition is met.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.atom1 Identifier of the atom that will be dragged.
 * @param {string} paramsObj.atom2 Identifier of the atom that, if close to the first one, will be
 * highlighted.
 * @param {Object} [paramsObj.bond] Details about the bond to be formed when the user stops dragging
 * the first atom while being close to the second atom.
 * @param {string} [paramsObj.bond.id] Id of the bond to be formed.
 * @param {string} [paramsObj.bond.type=single] Type of the bond to be formed.
 * @param {string[]} [paramsObj.bond.classes] Classes of the bond to be formed (they will add
 * interactivity to the bond).
 * @param {Object.<string, Object[]>} [paramsObj.bond.customCallbacks] Object whose keys are the
 * name of bond classes and whose values are arrays of objects, where each object specifies the name
 * of a function and its parameters. That function will be executed when the main action of the
 * corresponding bond class occurs. 
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
      atom2.draggable(false);

      let bondInfo = {};
      if (paramsObj.hasOwnProperty('bond'))
        bondInfo = paramsObj.bond;
      if (!bondInfo.hasOwnProperty('atom1'))
        bondInfo.atom1 = atom1.id();
      if (!bondInfo.hasOwnProperty('atom2'))
        bondInfo.atom2 = atom2.id();
      if (!bondInfo.hasOwnProperty('type'))
        bondInfo.type = 'single';
      
      let newBond = createBondInLayer(bondInfo, layer);

      newBond.scale({x: 1 / scale, y: 1 / scale});
      newBond.strokeWidth(newBond.strokeWidth() * scale);

      let newBondClasses = newBond.name().split(' ');
      applyClassesToElement(newBond, newBondClasses, layer, stage);

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

      if(paramsObj.hasOwnProperty('callbacks')) {
        processCallbacks(paramsObj.callbacks, layer, stage);
      }

      layer.draw();
      currentWinConditions++;
      validateWin();
    }
  });
}

/**
 * Adds an event listener to a given atom so that whenever the user drags it, the system detects
 * whether or not is close to other two specified atoms. The two atoms to pair it with should be
 * at a decent distance between them. If it is close, the other two atoms are highlighted
 * and, if the user stops dragging, a single bond is formed between both atoms and a win condition
 * is met.
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.atom1 Identifier of the atom that will be dragged.
 * @param {string} paramsObj.atom2 Identifier of the atom that, if close to the first one, will be
 * highlighted.
 * @param {Konva.Layer} layer Layer in which the atoms are found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const searchForTwoPairsOnDragCallback = (paramsObj, layer, stage) => {
  let atom1 = layer.findOne(`#${paramsObj.atom1}`);
  let atom2 = layer.findOne(`#${paramsObj.atom2}`);
  let atom3 = layer.findOne(`#${paramsObj.atom3}`);
  let scale = stage.scale().x;
  atom2.cache();
  atom2.filters([Konva.Filters.Brighten]);

  atom3.cache();
  atom3.filters([Konva.Filters.Brighten]);

  atom1.on('dragmove', (e) => {
    if (haveSimilarDistance(atom1, [atom2, atom3], scale)) {
      if (atom2.isEnabledToPair)
        atom2.brightness(0.5);
      else
        atom2.brightness(0);
      
      if (atom3.isEnabledToPair)
        atom3.brightness(0.5);
      else
        atom3.brightness(0);
    } else {
      atom2.brightness(0);
      atom3.brightness(0);
    }
  });

  atom1.on('dragend', (e) => {
    if (atom2.isEnabledToPair && atom3.isEnabledToPair &&
        haveSimilarDistance(atom1, [atom2, atom3], scale)) {
      atom2.brightness(0);
      atom3.brightness(0);

      atom1.draggable(false);
      atom2.draggable(false);
      atom3.draggable(false);

      let newBond = singleBond(atom1, atom2);
      if(paramsObj.hasOwnProperty('bond1Id'))
        newBond.id(paramsObj.bond1Id);
      newBond.scale({x: 1 / scale, y: 1 / scale});
      newBond.strokeWidth(newBond.strokeWidth() * scale);
      layer.add(newBond);
      newBond.moveToBottom();

      newBond = singleBond(atom1, atom3);
      if(paramsObj.hasOwnProperty('bond2Id'))
        newBond.id(paramsObj.bond2Id);
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

      // Checks if the third atom was an ion, in which case deletes the ion charge, since the atom
      // has been neutralized with the new bond.
      let atom3Ion = atom3.findOne(`#${atom3.id()}-ion`);
      if (atom3Ion != null) {
        atom3Ion.destroy();
        atom3.clearCache();
      }

      if(paramsObj.hasOwnProperty('callbacks')) {
        processCallbacks(paramsObj.callbacks, layer, stage);
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

/**
 * Sets properties to a given Konva.js element (adds them if it does not already have them).
 * @param {Object} paramsObj An object whose properties contain values to be used in this function.
 * @param {string} paramsObj.element Identifier of the element to which properties are to be set.
 * @param {string[]} paramsObj.properties Name of the properties to be set in the element.
 * @param {string[]} [paramsObj.values] Values of the properties to be set in the element. If they
 * are not provided, all properties will be set to the boolean value 'true'.
 * @param {Konva.Layer} layer Layer in which the atom is found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const setPropertiesToElementCallback = (paramsObj, layer, stage) => {
  let element = layer.findOne(`#${paramsObj.element}`);
  if (paramsObj.hasOwnProperty('values')) {
    for (let index in paramsObj.properties) {
      let property = paramsObj.properties[index];
      element[property] = paramsObj.values[index];
    }
  } else {
    paramsObj.properties.map((property) => {
      element[property] = true;
    }); 
  }
}


/** @type {Object.<string, function>} A dictionary of possible callback functions to be used */
let availableCallbacks = {
  createDoubleBond: createDoubleBondCallback,
  createSingleBond: createSingleBondCallback,
  destroyElement: destroyElementCallback,
  makeDraggable: makeDraggableCallback,
  searchForPairOnDrag: searchForPairOnDragCallback,
  searchForTwoPairsOnDrag: searchForTwoPairsOnDragCallback,
  setAtomAsIon: setAtomAsIonCallback,
  setPropertiesToElement: setPropertiesToElementCallback,
  redrawBond: redrawBondCallback
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
 * Applies the characteristics (interactivity) of a given set of classes to a Konva.js element.
 * @param {Konva.Node} element Element to which the classes are going to be applied. 
 * @param {string[]} classes Array containing the names of the classes to apply to the element.
 * @param {Konva.Layer} layer Layer in which the element is found.
 * @param {Konva.Stage} stage Stage in which the layer lies.
 */
const applyClassesToElement = (element, classes, layer, stage) => {
  classes.map((elemClass) => {
    switch (elemClass) {
      case 'clickableBond':
        element.on('mouseover', (e) => {
          e.target.stroke('red');
          document.body.style.cursor = 'pointer';
          layer.draw();
        });

        element.on('mouseout touchend', (e) => {
          e.target.stroke('black');
          document.body.style.cursor = 'default';
          layer.draw();
        });

        break;

      case 'destroyableBond':
        let callbacks = getCustomCallbacks(element, elemClass);
        element.on('click', (e) => {
          if (!element.hasOwnProperty('canBeDestroyed') || element.canBeDestroyed) {
            processCallbacks(callbacks, layer, stage);
            e.target.destroy();
            layer.draw();
          }
        });
        break;
    }
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
    applyClassesToElement(bond, [bondClass], layer, stage);
  });

  bondClass = 'destroyableBond';
  layer.find(`.${bondClass}`).map((bond) => {
    applyClassesToElement(bond, [bondClass], layer, stage);
  });
}

export { beginInteractionInLayer, setWinConditions };
