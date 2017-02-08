// import 'Assert'
// import 'Canvas'
// import 'Coordinate'
// import 'FrameModel'
// import 'PolygonPointInterface'

/**
 * User interface to edit a polygon.
 */
class PolygonInterface {
  constructor(frameModel, polygonId) {
    assertParameters(arguments, FrameModel, Number);

    this._frameModel = frameModel;
    this._id = polygonId;
    this._polygon = this._frameModel.getPolygon(polygonId);

    for (const coord of this._scaledCoords) {
      new PolygonPointInterface(coord);
    }

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
  }

  _scaleCoord(coord, toWidth, toHeight) {
    assertParameters(arguments, Coordinate, Number, Number);

    coord = coord
        .scale(toHeight / PolygonInterface._AREA_SIZE)
        .translate(new Coordinate((toWidth - toHeight) / 2, 0));

    return coord;
  }

  get _scaledCoords() {
    let scaledCoords = [];
    for (const coord of this._polygon.coords) {
      scaledCoords.push(this._scaleCoord(coord, canvas.width, canvas.height));
    }
    return scaledCoords;
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    canvas.drawPolygon(this._scaledCoords, 'red', true);
  }
};

PolygonInterface._AREA_SIZE = 256;
