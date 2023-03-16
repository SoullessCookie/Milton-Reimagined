const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const saul = [
  'Clearly, his taste in women is the same as his taste in lawyers.',
  'You two suck at peddling meth.',
  'Don\'t drink and drive but if you do, call me.',
  'Congratulations, you’ve just left your family a second-hand Subaru.',
  'Better call Saul!',
  'I’m not saying it’s not bad. It’s bad. But it could be worse.',
  'Clearly, his taste in women is the same as his taste in lawyers.',
  'What Did You Expect? Haji\'s Quick Vanish?Walt Told Me You Took A Run At This Bogdan Character, And He Wrestled You Into Submission With His Eyebrows.',
  'Did The Academy Hire You Right Out Of The Womb? You Guys Get Younger And Younger Every Year. We Have Laws, Detective, Have Your Kindergarten Teacher Read Them To You.',
  'Congratulations! You\'re Now Officially The Cute One Of The Group.',
  'If You\'re Committed Enough, You Can Make Any Story Work. I Once Convinced A Woman I Was Kevin Costner, And It Worked, Because I Believed It!',
  'Look, Let’s Start With Some Tough Love, All Right? Ready For This? Here Goes: You Two Suck At Peddling Meth. Period.',
  'If I Ever Get Anal Polyps, At Least I Know What To Name Them.',
  'He Said He\'ll Break My Legs, And Don’t Tell Me He Didn’t Mean It... He Gave Me The Dead Mackerel Eyes.',
  'You pulled that heartstrings con job on me?! You piece of shit! ‘Oh, my brain used to work, I’m sick, I don’t know what to do!’ Asshole! No wonder Rebecca left you! What took her so long?!',
];
const walter = [
  'No more half measures.',
  'I am not in danger, I am the danger.',
  'I\'ve got your restraining order right here. [grabs crotch] Restrain this!',
  'Who are you talking to right now? Who is it you think you see? Do you know how much I make a year? I mean, even if I told you, you wouldn\'t believe it. Do you know what would happen if I suddenly decided to stop going into work? A business big enough that it could be listed on the NASDAQ goes belly up. Disappears. It ceases to exist, without me. No, you clearly don\'t know who you\'re talking to, so let me clue you in. I am not in danger, Skyler. I AM the danger. A guy opens his door and gets shot, and you think that of me? No! I am the one who knocks!',
  'I watched Jane die. I was there. And I watched her die.',
  'I did it for me. I liked it. I was good at it. And... I was really... I was alive.',
  'Never give up control.',
  'Is this just a genetic thing with you? Is it congenital? Did your, did your mother drop you on your head when you were a baby?',
  'You brought a meth lab to the airport?',
  'Smoking marijuana, eating Cheetos and masturbating do not constitute \'plans\' in my book.',
  'I have spent my whole life scared. Frightened of things that could happen; might happen; might not happen. 50 years I\'ve spent like that. Finding myself awake at 3am. But you know what? Ever since my diagnosis, I sleep just fine. I came to realize it\'s that fear is the worst of it, that\'s the real enemy. So, get up, get out in the real world and you kick that bastard as hard as you can, right in the teeth.',
  'If that\'s true... If you don\'t know who I am, then... maybe your best course would be to tread lightly.',
];
const jesse = [
  'So you do have a plan? Yeah, Mr. White! Yeah, science!',
  'Nah, come on man. Some straight like you, giant stick up his ass at like what, sixty, he\'s just gonna break bad?',
  'I\'m a blowfish, yo!',
  'Yeah, b*tch!',
  'Blowfish this up.',
  'Yo kiss my pink ass man. I didn\'t ask for any of this. Alright how am I supposed to live here now huh? My whole house smells like toe cheese and dry cleaning.',
  'Oh, well heil Hitler b*tch and let me tell you something else. We flipped a coin. OK, you and me. You and me. Coin flip is sacred. Your job is waiting for you in that basement, as per the coin. F***ing do it already.',
  'Yo, yo, yo! 1-4-8-3 to the 3 to the 6 to the 9. representin\' the ABQ. What up, Biatch? Leave at the tone.',
  'I left them right here. In the, um... the ignition.',
  'Whoa whoa. No, this is not my fault, alright? The buzzer didn\'t buzz.',
  'The buzzer! The buzzer that buzzes when you put the keys in. To like let you know that the battery\'s on. I know that! It didn\'t buzz. Look, I didn\'t turn the key or anything, alright? I\'m not stupid. Did you hear the buzzer buzz? I did not... It\'s faulty, it\'s a faulty mechanism.',
  'I got two dudes that turned into raspberry slushie then flushed down my toilet. I can\'t even take a proper dump in there. I mean, the whole damn house has got to be haunted by now.',
  'Y\'know Mr. White. I can\'t even PRONOUNCE half this sh*t!',
  'Yo, I thought I was gonna see some, like, vaginas.',
  'You don\'t want a criminal lawyer... you want a "criminal" lawyer,',
];
const mike = [
  'nah',
];
const hank = [
  'So, why did the little hair-gel sh*t leave his car? Aye yi yi, Gomey. It\'s a culture in decline.',
  'It\'s a car that jumps up and down. What the hell, you people used to be conquistadors for Christ sake. Smells like a Drakkar Noir factory in here.',
  'Oh yeah? You are talking to the trap car master my friend. I\'m rain man counting his toothpicks.',
  'Pain is my foot in your ass, Marie.',
  'That call I got telling me Marie was in the hospital... that wasn\'t Pinkman. You had my cell number. You killed ten witnesses to save your sorry ass. You bombed a nursing home! Heisenberg... Heisenberg! You lying two-faced sack of sh*t!',
  'I walked 16 feet in 20 minutes. Which is up from like 15 1/2 yesterday. And I had maybe *this much* less sh*t in my pants, so yeah Marie, if you and him everybody else in America secretly took a vote, and changed the meaning of the entire English language, yeah, I guess I "broke new ground."',
  'I\'m *bidding* on a new *mineral.*',
];
const skylar = [
  'Walter, if I have to hear one more f***ing time that you did it for the family...',
];


