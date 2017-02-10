// import 'Assert'
// import 'Coordinate'
// import 'PolygonModel'

/**
 * Represents the frames of the animation and keyframe information as well.
 * Stores all the polygons used.
 */
class FrameModel {
  constructor() {
    assertParameters(arguments);

    this._polygons = {};
    this._currentFrame = 0;
  }

  get polygons() {
    return Object.values(this._polygons);
  }

  getPolygon(id) {
    assertParameters(arguments, Number);

    return this._polygons[id];
  }

  // Adds a polygon and returns its id.
  addPolygon() {
    assertParameters(arguments);

    const poly = new PolygonModel();

    for (const coord of FrameModel._DEFAULT_POLYGON) {
      poly.addPoint(coord);
    }

    const id = FrameModel._nextPolygonId ++;
    this._polygons[id] = poly;

    Events.dispatch(FrameModel.EVENT_TYPES.ADD_POLYGON, id);

    return id;
  }
};

FrameModel.KEYFRAMES = 64;
FrameModel.FPS = 16;
FrameModel._DEFAULT_POLYGON = [
  new Coordinate(108, 108),
  new Coordinate(148, 108),
  new Coordinate(148, 148),
  new Coordinate(108, 148)
];

FrameModel._nextPolygonId = 0;

FrameModel.EVENT_TYPES = {
  ADD_POLYGON: 'framemodel-addpolygon'
};
