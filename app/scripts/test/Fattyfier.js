var Fattyfier = function (id) {
    this.element = document.getElementById(id);
};

Fattyfier.prototype = {
  constructor: Fattyfier,
  fat: function () {
    this.element.style.fontWeight = "bold";
  }
};

module.exports = Fattyfier;