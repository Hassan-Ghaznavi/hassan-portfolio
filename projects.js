export const projects = [
  {
    id: 'paper-dash',
    title: 'Paper Plane Dash',
    tools: 'Unreal Engine 5 · Blender',
    role: 'Lead developer · Team project',
    contribution: 'I designed the lane switching, banking, and flight-energy mechanics for our endless flyer.',
    overview: 'Pilot a paper plane through an oversized house. Dodge everyday obstacles and collect energy to keep flying.',
    designNote: {
      title: 'Every detour costs energy.',
      text: 'Flight energy drains over time. Pickups refill it, so you have to steer around obstacles while choosing when to change lanes for a refill.'
    },
    cover: {
      src: 'assets/paper-plane-dash.webp',
      alt: 'Graphite illustration of a paper plane banking around an oversized coffee mug.'
    },
    demo: '#flight',
    chapterLabel: '02 / Flight notes',
    rule: 'A house is not a flight path.',
    correction: 'Depends on your scale.',
    youtubeId: 'OQCn7CIqIlI',
    mechanics: [
      { title: 'Choose a lane', text: 'Lane switching gives the player a way to dodge household obstacles and reach energy pickups.' },
      { title: 'Bank into the turn', text: 'Banking makes the paper plane respond visibly to steering, connecting input to the feeling of flight.' },
      { title: 'Keep the flight alive', text: 'A draining energy supply gives each pickup a purpose and keeps the player making route decisions.' }
    ]
  },
  {
    id: 'two-lights',
    title: 'Two Lights One Escape',
    tools: 'Unity · C# · Blender',
    role: 'Gameplay developer · Team project',
    contribution: 'Implemented gameplay and light-based puzzle interactions for a split-screen co-op adventure. The team won at GameCon and at the project evaluation.'
  },
  {
    id:'behind-smile', collection:'more', title:'Behind the Smile',
    tools:'Global Game Jam 2026 · CEGA Karachi', role:'Co-developer · Team project',
    overview:'Built together during Global Game Jam 2026.',
    contribution:'A game jam collaboration at the CEGA Karachi site. Watch our submitted project in motion.',
    youtubeId:'jPcsgKAHYAY', motif:'smile'
  },
  {
    id:'blender-studies', collection:'more', title:'The render room',
    tools:'Blender · 3D studies', role:'3D modeling & environment art',
    overview:'A different side of the work: atmosphere, materials, and composition.',
    contribution:'A collection of environment and object renders from my 3D work.',
    films:[
      {id:'cave',title:'Cave Scene',note:'A camera journey through a rocky, atmospheric cave.',motif:'crystal'},
      {id:'ocean',title:'Stormy Ocean',note:'Rolling water, a warning light, and a storm on the horizon.',motif:'buoy'},
      {id:'airpods',title:'AirPods',note:'An animated product study with opening, floating forms and color changes.',motif:'earbuds'}
    ],
    studies:[
      {id:'forest',title:'Forest environment',note:'Light, foliage, and atmosphere.'},
      {id:'perfume',title:'Product study',note:'A bottle, a surface, a lighting setup.'},
      {id:'cube',title:"Rubik's cube study",note:'Form, color, and a moment of balance.'}
    ]
  }
].sort((a,b)=>(a.id==='two-lights'?-1:b.id==='two-lights'?1:0));
