import { Menu } from "@grammyjs/menu"
function createMenu(monthHandler, returnHandler){
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
  return pickMonth
}
export default createMenu;