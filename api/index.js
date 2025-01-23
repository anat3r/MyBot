/* eslint-disable no-undef */
//#region Imports
import { Bot, GrammyError, HttpError} from "grammy";
import { AboutDate } from "./util/generate.js";
import { Fluent} from "@moebius/fluent";
import { useFluent } from "@grammyjs/fluent";
import { getToday, readDate } from "./util/utilities.js" ;
import { Menu } from "@grammyjs/menu";
import * as path from 'path';

import 'dotenv/config';

//#endregion


let test = false;

//#region Translation
const fluent = new Fluent();

await fluent.addTranslation({
  locales: 'en',
  filePath: [
    path.resolve("./locales", "en", "main.ftl"),
    path.resolve("./locales", "en", "menu.ftl")
  ],
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});

await fluent.addTranslation({
  locales: 'ru',
  filePath: [
    path.resolve("./locales", "ru", "main.ftl"),
    path.resolve("./locales", "ru", "menu.ftl")
  ],
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});
//#endregion


//#region Bot connection


const token = test ? process.env.TEST_BOT_TOKEN : process.env.BOT_API_TOKEN;
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

//#region Handlers
/* 
function monthHandler(monthName , ctx) 
{
  console.log(monthName);
}

function returnHandler(ctx){

  return console.log("return");
}

 */

//#region Menus
/* 
const eventMenu = new Menu("event")
  .text(
    (ctx) => ctx
  )


const pickMonth = new Menu("pick-month")
  .text(
    (ctx) => ctx.t('jan'),
    (ctx) => monthHandler('jan', ctx))
  .text(
    (ctx) => ctx.t('feb'),
    (ctx) => monthHandler('feb', ctx)
  )
  .text(
    (ctx) => ctx.t('mar'),
    (ctx) => monthHandler('mar', ctx))
  .text(
    (ctx) => ctx.t('apr'),
    (ctx) => monthHandler('apr', ctx)).row()
  .text(
    (ctx) => ctx.t('maj'),
    (ctx) => monthHandler('maj', ctx))
  .text(
    (ctx) => ctx.t('jun'),
    (ctx) => monthHandler('jun', ctx))
  .text(
    (ctx) => ctx.t('jul'),
    (ctx) => monthHandler('jul', ctx))
  .text(
    (ctx) => ctx.t('aug'),
    (ctx) => monthHandler('aug', ctx)).row()
  .text(
    (ctx) => ctx.t('sep'),
    (ctx) => monthHandler('sep', ctx))
  .text(
    (ctx) => ctx.t('oct'),
    (ctx) => monthHandler('oct', ctx))
  .text(
    (ctx) => ctx.t('nov'),
    (ctx) => monthHandler('nov', ctx))
  .text(
    (ctx) => ctx.t('dec'),
    (ctx) => monthHandler('dec', ctx)).row()
  .text(
    (ctx) => ctx.t('return'),
    (ctx) => returnHandler(ctx))
 */

//#endregion




//#region Middlewares

bot.command("start", async (ctx) =>{
  await ctx.reply( 
    ctx.t("start"),
    { parse_mode: "HTML" })
})
/* 
bot.command("menu", async (ctx) => {
  await ctx.reply("Посмотрите на это меню:", { reply_markup: pickMonth });
})

 */
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

  let date = readDate(ctx.message.text);

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