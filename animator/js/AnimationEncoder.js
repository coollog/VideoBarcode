// import 'Assert'
// import 'Coordinate'
// import 'FrameModel'
// import 'PolygonModel'

/**
 * Encodes an animation into bytecode.
 *
 * Encoding is:
 * [ POLYGON: NUM POINTS | [ X Y ] |
 *            NUM KEYFRAMES | [ X Y ] ]
 */
class AnimationEncoder {
  constructor(frameModel) {
    assertParameters(arguments, FrameModel);

    this._frameModel = frameModel;
  }

  encode() {
    const nums = [];

    for (let polygon of this._frameModel.polygons) {
      // NUM POINTS
      const coords = polygon.coords;
      nums.push(coords.length);

      for (let coord of coords) {
        // X Y
        nums.push(coord.x);
        nums.push(coord.y);
      }

      // Get position keyframes.
      const keyframes = this._getPositionKeyframesFor(polygon.id);

      // NUM KEYFRAMES
      nums.push(keyframes.length);

      for (let keyframe of keyframes) {
        // X Y
        nums.push(keyframe.frameIndex);
        nums.push(keyframe.position.x);
        nums.push(keyframe.position.y);
      }
    }

    return String.fromCharCode.apply(null, Uint8Array.from(nums));
  }

  _getPositionKeyframesFor(polygonId) {
    assertParameters(arguments, Number);

    const keyframes = [];
    for (let i = 0; i < FrameModel.KEYFRAMES; i ++) {
      const frame = this._frameModel.getFrame(i);
      if (!frame.hasPositionKeyframeFor(polygonId)) continue;

      const keyframe = frame.getPositionKeyframeFor(polygonId);
      keyframes.push(keyframe);
    }

    return keyframes;
  }
};
