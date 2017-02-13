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

    // Map from id to PolygonModel.
    this._polygons = {};
    this._currentFrame = 0;

    this._frames = (new Array(FrameModel.KEYFRAMES)).fill().map(
        (x, i) => new FrameModel.Frame(this, i));
  }

  get currentFrameIndex() {
    return this._currentFrame;
  }

  // Gets the current FrameModel.Frame.
  get currentFrame() {
    return this._frames[this._currentFrame];
  }
  set currentFrame(frameIndex) {
    assertParameters(arguments, Number);

    this._currentFrame = frameIndex;

    Events.dispatch(FrameModel.EVENT_TYPES.CHANGE_FRAME, frameIndex);
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

/**
 * Represents a single frame for every polygon.
 */
FrameModel.Frame = class {
  constructor(frameModel, frameIndex) {
    assertParameters(arguments, FrameModel, Number);

    this._frameModel = frameModel;
    this._frameIndex = frameIndex;

    // Map from id to FrameModel.Frame.PositionKeyFrame.
    this._positionKeyFrames = {};
  }

  addKeyFrame(polygonId) {
    assertParameters(arguments, Number);

    if (polygonId in this._positionKeyFrames) return;

    this.addPositionKeyFrame(polygonId);
  }

  removeKeyFrame(polygonId) {
    assertParameters(arguments, Number);

    this.removePositionKeyFrame(polygonId);
  }

  addPositionKeyFrame(polygonId) {
    assertParameters(arguments, Number);

    this._frameModel.currentFrame = this._frameIndex;
    this._positionKeyFrames[polygonId] = new FrameModel.Frame.PositionKeyFrame(
        this._frameModel.getPolygonPosition(polygonId));
  }

  removePositionKeyFrame(polygonId) {
    assertParameters(arguments, Number);

    delete this._positionKeyFrames[polygonId];
  }
};

/**
 * Represents a single keyframe for a polygon.
 */
FrameModel.Frame.PositionKeyFrame = class {
  constructor(coord) {
    assertParameters(arguments, Coordinate);

    this._position = coord;
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
  ADD_POLYGON: 'framemodel-addpolygon',
  CHANGE_FRAME: 'framemodel-changeframe'
};
