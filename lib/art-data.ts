export interface Artwork {
  slug: string
  title: string
  medium: string
  category: "watercolor" | "digital" | "sketch"
  date: string
  dimensions: string
  image: string
  description?: string
}

export const artworks: Artwork[] = [
  {
    slug: "ho-xuan-huong",
    title: "Ho Xuan Huong",
    medium: "watercolor on paper",
    category: "watercolor",
    date: "2026-02-01",
    dimensions: "30x40cm",
    image: "/art/ho-xuan-huong.jpg",
    description:
      "Early morning at Ho Xuan Huong lake in Da Lat. The mist was sitting just above the water, and the pine trees on the far shore were barely visible. I set up on a bench near the flower garden and worked fast before the sun burned everything off. The reflections were the hardest part — getting the greens to feel soft without losing the shape of the trees.",
  },
  {
    slug: "saigon-rain",
    title: "Saigon Rain",
    medium: "digital (Procreate)",
    category: "digital",
    date: "2026-01-18",
    dimensions: "3840x2160px",
    image: "/art/saigon-rain.jpg",
    description:
      "District 1 during monsoon season. I took a reference photo from under an awning on Bui Vien and worked from that. The neon reflections on wet asphalt are what make Saigon at night so cinematic. Spent most of the time on the light bleeding effects and the motion blur on passing motorbikes.",
  },
  {
    slug: "old-quarter-sketch",
    title: "Old Quarter",
    medium: "graphite on paper",
    category: "sketch",
    date: "2026-01-10",
    dimensions: "21x29cm",
    image: "/art/old-quarter-sketch.jpg",
    description:
      "Sketched on location in Hanoi's Old Quarter. The tangle of power lines and the narrow shophouses create these incredible layers of depth. I used a 2B for the main structures and a 6B for the deep shadows in the alleyways. The woman with the conical hat walked through at just the right moment.",
  },
  {
    slug: "mekong-delta",
    title: "Mekong Delta",
    medium: "watercolor on paper",
    category: "watercolor",
    date: "2025-12-20",
    dimensions: "40x30cm",
    image: "/art/mekong-delta.jpg",
    description:
      "The floating markets of Can Tho. I worked from a combination of photos and memory. The challenge with watercolor here was the density of the vegetation — coconut palms everywhere, and the light filtering through them in patches. I let the colors bleed into each other more than usual to capture the humidity.",
  },
  {
    slug: "street-food-dusk",
    title: "Street Food at Dusk",
    medium: "digital (Procreate)",
    category: "digital",
    date: "2025-12-05",
    dimensions: "2560x1440px",
    image: "/art/street-food-dusk.jpg",
    description:
      "A composite scene inspired by street food stalls across Vietnam. The warm orange glow from the cooking fires against the cool blue twilight sky is a contrast I've always loved. The steam rising from the pho pots gives the whole scene a dreamy quality.",
  },
  {
    slug: "morning-coffee",
    title: "Morning Coffee",
    medium: "ink on paper",
    category: "sketch",
    date: "2025-11-15",
    dimensions: "15x20cm",
    image: "/art/morning-coffee.jpg",
    description:
      "A quick study of ca phe sua da — Vietnamese iced coffee with condensed milk. The phin filter is such a beautiful object. Simple, functional, meditative. Drew this at a coffee shop in Da Nang while waiting for my own cup to drip through.",
  },
]

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug)
}

export function getAllCategories(): string[] {
  const cats = new Set<string>()
  for (const art of artworks) {
    cats.add(art.category)
  }
  return Array.from(cats).sort()
}

export function getAdjacentArtworks(slug: string) {
  const index = artworks.findIndex((a) => a.slug === slug)
  return {
    previous: index > 0 ? artworks[index - 1] : null,
    next: index < artworks.length - 1 ? artworks[index + 1] : null,
  }
}
