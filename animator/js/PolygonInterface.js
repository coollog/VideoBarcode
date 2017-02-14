// import 'Assert'
// import 'Canvas'
// import 'Colors'
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

    this._state = PolygonInterface._STATES.IDLE;

    this._dragging = false;
    this._dragLast = null;

    Events.on(InputHandler.EVENT_TYPES.CLICK_NO_DRAG, this._onClick, this);
    Events.on(InputHandler.EVENT_TYPES.DRAG_START, this._onDragStart, this);
    Events.on(InputHandler.EVENT_TYPES.DRAG, this._onDrag, this);
    Events.on(InputHandler.EVENT_TYPES.DRAG_END, this._onDragEnd, this);
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

  static _inverseScaleCoordCanvas(coord, canvas) {
    return PolygonInterface._inverseScaleCoord(
        PolygonInterface._AREA_SIZE,
        coord,
        canvas.width,
        canvas.height);
  }

  startEditing() {
    assertParameters(arguments);

    for (const point of this._polygon.points) {
      this._addPointInterface(point);
    }
    this._state = PolygonInterface._STATES.EDITING;
  }

  startMoving() {
    assertParameters(arguments);

    canvas.setCursorFor(this, Canvas.CURSOR_TYPE.MOVE, 100);

    this._state = PolygonInterface._STATES.MOVING;
  }

  deactivate() {
    assertParameters(arguments);

    // Clear editing.
    for (const pointInterface of this._pointInterfaces) {
      pointInterface.destroy();
    }
    this._pointInterfaces.clear();

    // Clear moving.
    canvas.removeCursorFor(this);
    this._dragging = false;

    this._state = PolygonInterface._STATES.IDLE;
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

  get _isIdle() {
    return this._state === PolygonInterface._STATES.IDLE;
  }
  get _isEditing() {
    return this._state === PolygonInterface._STATES.EDITING;
  }
  get _isMoving() {
    return this._state === PolygonInterface._STATES.MOVING;
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

    if (!this._isEditing) return;

    // Add a new point.
    const inverseScaledCoord = PolygonInterface._inverseScaleCoordCanvas(
        mousePosition, canvas);
    const newPoint = this._polygon.addPoint(inverseScaledCoord);
    this._addPointInterface(newPoint);
  }

  _onDragStart(mousePosition, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    if (!this._isMoving) return;

    this._dragging = true;
    const inverseScaledCoord = PolygonInterface._inverseScaleCoordCanvas(
        mousePosition, canvas);
    this._dragLast = inverseScaledCoord;
  }

  _onDrag(mousePosition, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    if (!this._dragging) return;

    const inverseScaledCoord = PolygonInterface._inverseScaleCoordCanvas(
        mousePosition, canvas);
    const dragDelta = inverseScaledCoord.subtract(this._dragLast);
    this._dragLast = inverseScaledCoord;

    const newPosition = this._polygon.position.translate(dragDelta);
    this._polygon.position = newPosition;
  }

  _onDragEnd() {
    assertParameters(arguments, Coordinate, Canvas);

    if (!this._dragging) return;

    this._dragging = false;
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    const color = this._isIdle ?
        COLORS.POLYGON_INTERFACE_IDLE : COLORS.POLYGON_INTERFACE_ACTIVE;
    canvas.drawPolygon(this._scaledCoords, color, true);
  }
};

PolygonInterface._AREA_SIZE = 256;

PolygonInterface._STATES = {
  IDLE: 0,
  EDITING: 1,
  MOVING: 2
};
