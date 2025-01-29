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

/* import menu, {createAllMenus, initAllMenus} from "./keyboards/compiler.js" */
//Create composer
const user = new Composer();

//Declare vars

/* const data = {
  isPicking: false,
  month: null,
  day: null,
  type: null
} */

//Declare funcs








//Add menu
/* 
let [
  startMenu,
  pickMonthMenu,
  pickDayMenu,
  pickQualityMenu,
  submitMenu,
] = createAllMenus(); */
//Add plugins

//Create conversation
async function userConv(conversation, ctx) {


  //Preparation
  await conversation.run(useFluent({
    fluent
  }))

  ctx.reply(//Change menu to other
    ctx.t('user'),
    {
      parse_mode: "HTML",
    }
  )
  return
}
user.use(createConversation(userConv));

user.command("user", async (ctx) => {
  await ctx.conversation.enter("userConv");
});

export default user