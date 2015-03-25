(function (undefined) {
  $(document).on('click', '[data-metrika-target]:not(form)', function (e) {
//    console.log(window.yaMetrika);
    if (typeof window.yaMetrika === 'undefined') {return;}
    var targetName = this.getAttribute('data-metrika-target') || false;
    if (targetName) {
//      console.log(targetName);
      window.yaMetrika.reachGoal(targetName);
    }
  });
})();
