// import 'Assert'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

class DOMInterfaceTableKeyframeRow extends DOMInterfaceTableRow {
  constructor(polygonId, rowId, active = true) {
    assertParameters(arguments, Number, String, [Boolean, undefined]);

    super(rowId);

    this._polygonId = polygonId;
    this._active = false;

    this._currentFrame = null;

    Events.on(DOMInterfaceTableKeyframeRow.EVENT_TYPES.DEACTIVATE_ALL,
        this._deactivate, this);

    this._setupDOM(active);
  }

  set currentFrame(frameIndex) {
    assertParameters(arguments, Number);

    this._currentFrame = frameIndex;
    this._cells.removeClass('current')
        .filter(`[index=${frameIndex}]`).addClass('current');
  }

  get _headColElem() {
    assertParameters(arguments);

    return $(`#${this._rowId} .headcol`);
  }

  _setupDOM(active) {
    assertParameters(arguments, Boolean);

    this._headColElem
      .addClass(`headcol-interactive`)
      .click(this._toggle.bind(this));

    if (active) this._toggle();
  }

  _toggle() {
    assertParameters(arguments, undefined);

    const active = this._active;

    Events.dispatch(DOMInterfaceTableKeyframeRow.EVENT_TYPES.DEACTIVATE_ALL);
    if (active) return;

    this._activate();
    this._dispatchActivateEvent();
  }

  _updateActive() {
    assertParameters(arguments);

    const headCol = $(`#${this._rowId} .headcol`);

    if (this._active) headCol.addClass(`active`);
    else headCol.removeClass(`active`);
  }

  _activate() {
    assertParameters(arguments);

    this._active = true;
    this._updateActive();
  }

  _deactivate() {
    assertParameters(arguments);

    this._active = false;
    this._updateActive();
  }

  // Can be overridden to dispatch different events.
  _dispatchActivateEvent() {
    assertParameters(arguments);

    Events.dispatch(DOMInterfaceTableKeyframeRow.EVENT_TYPES.ACTIVATE,
        this._polygonId);
  }
};

DOMInterfaceTableKeyframeRow.EVENT_TYPES = {
  ACTIVATE: 'domiftblrow-activate',
  DEACTIVATE_ALL: 'domiftblrow-deactivate'
};
