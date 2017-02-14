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

    this._polygonInterfaces = {};

    // Attach event listeners.
    Events.on(DOMInterface.EVENT_TYPES.READY, this._domInterfaceReady, this);
    Events.on(FrameModel.EVENT_TYPES.ADD_POLYGON, this._addPolygon, this);

    Events.on(DOMInterfaceTableGotoRow.EVENT_TYPES.GOTO, this._gotoFrame, this);
    Events.on(DOMInterfaceTablePolygonRow.EVENT_TYPES.ACTIVATE,
        this._startEditingPolygon, this);

    Events.on(DOMInterfaceTableKeyframeRow.EVENT_TYPES.DEACTIVATE_ALL,
        this._deactivatePolygons, this);

    Events.on(DOMInterfaceTablePolygonPositionRow.EVENT_TYPES.ACTIVATE,
        this._startMovingPolygon, this);
    Events.on(DOMInterfaceTablePolygonPositionRow.EVENT_TYPES.CHANGE,
        this._polygonPositionChanged, this);

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
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

  _deactivatePolygons() {
    assertParameters(arguments);

    for (const polygon of Object.values(this._polygonInterfaces)) {
      polygon.deactivate();
    }
  }

  _addPolygon(polygonId) {
    assertParameters(arguments, Number);

    // Should prob change frame to 0.
    const newPolygon = new PolygonInterface(this._frameModel, polygonId);
    this._polygonInterfaces[polygonId] = newPolygon;
    this._startEditingPolygon(polygonId);
  }

  _polygonPositionChanged(polygonId, newPosition) {
    assertParameters(arguments, Number, Coordinate);

    this._frameModel.getPolygon(polygonId).position = newPosition;
  }

  _draw() {

  }
};

FrameInterface.EVENT_TYPES = {
  READY: 'frameinterface-ready'
};
