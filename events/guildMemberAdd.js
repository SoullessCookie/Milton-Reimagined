const { Client, Events, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution] });
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');


const applyText = (canvas, text) => {
  const context = canvas.getContext('2d');

  // Declare a base size of the font
  let fontSize = 70;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `${fontSize -= 10}px sans-serif`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return context.font;
};


module.exports = {
  name: Events.GuildMemberAdd,
  async execute(guildMemberAdd) {
    const { guild, user } = guildMemberAdd;

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('./wallpaper.jpg');

    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set the color of the stroke
    context.strokeStyle = '#0099ff';

    // Draw a rectangle with the dimensions of the entire canvas
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Add an exclamation point here and below
    context.font = applyText(canvas, `${user.username}!`);
    context.fillStyle = '#ffffff';
    context.fillText(`${user.username}!`, canvas.width / 2.5, canvas.height / 1.8);

    // Assign the decided font to the canvas
    context.font = applyText(canvas, user.username);
    context.fillStyle = '#ffffff';
    context.fillText(user.username, canvas.width / 2.5, canvas.height / 1.8);

    // Pick up the pen
    context.beginPath();

    // Start the arc to form a circle
    context.arc(125, 125, 100, 0, Math.PI * 2, true);

    // Put the pen down
    context.closePath();

    // Clip off the region you drew on
    context.clip();

    const avatarURL = user.displayAvatarURL({ format: 'jpg', dynamic: true }); // Get the avatar URL
    const avatarUrlObj = new URL(avatarURL); // Convert the URL string to a URL object

    try {
      // Using undici to make HTTP requests for better performance
      const { body } = await request(avatarUrlObj);
      const avatar = await Canvas.loadImage(await body.arrayBuffer());

      // Draw a shape onto the main canvas
      context.drawImage(avatar, 25, 25, 200, 200);

      // Retrieve user's level and balance from your data source (e.g., database)
      const userLevel = 10 //await getUserLevel(user.id);
      const userBalance = 10 //await getUserBalance(user.id);

      // Add user's level and balance text underneath the name
      context.font = '20px Arial'; // Use a nicer font here
      context.fillStyle = '#ffffff';
      context.fillText(`Level: ${userLevel}`, canvas.width / 2.5, canvas.height / 1.5);
      context.fillText(`Balance: ${userBalance}`, canvas.width / 2.5, canvas.height / 1.3);

      // Use the helpful Attachment class structure to process the file for you
      const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

      client.channels.fetch('1133160904838615052')
        .then(channel => channel.send({ files: [attachment] }));
    } catch (error) {
      console.error('Error sending embed:', error);
    }
  },
};

client.login(process.env.token);