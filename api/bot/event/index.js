import { 
  Composer,
  InlineKeyboard,
  session,
  GrammyError,
  HttpError
 } from "grammy"
import {
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { Menu } from "@grammyjs/menu";
import { useFluent } from "@grammyjs/fluent";
import fluent from "../../local.js";

import menu, {createAllMenus, initAllMenus} from "./keyboards/menu.js"
//Create composer
const event = new Composer();

//Declare vars

const data = {
  isPicking: false,
  month: null,
  day: null,
  type: null
}

//Declare funcs


/**
 * Get current day and month
 *
 * @returns {Array<Number, String>} Array with current day and month, in format [Day, Month].
 */

function getToday() {
  return new Date().toUTCString().toLowerCase().slice(5, -18).split(' ');
}

import 'dotenv/config';
import OpenAI from "openai";
const openai = new OpenAI();

function tb(variable){
  let txtbase = {
    event: {
      en: `Imagine this is a real historical event that happened in ${variable} [specify a year from the Middle Ages to 2020]. The event should contain absurd elements but sound like it could have actually happened. Avoid repeating themes of uprisings, marches, or wars. Instead, focus on unusual cultural, scientific, everyday, or mystical events. Include well-known figures from that era who could have been involved, and describe everything with a touch of humor. The text should be under 1000 characters and follow this format:

[Emoji representing the event] [Day + month name] was "[Event Name]" in [Event Year]! [Emoji representing the event]

[Description of the event, including unusual details, such as food, random inventions, absurd mystifications, strange cultural phenomena.] [End the text with a short, emotional  ion using an emoji.]`,

      ru: `Представь, что это настоящее историческое событие, которое произошло ${variable} [укажи год от Средневековья до 2020]. Событие должно содержать абсурдные элементы, но звучать так, будто оно действительно произошло. Избегай повторения тем восстаний, маршей и войн. Вместо этого акцентируй внимание на необычных культурных, научных, бытовых или мистических событиях. Включи известных людей той эпохи, которые могли быть вовлечены, и опиши всё с ноткой юмора. Текст должен содержать менее 1000 символов и быть сформирован так:

[Эмодзи, характеризующее событие] [День + название месяца] было "[Название события]" в [Год события]! [Эмодзи, характеризующее событие]

[Описание события, включающее необычные детали, например: еда, случайные изобретения, нелепые мистификации, странные культурные явления.] [Заверши текст своей реакцией на событие в одно предложение с добавлением эмодзи.]`
    },
    image: {
      en: `Create a brief request for generating an image as a list of tags without #, separated by commas, without text, in a Pixar-style colorful atmosphere with a greater focus on detail in the text describing the event: '${variable}'. Then translate the request into English. Send ONLY the request in English.`,
      ru: `Создай краткий запрос для генерации изображения в виде списка тегов без #, разделённых запятыми, без текста, в стиле Pixar с красочной атмосферой и большим вниманием к деталям в тексте, описывающем событие: '${variable}'. Потом переведи запрос на английский. Отправь ТОЛЬКО запрос на английском.`
    }
  }
  return txtbase;
}


export async function AboutDate(textDate, quality , lang)
{
  let text, imageUrl;
  await GenerateText(lang == 'en' ? tb(textDate).event.en : tb(textDate).event.ru)
        .then(message =>
          {
              text = message;
              return message;
          })
    .then(message => GenerateText(lang == 'en' ? tb(message).image.en : tb(message).image.ru))
        .then(prompt => GenerateImage(prompt, quality))
        .then(url => {
          imageUrl = url
        });
  return {
    url: imageUrl,
    text: text,
  }
}

export async function GenerateImage(promt, quality){
  promt = promt + (quality.includes('best') ? '' : 'Please do not add text, numbers, or letters to the image.');
  if (promt.length > 1000){
    promt = promt.slice(0,990);
  }
  console.log(promt)
  console.log();
  console.log('\n', quality)
  let imageP = {};
  if (quality.includes('best')) {
    imageP = { model: "dall-e-3", prompt: promt }
  } else if (quality.includes('good')) {
    imageP = { model: "dall-e-2", prompt: promt, size: "512x512" }
  } else {
    imageP = { model: "dall-e-2", prompt: promt, size: "256x256" }
  }
  const image = await openai.images.generate(imageP);
  console.log(image.data)
  return image.data[0].url;
}

export async function GenerateText(promt){


  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {
        "role": "user",
        "content": promt,
        "size": "256x256"
}
    ]
  });
  return completion.choices[0].message.content;
}







//Add menu

let [
  startMenu,
  pickMonthMenu,
  pickDayMenu,
  pickQualityMenu,
  submitMenu,
] = createAllMenus();
//Add plugins

