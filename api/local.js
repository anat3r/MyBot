import { Fluent } from "@moebius/fluent";
const fluent = new Fluent();
import * as path from 'path';
let locales = ['main.ftl', 'menu.ftl','variables.ftl'];
let langs = ['en','ru'];


langs.forEach(async (lang) =>
  {
  await fluent.addTranslation({
    locales: lang,
    filePath: locales.map((file) => path.resolve('./locales', lang, file)),
    bundleOptions: {
      // Use this option to avoid invisible characters around placeables.
      useIsolating: false,
    },
  });
})
export default fluent;