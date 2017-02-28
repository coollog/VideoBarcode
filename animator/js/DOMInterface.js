// import 'Assert'
// import 'DOMInterfaceTable'
// import 'DOMInterfaceTableKeyframeRow'
// import 'DOMInterfaceTablePolygonRow'
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

    Events.on(DOMInterfaceTablePolygonRow.EVENT_TYPES.ACTIVATE,
        this._polygonSelected, this);
    Events.on(DOMInterfaceTableKeyframeRow.EVENT_TYPES.DEACTIVATE_ALL,
        this._polygonDeselected, this);
  }

  static get BUTTON_ADD_POLYGON() {
    return $('#but-add-polygon');
  }

  static get BUTTON_REMOVE_POLYGON() {
    return $('#but-remove-polygon');
  }

  static get BUTTON_PREVIEW() {
    return $('#but-preview');
  }

  static get BUTTON_GENERATE_QRCODE() {
    return $('#but-generate-qrcode');
  }

  static get QRCODE() {
    return $('#qrcode');
  }

  _activateButtons() {
    assertParameters(arguments);

    DOMInterface.BUTTON_ADD_POLYGON.click(() => {
      this._frameModel.addPolygon();
    });

    DOMInterface.BUTTON_REMOVE_POLYGON.click(() => {
      this._frameModel.removePolygon(this._table.currentPolygon);
    });

    DOMInterface.BUTTON_GENERATE_QRCODE.click(() => {
      const encoded = (new AnimationEncoder(this._frameModel)).encode();
      console.log(encoded.length);
      console.log(btoa(encoded));

      DOMInterface.QRCODE.html('');
      var qrcode = new QRCode(DOMInterface.QRCODE[0], {
        text: encoded,
        width: 128,
        height: 128,
        colorDark : '#000000',
        colorLight : '#ffffff',
        correctLevel : QRCode.CorrectLevel.L
      });
    });
  }

  _polygonSelected(polygonId) {
    assertParameters(arguments, Number);

    DOMInterface.BUTTON_REMOVE_POLYGON.removeAttr('disabled');
  }

  _polygonDeselected() {
    assertParameters(arguments);

    DOMInterface.BUTTON_REMOVE_POLYGON.attr('disabled', 'disabled');
  }
};

DOMInterface.EVENT_TYPES = {
  ADD_POLYGON: 'dominterface-add-polygon',
  READY: 'dominterface-ready'
};
