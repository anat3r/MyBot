/* eslint-disable no-undef */
//#region Imports
import { Bot, webhookCallback, GrammyError, HttpError} from "grammy";
import { AboutDate } from "./util/generate.js";
import { Fluent} from "@moebius/fluent";
import { useFluent } from "@grammyjs/fluent";
import { getToday, readDate } from "./util/utilities.js" ;
import { Menu } from "@grammyjs/menu";
import * as fs from 'fs';
import * as path from 'path';

import 'dotenv/config';
import { dirname } from "@grammyjs/i18n/script/deps/deno.land/std@0.192.0/path/win32.js";

//#endregion


let test = false;

//#region Translation
const fluent = new Fluent();

await fluent.addTranslation({
  locales: 'en',
  source: (`
start =
  Hi! 🌟  
   
  I'm a bot 🤖, here to help you find the coolest events by date! 📅✨  
   
  Just type <b>'/today'</b> to see what happened today, or <b>'/ondate DD.MM'</b> to look up an event on your chosen date! 🎉😊  
   
  Happy to help! 😄

wrong_command =
  😅 Oops, it seems something went wrong! 
     
  Try using these commands: 
  👉 <b>/event</b>— to discover an event on a specific date.
       
  Let’s try again! 😊✨ 

wait = Request received! 🤔 I’m flipping through my magical history book 🪄📖… Stay tuned, I’ll have the answer for you soon! ✨

wrong_date = Please provide the command with the date in DD.MM format, and I'll be happy to find an interesting event for you! 😉📅`),
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});

await fluent.addTranslation({
  locales: 'ru',
  filePath: path.resolve("./locales", "ru", "ru.ftl"),
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});
//#endregion


//#region Bot connection


const token = test ? process.env.TEST_BOT_API : process.env.BOT_API_KEY;
if (!token) throw new Error("BOT_TOKEN не установлен");

const bot = new Bot(token);

//Catch errors
bot.catch((err) => {
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

//#endregion


//#region Values


//#endregion


//#region BotFuncs

async function showWrong(ctx) {
  await ctx.reply(ctx.t("wrong_command"),
    {
      parse_mode: "HTML",
    });
}

//#endregion


//#region Middlewares

bot.command("start", async (ctx) =>{
  await ctx.reply( 
    ctx.t("start"),
    { parse_mode: "HTML" })
})

bot.command("today", async (ctx) => {
  let date = getToday();

  await ctx.react("👍");
  await ctx.reply(ctx.t("wait"),{
    reply_parameters: { message_id: ctx.msg.message_id },
  })

  try {
    await AboutDate(date, ctx.from.language_code)
      .then((event) => ctx.replyWithPhoto(event.url, {
        reply_parameters: { message_id: ctx.msg.message_id },
        caption: event.text,
      }))
  }
  catch (e) {
    console.log(e);
  }
});

bot.command("ondate", async (ctx) => {

  let date = readDate(ctx);

  if (date != null){
    console.log(`-----Date: ${date}------`)
    await ctx.react("👍");
    await ctx.reply(ctx.t("wait"), {
      reply_parameters: { message_id: ctx.msg.message_id },
    })

    try{
      await AboutDate(date, ctx.from.language_code)
        .then((event) => ctx.replyWithPhoto(event.url, {
          reply_parameters: { message_id: ctx.msg.message_id },
          caption: event.text,
        }))
    }
    catch(e){
      console.log(e);
    }
  } else {
    await ctx.reply(ctx.t("wrong_date"), {
      reply_parameters: { message_id: ctx.msg.message_id },
    })
  }
});

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