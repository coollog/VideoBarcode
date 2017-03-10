// import 'Assert'
// import 'BitBuffer'
// import 'Coordinate'
// import 'FrameModel'
// import 'PolygonModel'

/**
 * Encodes an animation into bytecode.
 *
 * Encoding is:
 * [ POLYGON: NUM POINTS | [ X Y ] |
 *   POSITION KEYFRAMES: NUM KEYFRAMES | [ FRAMEINDEX X Y ] ]
 */
class AnimationEncoder {
  constructor(frameModel) {
    assertParameters(arguments, FrameModel);

    this._frameModel = frameModel;
  }

  static bitsToString(bitBuffer) {
    assertParameters(arguments, BitBuffer);

    return String.fromCharCode.apply(null, bitBuffer.toUint8Array());
  }

  encode() {
    let numbers = [];

    const bitBuffer = new BitBuffer();

    for (let polygon of this._frameModel.polygons) {
      // NUM POINTS
      const coords = polygon.coords;
      bitBuffer.writeBits(4, coords.length);
      numbers.push(coords.length);

      for (let coord of coords) {
        // X Y
        bitBuffer.writeBits(8, Math.round(coord.x));
        numbers.push(Math.round(coord.x));
        bitBuffer.writeBits(8, Math.round(coord.y));
        numbers.push(Math.round(coord.y));
      }

      // Get position keyframes.
      const keyframes = this._getPositionKeyframesFor(polygon.id);

      // NUM KEYFRAMES
      bitBuffer.writeBits(6, keyframes.length);
      numbers.push(keyframes.length);

      for (let keyframe of keyframes) {
        const position = this._positionToUnsigned(keyframe.position);

        // X Y
        bitBuffer.writeBits(6, keyframe.frameIndex);
        numbers.push(keyframe.frameIndex);
        bitBuffer.writeBits(8, Math.round(position.x));
        numbers.push(Math.round(position.x));
        bitBuffer.writeBits(8, Math.round(position.y));
        numbers.push(Math.round(position.y));
      }
    }

    console.log(numbers)

    this._checkEncoding(bitBuffer);

    return bitBuffer;
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

  _positionToUnsigned(position) {
    assertParameters(arguments, Coordinate);

    return position.subtract(FrameModel.Frame.PositionKeyFrame._BOUND_TOP_LEFT);
  }

  // Just a test function to make sure our encoding is correct.
  _checkEncoding(bitBuffer) {
    assertParameters(arguments, BitBuffer);

    for (let polygon of this._frameModel.polygons) {
      const coords = polygon.coords;

      assertEq(coords.length, bitBuffer.readBits(4));

      for (let coord of coords) {
        assertEq(Math.round(coord.x), bitBuffer.readBits(8));
        assertEq(Math.round(coord.y), bitBuffer.readBits(8));
      }

      // Get position keyframes.
      const keyframes = this._getPositionKeyframesFor(polygon.id);

      // NUM KEYFRAMES
      assertEq(keyframes.length, bitBuffer.readBits(6));

      for (let keyframe of keyframes) {
        const position = this._positionToUnsigned(keyframe.position);

        // X Y
        assertEq(keyframe.frameIndex, bitBuffer.readBits(6));
        assertEq(Math.round(position.x), bitBuffer.readBits(8));
        assertEq(Math.round(position.y), bitBuffer.readBits(8));
      }
    }
  }
};
