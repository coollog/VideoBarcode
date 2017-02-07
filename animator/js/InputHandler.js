// import 'Assert'
// import 'Canvas'
// import 'Coordinate'
// import 'Events'

class InputHandler {
  constructor(canvas) {
    assertParameters(arguments, Canvas);

    this._canvas = canvas;
    this._dragging = false;

    // Attach the event listeners.
    canvas.listen('mousedown', this._dragStart.bind(this));
    canvas.listen('mousemove', this._drag.bind(this));
    canvas.listen('mouseup', this._dragEnd.bind(this));
    canvas.listen('keydown', this._key.bind(this));
    canvas.listen('click', this._click.bind(this));
    canvas.listen('mousemove', this._hover.bind(this));
  }

  _dragStart(e) {
    assertParameters(arguments, MouseEvent);

    this._dragging = true;
    this._dispatchMouseEvent(e, InputHandler.EVENT_TYPES.DRAG_START);
  }
  _drag(e) {
    assertParameters(arguments, MouseEvent);

    if (!this._dragging) return;
    this._dispatchMouseEvent(e, InputHandler.EVENT_TYPES.DRAG);
  }
  _dragEnd(e) {
    assertParameters(arguments, MouseEvent);

    if (!this._dragging) return;
    this._dragging = false;
    this._dispatchMouseEvent(e, InputHandler.EVENT_TYPES.DRAG_END);
  }

  _key(e) {
    assertParameters(arguments, KeyboardEvent);

    const keyChar = String.fromCharCode(e.keyCode);
    Events.dispatch(InputHandler.EVENT_TYPES.KEY, keyChar);
  }

  _click(e) {
    assertParameters(arguments, MouseEvent);

    this._dispatchMouseEvent(e, InputHandler.EVENT_TYPES.CLICK);
  }

  _hover(e) {
    assertParameters(arguments, MouseEvent);

    this._dispatchMouseEvent(e, InputHandler.EVENT_TYPES.HOVER);
  }

  _dispatchMouseEvent(e, eventType) {
    assertParameters(arguments, MouseEvent, InputHandler.EVENT_TYPES);

    const mousePosition = this._canvas.getMousePosition(e);
    Events.dispatch(eventType, mousePosition);
  }
}

InputHandler.EVENT_TYPES = {
  DRAG_START: 'input-dragstart',
  DRAG: 'input-drag',
  DRAG_END: 'input-dragend',
  KEY: 'input-key',
  CLICK: 'input-click',
  HOVER: 'input-hover'
};
