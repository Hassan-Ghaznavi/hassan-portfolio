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
    chapterLabel: '01 / Flight notes',
    rule: 'A house is not a flight path.',
    correction: 'Depends on your scale.',
    mediaPending: true,
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
    contribution: 'Implemented gameplay and light-based puzzle interactions for a split-screen co-op adventure. The team placed first at GameCon 25.'
  }
];
