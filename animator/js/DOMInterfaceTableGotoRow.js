// import 'Assert'
// import 'DOMInterfaceTableRow'
// import 'Events'
// import 'FrameModel'
// import 'jquery'

class DOMInterfaceTableGotoRow extends DOMInterfaceTableRow {
  constructor(rowId) {
    assertParameters(arguments, String);

    super(rowId);
  }

  _clickFrame(e) {
    assertParameters(arguments, $.Event);

    const isSel = $(this).hasClass('sel');

    if (isSel) return;

    const cells = e.data;
    cells.removeClass('sel');
    $(this).addClass('sel');

    const index = parseInt($(this).attr('index'));

    Events.dispatch(DOMInterfaceTableGotoRow.EVENT_TYPES.GOTO, index);
  }
};

DOMInterfaceTableGotoRow.EVENT_TYPES = {
  GOTO: 'domiftblgotorow-goto'
};
