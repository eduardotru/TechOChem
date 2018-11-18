/**
 * Fits a Konva.js stage into the height and width of its parent container, performing proper
 * scaling.
 * @param {Konva.Stage} stage Stage that will be fitted into the dimensions of its parent container.
 * @param {number} stageWidth Original width of the stage.
 * @param {number} stageHeight Original height of the stage.
 * @param {string} parentContainerId HTML identifier of the parent container. 
 */
const fitStageIntoParentContainer = (stage, stageWidth, stageHeight, parentContainerId) => {
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

export { fitStageIntoParentContainer };