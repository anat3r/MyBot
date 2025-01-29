import { InlineKeyboard } from "grammy"
import fluent from "../../../local.js"

function pickDay() {
  this.options = [
    ['return']
  ];

  this.keyboard = null;
  this.init = function (ctx) {
    try {
      let options = this.options.map((arr) => arr.map((tag) => InlineKeyboard.text(ctx.t(tag), tag)))
      this.keyboard = InlineKeyboard.from(options)
    } catch (e) {
      if (e instanceof ReferenceError) {
        console.error("ReferenceError:", e.message);
      }
      else {
        console.error("Unknown error:", e.message);
      }
    }

  }
}

function pickMonth() {
  this.options = [
    ['jan', 'feb', 'mar'],
    ['apr', 'may', 'jun'],
    ['jul', 'aug', 'sep'],
    ['oct', 'nov', 'dec'],
    ['return']
  ];

  this.keyboard = null;
  this.init = function (ctx) {
    try {
      let options = this.options.map((arr) => arr.map((tag) => InlineKeyboard.text(ctx.t(tag), tag)))
      this.keyboard = InlineKeyboard.from(options)
    } catch (e) {
      if (e instanceof ReferenceError) {
        console.error("ReferenceError:", e.message);
      }
      else {
        console.error("Unknown error:", e.message);
      }
    }

  }
}

function pickQuality(){
  this.options = [
    ['best-q', 'good-q', 'normal-q'],
    ['return']
  ];

  this.keyboard = null;
  this.init = function (ctx) {
    try {
      let options = this.options.map((arr) => arr.map((tag) => InlineKeyboard.text(ctx.t(tag), tag)))
      this.keyboard = InlineKeyboard.from(options)
    } catch (e) {
      if (e instanceof ReferenceError) {
        console.error("ReferenceError:", e.message);
      }
      else {
        console.error("Unknown error:", e.message);
      }
    }

  }
}

function startMenu(){
  this.options = [
    ['today', 'pickDate'],
  ];

  this.keyboard = null;
  this.init = function (ctx) {
    try {
      let options = this.options.map((arr) => arr.map((tag) => InlineKeyboard.text(ctx.t(tag), tag)))
      this.keyboard = InlineKeyboard.from(options)
    } catch (e) {
      if (e instanceof ReferenceError) {
        console.error("ReferenceError:", e.message);
      }
      else {
        console.error("Unknown error:", e.message);
      }
    }

  }
}

function submitMenu() {
  this.options = [
    ['submit'],
    ['return', 'cancel']
  ];

  this.keyboard = null;
  this.init = function (ctx) {
    try {
      let options = this.options.map((arr) => arr.map((tag) => InlineKeyboard.text(ctx.t(tag), tag)))
      this.keyboard = InlineKeyboard.from(options)
    } catch (e) {
      if (e instanceof ReferenceError) {
        console.error("ReferenceError:", e.message);
      }
      else {
        console.error("Unknown error:", e.message);
      }
    }

  }
}

const menu = {
  startMenu,
  pickMonth,
  pickDay,
  pickQuality,
  submitMenu,
}
export default menu;

/**
 * Create all menus from compiler.js or you own
 *
 * @argument menus A your own Object with menu generators
 * @returns {Array<Object>} A object with menu Objects.
 */

export function createAllMenus(menus = menu){
  return Object.values(menus).map((menu) => new menu())
}
/**
 * Create all menus from compiler.js or you own
 * @argument ctx Telegram bot context
 * @argument menus An array with menus
 */
export function initAllMenus(ctx, menus){
  menus.forEach((menu) => menu.init(ctx))
};