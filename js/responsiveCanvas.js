const stageWidth = 1000;
const stageHeight = 600;

const fitStageIntoParentContainer = (stage, parentContainerId = '#canvasContainer') => {
  let parentContainer = document.querySelector(parentContainerId);

  // now we need to fit stage into parent
  let containerWidth = parentContainer.offsetWidth;
  // to do this we need to scale the stage
  let scale = containerWidth / stageWidth;
  stage.width(stageWidth * scale);
  stage.height(stageHeight * scale);
  stage.scale({ x: scale, y: scale });
  stage.draw();
}

export { stageWidth, stageHeight, fitStageIntoParentContainer };