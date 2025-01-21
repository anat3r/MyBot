import { Bot, webhookCallback, Context } from "grammy";
import { AboutDate, GenerateImage } from "./scripts/generate.js";
import { Fluent} from "@moebius/fluent";
import { useFluent } from "@grammyjs/fluent";
import { getToday, getDate, readDate } from "./scripts/utilities.js" ;

import 'dotenv/config';

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
  👉 <b>/today</b>— to find out what happened today. 
  📅 <b>/ondate DD.MM</b> — to discover an event on a specific date. 
       
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
  source: (`
start =
  Привет!🌟 
  
  Я бот 🤖, готовый помочь найти самое удивительное событие по дате! 📅✨ 

  Просто напиши <b>'/today'</b>, чтобы узнать, что произошло сегодня, или <b>'/ondate ДД.ММ'</b>, чтобы найти событие на выбранную тобой дату! 🎉😊   

  Буду рад помочь! 😄

wait = Запрос получен! 🤔 Сейчас загляну в свою магическую книгу истории 🪄📖… Будьте на связи, скоро всё расскажу! ✨

wrong_command =
  😅 Ой, похоже, что-то пошло не так! 
     
  Попробуй использовать команды: 
  👉 <b>/today</b> — чтобы узнать, что произошло сегодня. 
  📅 <b>/ondate ДД.ММ</b> — чтобы найти событие на конкретную дату. 
     
  Давай попробуем снова! 😊✨

wrong_date = Пожалуйста, укажите команду с датой в формате ДД.ММ, и я с радостью найду интересное событие для вас! 😉📅`),
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});
//#endregion


//#region Bot connection
const token = process.env.BOT_API_KEY;
if (!token) throw new Error("BOT_TOKEN не установлен");

const bot = new Bot(process.env.BOT_API_KEY);

bot.use(
useFluent({
    fluent,
  }),
);

//#endregion


//#region Values

let isParam = false;

//#endregion


//#region Utility functions





//#endregion

async function readParam(r){


}



//#region Input commands
bot.command("start", async (ctx) =>{
  await ctx.reply(
    ctx.t("start"),
    {
      parse_mode: "HTML",
    })
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
//#endregion

//ProcessMessage
bot.on("message", async (ctx) => {
  console.log(
    `${ctx.from.first_name} wrote ${"text" in ctx.message ? ctx.message.text : ""
    }`,
  );
  await ctx.reply(ctx.t("wrong_command"),
    {
      parse_mode: "HTML",
    });
});

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

//Send to server
export default webhookCallback(bot, "https", {
  timeoutMilliseconds: 60000,
  onTimeout: "return"
});