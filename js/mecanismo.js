import { createAtomsInLayer, createBondsInLayer } from './atoms.js';
import { beginInteractionInLayer, setWinConditions } from './atomsInteraction.js';
import { fitStageIntoParentContainer } from './responsiveCanvas.js';
import { init, getUrlParameter, loadScriptAsync } from './commonFunctions.js';

init();

/** @type {string} Name of the reaction mecanism to retrieve and display */
const mecanism = getUrlParameter('mecanismo');
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
  url: `./data/${mecanism}.json`,
  type: 'GET',
  dataType: 'json',
  success: (data) => {
    $('#mecanismName').text(data.name);
    $('#description').text(data.description);
    $('#formula').html(data.formula);
    $('#help').on('click', () => {
      swal('Oxidación', data.help, 'question');
    });
    
    createAtomsInLayer(data.atoms, layer);
    createBondsInLayer(data.bonds, layer);
    beginInteractionInLayer(layer, stage);
    setWinConditions(data.winConditions, data.winMessage);
    stage.add(layer);
    fitStageIntoParentContainer(stage, stageWidth, stageHeight, '#canvasContainer');

    // Loads the MathJax script asynchronously after the formula is added to the HTML, so that, when
    // the script is executed, it process the formula.
    loadScriptAsync('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML');
  },
  error: (err) => {
    console.log(err);
  }
});
