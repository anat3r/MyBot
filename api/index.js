import { Bot, InlineKeyboard } from "grammy";
import { AboutDate, GenerateImage } from "./scripts/ChatGPT.js";
import { I18n } from "@grammyjs/i18n";
import 'dotenv/config';
const token = process.env.BOT_API_KEY;
if (!token) throw new Error("BOT_TOKEN не установлен");
console.log(token)

const i18n = new I18n({
  defaultLocale: "en", // смотрите ниже для получения дополнительной информации
  directory: 'locales/', 
});

const bot = new Bot(process.env.BOT_API_KEY);

// Создайте экземпляр `I18n`.
// Продолжайте читать, чтобы узнать, как настроить экземпляр.


// Наконец, зарегистрируйте экземпляр i18n в боте,
// чтобы сообщения переводились на ходу!
bot.use(i18n);



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