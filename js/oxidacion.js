import { createAtomsInLayer, createBondsInLayer } from './atoms.js';
import { beginInteractionInLayer, setWinConditions } from './atomsInteraction.js';
import { stageWidth, stageHeight, fitStageIntoParentContainer } from './responsiveCanvas.js';

let stage = new Konva.Stage({
  container: 'canvas',
  width: stageWidth,
  height: stageHeight
});

let layer = new Konva.Layer();

$.ajax({
  url: './data/mecanismo1.json',
  type: 'GET',
  dataType: 'json',
  success: (data) => {
    createAtomsInLayer(data.atoms, layer);
    createBondsInLayer(data.bonds, layer);
    beginInteractionInLayer(layer, stage);
    setWinConditions(
      data.winConditions,
      `Las reacciones de oxidación son de gran importancia porque son la mayor fuente de energía en
      el mundo, ya sea orgánica o inorgánica. Está presente en cualquier composición que contenga
      oxígenos. La oxidación de alcoholes a grupos carbonilos también es un paso muy importante en
      la degradación de grasa durante el metabolismo humano.`);
    
    stage.add(layer);
    fitStageIntoParentContainer(stage);  
  },
  error: (err) => {
    console.log(err);
  }
});
