'use strict';

const path = require('path');
const _ = require('lodash');
const slice = require('sliced');

class Position {

  /**
   * {string} value
   * @returns {Position}
   */
  constructor (value) {
    if (!(this instanceof Position)) {
      return new Position(value);
    }

    this.value = value.toLowerCase();

    //this.isNothing();
    //this.isOuter();
  }

  /**
   * @returns {string}
   */
  getValue () {
    return this.value;
  }

  isOuter () {
    if (_.isUndefined(this._isOuter)) {
      let tmp = this.value.split('-');

      this._isOuter = tmp[0] == 'outer' || (tmp[1] || '')  == 'outer';
    }

    return this._isOuter;
  }

  isTop () {
    if (_.isUndefined(this._isTop)) {
      let tmp = this.value.split('-');

      this._isTop = tmp[0] == 'top' || (tmp[1] || '')  == 'top';
    }

    return this._isTop;
  }

  isRight () {
    if (_.isUndefined(this._isRight)) {
      let tmp = this.value.split('-');

      this._isRight = tmp[0] == 'right' || (tmp[1] || '')  == 'right';
    }

    return this._isRight;
  }

  isBottom () {
    if (_.isUndefined(this._isBottom)) {
      let tmp = this.value.split('-');

      this._isBottom = tmp[0] == 'bottom' || (tmp[1] || '') == 'bottom';
    }

    return this._isBottom;
  }

  isLeft () {
    if (_.isUndefined(this._isLeft)) {
      let tmp = this.value.split('-');

      this._isLeft = tmp[0] == 'left' || (tmp[1] || '') == 'left';
    }

    return this._isLeft;
  }

  /**
   * @returns {boolean}
   */
  isVertical () {
    return this.isTop() || this.isBottom();
  }

  /**
   * @returns {boolean}
   */
  isHorizontal () {
    return this.isLeft() || this.isRight();
  }

  /**
   * @returns {boolean}
   */
  isCenter () {
    if (_.isUndefined(this._isCenter)) {
      this._isCenter = this.value == 'center';
    }

    return this._isCenter;
  }

  /**
   * @returns {boolean}
   */
  isNothing () {
    if (_.isUndefined(this._isNothing)) {
      this._isNothing = !this.isCenter() && !this.isHorizontal() && !this.isVertical();
    }

    return this._isNothing;
  }
}


class Positions {

}



function getPositions () {
  var args = slice(arguments);

  args = _(args)
    .flattenDeep()
    .map(position => position.split(' '))
    .flatten()
    .map(position => _.trim(position))
    .compact()
    .map(position => new Position(position))
    .value()
  ;

  var positions = {
    vertical: null,
    horizontal: null
  };

  console.log(args);

  switch (args.length) {
    case 0:

      break;
    case 1:

      break;
    case 2:

      break;
    case 3:

      break;
    default:
      args = slice(args, 0, 4);


      break;
  }

}

getPositions('top  Riwght ', ['center'], [['outer-right '], 'outer-left']);


module.export = getPositions;
