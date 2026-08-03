export type ArtworkImage = {
  src: string;
  width: number;
  height: number;
};

export type Artwork = {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  /** First image is the cover shown on the Works page. */
  images: ArtworkImage[];
};

/**
 * Catalogue generated from the Paintings folder.
 * Fill in year / medium / dimensions / description when ready.
 * Image paths and dimensions are driven by the imported files —
 * re-run `node scripts/import-paintings.mjs` after adding photos.
 */
export const artworks: Artwork[] = [
  {
    "id": "coke",
    "title": "Coke",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/coke/01.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/coke/02.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/coke/03.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/coke/04.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/coke/05.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/coke/06.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/coke/07.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/coke/08.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/coke/09.jpg",
        "width": 1800,
        "height": 1368
      }
    ]
  },
  {
    "id": "des-poissons",
    "title": "Des Poissons",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/des-poissons/01.jpg",
        "width": 1800,
        "height": 1505
      },
      {
        "src": "/works/des-poissons/02.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/des-poissons/03.jpg",
        "width": 1350,
        "height": 1800
      }
    ]
  },
  {
    "id": "deux-poissons",
    "title": "Deux Poissons",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/deux-poissons/01.jpg",
        "width": 1800,
        "height": 1402
      },
      {
        "src": "/works/deux-poissons/02.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/deux-poissons/03.jpg",
        "width": 1350,
        "height": 1800
      }
    ]
  },
  {
    "id": "fanta",
    "title": "Fanta",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/fanta/01.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/fanta/02.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/fanta/03.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/fanta/04.jpg",
        "width": 1800,
        "height": 1368
      }
    ]
  },
  {
    "id": "gold-ring",
    "title": "Gold Ring",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/gold-ring/01.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/gold-ring/02.jpg",
        "width": 1351,
        "height": 1800
      }
    ]
  },
  {
    "id": "kaniere",
    "title": "Kaniere",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/kaniere/01.jpg",
        "width": 1800,
        "height": 1800
      },
      {
        "src": "/works/kaniere/02.jpg",
        "width": 1800,
        "height": 1798
      },
      {
        "src": "/works/kaniere/03.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/kaniere/04.jpg",
        "width": 1800,
        "height": 1800
      },
      {
        "src": "/works/kaniere/05.jpg",
        "width": 1350,
        "height": 1800
      }
    ]
  },
  {
    "id": "liquid-rainbow",
    "title": "Liquid Rainbow",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/liquid-rainbow/01.jpg",
        "width": 1800,
        "height": 1800
      },
      {
        "src": "/works/liquid-rainbow/02.jpg",
        "width": 1800,
        "height": 1800
      }
    ]
  },
  {
    "id": "minecraft",
    "title": "Minecraft",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/minecraft/01.jpg",
        "width": 1800,
        "height": 1800
      },
      {
        "src": "/works/minecraft/02.jpg",
        "width": 1800,
        "height": 1800
      },
      {
        "src": "/works/minecraft/03.jpg",
        "width": 1800,
        "height": 1800
      },
      {
        "src": "/works/minecraft/04.jpg",
        "width": 1350,
        "height": 1800
      }
    ]
  },
  {
    "id": "orange-flow",
    "title": "Orange Flow",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/orange-flow/01.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/orange-flow/02.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/orange-flow/03.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/orange-flow/04.jpg",
        "width": 1601,
        "height": 1800
      }
    ]
  },
  {
    "id": "pebbles",
    "title": "Pebbles",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/pebbles/01.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/pebbles/02.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/pebbles/03.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/pebbles/04.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/pebbles/05.jpg",
        "width": 1350,
        "height": 1800
      }
    ]
  },
  {
    "id": "picnic",
    "title": "Picnic",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/picnic/01.jpg",
        "width": 1800,
        "height": 1350
      },
      {
        "src": "/works/picnic/02.jpg",
        "width": 1800,
        "height": 1350
      },
      {
        "src": "/works/picnic/03.jpg",
        "width": 1800,
        "height": 1350
      },
      {
        "src": "/works/picnic/04.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/picnic/05.jpg",
        "width": 1350,
        "height": 1800
      },
      {
        "src": "/works/picnic/06.jpg",
        "width": 1800,
        "height": 1350
      }
    ]
  },
  {
    "id": "purple-forest",
    "title": "Purple Forest",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/purple-forest/01.jpg",
        "width": 1800,
        "height": 1800
      },
      {
        "src": "/works/purple-forest/02.jpg",
        "width": 1350,
        "height": 1800
      }
    ]
  },
  {
    "id": "purple-wheel",
    "title": "Purple Wheel",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/purple-wheel/01.jpg",
        "width": 1402,
        "height": 1800
      }
    ]
  },
  {
    "id": "sprite",
    "title": "Sprite",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/sprite/01.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/sprite/02.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/sprite/03.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/sprite/04.jpg",
        "width": 1351,
        "height": 1800
      },
      {
        "src": "/works/sprite/05.jpg",
        "width": 1800,
        "height": 1368
      }
    ]
  },
  {
    "id": "sunset",
    "title": "Sunset",
    "year": 0,
    "medium": "[Medium]",
    "dimensions": "[Dimensions]",
    "description": "Placeholder text — a short note about this piece will go here.",
    "images": [
      {
        "src": "/works/sunset/01.jpg",
        "width": 1800,
        "height": 1799
      },
      {
        "src": "/works/sunset/02.jpg",
        "width": 1800,
        "height": 1800
      }
    ]
  }
];
