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

function createSingleBondInLayer(atomId1, atomId2, layer) {
  let atom1 = layer.findOne(`#${atomId1}`);
  let atom2 = layer.findOne(`#${atomId2}`);
  let bond = new Konva.Line({
    points: [atom1.children[0].x(), atom1.children[0].y(),
             atom2.children[0].x(), atom2.children[0].y()],
    stroke: '#000',
    strokeWidth: 8
  });
  layer.add(bond);
  bond.moveToBottom();
}

function createBondInLayer(bondInfo, layer) {
  switch(bondInfo.type) {
    case "single":
      createSingleBondInLayer(bondInfo.atom1, bondInfo.atom2, layer);
      break;
  }
}

function createBondsInLayer(bondsInfo, layer) {
  bondsInfo.map((bondInfo) => {
    createBondInLayer(bondInfo, layer);
  });
}

function createAtomsInLayer(atomsInfo, layer) {
  atomsInfo.map((atom) => {
    let node = Konva.Node.create(atom);
    layer.add(node);
  });
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

