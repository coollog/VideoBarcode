// import 'Assert'
// import 'Canvas'
// import 'Coordinate'
// import 'PolygonModel'

/**
 * User interface to edit a polygon corner.
 */
class PolygonPointInterface {
  constructor(point, scaleFn, inverseScaleFn) {
    assertParameters(arguments, PolygonModel.Point, Function, Function);

    this._point = point;
    this._hover = false;
    this._scaleCoord = scaleFn;
    this._inverseScaleCoord = inverseScaleFn;
    this._dragging = false;
    this._dragOffset = null;
    this._shouldDrag = true;

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this, 5);
    Events.on(InputHandler.EVENT_TYPES.HOVER, this._onHover, this);
    Events.on(InputHandler.EVENT_TYPES.DRAG_START, this._onDragStart, this);
    Events.on(InputHandler.EVENT_TYPES.DRAG, this._onDrag, this);
    Events.on(InputHandler.EVENT_TYPES.DRAG_END, this._onDragEnd, this);
    Events.on(InputHandler.EVENT_TYPES.KEY, this._onKey, this);

    Events.on(PolygonPointInterface.EVENT_TYPES.DRAGGING,
        this._anotherDragging, this);
    Events.on(PolygonPointInterface.EVENT_TYPES.DRAG_END,
        this._anotherFinishedDragging, this);
  }

  destroy() {
    assertParameters(arguments);

    if (this._dragging) {
      Events.dispatch(PolygonPointInterface.EVENT_TYPES.DRAG_END, this);
    }
    canvas.removeCursorFor(this);

    Events.off(DrawTimer.EVENT_TYPES.DRAW, this);
    Events.off(InputHandler.EVENT_TYPES.HOVER, this);
    Events.off(InputHandler.EVENT_TYPES.DRAG_START, this);
    Events.off(InputHandler.EVENT_TYPES.DRAG, this);
    Events.off(InputHandler.EVENT_TYPES.DRAG_END, this);
    Events.off(InputHandler.EVENT_TYPES.KEY, this);
    Events.off(PolygonPointInterface.EVENT_TYPES.DRAGGING, this);
    Events.off(PolygonPointInterface.EVENT_TYPES.DRAG_END, this);
  }

  _scaledCoord(canvas) {
    assertParameters(arguments, Canvas);

    return this._scaleCoord(this._point.coord, canvas.width, canvas.height);
  }

  _onHover(mousePosition, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    const dist = this._scaledCoord(canvas).distanceTo(mousePosition);

    this._hover = dist <= PolygonPointInterface._HOVER_RADIUS;
  }

  _anotherDragging(other) {
    assertParameters(arguments, PolygonPointInterface);

    if (other === this) return;

    this._shouldDrag = false;
  }

  _anotherFinishedDragging(other) {
    assertParameters(arguments, PolygonPointInterface);

    this._shouldDrag = true;
  }

  _onDragStart(mousePosition, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    if (!this._shouldDrag) return;

    const dist = this._scaledCoord(canvas).distanceTo(mousePosition);

    if (dist <= PolygonPointInterface._HOVER_RADIUS) {
      this._dragging = true;
      this._dragOffset = this._scaledCoord(canvas).subtract(mousePosition);
      Events.dispatch(PolygonPointInterface.EVENT_TYPES.DRAGGING, this);
    }
  }

  _onDrag(mousePosition, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    if (!this._dragging) return;

    const coord = mousePosition.translate(this._dragOffset);
    const inverseScaledCoord =
        this._inverseScaleCoord(coord, canvas.width, canvas.height);

    this._point.coord = inverseScaledCoord;
  }

  _onDragEnd(mousePosition, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    if (!this._dragging) return;

    this._dragging = false;
    Events.dispatch(PolygonPointInterface.EVENT_TYPES.DRAG_END, this);
  }

  _onKey(keyChar) {
    assertParameters(arguments, String);

    if (!this._hover) return;

    if (keyChar === 'D') {
      this._point.remove();
      this.destroy();
    }
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    if (this._hover) {
      canvas.drawCircle(this._scaledCoord(canvas), 10, 'black', true);
      canvas.setCursorFor(this, Canvas.CURSOR_TYPE.MOVE, 100);
    } else {
      canvas.setCursorFor(this, Canvas.CURSOR_TYPE.DEFAULT, 0);
    }

    canvas.drawCircle(this._scaledCoord(canvas), 5, 'red');
  }
};

PolygonPointInterface._HOVER_RADIUS = 10;

PolygonPointInterface.EVENT_TYPES = {
  MOVE: 'polypt-move',
  DRAGGING: 'polypt-dragging',
  DRAG_END: 'polypt-dragend'
};
