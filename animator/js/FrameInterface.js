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

    this._domInterface = new DOMInterface(this.controller);

    this._polygonInterfaces = {};

    // Attach event listeners.
    Events.on(DOMInterface.EVENT_TYPES.READY, this._domInterfaceReady, this);
    Events.on(DOMInterface.EVENT_TYPES.ADD_POLYGON, this._addPolygon, this);

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
  }

  _domInterfaceReady() {
    assertParameters(arguments);

    Events.dispatch(FrameInterface.EVENT_TYPES.READY);
  }

  _activatePolygon(polygonId) {
    assertParameters(arguments, Number);

    for (const polygon of Object.values(this._polygonInterfaces)) {
      polygon.deactivate();
    }

    this._polygonInterfaces[polygonId].activate();
  }

  _addPolygon() {
    assertParameters(arguments);

    // Should prob change frame to 0.
    const polygonId = this._frameModel.addPolygon();
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
