// import 'Assert'
// import 'Canvas'
// import 'Coordinate'
// import 'FrameModel'
// import 'PolygonModel'
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

    this._pointInterfaces = new Set();
    this._activated = false;

    Events.on(InputHandler.EVENT_TYPES.CLICK_NO_DRAG, this._onClick, this);
    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
  }

  static _scaleCoord(coord, toWidth, toHeight) {
    assertParameters(arguments, Coordinate, Number, Number);

    coord = coord
        .scale(toHeight / PolygonInterface._AREA_SIZE)
        .translate(new Coordinate((toWidth - toHeight) / 2, 0));

    return coord;
  }

  static _inverseScaleCoord(toSize, coord, fromWidth, fromHeight) {
    assertParameters(arguments, Number, Coordinate, Number, Number);

    coord = coord
        .translate(new Coordinate(-(fromWidth - fromHeight) / 2, 0))
        .scale(toSize / fromHeight);

    return coord;
  }

  activate() {
    assertParameters(arguments);

    for (const point of this._polygon.points) {
      this._addPointInterface(point);
    }
    this._activated = true;
  }

  deactivate() {
    assertParameters(arguments);

    for (const pointInterface of this._pointInterfaces) {
      pointInterface.destroy();
    }
    this._pointInterfaces.clear();
    this._activated = false;
  }

  get _scaledCoords() {
    assertParameters(arguments);

    let scaledCoords = [];
    for (const coord of this._polygon.coords) {
      const positionedCoord = coord.translate(this._polygon.position);
      scaledCoords.push(PolygonInterface._scaleCoord(
          positionedCoord, canvas.width, canvas.height));
    }
    return scaledCoords;
  }

  _addPointInterface(point) {
    assertParameters(arguments, PolygonModel.Point);

    const newPoint = new PolygonPointInterface(
        point,
        PolygonInterface._scaleCoord,
        PolygonInterface._inverseScaleCoord.bind(
            this, PolygonInterface._AREA_SIZE));
    this._pointInterfaces.add(newPoint);
  }

  _onClick(mousePosition, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    if (!this._activated) return;

    // Add a new point.
    const inverseScaledCoord = PolygonInterface._inverseScaleCoord(
        PolygonInterface._AREA_SIZE,
        mousePosition,
        canvas.width,
        canvas.height);
    const newPoint = this._polygon.addPoint(inverseScaledCoord);
    this._addPointInterface(newPoint);
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    canvas.drawPolygon(this._scaledCoords, 'red', true);
  }
};

PolygonInterface._AREA_SIZE = 256;
