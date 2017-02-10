// import 'Assert'
// import 'Coordinate'

/**
 * Represents a polygon.
 * TODO: addPoint does not always add between two closest points. Probably
 *       need to make linked list circular.
 */
class PolygonModel {
  constructor() {
    assertParameters(arguments);

    this._firstPoint = null;
  }

  get coords() {
    let coords = [];

    for (const pt of this.points) {
      coords.push(pt.coord);
    }

    return coords;
  }

  get points() {
    const firstPoint = this._firstPoint;

    return {
      [Symbol.iterator]() {
        return {
          _curPoint: firstPoint,
          next() {
            let value = undefined;
            let done = true;
            if (this._curPoint !== null) {
              value = this._curPoint;
              done = false;
              this._curPoint = this._curPoint.next;
            }
            return {
              value: value,
              done: done
            }
          }
        }
      }
    }
  }

  // Inserts a point between two closest points.
  addPoint(coord) {
    assertParameters(arguments, Coordinate);

    const newPoint = new PolygonModel.Point(this, coord);

    if (this._firstPoint === null) {
      this._firstPoint = newPoint;
      return newPoint;
    }

    if (this._firstPoint.isLast) {
      this._firstPoint.append(newPoint);
      return newPoint;
    }

    // Find the two closest points (Euclidean distance).
    // First, find the closest point.
    // Then find the adjacent point that is closest.
    // Next, get the distance between these two points.
    // Finally, based on these 3 distances, insert the new point accordingly.
    let minPt = null;
    let minPtDist = Number.MAX_SAFE_INTEGER;

    for (const pt of this.points) {
      const dist = pt.distanceTo(newPoint);
      if (dist < minPtDist) {
        minPt = pt;
        minPtDist = dist;
      }
    }

    const ptLeft = minPt.prev;
    const ptLeftDist = (ptLeft !== null) ?
        ptLeft.distanceTo(newPoint) : Number.MAX_SAFE_INTEGER;
    const ptRight = minPt.next;
    const ptRightDist = (ptRight !== null) ?
        ptRight.distanceTo(newPoint) : Number.MAX_SAFE_INTEGER;

    if (ptLeftDist < ptRightDist) {
      const distBetween = minPt.distanceTo(ptLeft);

      // Left is closer.
      if (minPtDist > distBetween) {
        ptLeft.insert(newPoint);
        if (ptLeft === this._firstPoint) this._firstPoint = newPoint;
      } else if (ptLeftDist > distBetween) {
        minPt.append(newPoint);
      } else {
        ptLeft.append(newPoint);
      }
    } else {
      const distBetween = minPt.distanceTo(ptRight);

      // Right is closer.
      if (minPtDist > distBetween) {
        ptRight.append(newPoint);
      } else if (ptRightDist > distBetween) {
        minPt.insert(newPoint);
        if (minPt === this._firstPoint) this._firstPoint = newPoint;
      } else {
        minPt.append(newPoint);
      }
    }

    return newPoint;
  }

  removePoint(point) {
    assertParameters(arguments, PolygonModel.Point);

    if (point.prev !== null) {
      point.prev.next = point.next;
      console.log('setting prev to next');
    } else if (point.next !== null) {
      point.next.prev = point.prev;
      console.log('setting next to prev');
    }

    if (point === this._firstPoint) {
      this._firstPoint = point.next;
    }

    console.log(...this.points);
  }
};

/**
 * Represents a point in the polygon in a linked-list manner.
 */
PolygonModel.Point = class {
  constructor(polygon, coord) {
    assertParameters(arguments, PolygonModel, Coordinate);

    this._polygon = polygon;
    this._coord = coord;

    this._nextPoint = null;
    this._prevPoint = null;
  }

  get coord() {
    return this._coord;
  }
  set coord(coord) {
    assertParameters(arguments, Coordinate);

    this._coord = coord;
  }

  get next() {
    return this._nextPoint;
  }
  set next(next) {
    assertParameters(arguments, [PolygonModel.Point, null]);

    this._nextPoint = next;
    if (next !== null) next.prevPoint = this;
  }

  get prev() {
    return this._prevPoint;
  }
  set prev(prev) {
    assertParameters(arguments, [PolygonModel.Point, null]);

    this._prevPoint = prev;
    if (prev !== null) prev.nextPoint = this;
  }

  set prevPoint(other) {
    assertParameters(arguments, PolygonModel.Point);

    this._prevPoint = other;
  }
  set nextPoint(other) {
    assertParameters(arguments, PolygonModel.Point);

    this._nextPoint = other;
  }

  distanceTo(other) {
    assertParameters(arguments, PolygonModel.Point);

    return this._coord.distanceTo(other.coord);
  }

  get isLast() {
    assertParameters(arguments);
    return this._nextPoint === null;
  }

  // Inserts the point between this point and its next.
  append(pt) {
    assertParameters(arguments, PolygonModel.Point);

    if (this._nextPoint !== null) this._nextPoint.prev = pt;
    this.next = pt;
  }

  // Inserts the point between this point and its prev.
  insert(pt) {
    assertParameters(arguments, PolygonModel.Point);

    if (this._prevPoint !== null) this._prevPoint.next = pt;
    this.prev = pt;
  }

  remove() {
    assertParameters(arguments);

    this._polygon.removePoint(this);
  }
};
