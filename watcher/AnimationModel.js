// import 'Assert'

/**
 * Stores an animation in an easily-queriable format.
 */
class AnimationModel {
  // Initialize the model with CSV data from the decoded animation.
  // The data should have 2 rows for each polygon. The first row for each
  // polygon corresponds to the x values for each frame, and the second row is
  // the y values. The first column can be disregarded.
  constructor(csvData) {
    assertParameters(arguments, Array);

    this._polygons = [];

    let rowCounter = 0;

    for (let row of csvData) {
      if (row.length != 65) break;

      if (rowCounter === 0) { // x row
        const poly = new AnimationModel.Polygon();
        this._polygons.push(poly);

        poly.xFrames = AnimationModel._parseIntArray(row.slice(1));
      } else { // y row
        const poly = this._polygons[this._polygons.length - 1];

        poly.yFrames = AnimationModel._parseIntArray(row.slice(1));
      }

      rowCounter = (rowCounter + 1) % 2;
    }
  }

  static _parseIntArray(arr) {
    assertParameters(arguments, Array);

    return arr.map(function(x) {
      return parseInt(x);
    });
  }
};

AnimationModel.FRAMES = 64;

AnimationModel.Polygon = class {
  constructor() {
    assertParameters(arguments);

    // Construct the frames.
    this._xFrames = new Array(AnimationModel.FRAMES);
    this._yFrames = new Array(AnimationModel.FRAMES);
  }

  get xFrames() {
    return this._xFrames;
  }
  get yFrames() {
    return this._yFrames;
  }
  set xFrames(xFrames) {
    assertParameters(arguments, Array);

    this._xFrames = AnimationModel.Polygon._interpolateFrames(xFrames);
  }
  set yFrames(yFrames) {
    assertParameters(arguments, Array);

    this._yFrames = AnimationModel.Polygon._interpolateFrames(yFrames);
  }

  xAtFrame(frameIndex) {
    assertParameters(arguments, Number);

    return this._xFrames[frameIndex];
  }
  yAtFrame(frameIndex) {
    assertParameters(arguments, Number);

    return this._yFrames[frameIndex];
  }

  static _interpolateFrames(frames) {
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
            const setVal = portion * (endVal - startVal) + startVal;
            frames[i] = setVal;
          }
        }
      }
    }

    return frames;
  }
};
