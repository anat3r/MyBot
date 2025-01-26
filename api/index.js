/* eslint-disable no-undef */
//#region Imports
import { 
  Bot,
  GrammyError,
  HttpError,
  session,
  webhookCallback
 } from "grammy";
import { useFluent } from "@grammyjs/fluent";
import {
  conversations,
  //createConversation,
} from "@grammyjs/conversations";
import event from "./bot/event/index.js";

import 'dotenv/config';

import fluent from "./local.js";

//#endregion


//#region Translation

//#endregion


//#region Bot connection


const token = process.env.BOT_API_TOKEN;
if (!token) throw new Error("BOT_TOKEN не установлен");

const bot = new Bot(token);


//Catch errors
/* bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Update error ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Request error:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Telegram could not be reached:", e);
  } else {
    console.error("Unknown error:", e);
  }
});



bot.use(
  useFluent({
    fluent,
  }),
);

bot.use(session({
  initial() {
    return {};
  },
}));

// Установите плагин conversations
bot.use(conversations());

bot.use(event);
//#endregion
 */
async function showWrong(ctx) {
  await ctx.reply(ctx.t("wrong_command"),
    {
      parse_mode: "HTML",
    });
}



//#region Middlewares

bot.command("start", async (ctx) => {
  await ctx.reply(
    ctx.t("start"),
    { parse_mode: "HTML" })
})
bot.command("help", async(ctx) =>{
  await ctx.reply(
    ctx.t("help"),
    { parse_mode: "HTML" })
})

bot.on("message", async (ctx) => {
  showWrong(ctx);

  console.log(
    `${ctx.from.first_name} wrote ${"text" in ctx.message ? ctx.message.text : ""
    }`,
  );

});


//#endregion


//Send to server
export default webhookCallback(bot, "https", {
  timeoutMilliseconds: 60000,
  onTimeout: "return"
});

/* bot.start(); */