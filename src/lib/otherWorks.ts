export type OtherWork = {
  id: string;
  title: string;
  availableForPrint: boolean;
  src: string;
  width: number;
  height: number;
};

/**
 * Catalogue generated from the Drawings folder. Every source filename ends
 * in "-afp" (available for print) or "-nafp" (not available for print);
 * everything before that suffix becomes the title. Re-run
 * `node scripts/import-other-works.mjs` after adding, removing, or
 * renaming photos — it wipes and regenerates public/other-works from
 * scratch, so there's nothing hand-edited here to lose.
 */
export const otherWorks: OtherWork[] = [
  {
    "id": "art-nouveau",
    "title": "Art Nouveau",
    "availableForPrint": true,
    "src": "/other-works/art-nouveau-e7dc16b700.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "broken",
    "title": "Broken",
    "availableForPrint": false,
    "src": "/other-works/broken-5f564e15c4.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "bunny",
    "title": "Bunny",
    "availableForPrint": true,
    "src": "/other-works/bunny-cdce8ded7c.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "circle-girl",
    "title": "Circle Girl",
    "availableForPrint": false,
    "src": "/other-works/circle-girl-33d661000c.jpg",
    "width": 1617,
    "height": 1800
  },
  {
    "id": "corrupt",
    "title": "Corrupt",
    "availableForPrint": false,
    "src": "/other-works/corrupt-199615c079.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "dance",
    "title": "Dance",
    "availableForPrint": false,
    "src": "/other-works/dance-8b6ac0522a.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "demon",
    "title": "Demon",
    "availableForPrint": true,
    "src": "/other-works/demon-f0be2f40f1.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "eye",
    "title": "Eye",
    "availableForPrint": false,
    "src": "/other-works/eye-2adbbf84a2.jpg",
    "width": 1800,
    "height": 1495
  },
  {
    "id": "flower-girl",
    "title": "Flower Girl",
    "availableForPrint": false,
    "src": "/other-works/flower-girl-3bd3bb26a8.jpg",
    "width": 1800,
    "height": 1800
  },
  {
    "id": "glitch",
    "title": "Glitch",
    "availableForPrint": true,
    "src": "/other-works/glitch-cba71f2f4c.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "green-sweater",
    "title": "Green Sweater",
    "availableForPrint": true,
    "src": "/other-works/green-sweater-af87925d0e.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "inktober1",
    "title": "Inktober1",
    "availableForPrint": false,
    "src": "/other-works/inktober1-d2228363f5.jpg",
    "width": 1800,
    "height": 1800
  },
  {
    "id": "inktober2",
    "title": "Inktober2",
    "availableForPrint": false,
    "src": "/other-works/inktober2-3eea658a75.jpg",
    "width": 1800,
    "height": 1800
  },
  {
    "id": "inktober3",
    "title": "Inktober3",
    "availableForPrint": false,
    "src": "/other-works/inktober3-fd8ebcd309.jpg",
    "width": 1800,
    "height": 1800
  },
  {
    "id": "insanity",
    "title": "Insanity",
    "availableForPrint": true,
    "src": "/other-works/insanity-e2c80c5aea.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "kelly",
    "title": "Kelly",
    "availableForPrint": false,
    "src": "/other-works/kelly-034ef0dc81.jpg",
    "width": 1421,
    "height": 1800
  },
  {
    "id": "late-night",
    "title": "Late Night",
    "availableForPrint": true,
    "src": "/other-works/late-night-9e1845f39d.jpg",
    "width": 1800,
    "height": 1349
  },
  {
    "id": "lonely",
    "title": "Lonely",
    "availableForPrint": true,
    "src": "/other-works/lonely-ad5c03d71e.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "melt",
    "title": "Melt",
    "availableForPrint": true,
    "src": "/other-works/melt-58bf70747e.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "nature-girl",
    "title": "Nature Girl",
    "availableForPrint": false,
    "src": "/other-works/nature-girl-fa4d326b14.jpg",
    "width": 1447,
    "height": 1800
  },
  {
    "id": "nostalgia",
    "title": "Nostalgia",
    "availableForPrint": false,
    "src": "/other-works/nostalgia-8c10831b8b.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "once",
    "title": "Once",
    "availableForPrint": false,
    "src": "/other-works/once-068c469b9d.jpg",
    "width": 1350,
    "height": 1800
  },
  {
    "id": "raven",
    "title": "Raven",
    "availableForPrint": true,
    "src": "/other-works/raven-adbf9647aa.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "self-portrait-2021",
    "title": "Self Portrait 2021",
    "availableForPrint": false,
    "src": "/other-works/self-portrait-2021-fe3e322120.jpg",
    "width": 1259,
    "height": 1800
  },
  {
    "id": "shatter",
    "title": "Shatter",
    "availableForPrint": true,
    "src": "/other-works/shatter-92ca1a5e17.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "slice",
    "title": "Slice",
    "availableForPrint": true,
    "src": "/other-works/slice-3b96696036.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "snake",
    "title": "Snake",
    "availableForPrint": true,
    "src": "/other-works/snake-493967f44c.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "spade",
    "title": "Spade",
    "availableForPrint": true,
    "src": "/other-works/spade-4448b1fabf.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "star-girl",
    "title": "Star Girl",
    "availableForPrint": false,
    "src": "/other-works/star-girl-45aaa29d9a.jpg",
    "width": 1253,
    "height": 1800
  },
  {
    "id": "stuck-at-home",
    "title": "Stuck At Home",
    "availableForPrint": false,
    "src": "/other-works/stuck-at-home-f6b99ec6da.jpg",
    "width": 1800,
    "height": 1800
  },
  {
    "id": "tarot",
    "title": "Tarot",
    "availableForPrint": false,
    "src": "/other-works/tarot-1291e86f73.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "virus",
    "title": "Virus",
    "availableForPrint": true,
    "src": "/other-works/virus-c7cd4f1238.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "wild",
    "title": "Wild",
    "availableForPrint": false,
    "src": "/other-works/wild-27f40d19e2.jpg",
    "width": 1272,
    "height": 1800
  },
  {
    "id": "wise",
    "title": "Wise",
    "availableForPrint": true,
    "src": "/other-works/wise-a8367529f8.jpg",
    "width": 1272,
    "height": 1800
  }
];