//Create conversation
async function eventConv(conversation, ctx) {


  //Preparation
  await conversation.run(useFluent({
    fluent
  }))

  await conversation.external(
    () => {
      initAllMenus(ctx, 
        [
        startMenu,
        pickMonthMenu,
        pickDayMenu,
        pickQualityMenu,
        submitMenu,
      ])

      Object.assign(data,
        {
          isPicking: false,
          month: null, //String
          day: null, //Num
          type: null //String
        })
    }
  )

  //Conv
  const menu = await ctx.reply(//Change menu to other
    ctx.t('event-start'),
    {
      parse_mode: "HTML",
      reply_markup: startMenu.keyboard,
    }
  )
  {
    const response = await conversation.waitForCallbackQuery(startMenu.options.flat());
    data.isPicking = true;
    if (response.match == 'today') {
      await conversation.external(() => [data.day, data.month] = getToday());
    }
  }



  do
  {
    if (!await conversation.external(() => data.isPicking)) 
    {
      await ctx.api.editMessageText(//Edit message
        menu.chat.id,
        menu.message_id,
        ctx.t('event-start'),
        {
          parse_mode: "HTML",
          reply_markup: startMenu.keyboard,
        }
      )

      const response = await conversation.waitForCallbackQuery(startMenu.options.flat());
      data.isPicking = true;
      if (response.match == 'today') {
        await conversation.external(() => [data.day, data.month] = getToday());
      }
    }

    else if (!await conversation.external(() => data.month))
    {
      await ctx.api.editMessageText(//Edit message
        menu.chat.id,
        menu.message_id,
        ctx.t('pick-month'),
        {
          parse_mode: "HTML",
          reply_markup: pickMonthMenu.keyboard,
        }
      )


      const response = await conversation.waitForCallbackQuery(pickMonthMenu.options.flat())
      await conversation.external(() => {
        if (response.match == 'return') 
          {
          data.isPicking = false;
        }
        else{
          data.month = response.match;
          data.day = null;
        }
      })
    }

    else if (!await conversation.external(() => data.day)){
      await ctx.api.editMessageText(//Edit message
        menu.chat.id,
        menu.message_id,
        ctx.t('pick-day'),
        {
          parse_mode: "HTML",
          reply_markup: pickDayMenu.keyboard,
        }
      )
      const response = await conversation.waitFor(["callback_query:data","message"]);
      if (response?.update?.callback_query?.data == 'return') {
        await conversation.external(() =>{
          data.month = null;
          data.day = null;
        })
      }
      else if (response?.message) {
        await conversation.external(async () => {
          let day = +response.message.text;
          data.day = day;
          await conversation.sleep(100)
        })
        await ctx.api.deleteMessage(
          response.message.chat.id,
          response.message.message_id
        )
        await conversation.sleep(500);
      }      
    }

    else if (!await conversation.external(() => data.type)){
      await ctx.api.editMessageText(//Edit message
        menu.chat.id,
        menu.message_id,
        ctx.t('pick-quality'),
        {
          parse_mode: "HTML",
          reply_markup: pickQualityMenu.keyboard,
        }
      )
      const response = await conversation.waitForCallbackQuery(pickQualityMenu.options.flat())
      if (response.match == 'return') {
        await conversation.external(() => 
          data.day = null
        )
      } 
      else{
        await conversation.external(() => 
          data.type = response.match
        )
      }
    }
    else if (await conversation.external(() => true)) {
      await ctx.api.editMessageText(//Edit message
        menu.chat.id,
        menu.message_id,
        ctx.t('submit-menu',{
          freeAttempts: await conversation.external(() => Math.floor(Math.random()*3)),
          requiredTokens: (await conversation.external(() => data.type)).includes('best') ? 100 : 20
        }),
        {
          parse_mode: "HTML",
          reply_markup: submitMenu.keyboard,
        }
      )
      const response = await conversation.waitForCallbackQuery(submitMenu.options.flat())
      if(response.match == 'submit'){
        await conversation.external(() => data.isPicking = false);
        break;
      }
      else if(response.match == 'cancel'){
      await ctx.api.editMessageText(//Edit message
        menu.chat.id,
        menu.message_id,
        ctx.t('cancel-menu'),{
          parse_mode: "HTML"
        }
      )
        return;
      }
      else{
        await conversation.external(() => data.type = null)
      }
    }
    conversation.log(data);
  }while(
    await conversation.external(() => data.isPicking || !(data.day && data.month && data.type))
  )
  await conversation.log(data);
  await ctx.reply(ctx.t("wait"), {
    reply_parameters: { message_id: ctx.msg.message_id },
  })
  const event = await conversation.external(async () => {
    let ret
    try{
      ret = await AboutDate(`${data.day} ${data.month}`, data.type, ctx.from.language_code);
      return ret;
    }
    catch(e){
      conversation.log(e);
    }
  })
  if(event){
    await ctx.replyWithPhoto(event.url, {
      reply_parameters: { message_id: ctx.msg.message_id },
      caption: event.text,
    })
  }
  else{
    await ctx.reply(ctx.t('wrong'));
  }
  await conversation.external(
    () => {
      Object.assign(data,
        {
          isPicking: false,
          month: null, //String
          day: null, //Num
          type: null //String
        })
    }
  )
}

event.use(createConversation(eventConv));

event.command("event", async (ctx) => {
  await ctx.conversation.enter("eventConv");
});

export default event