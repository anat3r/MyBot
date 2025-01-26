import { InlineKeyboard } from "grammy"

export default function pickDay()
{
  this.options = [
    ['return']
  ];
    
  this.keyboard = null;
  this.init = function (ctx) 
    {
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