import { createAtomsInLayer, createBondsInLayer } from './atoms.js';
import { beginInteractionInLayer, setWinConditions } from './atomsInteraction.js';
import { fitStageIntoParentContainer } from './responsiveCanvas.js';

/** @type {number} Virtual width of the canvas */
const stageWidth = 1000;
/** @type {number} Virtual height of the canvas */
const stageHeight = 600;

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
    setWinConditions(data.winConditions, `El resultado de esta reacción simple te da bromuro de etilo y etanol. Ambas sustancias son bastante
útiles. El bromuro de étilo se utiliza para la gasolina como un antidetonante y el etanol es la
sustancia principal en la creacion del alcohol para tomar.`);

    stage.add(layer);
    fitStageIntoParentContainer(stage, stageWidth, stageHeight, '#canvasContainer');
  },
  error: (err) => {
    console.log(err);
  }
});
