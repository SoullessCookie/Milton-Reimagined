const quotes = [
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

export const getQuote = () => {
    const randomNumber = Math.floor(Math.random() * quotes.length);
    return quotes[randomNumber];
};

export const getAllQuotes = () => quotes;
