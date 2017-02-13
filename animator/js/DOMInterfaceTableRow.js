// import 'Assert'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

class DOMInterfaceTableRow {
  constructor(rowId) {
    assertParameters(arguments, String);

    this._rowId = rowId;
  }

  get _cells() {
    return $(`#${this._rowId} td:not(:first-child)`);
  }

  // @virtual
  // Called when a frame cell is clicked.
  // e.data is the selected cell elements.
  _clickFrame(e) {
    assertParameters(arguments, $.Event);

    assertUnimplemented();
  }

  activate() {
    assertParameters(arguments);

    $(this._cells).click(this._cells, this._clickFrame);
  }
};
