// import 'Assert'
// import 'AnimationModel'
// import 'Coordinate'
// import 'Size'

/**
 * Controls and plays the animation on a canvas.
 */
class AnimationController {
  constructor(animationModel) {
    assertParameters(arguments, AnimationModel);

    this._animationModel = animationModel;

    this._playing = false;
    this._curProgress = 0;

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
  }

  play() {
    assertParameters(arguments);

    this._playing = true;
  }
  pause() {
    this._playing = false;
  }
  stop() {
    this._playing = false;
    this._curProgress = 0;
  }

  get _curFrame() {
    return Math.min(AnimationModel.FRAMES - 1, this._curProgress);
  }

  _drawBorder(canvas) {
    assertParameters(arguments, Canvas);

    const stageTopLeft = AnimationController.Stage._getTopLeft(canvas);
    const stageBottomRight = AnimationController.Stage._getBottomRight(canvas);

    const top = Envelope.fromCoordinates(
        new Coordinate(0, 0), new Coordinate(canvas.width, stageTopLeft.y));
    const bottom = Envelope.fromCoordinates(
        new Coordinate(0, stageBottomRight.y),
        new Coordinate(canvas.width, canvas.height));
    const left = Envelope.fromCoordinates(
        new Coordinate(0, stageTopLeft.y),
        new Coordinate(stageTopLeft.x, stageBottomRight.y));
    const right = Envelope.fromCoordinates(
        new Coordinate(stageBottomRight.x, stageTopLeft.y),
        new Coordinate(canvas.width, stageBottomRight.y));

    canvas.drawRectangle(
        Canvas.RECTANGLE_TYPE.FILL, top, AnimationController._BORDER_COLOR);
    canvas.drawRectangle(
        Canvas.RECTANGLE_TYPE.FILL, bottom, AnimationController._BORDER_COLOR);
    canvas.drawRectangle(
        Canvas.RECTANGLE_TYPE.FILL, left, AnimationController._BORDER_COLOR);
    canvas.drawRectangle(
        Canvas.RECTANGLE_TYPE.FILL, right, AnimationController._BORDER_COLOR);
  }

  _drawProgress(canvas) {
    assertParameters(arguments, Canvas);

    const progress = (this._curFrame + 1) / AnimationModel.FRAMES;
    const width = canvas.width * progress;

    const top = canvas.height - AnimationController._PROGRESS_HEIGHT;
    const progressBar = Envelope.fromCoordinates(
      new Coordinate(0, top), new Coordinate(width, canvas.height));

    canvas.drawRectangle(Canvas.RECTANGLE_TYPE.FILL, progressBar,
        AnimationController._PROGRESS_COLOR);
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    if (this._playing) {
      this._curProgress =
          (this._curProgress + AnimationController._PLAY_SPEED) %
          (AnimationModel.FRAMES + AnimationController._FRAMES_AT_END);
    }

    // Draw the background.
    if (this._animationModel.hasBackground()) {
      const image = this._animationModel.backgroundImage;

      const coord =
          AnimationController.Stage._scaleToStage(new Coordinate(0, 0), canvas);
      const stageSize = AnimationController.Stage._getSize(canvas);
      const xScale = stageSize / image.width;
      const yScale = stageSize / image.height;

      canvas.drawImage(image, coord, xScale, yScale);
    }

    // Draw the objects.
    for (let object of this._animationModel.objects) {
      const image = this._animationModel.getImage(object.id);

      if (image === undefined) continue;

      const x = object.xAtFrame(this._curFrame) - object.xAtFrame(0);
      const y = object.yAtFrame(this._curFrame) - object.yAtFrame(0);
      const rotation = object.rotationAtFrame(this._curFrame);
      const center = object.centerAtFrame(this._curFrame);
      const coord =
          AnimationController.Stage._scaleToStage(new Coordinate(x, y), canvas);
      const centerCoord =
          AnimationController.Stage._scaleToStage(center, canvas)
              .subtract(coord);
      const stageSize = AnimationController.Stage._getSize(canvas);
      const xScale = stageSize / image.width;
      const yScale = stageSize / image.height;

      canvas.drawImage(image, coord, xScale, yScale, centerCoord, rotation);
      // canvas.drawCircle(centerCoord, 5, 'red');
    }

    // Mask out non-stage areas.
    this._drawBorder(canvas);

    // Draw progress bar.
    this._drawProgress(canvas);
  }
};

AnimationController.Stage = class {
  static _getSize(canvas) {
    assertParameters(arguments, Canvas);

    return Math.min(canvas.width, canvas.height) * 0.9;
  }

  static _scaleToStage(coord, canvas) {
    assertParameters(arguments, Coordinate, Canvas);

    // Scale to contain.
    const stageSize = AnimationController.Stage._getSize(canvas);
    coord = coord.scale(stageSize / AnimationController._ANIMATION_SIZE);

    // Center on canvas.
    coord = coord.translate(AnimationController.Stage._getTopLeft(canvas));

    return coord;
  }

  static _getTopLeft(canvas) {
    assertParameters(arguments, Canvas);

    const stageSize = AnimationController.Stage._getSize(canvas);
    const xOff = (canvas.width - stageSize) / 2;
    const yOff = (canvas.height - stageSize) / 2;

    return new Coordinate(xOff, yOff);
  }
  static _getBottomRight(canvas) {
    assertParameters(arguments, Canvas);

    const stageSize = AnimationController.Stage._getSize(canvas);

    return AnimationController.Stage._getTopLeft(canvas)
        .translate(new Coordinate(stageSize, stageSize));
  }
}

AnimationController._FRAMES_AT_END = 20;
AnimationController._PLAY_SPEED = 0.2;
AnimationController._ANIMATION_SIZE = 256;
AnimationController._BORDER_COLOR = '#ddd';
AnimationController._PROGRESS_COLOR = '#f55';
AnimationController._PROGRESS_HEIGHT = 8;
