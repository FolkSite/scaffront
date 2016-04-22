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

    this._value = value.toLowerCase();

    this.isNothing;
    this.isOuter;
  }

  /**
   * @returns {string}
   */
  get value () {
    return this._value;
  }

  /**
   * @returns {boolean}
   */
  get isOuter () {
    if (_.isUndefined(this._isOuter)) {
      let tmp = this._value.split('-');

      this._isOuter = tmp[0] == 'outer' || (tmp[1] || '')  == 'outer';
    }

    return this._isOuter;
  }

  /**
   * @returns {boolean}
   */
  get isTop () {
    if (_.isUndefined(this._isTop)) {
      let tmp = this._value.split('-');

      this._isTop = tmp[0] == 'top' || (tmp[1] || '')  == 'top';
    }

    return this._isTop;
  }

  /**
   * @returns {boolean}
   */
  get isRight () {
    if (_.isUndefined(this._isRight)) {
      let tmp = this._value.split('-');

      this._isRight = tmp[0] == 'right' || (tmp[1] || '')  == 'right';
    }

    return this._isRight;
  }

  /**
   * @returns {boolean}
   */
  get isBottom () {
    if (_.isUndefined(this._isBottom)) {
      let tmp = this._value.split('-');

      this._isBottom = tmp[0] == 'bottom' || (tmp[1] || '') == 'bottom';
    }

    return this._isBottom;
  }

  /**
   * @returns {boolean}
   */
  get isLeft () {
    if (_.isUndefined(this._isLeft)) {
      let tmp = this._value.split('-');

      this._isLeft = tmp[0] == 'left' || (tmp[1] || '') == 'left';
    }

    return this._isLeft;
  }

  /**
   * @returns {boolean}
   */
  get isVertical () {
    return this.isTop || this.isBottom;
  }

  /**
   * @returns {boolean}
   */
  get isHorizontal () {
    return this.isLeft || this.isRight;
  }

  /**
   * @returns {boolean}
   */
  get isCenter () {
    if (_.isUndefined(this._isCenter)) {
      this._isCenter = this._value == 'center';
    }

    return this._isCenter;
  }

  /**
   * @returns {boolean}
   */
  get isNothing () {
    if (_.isUndefined(this._isNothing)) {
      this._isNothing = !this.isCenter && !this.isHorizontal && !this.isVertical;
    }

    return this._isNothing;
  }
}

class Positions {
  constructor () {
    var args = slice(arguments);

    this.input = _(args)
      .flattenDeep()
      .map(position => position.split(' '))
      .flatten()
      .map(position => _.trim(position))
      .compact()
      .map(position => new Position(position))
      .filter(position => !position.isNothing)
      .value()
    ;

    if (this.input.length > 4) {
      this.input = slice(this.input, 0, 4);
    }

    this.grouped = _.reduce(this.input, (all, position) => {
      position.isTop        && all.top.push(position);
      position.isRight      && all.right.push(position);
      position.isBottom     && all.bottom.push(position);
      position.isLeft       && all.left.push(position);
      position.isCenter     && all.center.push(position);
      position.isHorizontal && all.horizontal.push(position);
      position.isVertical   && all.vertical.push(position);
      position.isOuter      && all.outer.push(position);

      return all;
    }, {
      top: [],
      right: [],
      bottom: [],
      left: [],
      center: [],
      horizontal: [],
      vertical: [],
      outer: []
    });

    console.log(this.grouped);

    //switch (this.input.length) {
    //  case 0:
    //
    //    break;
    //  case 1:
    //
    //    break;
    //  case 2:
    //
    //    break;
    //  case 3:
    //
    //    break;
    //  default:
    //    args = slice(args, 0, 4);
    //
    //
    //    break;
    //}
  }

  parse () {

  }
}



new Positions ('top  Riwght ', ['center'], [['outer-right '], 'outer-left']);


module.export = function () {
  return new Positions(arguments);
};
