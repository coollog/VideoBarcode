// import 'Assert'
// import 'DOMInterfaceTableKeyframeRow'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

/**
 * Sets up and controls a row for a polygon.
 */
class DOMInterfaceTablePolygonPositionRow extends DOMInterfaceTableKeyframeRow {
  constructor(polygonId, rowId, active = true) {
    assertParameters(arguments, Number, String, [Boolean, undefined]);

    super(polygonId, rowId, active);

    this.activate();
  }

  get _inputX() {
    return this._headColElem.children('input[type=x]');
  }
  get _inputY() {
    return this._headColElem.children('input[type=y]');
  }

  _setupDOM(active) {
    assertParameters(arguments, Boolean);

    super._setupDOM(active);

    this._headColElem.children('input')
        .click(this._inputClicked.bind(this))
        .change(this._inputChanged.bind(this));
  }

  _inputClicked(e) {
    assertParameters(arguments, $.Event);

    if (!this._active) return;

    e.stopPropagation();
  }

  _inputChanged() {
    assertParameters(arguments, undefined);

    const x = parseInt(this._inputX.val());
    const y = parseInt(this._inputY.val());
    const coord = new Coordinate(x, y);

    Events.dispatch(
        DOMInterfaceTablePolygonPositionRow.EVENT_TYPES.CHANGE,
        this._polygonId,
        coord);
  }

  _dispatchActivateEvent() {
    assertParameters(arguments);

    Events.dispatch(DOMInterfaceTablePolygonPositionRow.EVENT_TYPES.ACTIVATE,
        this._polygonId);
  }
};

DOMInterfaceTablePolygonPositionRow.EVENT_TYPES = {
  ACTIVATE: 'domiftblpolyposrow-activate',
  CHANGE: 'domiftblpolyposrow-change'
};
