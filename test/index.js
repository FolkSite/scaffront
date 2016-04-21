'use strict';

const path = require('path');
const _ = require('lodash');
const slice = require('sliced');

var verticalTokens = 'top bottom outer-top outer-bottom'.split(' ');
var horizontalTokens = 'left right outer-left outer-right'.split(' ');
var centerTokens = 'center'.split(' ');

class Position {

  /**
   * {string} value
   * @returns {Position}
   */
  constructor (value) {
    if (!(this instanceof Position)) {
      return new Position(value);
    }

    this.value = value;
    this._isVertical = void 0;
    this._isHorizontal = void 0;
    this._isCenter = void 0;
    this._isNothing = void 0;

    this.isVertical();
    this.isHorizontal();
    this.isCenter();
    this.isNothing();
  }

  /**
   * @returns {boolean}
   */
  isVertical () {
    if (_.isUndefined(this._isVertical)) {
      this._isVertical = !!~verticalTokens.indexOf(this.value)
    }

    return this._isVertical;
  }

  /**
   * @returns {boolean}
   */
  isHorizontal () {
    if (_.isUndefined(this._isHorizontal)) {
      this._isHorizontal = !!~horizontalTokens.indexOf(this.value)
    }

    return this._isHorizontal;
  }

  /**
   * @returns {boolean}
   */
  isCenter () {
    if (_.isUndefined(this._isCenter)) {
      this._isCenter = !!~centerTokens.indexOf(this.value);
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

export default function getPositions () {
  var args = slice(arguments);

  args = _(args)
    .flattenDeep()
    .map(position => position.split(' '))
    .flatten()
    .map(position => _.trim(position))
    .compact()
    .map(position => new Position(position))
    .value();

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

getPositions('top  right ', ['center'], [['outer-right '], 'outer-left']);
