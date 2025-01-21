"use strict";
import 'dotenv/config';
import OpenAI from "openai";
const openai = new OpenAI();

function tb(varuable){
  let txtbase = {
    event: {
      en: `Imagine this is a real historical event that took place on ${varuable} [place year from medival age up to 2020].The event should be absurd and nonsensical, but it must sound plausible, as if it actually happened on that day.Include well - known figures from that era who could have been involved in the event and describe it as if it were a real historical fact. The text must contain fewer than 1000 characters. Generate the response in this format:
    [Event Characterization Emoji][Day + Month name] was "[Event Name]" in [Event Year]![Emoji characterizing the event]

    [Event Description][Give your text reaction to event in 1 sentence, use emoji too].`,

      ru: `Представь, что это настоящее историческое событие, которое произошло ${varuable} [укажи год от Средневековья до 2020]. Событие должно быть абсурдным и нелепым, но оно должно звучать правдоподобно, как если бы оно действительно произошло в этот день. Включи известных людей той эпохи, которые могли бы быть вовлечены в это событие, и опиши его так, как если бы это был реальный исторический факт. Текст должен содержать менее 1000 символов. Ответ должен быть сгенерирован в следующем формате:
    [Эмодзи, характеризующее событие] [День + название месяца] было "[Название события]" в [Год события]! [Эмодзи, характеризующее событие]

    [Описание события] [Добавь свою текстовую реакцию на событие используя одно предложение, используй также эмодзи].`
    },
    image: {
      en: `Create a short image promt as tag list without # separated by ',', without text at historical style to dalle-3 to genereate image that represent that historical event correctly: \n ${varuable}`,
      ru: `Создай краткий запрос для изображения в виде списка тегов без #, разделённых запятыми, без текста, в историческом стиле, чтобы DALL-E 3 мог сгенерировать изображение, которое правильно представляет это историческое событие: \n ${varuable}`
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
