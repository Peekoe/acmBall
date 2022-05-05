import {
  sendTestResults,
  testBallPosition,
  testBallVelocity,
  testBallShape,
  testBallSize,
  testBallRender,
} from "./tests.js";
let { Bodies, Body, Composite } = Matter;
import { parseOptions } from "./helpers.js";
import config from "../config.js";
import ConveyorBelt from "./ConveyorBelt.js";
import Circle from "./Circle.js";
import Button from "./Button.js";
import Rectangle from "./Rectangle.js";
import Entity from "./Entity.js";
import Line from "./Line.js";
import Triangle from "./Triangle.js";
import Ramp from "./Ramp.js";

/**
 * A tile in the game grid
 * @class {Tile}
 */
class Tile {
  constructor() {
    game.tiles.push(this);

    this.id = game.tiles.length - 1;
    this.height = game.TILE_HEIGHT;
    this.width = game.TILE_WIDTH;
    this.left = (this.id % game.NUM_TILES_X) * game.TILE_WIDTH;
    this.top = Math.floor(this.id / game.NUM_TILES_Y) * game.TILE_WIDTH;
    this.right = this.left + game.TILE_WIDTH;
    this.bottom = this.right + game.TILE_HEIGHT;
    this.testsPassed = 0;
    this.numTests = 5;
    this.game = game;
    this.matter = Matter; // for advanced users
    this.bodies = []; // list of objects in this tile

    /* User Defined Member Variables */
    this.ballStart = {};
    this.ballEnd = {};

    /* User Defined Member Functions */
    this.setup;
    this.onBallEnter;
    this.onBallLeave;
    this.onTick;
    this.onTickBackground;
  }

  get ball() {
    return this.game.ball;
  }

  testExit() {
    let c = config.tests.exit;
    this.testsPassed += !c.position || testBallPosition(game.ball.body, this.ballEnd);
    this.testsPassed += !c.velocity || testBallVelocity(game.ball.body, this.ballEnd);
    this.testsPassed += !c.shape || testBallShape(game.ball.body);
    this.testsPassed += !c.size || testBallSize(game.ball.body);
    this.testsPassed += !c.render || testBallRender(game.ball.body);
    sendTestResults(this);
  }

  /**
   * @method setBackgroundColor
   * @param {string} color
   * @returns {void}
   */
  setBackgroundColor(color) {
    game.render.options.background = color;
  }

  /**
   * @method createRectangle
   * @param {number} x - the center x value
   * @param {number} y - the center y value
   * @param {number} width
   * @param {number} height
   * @param {bool} moveable
   * @param {Object} options
   * @returns {Rectangle}
   */
  createRectangle(x, y, width, height, moveable = false, options = {}) {
    return new Rectangle(this, this.left + x, this.top + y, width, height, moveable, options);
  }

  createLine(x1, y1, x2, y2, thickness, moveable = false, options = {}) {
    return new Line(this, x1, y1, x2, y2, thickness, moveable, options);
  }

  createTriangle(x1, y1, x2, y2, x3, y3, moveable = false, options = {}) {
    return new Triangle(this, x1, y1, x2, y2, x3, y3, moveable, options);
  }

  createRamp(x1, y1, x2, y2, options = {}) {
    return new Ramp(this, x1, y1, x2, y2, options);
  }

  /**
   * @method createCircle
   * @param {number} x - the center x value
   * @param {number} y - the center y value
   * @param {number} radius
   * @param {bool} moveable
   * @param {Object} options
   * @returns {Circle}
   */
  createCircle(x, y, radius, moveable = false, options = {}) {
    return new Circle(this, this.left + x, this.top + y, radius, moveable, options);
  }

  /**
   * @method createConveyorBelt
   * @param {number} x - the center x value
   * @param {number} y - the center y value
   * @param {number} width
   * @param {number} height
   * @param {number} speed
   * @param {Object} options
   * @returns {Entity}
   */
  createConveyorBelt(x, y, width, height, speed, options = {}) {
    return new ConveyorBelt(this, this.left + x, this.top + y, width, height, speed, options);
  }

  /**
   * callback is triggered when button pressed.
   * endCallback is triggered when button becomes unpressed.
   * options.trigger_threshold (amount of mass required to trigger a button)
   * @method createButton
   * @param {number} x - the center x value
   * @param {number} y - the center y value
   * @param {number} width
   * @param {number} height
   * @param {function} callback
   * @param {function} endCallback
   * @param {Object} options
   * @returns {Entity}
   */
  createButton(x, y, width, height, callback, endCallback = (_) => {}, options = {}) {
    return new Button(this, this.left + x, this.top + y, width, height, callback, endCallback, options);
  }

  /**
   * @method createSpring
   * @param {number} x - the center x value
   * @param {number} y - the center y value
   * @param {number} width
   * @param {number} height
   * @param {vector} launchVelocity
   * @param {Object} options
   * @returns {Entity}
   */
  createSpring(x, y, width, height, launchVelocity, options = { isStatic: true }) {
    parseOptions(options);
    let base = Bodies.rectangle(this.left + x, this.top + y, width, height, options);
    let spring = Bodies.rectangle(this.left + x, this.top + y, width, height, options);
    return new Entity(spring, this);
  }

  /**
   * Removes all non-static objects in the tile
   * @method clear
   * @returns {void}
   */
  clear() {
    Composite.remove(this.game.engine.world, this.bodies);
  }
}

export default Tile;
