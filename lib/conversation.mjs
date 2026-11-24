// Exact conversational intents only: factual portfolio questions still use retrieval.
export function conversationalReply(question){
 const text=question.toLowerCase().trim().replace(/[!?.’,']/g,'').replace(/\s+/g,' ');
 if(/^(hello|hi|hey|hiya|salam|assalamualaikum)( doodle)?$/.test(text))return 'Hey! I’m Doodle, Hassan’s pencil companion. Ask me about his games, Blender work, skills, or awards. What would you like to explore?';
 if(/^(thanks|thank you|thank you doodle|thanks doodle)$/.test(text))return 'You’re welcome! There’s always another page to explore.';
 if(/^(help|what can you do|how can you help|who are you)$/.test(text))return 'I’m Doodle. I can help you explore Hassan’s projects, skills, education, and achievements, with links to the relevant chapters. Try “Which game won twice?”';
 return null;
}
