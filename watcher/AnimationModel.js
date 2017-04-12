// import 'Assert'

/**
 * Stores an animation in an easily-queriable format.
 */
class AnimationModel {
  // Initialize the model with CSV data from the decoded animation.
  // The data should have 2 rows for each object. The first row for each
  // object corresponds to the x values for each frame, and the second row is
  // the y values. The first column can be disregarded.
  constructor(csvData) {
    assertParameters(arguments, Array);

    this._objects = [];
    this._images = [];
    this._backgroundImage = undefined;

    let rowCounter = 0;
    let objectId = 0;

    for (let row of csvData) {
      if (row.length != 65) break;

      switch (rowCounter) {

      case 0: { // x row
        const object = new AnimationModel.Object(objectId);
        this._objects.push(object);

        object.xFrames = AnimationModel._parseArray(row.slice(1), parseInt);
        break;
      }

      case 1: { // y row
        const object = this._objects[this._objects.length - 1];

        object.yFrames = AnimationModel._parseArray(row.slice(1), parseInt);
        break;
      }

      case 2: { // rotation row
        const object = this._objects[this._objects.length - 1];

        object.rotationFrames =
            AnimationModel._parseArray(row.slice(1), parseFloat);

        objectId ++;
        break;
      }
      }

      rowCounter = (rowCounter + 1) % 3;
    }
  }

  get objects() {
    return this._objects;
  }

  get backgroundImage() {
    return this._backgroundImage;
  }

  addPolygonData(csvData) {
    assertParameters(arguments, Array);

    for (let i = 0; i < this._objects.length; i ++) {
      const row = csvData[i];

      const numPoints = row[0];
      const coords = [];
      for (let j = 0; j < numPoints; j ++) {
        const x = parseInt(row[2 * j + 1]);
        const y = parseInt(row[2 * j + 2]);
        coords.push(new Coordinate(x, y));
      }

      this._objects[i].coords = coords;
    }

    console.log(this._objects);
  }

  hasAllImages() {
    assertParameters(arguments);

    for (let i = 0; i < this._objects.length; i ++) {
      if (i >= this._images.length || this._images[i] === undefined) {
        return false;
      }
    }
    return true;
  }

  getImage(objectId) {
    assertParameters(arguments, Number);

    if (objectId >= this._images.length) return undefined;

    return this._images[objectId];
  }

  setImage(objectId, image) {
    assertParameters(arguments, Number, HTMLImageElement);

    this._images[objectId] = image;
  }

  hasBackground() {
    assertParameters(arguments);

    return this._backgroundImage !== undefined;
  }

  setBackground(image) {
    assertParameters(arguments, HTMLImageElement);

    this._backgroundImage = image;
  }

  static _parseArray(arr, parserFn) {
    assertParameters(arguments, Array, Function);

    return arr.map(parserFn);
  }
};

AnimationModel.FRAMES = 64;

AnimationModel.Object = class {
  constructor(objectId) {
    assertParameters(arguments, Number);

    this._objectId = objectId;

    // Construct the frames.
    this._xFrames = new Array(AnimationModel.FRAMES);
    this._yFrames = new Array(AnimationModel.FRAMES);
    this._rotationFrames = new Array(AnimationModel.FRAMES);

    this._coords = [];
  }

  static _linearInterpolate(startVal, endVal, portion) {
    return portion * (endVal - startVal) + startVal;
  }

  static _angularInterpolate(startVal, endVal, portion) {
    const portionDiff = (endVal - startVal) * portion;
    const angleDiff = Math.atan2(Math.sin(portionDiff), Math.cos(portionDiff));

    return startVal + angleDiff;
  }

  get id() {
    return this._objectId;
  }

  get xFrames() {
    return this._xFrames;
  }
  get yFrames() {
    return this._yFrames;
  }
  get rotationFrames() {
    return this._rotationFrames;
  }
  set xFrames(xFrames) {
    assertParameters(arguments, Array);

    this._xFrames = AnimationModel.Object._interpolateFrames(
        xFrames, AnimationModel.Object._linearInterpolate);
  }
  set yFrames(yFrames) {
    assertParameters(arguments, Array);

    this._yFrames = AnimationModel.Object._interpolateFrames(
        yFrames, AnimationModel.Object._linearInterpolate);
  }
  set rotationFrames(rotationFrames) {
    assertParameters(arguments, Array);

    this._rotationFrames = AnimationModel.Object._interpolateFrames(
        rotationFrames, AnimationModel.Object._angularInterpolate);
  }

  set coords(coords) {
    assertParameters(arguments, Array);

    this._coords = coords;
  }

  centerAtFrame(frameIndex) {
    assertParameters(arguments, Number);

    const position =
        new Coordinate(this.xAtFrame(frameIndex), this.yAtFrame(frameIndex));

    let center = new Coordinate(0, 0);
    let numPoints = 0;
    for (let coord of this._coords) {
      center = center.translate(coord);
      numPoints ++;
    }
    return center.scale(1 / numPoints).translate(position);
  }
  xAtFrame(frameIndex) {
    assertParameters(arguments, Number);

    return AnimationModel.Object._interpolateBetween(this._xFrames, frameIndex);
  }
  yAtFrame(frameIndex) {
    assertParameters(arguments, Number);

    return AnimationModel.Object._interpolateBetween(this._yFrames, frameIndex);
  }
  rotationAtFrame(frameIndex) {
    assertParameters(arguments, Number);

    return AnimationModel.Object._interpolateBetween(
        this._rotationFrames, frameIndex);
  }

  static _interpolateBetween(values, frameIndex) {
    assertParameters(arguments, Array, Number);

    if (frameIndex === values.length - 1) return values[frameIndex];

    const progress = frameIndex % 1;

    const firstFrame = Math.floor(frameIndex);

    const first = values[firstFrame];
    const second = values[firstFrame + 1];

    return (second - first) * progress + first;
  }

  static _interpolateFrames(frames, interpFn) {
    assertParameters(arguments, Array, Function);

    // Find each start-end of keyframes and interpolate frames in-between.
    for (let start = 0; start < AnimationModel.FRAMES; start ++) {
      const startVal = frames[start];

      let end = start + 1;
      while (end < AnimationModel.FRAMES) {
        if (!isNaN(frames[end])) break;
        end ++;
      }

      if (isNaN(startVal)) {
        // If no start value, use the end value, or 0 as default.
        let setVal = 0;

        if (end !== AnimationModel.FRAMES) {
          setVal = frames[end];
        }

        for (let i = start; i < end; i ++) {
          frames[i] = setVal;
        }
      } else {
        // If no end value, use the start value.
        if (end === AnimationModel.FRAMES) {
          const setVal = startVal;
          for (let i = start + 1; i < end; i ++) {
            frames[i] = setVal;
          }
        } else {
          // If there is both a start and end value, interpolate.
          const endVal = frames[end];

          for (let i = start + 1; i < end; i ++) {
            const portion = (i - start) / (end - start);
            const setVal = interpFn(startVal, endVal, portion);
            frames[i] = setVal;
          }
        }
      }
    }

    return frames;
  }
};
