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

    $('#but-generate-qrcode').click(() => {
      const encoded = (new AnimationEncoder(this._frameModel)).encode();
      console.log(encoded.length);
      console.log(btoa(encoded));

      $('#qrcode').html('');
      var qrcode = new QRCode($('#qrcode')[0], {
        text: encoded,
        width: 128,
        height: 128,
        colorDark : '#000000',
        colorLight : '#ffffff',
        correctLevel : QRCode.CorrectLevel.L
      });
    });
  }
};

DOMInterface.EVENT_TYPES = {
  ADD_POLYGON: 'dominterface-add-polygon',
  READY: 'dominterface-ready'
};
