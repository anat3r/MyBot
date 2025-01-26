"use strict";
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
