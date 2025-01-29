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
import { AboutDate } from "./util/generate.js";
import { useFluent } from "@grammyjs/fluent";
import fluent from "../../local.js";
import { getToday } from "./util/utilities.js";

import menu, {createAllMenus, initAllMenus} from "./keyboards/compiler.js"
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