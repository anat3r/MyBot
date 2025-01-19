import { Bot, webhookCallback, Context } from "grammy";
import { AboutDate, GenerateImage } from "./scripts/ChatGPT.js";
import { Fluent} from "@moebius/fluent";
import { useFluent } from "@grammyjs/fluent";

const fluent = new Fluent();

import 'dotenv/config';

await fluent.addTranslation({
  locales: 'en',
  source: (`
start =
  Hi! 🌟  
   
  I'm a bot 🤖, here to help you find the coolest events by date! 📅✨  
   
  Just type <b>'/today'</b> to see what happened today, or <b>'/ondate DD.MM'</b> to look up an event on your chosen date! 🎉😊  
   
  Happy to help! 😄

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

wrong_date = Пожалуйста, укажите команду с датой в формате ДД.ММ, и я с радостью найду интересное событие для вас! 😉📅
  `),
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});


const token = process.env.BOT_API_KEY;
if (!token) throw new Error("BOT_TOKEN не установлен");

const bot = new Bot(process.env.BOT_API_KEY);

bot.use(
useFluent({
    fluent,
  }),
);



//Funcs
function getToday(){
  return new Date().toUTCString().slice(5, -18);
}

function getDate(promt){
  let day, month = 0;
  try{
    month = Number.parseInt(promt.split('.')[1]) - 1;
    day = Number.parseInt(promt.split('.')[0]) + 1;
  } catch(e){
    console.log(e);
  }
  return new Date(2015, month, day).toUTCString().slice(5, -18);
}

function ReadDate(ctx){
  let arg = ctx.match.trim();
  if (arg && arg.length == 5 && Number.parseInt(arg.split('.')[0]) && Number.parseInt(arg.split('.')[1])){
    return getDate(arg);
  } else{
    return null;
  }
}

//Start script
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

  let date = ReadDate(ctx);

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
  console.log(
    `${ctx.from.first_name} wrote ${"text" in ctx.message ? ctx.message.text : ""
    }`,
  );
  await ctx.reply("Please use /today or /ondate command");
});

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

export default webhookCallback(bot, "https");