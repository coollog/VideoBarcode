// import 'Assert'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

/**
 * Sets up and controls a row for a polygon.
 */
class DOMInterfaceTablePolygonRow {
  constructor(polygonId, rowId, active = true) {
    assertParameters(arguments, Number, String, [Boolean, undefined]);

    this._polygonId = polygonId;
    this._rowId = rowId;
    this._active = active;

    Events.on(DOMInterfaceTablePolygonRow.EVENT_TYPES.DEACTIVATE_ALL,
        this._deactivate, this);

    this._setupDOM();
  }

  _setupDOM() {
    assertParameters(arguments);

    $(`#${this._rowId} .headcol`)
      .addClass(`headcol-interactive`)
      .click(this._toggle.bind(this));

    this._updateActive();
  }

  _toggle() {
    const active = this._active;

    Events.dispatch(DOMInterfaceTablePolygonRow.EVENT_TYPES.DEACTIVATE_ALL);
    if (active) return;

    this._activate();
    Events.dispatch(DOMInterfaceTablePolygonRow.EVENT_TYPES.ACTIVATE,
        this._polygonId);
  }

  _updateActive() {
    const headCol = $(`#${this._rowId} .headcol`);

    if (this._active) headCol.addClass(`active`);
    else headCol.removeClass(`active`);
  }

  _activate() {
    this._active = true;
    this._updateActive();
  }

  _deactivate() {
    this._active = false;
    this._updateActive();
  }
};

DOMInterfaceTablePolygonRow.EVENT_TYPES = {
  ACTIVATE: 'domiftblpolyrow-activate',
  DEACTIVATE_ALL: 'domiftblpolyrow-deactivate'
};
