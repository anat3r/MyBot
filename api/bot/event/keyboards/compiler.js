import { InlineKeyboard } from "grammy"
import fluent from "../../../local.js"

import startMenu from "./start.js"
import pickMonth from "./pickMonth.js"
import pickDay from "./pickDay.js"
import pickQuality from "./pickQuality.js"
import submitMenu from "./submit.js"

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