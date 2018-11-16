import { createAtomsInLayer, createBondsInLayer } from './atoms.js';

let stageWidth = 1000;
let stageHeight = 600;

let stage = new Konva.Stage({
  container: 'canvas',
  width: stageWidth,
  height: stageHeight
});

let layer = new Konva.Layer();

function fitStageIntoParentContainer() {
  let parentContainer = document.querySelector('#canvasContainer');

  // now we need to fit stage into parent
  let containerWidth = parentContainer.offsetWidth;
  // to do this we need to scale the stage
  let scale = containerWidth / stageWidth;
  stage.width(stageWidth * scale);
  stage.height(stageHeight * scale);
  stage.scale({ x: scale, y: scale });
  stage.draw();
}

$.ajax({
  url: './data/mecanismo2.json',
  type: 'GET',
  dataType: 'json',
  success: (data) => {
    createAtomsInLayer(data.atoms, layer);
    createBondsInLayer(data.bonds, layer);
    
    stage.add(layer);
    fitStageIntoParentContainer();  
  },
  error: (err) => {
    console.log(err);
  }
});