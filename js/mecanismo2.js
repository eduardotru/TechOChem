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
  url: './data/mecanismo2.json',
  type: 'GET',
  dataType: 'json',
  success: (data) => {
    createAtomsInLayer(data.atoms, layer);
    createBondsInLayer(data.bonds, layer);
    beginInteractionInLayer(layer, stage);
    setWinConditions(data.winConditions, "Has completado el segundo mecanismo de reacción!");
    
    stage.add(layer);
    fitStageIntoParentContainer(stage);  
  },
  error: (err) => {
    console.log(err);
  }
});