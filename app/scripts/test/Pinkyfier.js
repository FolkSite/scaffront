var Pinkyfier = function (id) {
  this.element = document.getElementById(id);
};

Pinkyfier.prototype = {
  constructor: Pinkyfier,

  pink: function () {
    this.element.style.backgroundColor = "mistyrose";
    this.element.style.color = "hotpink";
  }
};

module.exports = Pinkyfier;