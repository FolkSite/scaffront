$('.ajax-form').afl({

})
.on('success', function () {
  if (typeof window.yaMetrika !== 'undefined') {
    var metrikaTargetName = $(this).data('metrika-target') || false;
    if (metrikaTargetName) {
      //console.log(metrikaTargetName);
      window.yaMetrika.reachGoal(metrikaTargetName);
    }
  }
});


