"use strict";
import 'dotenv/config';
import OpenAI from "openai";
const openai = new OpenAI();

function tb(variable){
  let txtbase = {
    event: {
      en: `Imagine this is a real historical event that happened in ${variable} [specify a year from the Middle Ages to 2020]. The event should contain absurd elements but sound like it could have actually happened. Avoid repeating themes of uprisings, marches, or wars. Instead, focus on unusual cultural, scientific, everyday, or mystical events. Include well-known figures from that era who could have been involved, and describe everything with a touch of humor. The text should be under 1000 characters and follow this format:

[Emoji representing the event] [Day + month name] was "[Event Name]" in [Event Year]! [Emoji representing the event]

[Description of the event, including unusual details, such as food, random inventions, absurd mystifications, strange cultural phenomena.] [End the text with a short, emotional reaction using an emoji.]`,

      ru: `Представь, что это настоящее историческое событие, которое произошло ${variable} [укажи год от Средневековья до 2020]. Событие должно содержать абсурдные элементы, но звучать так, будто оно действительно произошло. Избегай повторения тем восстаний, маршей и войн. Вместо этого акцентируй внимание на необычных культурных, научных, бытовых или мистических событиях. Включи известных людей той эпохи, которые могли быть вовлечены, и опиши всё с ноткой юмора. Текст должен содержать менее 1000 символов и быть сформирован так:

[Эмодзи, характеризующее событие] [День + название месяца] было "[Название события]" в [Год события]! [Эмодзи, характеризующее событие]

[Описание события, включающее необычные детали, например: еда, случайные изобретения, нелепые мистификации, странные культурные явления.] [Заверши текст своей реакцией на событие в одно предложение с добавлением эмодзи.]`
    },
    image: {
      en: `Create a short image promt as tag list without # separated by ',', without text at historical style to dalle-3 to genereate image that represent that historical event correctly: \n ${variable}`,
      ru: `Создай краткий запрос для изображения в виде списка тегов без #, разделённых запятыми, без текста, в историческом стиле, чтобы DALL-E 3 мог сгенерировать изображение, которое правильно представляет это историческое событие: \n ${variable}`
    }
  }
  return txtbase;
}


export async function AboutDate(textDate, lang)
{
  let text, imageUrl;

  await GenerateText(lang == 'en' ? tb(textDate).event.en : tb(textDate).event.ru)
        .then(message =>
          {
              text = message;
              return message;
          })
    .then(message => GenerateText(lang == 'en' ? tb(message).image.en : tb(message).image.ru))
        .then(promt => GenerateImage(promt))
        .then(url => {
          imageUrl = url
        });
  return {
    url: imageUrl,
    text: text,
  }
}

export async function GenerateImage(promt){
  console.log(promt)
  const image = await openai.images.generate({ model: "dall-e-3", prompt: `${promt}` });
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
