// import 'Assert'
// import 'DOMInterfaceTablePolygonRow'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

/**
 * Sets up and controls the frame table interface.
 */
class DOMInterfaceTable {
  constructor() {
    assertParameters(arguments);

    this._addFrameNumbersRow();
    this._addGotoFrameRow();

    Events.on(FrameModel.EVENT_TYPES.ADD_POLYGON, this._addPolygonRow, this);
  }

  static _addRow(rowId, rowName, cellContentFn) {
    assertParameters(arguments, String, String, Function);

    let row = `<tr id="${rowId}"><td class="headcol">${rowName}</td>`;

    for (let i = 0; i < FrameModel.KEYFRAMES; i ++) {
      const content = cellContentFn(i);
      row += `<td index=${i}>${content}</td>`;
    }

    row += `</tr>`;
    $('#keyframes table').append(row);
  }

  activate() {
    assertParameters(arguments);

    this._activateGotoFrames();
  }

  _addPolygonRow(polygonId) {
    assertParameters(arguments, Number);

    const rowId = `kf-poly${polygonId}`;
    DOMInterfaceTable._addRow(rowId, `Polygon ${polygonId}`, (i) => i);

    new DOMInterfaceTablePolygonRow(polygonId, rowId);
  }

  _addFrameNumbersRow() {
    assertParameters(arguments);

    DOMInterfaceTable._addRow(`kf-num`, ``, (i) => i);
  }

  _addGotoFrameRow() {
    assertParameters(arguments);

    DOMInterfaceTable._addRow(`kf-sel`, `Goto frame`, (i) => ``);
  }

  _activateGotoFrames() {
    assertParameters(arguments);

    const kfelems = '#kf-sel :not(:first-child)';

    $(kfelems).click(function() {
      const isSel = $(this).hasClass('sel');

      if (isSel) {
        $(this).removeClass('sel');
      } else {
        $(kfelems).removeClass('sel');
        $(this).addClass('sel');
      }
    });
  }
};
