// import 'Assert'
// import 'AnimationModel'

/**
 * Controls and plays the animation on a canvas.
 */
class AnimationController {
  constructor(animationModel) {
    assertParameters(arguments, AnimationModel);

    this._animationModel = animationModel;

    this._playing = false;

    Events.on(DrawTimer.EVENT_TYPES.DRAW, this._draw, this);
  }

  play() {
    assertParameters(arguments);

    this._playing = true;
  }

  _draw(canvas) {
    assertParameters(arguments, Canvas);

    if (this._playing) {

    } else {
      for (let polygon of this._animationModel.polygons) {
        const image = this._animationModel.getImage(polygon.id);

        if (image === undefined) continue;
        canvas.drawImage(image, new Coordinate(0, 0));
      }
    }
  }
};
