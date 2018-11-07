var width = window.innerWidth;
var height = window.innerHeight;

// globals
var curveLayer, lineLayer, anchorLayer, quad;

function updateDottedLines() {
    var q = quad;

    var quadLine = lineLayer.get('#quadLine')[0];

    quadLine.setPoints([q.start.attrs.x, q.start.attrs.y, q.control.attrs.x, q.control.attrs.y, q.end.attrs.x, q.end.attrs.y]);

    lineLayer.draw();
}

function buildAnchor(x, y) {
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        radius: 20,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        draggable: true
    });

    // add hover styling
    anchor.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        anchorLayer.draw();
    });
    anchor.on('mouseout', function() {
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        anchorLayer.draw();

    });

    anchor.on('dragend', function() {
        drawCurves();
        updateDottedLines();
    });

    anchorLayer.add(anchor);
    return anchor;
}
function drawCurves() {
    var context = curveLayer.getContext();

    context.clear();

    // draw quad
    context.beginPath();
    context.moveTo(quad.start.attrs.x, quad.start.attrs.y);
    context.quadraticCurveTo(quad.control.attrs.x, quad.control.attrs.y, quad.end.attrs.x, quad.end.attrs.y);
    context.setAttr('strokeStyle', 'red');
    context.setAttr('lineWidth', 4);
    context.stroke();
}

var stage = new Konva.Stage({
    container: 'canvas',
    width: width-50,
    height: height-200
});

anchorLayer = new Konva.Layer();
lineLayer = new Konva.Layer();

// curveLayer just contains a canvas which is drawn
// onto with the existing canvas API
curveLayer = new Konva.Layer();

var quadLine = new Konva.Line({
    dash: [10, 10, 0, 10],
    strokeWidth: 3,
    stroke: 'black',
    lineCap: 'round',
    id: 'quadLine',
    opacity: 0.3,
    points: [0, 0]
});

// add dotted line connectors
lineLayer.add(quadLine);

quad = {
    start: buildAnchor(60, 30),
    control: buildAnchor(240, 110),
    end: buildAnchor(80, 160)
};

// keep curves insync with the lines
anchorLayer.on('beforeDraw', function() {
    drawCurves();
    updateDottedLines();
});



stage.add(curveLayer);
stage.add(lineLayer);
stage.add(anchorLayer);

drawCurves();
updateDottedLines();
