// import 'Assert'
// import 'DOMInterfaceTable'
// import 'Events'
// import 'jquery'

/**
 * Sets up and controls the DOM user interface.
 */
class DOMInterface {
  constructor(frameModel) {
    assertParameters(arguments, FrameModel);

    this._frameModel = frameModel;

    this._table = new DOMInterfaceTable(frameModel);

    $(() => {
      this._activateButtons();

      this._table.activate();

      Events.dispatch(DOMInterface.EVENT_TYPES.READY);
    });
  }

  _activateButtons() {
    assertParameters(arguments);

    $('#but-add-polygon').click(() => {
      this._frameModel.addPolygon();
    });
  }
};

DOMInterface.EVENT_TYPES = {
  ADD_POLYGON: 'dominterface-add-polygon',
  READY: 'dominterface-ready'
};
