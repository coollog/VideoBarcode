// import 'Assert'
// import 'DOMInterfaceTableKeyframeRow'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

/**
 * Sets up and controls a row for a polygon.
 */
class DOMInterfaceTablePolygonRow extends DOMInterfaceTableKeyframeRow {
  constructor(polygonId, rowId, active = true) {
    assertParameters(arguments, Number, String, [Boolean, undefined]);

    super(polygonId, rowId, active);

    this.activate();
  }

  // _clickFrame(e) {
  //   assertParameters(arguments, $.Event);

  //   const cells = e.data;

  // }

  _dispatchActivateEvent() {
    assertParameters(arguments);

    Events.dispatch(DOMInterfaceTablePolygonRow.EVENT_TYPES.ACTIVATE,
        this._polygonId);
  }
};

DOMInterfaceTablePolygonRow.EVENT_TYPES = {
  ACTIVATE: 'domiftblpolyrow-activate'
};
