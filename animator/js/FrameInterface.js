// import 'Assert'
// import 'Controller'
// import 'DOMInterface'
// import 'DOMInterfaceTablePolygonPositionRow'
// import 'DOMInterfaceTablePolygonRow'
// import 'DOMInterfaceTableRow'
// import 'FrameModel'
// import 'PolygonInterface'

/**
 * Controls the user interface to interact with the frame model.
 */
class FrameInterface {
  constructor(controller) {
    assertParameters(arguments, Controller);

    this._frameModel = new FrameModel();

    this._domInterface = new DOMInterface(this._frameModel);

    // Map from polygonId to PolygonInterface.
    this._polygonInterfaces = {};

    // Attach event listeners.
    Events.on(DOMInterface.EVENT_TYPES.READY, this._domInterfaceReady, this);
    Events.on(FrameModel.EVENT_TYPES.ADD_POLYGON, this._addPolygon, this);

    Events.on(DOMInterfaceTableRow.EVENT_TYPES.CHANGE_FRAME,
        this._gotoFrame, this);

    Events.on(DOMInterfaceTablePolygonRow.EVENT_TYPES.ACTIVATE,
        this._startEditingPolygon, this);
    Events.on(DOMInterfaceTablePolygonRow.EVENT_TYPES.ADD_KEYFRAME,
        this._addKeyframe, this);

    Events.on(DOMInterfaceTableKeyframeRow.EVENT_TYPES.DEACTIVATE_ALL,
        this._deactivatePolygons, this);

    Events.on(DOMInterfaceTablePolygonPositionRow.EVENT_TYPES.ACTIVATE,
        this._startMovingPolygon, this);
    Events.on(DOMInterfaceTablePolygonPositionRow.EVENT_TYPES.CHANGE,
        this._polygonPositionChanged, this);
    Events.on(DOMInterfaceTablePolygonPositionRow.EVENT_TYPES.ADD_KEYFRAME,
        this._addPositionKeyframe, this);

    Events.on(PolygonInterface.EVENT_TYPES.MOVE,
        this._polygonPositionChanged, this);

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
  }

  static _scaleCoord(coord, toWidth, toHeight) {
    assertParameters(arguments, Coordinate, Number, Number);

    toWidth -= FrameInterface._SCALE_PADDING * 2;
    toHeight -= FrameInterface._SCALE_PADDING * 2;

    coord = coord
        .scale(toHeight / FrameInterface._AREA_SIZE)
        .translate(new Coordinate(
            (toWidth - toHeight) / 2 + FrameInterface._SCALE_PADDING,
            FrameInterface._SCALE_PADDING));

    return coord;
  }

  static _inverseScaleCoord(toSize, coord, fromWidth, fromHeight) {
    assertParameters(arguments, Number, Coordinate, Number, Number);

    fromWidth -= FrameInterface._SCALE_PADDING * 2;
    fromHeight -= FrameInterface._SCALE_PADDING * 2;

    coord = coord
        .translate(new Coordinate(
            -(fromWidth - fromHeight) / 2 - FrameInterface._SCALE_PADDING,
            -FrameInterface._SCALE_PADDING))
        .scale(toSize / fromHeight);

    return coord;
  }

  _domInterfaceReady() {
    assertParameters(arguments);

    Events.dispatch(FrameInterface.EVENT_TYPES.READY);
  }

  _gotoFrame(frameIndex) {
    assertParameters(arguments, Number);

    this._frameModel.currentFrame = frameIndex;
  }

  _startEditingPolygon(polygonId) {
    assertParameters(arguments, Number);

    // Don't start editing the polygon if it hasn't been added to the interfaces
    // yet.
    if (!(polygonId in this._polygonInterfaces)) return;

    this._polygonInterfaces[polygonId].startEditing();
  }

  _startMovingPolygon(polygonId) {
    assertParameters(arguments, Number);

    this._polygonInterfaces[polygonId].startMoving();
  }

  _addKeyframe(polygonId, frameIndex) {
    this._frameModel.getFrame(frameIndex).addKeyFrame(polygonId);
  }

  _addPositionKeyframe(polygonId, frameIndex) {
    this._frameModel.getFrame(frameIndex).addPositionKeyFrame(polygonId);
  }

  _deactivatePolygons() {
    assertParameters(arguments);

    for (let polygon of Object.values(this._polygonInterfaces)) {
      polygon.deactivate();
    }
  }

  _addPolygon(polygonId) {
    assertParameters(arguments, Number);

    // Should prob change frame to 0.
    const newPolygon = new PolygonInterface(
        this._frameModel, polygonId,
        FrameInterface._scaleCoord,
        FrameInterface._inverseScaleCoord.bind(this,
            FrameInterface._AREA_SIZE));
    this._polygonInterfaces[polygonId] = newPolygon;
    this._startEditingPolygon(polygonId);
  }

  _polygonPositionChanged(polygonId, newPosition) {
    assertParameters(arguments, Number, Coordinate);

    // Make keyframe.
    this._frameModel.currentFrame.addPositionKeyFrame(
        polygonId, newPosition);

    // this._frameModel.getPolygon(polygonId).position = newPosition;
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    // Draw background.
    const backgroundEnvelope = new Envelope(
        new Coordinate(0, 0), new Size(canvas.width, canvas.height));
    canvas.drawRectangle(Canvas.RECTANGLE_TYPE.FILL, backgroundEnvelope,
        FrameInterface._BACKGROUND);

    // Draw stage.
    const topLeft = FrameInterface._scaleCoord(
        new Coordinate(0, 0), canvas.width, canvas.height);
    const bottomRight = FrameInterface._scaleCoord(
        new Coordinate(
            FrameInterface._AREA_SIZE - 1, FrameInterface._AREA_SIZE - 1),
        canvas.width, canvas.height);
    const stageEnvelope = Envelope.fromCoordinates(topLeft, bottomRight);
    canvas.drawWithShadow(
        FrameInterface._SHADOW_SIZE,
        FrameInterface._SHADOW_COLOR,
        FrameInterface._SHADOW_OFFSET,
        () => canvas.drawRectangle(
            Canvas.RECTANGLE_TYPE.FILL, stageEnvelope, 'white'));
  }
};

FrameInterface.EVENT_TYPES = {
  READY: 'frameinterface-ready'
};

FrameInterface._AREA_SIZE = 256;
FrameInterface._SCALE_PADDING = 50;
FrameInterface._BACKGROUND = '#ddd';
FrameInterface._SHADOW_COLOR = '#444';
FrameInterface._SHADOW_OFFSET = new Coordinate(4, 4);
FrameInterface._SHADOW_SIZE = 8;
