// import 'Assert'
// import 'DrawTimer'

/**
 * Controls the state of the game.
 */
class Controller {
  constructor() {
    assertParameters(arguments);

    this.state = new Controller.ReadyState();

    // Attach even handlers.
    Events.on(DrawTimer.EVENT_TYPES.STEP, this._step, this, 0);
  }

  set state(newState) {
    assertParameters(arguments, Controller.State);

    if (this._state) this._state.finish();
    this._state = newState;
    newState.controller = this;
  }

  _step() {
    assertParameters(arguments);

    this._state.step();
  }
};

Controller.STATES = {
  READY: 0
};

/**
 * Represents a state of the Controller.
 * Extend this class to implement new states.
 *  step - runs every draw step.
 *  finish - runs when the state is changed.
 *  _controllerReady - runs when the state is attached to the Controller.
 */
Controller.State = class {
  constructor(type) {
    assertParameters(arguments, Controller.STATES);

    this._type = type;
  }

  get type() {
    return this._type;
  }

  set controller(controller) {
    assertParameters(arguments, Controller);

    this._controller = controller;

    this._controllerReady();
  }

  step() {
    assertParameters(arguments);

    // Do nothing by default.
  }

  finish() {
    assertParameters(arguments);

    // Do nothing by default.
  }

  _controllerReady() {
    assertParameters(arguments);

    // Do nothing by default.
  }
};
