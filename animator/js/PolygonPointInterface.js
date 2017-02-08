// import 'Assert'
// import 'Canvas'
// import 'Coordinate'

/**
 * User interface to edit a polygon corner.
 */
class PolygonPointInterface {
  constructor(coord) {
    assertParameters(arguments, Coordinate);

    this._coord = coord;
    this._hover = false;

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this, 5);
    Events.on(InputHandler.EVENT_TYPES.HOVER, this._onHover, this);
  }

  _onHover(mousePosition) {
    const dist = this._coord.distanceTo(mousePosition);

    this._hover = dist <= PolygonPointInterface._HOVER_RADIUS;
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    if (this._hover) {
      canvas.drawCircle(this._coord, 10, 'black', true);
      canvas.setCursorFor(this, Canvas.CURSOR_TYPE.MOVE, 100);
    } else {
      canvas.setCursorFor(this, Canvas.CURSOR_TYPE.DEFAULT, 0);
    }

    canvas.drawCircle(this._coord, 5, 'red');
  }
};

PolygonPointInterface._HOVER_RADIUS = 10;
