pick-month =
    .title = 🌟 Select a Month
    .description = Choose a month to generate a <b>fun historical event</b>. 😊 
        Use the buttons below or go back if needed.

pick-day =
    .title = 📅 Select a Day
    .description = Type the day as a <b>number</b> in the chat to proceed. ✍️

pick-quality =
    .title = 🖼️ Select Image Quality
    .description = Choose the quality of the illustration of the event:
        - 🌟 <b>Best</b> (requires tokens or a subscription)
        - 👍 <b>Good</b> (requires tokens or a subscription)
        - 🙂 <b>Normal</b> (free)

submit-menu =
    .title = ✅ Confirm Event Creation
    .description =
        { $freeAttempts ->
            [0] 😞 No free attempts remaining. 
                This will use <b>{ $requiredTokens }</b> tokens.
           *[other] 🎉 You have <b>{ $freeAttempts }</b> free attempts remaining.
        }
        Do you want to proceed with creating the event? 🤔

event-start =
    .title = 🎉 Event Creation
    .description = Let’s create a unique historical event together! 🕰️
        I suggest choosing a date, you can choose <b>today</b>, or <b>select date</b> and enter it ✍️
