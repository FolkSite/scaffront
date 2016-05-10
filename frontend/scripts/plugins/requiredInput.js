/** Required Inputs **/
var requiredInputWrapperHTML = window.requiredInputWrapperHTML || '<span class="form__required"></span>';
(function (wrapper) {
  if (!wrapper || typeof wrapper !== 'string') {return;}
  var inputTypes = 'email number password search tel text url color date datetime datetime-local month time week'.split(' ');
  var requiredInputTypes = [];
  var makeRequiredInput = function (selector) {
    selector = selector || '';
    return selector +':required, '+ selector +'.required';
  };
  for (var i=0,length=inputTypes.length;i<length;i++) {
    requiredInputTypes.push(
      makeRequiredInput('input[type='+ inputTypes[i] +']')
    );
  }
  requiredInputTypes.push(
    makeRequiredInput('textarea')
  );

  var requiredInputs = requiredInputTypes.join(', ');
  var $requiredInputs = $(requiredInputs);

  $requiredInputs.wrap(wrapper);

})(requiredInputWrapperHTML);
/** //Required Inputs **/