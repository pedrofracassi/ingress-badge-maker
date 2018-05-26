const Telegram = require('node-telegram-bot-api')
const Jimp = require('jimp')

if (!process.env.TELEGRAM_TOKEN) {
  console.error('TELEGRAM_TOKEN environment variable is missing. Can\'t start.')
  process.exit(0)
}
const bot = new Telegram(process.env.TELEGRAM_TOKEN, {polling: true})

bot.on('message', async (msg) => {
  console.log(msg)
  if(msg.photo) {
    bot.sendChatAction(msg.chat.id, 'upload_photo').catch(console.error)
    const {file_path} = await bot.getFile(msg.photo[msg.photo.length - 1].file_id)
    const foreground = await Jimp.read('./assets/resistance_foreground.png')
    const background = await Jimp.read('./assets/resistance_background.png')
    const profilePic = await Jimp.read(`https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file_path}`)
    profilePic.posterize(5)
    profilePic.resize(710, 710)
    profilePic.color([
      { apply: 'desaturate', params: [ 100 ] },
      { apply: 'darken', params: [ 20 ] },
      { apply: 'blue', params: [ 100 ] },
      { apply: 'green', params: [ 50 ]},
      { apply: 'red', params: [ 20 ]}
    ])
    background.composite(profilePic, 125, 125)
    background.composite(foreground, 0, 0)
    background.getBuffer('image/png', (err, buffer) => {
      bot.sendPhoto(msg.chat.id, buffer)
    })
  }
})

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Hi! I'm the IBMB.\nSend me any photo to start. (Square ones are recommended.)").catch(console.log)
})

bot.onText(/\/makebadge/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Nope, this command isn't necessary anymore. Try sending me a photo instead").catch(console.log)
})