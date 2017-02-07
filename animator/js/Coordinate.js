// import 'Assert'

/**
 * Represents an (x,y) coordinate.
 */
class Coordinate {
  constructor(x, y) {
    assertParameters(arguments, Number, Number);

    this._x = x;
    this._y = y;
  }

  static interpolate(coord1, coord2, scale) {
    assertParameters(arguments, Coordinate, Coordinate, Number);

    return coord1.translate(coord2.subtract(coord1).scale(scale));
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  set x(x) {
    assertParameters(arguments, Number);

    this._x = x;
  }
  set y(y) {
    assertParameters(arguments, Number);

    this._y = y;
  }

  // Calculate distance to 'other' Coordinate.
  distanceTo(other) {
    assertParameters(arguments, Coordinate);

    const xDiff = this._x - other.x;
    const yDiff = this._y - other.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }

  // Calculate angle to 'other' Coordinate.
  angleTo(other) {
    assertParameters(arguments, Coordinate);

    const yDiff = this._y - other.y;
    const xDiff = other.x - this._x;
    return (Math.atan2(yDiff, xDiff) + 2 * Math.PI) % (2 * Math.PI);
  }

  // Returns copy translated by 'other'.
  translate(other) {
    assertParameters(arguments, Coordinate);

    return new Coordinate(this._x + other.x, this._y + other.y);
  }

  // Returns copy subtracted by 'other'.
  subtract(other) {
    assertParameters(arguments, Coordinate);

    return new Coordinate(this._x - other.x, this._y - other.y);
  }

  // Returns copy scaled by 'magnitude'.
  scale(magnitudeX, magnitudeY = magnitudeX) {
    assertParameters(arguments, Number, [Number, undefined]);

    return new Coordinate(this._x * magnitudeX, this._y * magnitudeY);
  }

  toArray() {
    assertParameters(arguments);

    return [this._x, this._y];
  }
};
