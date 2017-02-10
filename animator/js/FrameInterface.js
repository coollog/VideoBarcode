// import 'Assert'
// import 'Controller'
// import 'DOMInterface'
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
    Events.on(DOMInterfaceTablePolygonRow.EVENT_TYPES.ACTIVATE,
        this._activatePolygon, this);
    Events.on(DOMInterfaceTablePolygonRow.EVENT_TYPES.DEACTIVATE_ALL,
        this._deactivatePolygons, this);
    Events.on(FrameModel.EVENT_TYPES.ADD_POLYGON, this._addPolygon, this);

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
  }

  _domInterfaceReady() {
    assertParameters(arguments);

    Events.dispatch(FrameInterface.EVENT_TYPES.READY);
  }

  _activatePolygon(polygonId) {
    assertParameters(arguments, Number);

    this._deactivatePolygons();
    this._polygonInterfaces[polygonId].activate();
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
    this._activatePolygon(polygonId);
  }

  _draw() {

  }
};

FrameInterface.EVENT_TYPES = {
  READY: 'frameinterface-ready'
};
