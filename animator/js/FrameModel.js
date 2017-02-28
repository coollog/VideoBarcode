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

  getPolygon(polygonId) {
    assertParameters(arguments, Number);

    return this._polygons[polygonId];
  }

  getPolygonPosition(polygonId) {
    assertParameters(arguments, Number);

    // Find frame to the left.
    const frameLeft = (() => {
      for (let i = this._currentFrame; i >= 0; i --) {
        if (this._frames[i].hasPositionKeyframeFor(polygonId))
          return this._frames[i];
      }
    })();

    // Find frame to the right.
    const frameRight = (() => {
      for (let i = this._currentFrame; i < FrameModel.KEYFRAMES; i ++) {
        if (this._frames[i].hasPositionKeyframeFor(polygonId))
          return this._frames[i];
      }
    })();

    if (frameLeft === frameRight && frameLeft === undefined) {
      return PolygonModel.START_POSITION;
    }

    // Interpolate between.
    const positionLeft = frameLeft === undefined ?
        null : frameLeft.getPositionKeyframeFor(polygonId).position;
    const positionRight = frameRight === undefined ?
        null : frameRight.getPositionKeyframeFor(polygonId).position;

    if (frameLeft === undefined) return positionRight;
    if (frameRight === undefined) return positionLeft;
    if (frameRight === frameLeft) return positionLeft;

    const currentFrameRelative = this._currentFrame - frameLeft.frameIndex;
    const frameRange = frameRight.frameIndex - frameLeft.frameIndex;
    const interp = currentFrameRelative / frameRange;
    return positionRight.subtract(positionLeft)
        .scale(interp)
        .translate(positionLeft);
  }

  getFrame(frameIndex) {
    assertParameters(arguments, Number);

    return this._frames[frameIndex];
  }

  // Adds a polygon and returns its id.
  addPolygon() {
    assertParameters(arguments);

    const id = FrameModel._nextPolygonId ++;
    const poly = new PolygonModel(id, this.getPolygonPosition.bind(this, id));

    for (let coord of FrameModel._DEFAULT_POLYGON) {
      poly.addPoint(coord);
    }

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

  get frameIndex() {
    return this._frameIndex;
  }

  hasPositionKeyframeFor(polygonId) {
    assertParameters(arguments, Number);

    return polygonId in this._positionKeyFrames;
  }

  getPositionKeyframeFor(polygonId) {
    assertParameters(arguments, Number);

    if (!this.hasPositionKeyframeFor(polygonId)) return null;

    return this._positionKeyFrames[polygonId];
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

  addPositionKeyFrame(polygonId, newPosition) {
    assertParameters(arguments, Number, [Coordinate, undefined]);

    if (newPosition === undefined) {
      newPosition = this._frameModel.getPolygon(polygonId).position;
    }

    this._frameModel.currentFrame = this._frameIndex;
    this._positionKeyFrames[polygonId] =
        new FrameModel.Frame.PositionKeyFrame(this._frameIndex, newPosition);

    Events.dispatch(FrameModel.EVENT_TYPES.ADD_POSITION_KEYFRAME,
        this._frameIndex, polygonId);
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
  constructor(frameIndex, coord) {
    assertParameters(arguments, Number, Coordinate);

    if (!coord.isWithin(
        FrameModel.Frame.PositionKeyFrame._BOUND_TOP_LEFT,
        FrameModel.Frame.PositionKeyFrame._BOUND_BOTTOM_RIGHT)) {
      coord = coord.moveWithin(
          FrameModel.Frame.PositionKeyFrame._BOUND_TOP_LEFT,
          FrameModel.Frame.PositionKeyFrame._BOUND_BOTTOM_RIGHT);
    }

    this._frameIndex = frameIndex;
    this._position = coord;
  }

  get frameIndex() {
    return this._frameIndex;
  }

  get position() {
    return this._position;
  }
};

FrameModel.Frame.PositionKeyFrame._BOUND_TOP_LEFT = new Coordinate(-128, -128);
FrameModel.Frame.PositionKeyFrame._BOUND_BOTTOM_RIGHT =
    new Coordinate(127, 127);

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
  CHANGE_FRAME: 'framemodel-changeframe',
  ADD_POSITION_KEYFRAME: 'framemodel-addposkeyframe' // FrameIndex, PolygonId
};
