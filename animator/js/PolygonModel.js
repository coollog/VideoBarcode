// import 'Assert'
// import 'Coordinate'

class PolygonModel {
  constructor() {
    assertParameters(arguments);

    this._firstPoint = null;
  }

  // Inserts a point between two closest points.
  addPoint(coord) {
    assertParameters(arguments, Coordinate);

    const newPoint = new PolygonModel.Point(coord);

    if (this._firstPoint === null) {
      this._firstPoint = newPoint;
      return;
    }

    if (this._firstPoint.isLast) {
      this._firstPoint.append(newPoint);
      return;
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
      } else {
        minPt.append(newPoint);
      }
    }
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
};

/**
 * Represents a point in the polygon in a linked-list manner.
 */
PolygonModel.Point = class {
  constructor(coord) {
    assertParameters(arguments, Coordinate);

    this._coord = coord;

    this._nextPoint = null;
    this._prevPoint = null;
  }

  get coord() {
    return this._coord;
  }

  get next() {
    return this._nextPoint;
  }
  set next(next) {
    assertParameters(arguments, PolygonModel.Point);

    this._nextPoint = next;
    next.prevPoint = this;
  }

  get prev() {
    return this._prevPoint;
  }
  set prev(prev) {
    assertParameters(arguments, PolygonModel.Point);

    this._prevPoint = prev;
    prev.nextPoint = this;
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
};
