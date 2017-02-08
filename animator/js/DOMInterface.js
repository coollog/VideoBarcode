// import 'Assert'
// import 'Events'
// import 'jquery'

/**
 * Sets up and controls the DOM user interface.
 */
class DOMInterface {
  constructor() {
    $(() => {
      this._activateButtons();

      Events.dispatch(DOMInterface.EVENT_TYPES.READY);
    });
  }

  _activateButtons() {
    $('#but-add-polygon').click(function() {
      Events.dispatch(DOMInterface.EVENT_TYPES.ADD_POLYGON);
    });
  }
};

DOMInterface.EVENT_TYPES = {
  ADD_POLYGON: 'dominterface-add-polygon',
  READY: 'dominterface-ready'
};
