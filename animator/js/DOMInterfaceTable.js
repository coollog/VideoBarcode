// import 'Assert'
// import 'DOMInterfaceTablePolygonRow'
// import 'DOMInterfaceTablePolygonPositionRow'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

/**
 * Sets up and controls the frame table interface.
 * TODO: Refactor all the inline DOM selectors.
 */
class DOMInterfaceTable {
  constructor(frameModel) {
    assertParameters(arguments, FrameModel);

    this._frameModel = frameModel;

    this._gotoRow = null;
    // Map from id to DOMInterfaceTablePolygonRow.
    this._polygonRows = {};
    // Map from id to DOMInterfaceTablePolygonPositionRow.
    this._polygonPositionRows = {};

    this._addFrameNumbersRow();
    this._addGotoFrameRow();

    Events.on(FrameModel.EVENT_TYPES.ADD_POLYGON, this._addPolygonRow, this);
    Events.on(FrameModel.EVENT_TYPES.ADD_POLYGON,
        this._addPolygonPositionRow, this);
    Events.on(FrameModel.EVENT_TYPES.CHANGE_FRAME, this._changeFrame, this);

    Events.on(PolygonModel.EVENT_TYPES.CHANGE_POSITION,
        this._changePolygonPosition, this)
  }

  activate() {
    assertParameters(arguments);

    this._gotoRow.activate();
  }

  _addRow(rowId, rowClass, rowName, headcolClass, cellContentFn) {
    assertParameters(arguments, String, String, String, String, Function);

    let row = `
      <tr id="${rowId}" class="${rowClass}">
      <td class="headcol ${headcolClass}">${rowName}</td>
    `;

    for (let i = 0; i < FrameModel.KEYFRAMES; i ++) {
      const content = cellContentFn(i);
      row += `<td index=${i}>${content}</td>`;
    }

    row += `</tr>`;
    $('#keyframes table').append(row);
  }

  _addPolygonRow(polygonId) {
    assertParameters(arguments, Number);

    const rowId = `kf-poly${polygonId}`;
    const rowContent = DOMInterfaceTable.POLYGON_ROW_CONTENT(polygonId);
    this._addRow(rowId, `keyframe-row`, rowContent, `kf-poly`, (i) => ``);

    const newPolygonRow = new DOMInterfaceTablePolygonRow(polygonId, rowId);
    newPolygonRow.currentFrame = this._frameModel.currentFrameIndex;
    this._polygonRows[polygonId] = newPolygonRow;
  }

  _addPolygonPositionRow(polygonId) {
    assertParameters(arguments, Number);

    const rowId = `kf-polyposition${polygonId}`;
    const rowContent = DOMInterfaceTable.POLYGON_POSITION_ROW_CONTENT(
        this._frameModel.getPolygon(polygonId).position);
    this._addRow(
        rowId, `keyframe-row`, rowContent, `kf-polyposition`, (i) => ``);

    const newPolygonPositionRow =
        new DOMInterfaceTablePolygonPositionRow(polygonId, rowId, false);
    newPolygonPositionRow.currentFrame = this._frameModel.currentFrameIndex;
    this._polygonPositionRows[polygonId] = newPolygonPositionRow;
  }

  _addFrameNumbersRow() {
    assertParameters(arguments);

    this._addRow(`kf-num`, ``, ``, ``, (i) => i);
  }

  _addGotoFrameRow() {
    assertParameters(arguments);

    const rowId = `kf-sel`;
    this._addRow(rowId, ``, `Goto frame`, ``, (i) => ``);

    this._gotoRow = new DOMInterfaceTableGotoRow(rowId);
  }

  _changeFrame(frameIndex) {
    assertParameters(arguments, Number);

    for (const polygonRow of Object.values(this._polygonRows)) {
      polygonRow.currentFrame = frameIndex;
    }

    for (const positionRow of Object.values(this._polygonPositionRows)) {
      positionRow.currentFrame = frameIndex;
    }
  }

  _changePolygonPosition(polygonId) {
    assertParameters(arguments, Number);

    const position = this._frameModel.getPolygon(polygonId).position;
    this._polygonPositionRows[polygonId].changePosition(position);
  }
};

DOMInterfaceTable.POLYGON_ROW_CONTENT = function(polygonId) {
  return `Polygon ${polygonId}`;
};

DOMInterfaceTable.POLYGON_POSITION_ROW_CONTENT = function(coord) {
  const x = coord.x;
  const y = coord.y;
  return `
    x <input type="x" value="${x}"></input> &nbsp;
    y <input type="y" value="${y}"></input>
  `;
};