module.exports = {
  data: new SlashCommandBuilder()
    .setName('bbquote')
    .setDescription('Sends a random Breaking Bad quote from a character.')
    .addStringOption(option =>
      option.setName('character')
        .setDescription('Select an option')
        .setRequired(true)
        .addChoices(
          { name: 'Saul Goodman', value: 'saul' },
          { name: 'Walter White', value: 'walter' },
          { name: 'Jesse Pinkman', value: 'jesse' },
          { name: 'Mike Ehrmantraut', value: 'mike' },
          { name: 'Hank Shrader', value: 'hank' },
          { name: 'Skylar White', value: 'skylar' },

        )),
  async execute(interaction) {

    const choice = interaction.options.getString('character');

    switch (choice) {
      case 'saul':
        const getQuoteSaul = () => {
          const randomNumber = Math.floor(Math.random() * saul.length);
          return saul[randomNumber];
        };
        message = `${getQuoteSaul()}`;
        break;
      case 'walter':
        const getQuoteWalter = () => {
          const randomNumber = Math.floor(Math.random() * walter.length);
          return walter[randomNumber];
        };
        message = `${getQuoteWalter()}`;
        break;
      case 'jesse':
        const getQuoteJesse = () => {
          const randomNumber = Math.floor(Math.random() * jesse.length);
          return jesse[randomNumber];
        };
        message = `${getQuoteJesse()}`;
        break;
      case 'mike':
        const getQuoteMike = () => {
          const randomNumber = Math.floor(Math.random() * mike.length);
          return mike[randomNumber];
        };
        message = `${getQuoteMike()}`;
        break;
      case 'hank':
        const getQuoteHank = () => {
          const randomNumber = Math.floor(Math.random() * hank.length);
          return hank[randomNumber];
        };
        message = `${getQuoteHank()}`;
        break;
      case 'skylar':
        const getQuoteSkylar = () => {
          const randomNumber = Math.floor(Math.random() * skylar.length);
          return skylar[randomNumber];
        };
        message = `${getQuoteSkylar()}`;
        break;
      default:
        message = 'Invalid option selected.';
    }

    const embed = new EmbedBuilder()
      .setColor('#ac6f17')
      .setTitle(`Breaking Bad Quote`)
      .addFields({ name: ' ', value: `${message}` })
      .setTimestamp()

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: 'An error occurred', ephemeral: true });
    }

  }
};