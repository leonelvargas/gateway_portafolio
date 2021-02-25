const { Telegraf } = require('telegraf');
var cat = 'hola'


//Credenciales Telegraf
const bot = new Telegraf('1544840759:AAEP75CoR6za0QtXmcj_o2DbUZ2H2vfEtXY');


///////////////////////////////////////////////////////////////
///////////////////////Telegram Code//////////////////////////
/////////////////////////////////////////////////////////////

bot.on('text', ctx => {
  console.log(ctx.message)
  ctx.reply(cat);
});

bot.launch();
