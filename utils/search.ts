import type { ProductWithDetails } from "@/types/database";

/**
 * Daftar kata kunci tren & rekomendasi utama yang dijamin memiliki produk di Jovique.
 */
export const DEFAULT_TRENDING_KEYWORDS = [
  "Kaos Polos",
  "Kemeja Linen",
  "Jaket Denim",
  "Celana Chino",
  "Sepatu Sneakers",
  "Tas & Aksesoris",
  "Hoodie",
  "Nike Dunk",
];

export interface SynonymDefinition {
  categories?: string[];
  terms?: string[];
  description?: string;
}

/**
 * Kamus Sinonim Pencarian (Bahasa Indonesia <-> Istilah Katalog Fashion Jovique)
 */
export const SYNONYM_MAP: Record<string, SynonymDefinition> = {
  // =========================================================================
  // 1. KAOS / TEE / POLO / ATASAN CASUAL
  // =========================================================================
  kaos: {
    categories: ["t-shirts-polos"],
    terms: ["tee", "t-shirt", "tshirt", "polo", "boxy", "breton"],
    description: "Koleksi Kaos & T-Shirt",
  },
  "kaos polos": {
    categories: ["t-shirts-polos"],
    terms: ["boxy tee", "pocket tee", "tee", "vintage washed"],
    description: "Kaos Polos & Basic Tee",
  },
  "kaos oversized": {
    categories: ["t-shirts-polos"],
    terms: ["boxy tee", "oversized", "graphic tee"],
    description: "Kaos Oversized Jovique",
  },
  "kaos pria": {
    categories: ["t-shirts-polos"],
    terms: ["tee", "t-shirt", "polo", "boxy"],
  },
  oblong: {
    categories: ["t-shirts-polos"],
    terms: ["tee", "t-shirt", "boxy"],
  },
  tee: {
    categories: ["t-shirts-polos"],
    terms: ["tee", "t-shirt", "boxy"],
  },
  tshirt: {
    categories: ["t-shirts-polos"],
    terms: ["tee", "t-shirt"],
  },
  "t-shirt": {
    categories: ["t-shirts-polos"],
    terms: ["tee", "t-shirt"],
  },
  polo: {
    categories: ["t-shirts-polos"],
    terms: ["polo", "knit polo", "open-collar"],
    description: "Polo Knit & Casual",
  },

  // =========================================================================
  // 2. KEMEJA / SHIRTS / FLANNEL / FORMAL
  // =========================================================================
  kemeja: {
    categories: ["shirts-flannels"],
    terms: ["shirt", "flannel", "oxford", "camp shirt", "overshirt", "viscose", "linen"],
    description: "Koleksi Kemeja & Flannel",
  },
  "kemeja pria": {
    categories: ["shirts-flannels"],
    terms: ["shirt", "flannel", "oxford", "camp shirt", "overshirt"],
  },
  "kemeja linen": {
    categories: ["shirts-flannels"],
    terms: ["riviera", "linen", "camp shirt"],
    description: "Kemeja Linen Santai",
  },
  "kemeja polos": {
    categories: ["shirts-flannels"],
    terms: ["oxford", "linen", "camp shirt"],
  },
  flanel: {
    categories: ["shirts-flannels"],
    terms: ["flannel", "plaid", "northwest"],
    description: "Kemeja Flannel Hangat",
  },
  flannel: {
    categories: ["shirts-flannels"],
    terms: ["flannel", "plaid", "northwest"],
    description: "Kemeja Flannel",
  },
  oxford: {
    categories: ["shirts-flannels"],
    terms: ["oxford", "ocbd", "button-down", "heritage"],
    description: "Kemeja Oxford Formal-Casual",
  },
  shirt: {
    categories: ["shirts-flannels"],
    terms: ["shirt", "overshirt", "camp shirt"],
  },

  // =========================================================================
  // 3. BAJU / PAKAIAN / ATASAN UMUM
  // =========================================================================
  baju: {
    categories: ["t-shirts-polos", "shirts-flannels", "jackets-outerwear"],
    terms: ["tee", "shirt", "jacket", "hoodie", "polo", "flannel", "bomber", "overshirt"],
    description: "Seluruh Koleksi Atasan & Busana",
  },
  pakaian: {
    categories: ["t-shirts-polos", "shirts-flannels", "jackets-outerwear", "pants-denim"],
    terms: ["tee", "shirt", "jacket", "trousers", "denim", "hoodie"],
  },
  atasan: {
    categories: ["t-shirts-polos", "shirts-flannels", "jackets-outerwear"],
    terms: ["tee", "shirt", "jacket", "hoodie", "polo", "flannel"],
  },
  busana: {
    categories: ["t-shirts-polos", "shirts-flannels", "jackets-outerwear", "pants-denim"],
    terms: ["tee", "shirt", "jacket", "trousers", "denim"],
  },
  outfit: {
    categories: ["t-shirts-polos", "shirts-flannels", "jackets-outerwear", "pants-denim"],
    terms: ["tee", "shirt", "jacket", "trousers"],
  },

  // =========================================================================
  // 4. JAKET / OUTERWEAR / HOODIE
  // =========================================================================
  jaket: {
    categories: ["jackets-outerwear"],
    terms: ["jacket", "bomber", "windbreaker", "hoodie", "chore", "trucker", "outerwear"],
    description: "Koleksi Jaket & Luaran",
  },
  "jaket pria": {
    categories: ["jackets-outerwear"],
    terms: ["jacket", "bomber", "windbreaker", "hoodie", "chore", "trucker"],
  },
  "jaket denim": {
    categories: ["jackets-outerwear"],
    terms: ["raw indigo", "trucker jacket", "denim trucker"],
    description: "Jaket Denim Trucker 14oz",
  },
  "jaket bomber": {
    categories: ["jackets-outerwear"],
    terms: ["flight bomber", "stealth satin", "ma-1", "bomber"],
    description: "Jaket Bomber MA-1",
  },
  outer: {
    categories: ["jackets-outerwear", "shirts-flannels"],
    terms: ["jacket", "overshirt", "bomber", "windbreaker", "hoodie", "chore"],
  },
  outerwear: {
    categories: ["jackets-outerwear"],
    terms: ["jacket", "bomber", "windbreaker", "hoodie", "chore", "trucker"],
    description: "Koleksi Outerwear Jovique",
  },
  hoodie: {
    categories: ["jackets-outerwear"],
    terms: ["hoodie", "sculpted", "boxy hoodie"],
    description: "Hoodie 420 GSM Boxy",
  },
  bomber: {
    categories: ["jackets-outerwear"],
    terms: ["bomber", "flight bomber", "ma-1", "satin"],
    description: "Flight Bomber MA-1",
  },
  windbreaker: {
    categories: ["jackets-outerwear"],
    terms: ["windbreaker", "ripstop", "altitude"],
    description: "Technical Windbreaker",
  },

  // =========================================================================
  // 5. CELANA / PANTS / DENIM / CHINO / CARGO
  // =========================================================================
  celana: {
    categories: ["pants-denim"],
    terms: ["trousers", "pants", "denim", "chino", "chinos", "cargo", "selvedge", "pleated"],
    description: "Koleksi Celana & Bawahan",
  },
  "celana panjang": {
    categories: ["pants-denim"],
    terms: ["trousers", "pants", "denim", "chino", "cargo", "selvedge"],
  },
  "celana chino": {
    categories: ["pants-denim"],
    terms: ["chinos", "chino", "bayside", "trousers"],
    description: "Celana Chino & Trousers",
  },
  chino: {
    categories: ["pants-denim"],
    terms: ["chinos", "chino", "bayside"],
    description: "Celana Chino Santai",
  },
  chinos: {
    categories: ["pants-denim"],
    terms: ["chinos", "chino", "bayside"],
  },
  "celana cargo": {
    categories: ["pants-denim"],
    terms: ["cargo", "parachute", "tactical"],
    description: "Celana Cargo Parachute",
  },
  cargo: {
    categories: ["pants-denim"],
    terms: ["cargo", "parachute", "tactical"],
    description: "Celana Cargo & Tactical",
  },
  "celana denim": {
    categories: ["pants-denim"],
    terms: ["selvedge", "denim", "redline"],
    description: "Celana Denim Selvedge",
  },
  jeans: {
    categories: ["pants-denim"],
    terms: ["selvedge", "denim", "redline"],
    description: "Celana Jeans & Selvedge Denim",
  },
  denim: {
    categories: ["pants-denim", "jackets-outerwear"],
    terms: ["denim", "selvedge", "trucker", "redline"],
    description: "Koleksi Selvedge Denim & Trucker",
  },
  bawahan: {
    categories: ["pants-denim"],
    terms: ["trousers", "pants", "denim", "chino", "cargo"],
  },
  trousers: {
    categories: ["pants-denim"],
    terms: ["trousers", "pleated", "wide trousers", "atelier"],
  },

  // =========================================================================
  // 6. SEPATU / SNEAKERS / FOOTWEAR / SANDAL / LOAFER
  // =========================================================================
  sepatu: {
    categories: ["footwear-sandals"],
    terms: ["sneaker", "runner", "loafers", "sandals", "slide", "mule", "clog", "dunk", "shoes", "velocity"],
    description: "Koleksi Sepatu & Alas Kaki",
  },
  "sepatu pria": {
    categories: ["footwear-sandals"],
    terms: ["sneaker", "runner", "dunk", "court classic", "velocity", "loafers"],
  },
  "sepatu sneakers": {
    categories: ["footwear-sandals"],
    terms: ["sneaker", "runner", "dunk", "court classic", "velocity", "nike"],
    description: "Koleksi Sneakers & Running",
  },
  sneakers: {
    categories: ["footwear-sandals"],
    terms: ["sneaker", "runner", "dunk", "court classic", "velocity", "nike"],
    description: "Sneakers Court & Runner",
  },
  sneaker: {
    categories: ["footwear-sandals"],
    terms: ["sneaker", "runner", "dunk", "court classic", "velocity"],
  },
  "sneakers pria": {
    categories: ["footwear-sandals"],
    terms: ["sneaker", "runner", "dunk", "court classic", "velocity"],
  },
  "alas kaki": {
    categories: ["footwear-sandals"],
    terms: ["sneaker", "runner", "loafers", "sandals", "slide", "mule", "shoes"],
  },
  sandal: {
    categories: ["footwear-sandals"],
    terms: ["sandals", "slide", "mule", "clog", "cork", "oasis"],
    description: "Sandal Cork Slide & Mules",
  },
  sandals: {
    categories: ["footwear-sandals"],
    terms: ["sandals", "slide", "mule", "clog", "cork", "oasis"],
  },
  loafer: {
    categories: ["footwear-sandals"],
    terms: ["loafers", "penny loafers", "lug-sole", "district"],
    description: "Penny Loafers Kulit",
  },
  loafers: {
    categories: ["footwear-sandals"],
    terms: ["loafers", "penny loafers", "lug-sole", "district"],
    description: "Penny Loafers Kulit",
  },

  // =========================================================================
  // 7. TAS / BAGS / TOTES / SLINGS
  // =========================================================================
  tas: {
    categories: ["accessories-headwear"],
    terms: ["bag", "tote", "sling", "crossbody", "shopper", "cordura"],
    description: "Koleksi Tas & Daily Carry",
  },
  "tas selempang": {
    categories: ["accessories-headwear"],
    terms: ["sling", "crossbody", "cordura"],
    description: "Tas Selempang Cordura",
  },
  "tote bag": {
    categories: ["accessories-headwear"],
    terms: ["tote", "shopper", "canvas tote", "utility"],
    description: "Canvas Tote Bag",
  },
  totebag: {
    categories: ["accessories-headwear"],
    terms: ["tote", "shopper", "canvas tote"],
  },
  "sling bag": {
    categories: ["accessories-headwear"],
    terms: ["sling", "crossbody", "cordura"],
    description: "Modular Sling Bag",
  },

  // =========================================================================
  // 8. TOPI / HEADWEAR / BEANIE
  // =========================================================================
  topi: {
    categories: ["accessories-headwear"],
    terms: ["cap", "dad cap", "beanie", "headwear"],
    description: "Topi & Headwear Jovique",
  },
  "topi baseball": {
    categories: ["accessories-headwear"],
    terms: ["cap", "dad cap", "washed cotton"],
    description: "Dad Cap Washed Cotton",
  },
  kupluk: {
    categories: ["accessories-headwear"],
    terms: ["beanie", "ribbed beanie", "harbor"],
    description: "Beanie Ribbed Rajut",
  },
  beanie: {
    categories: ["accessories-headwear"],
    terms: ["beanie", "ribbed beanie", "harbor"],
    description: "Harbor Ribbed Short Beanie",
  },
  cap: {
    categories: ["accessories-headwear"],
    terms: ["cap", "dad cap"],
  },

  // =========================================================================
  // 9. DOMPET / WALLETS
  // =========================================================================
  dompet: {
    categories: ["accessories-headwear"],
    terms: ["wallet", "card wallet", "veg-tan", "leather"],
    description: "Dompet Kartu Kulit Sapi Asli",
  },
  "dompet kartu": {
    categories: ["accessories-headwear"],
    terms: ["wallet", "card wallet", "veg-tan"],
    description: "Slim Veg-Tan Card Wallet",
  },
  wallet: {
    categories: ["accessories-headwear"],
    terms: ["wallet", "card wallet", "veg-tan"],
  },

  // =========================================================================
  // 10. AKSESORIS UMUM
  // =========================================================================
  aksesoris: {
    categories: ["accessories-headwear"],
    terms: ["cap", "beanie", "sling", "tote", "wallet"],
    description: "Seluruh Aksesoris & Perlengkapan",
  },
  aksesori: {
    categories: ["accessories-headwear"],
    terms: ["cap", "beanie", "sling", "tote", "wallet"],
  },
  "tas & aksesoris": {
    categories: ["accessories-headwear"],
    terms: ["bag", "tote", "sling", "wallet", "cap", "beanie"],
    description: "Tas, Topi & Aksesoris",
  },

  // =========================================================================
  // 11. WARNA (COLOR SYNONYMS)
  // =========================================================================
  hitam: { terms: ["black", "charcoal", "vintage black", "acid charcoal"] },
  putih: { terms: ["white", "chalk", "chalk white", "unbleached"] },
  biru: { terms: ["blue", "navy", "oxford blue", "indigo"] },
  hijau: { terms: ["green", "sage", "olive"] },
  abu: { terms: ["grey", "gray", "heather grey", "charcoal"] },
  "abu-abu": { terms: ["grey", "gray", "heather grey", "charcoal"] },
  cokelat: { terms: ["brown", "tobacco", "sand", "tan"] },
  coklat: { terms: ["brown", "tobacco", "sand", "tan"] },
  krem: { terms: ["beige", "sand", "chalk", "unbleached"] },

  // =========================================================================
  // 12. MATERIAL / BAHAN
  // =========================================================================
  katun: { terms: ["cotton", "combed cotton"] },
  cotton: { terms: ["cotton", "combed cotton"] },
  kulit: { terms: ["leather", "veg-tan", "full-grain"] },
  leather: { terms: ["leather", "veg-tan", "full-grain"] },
  linen: { terms: ["linen", "flax"] },
  kanvas: { terms: ["canvas", "duck canvas"] },
  canvas: { terms: ["canvas", "duck canvas"] },
  korduroi: { terms: ["corduroy", "wale corduroy"] },
  corduroy: { terms: ["corduroy", "wale corduroy"] },
  suede: { terms: ["suede"] },
  ripstop: { terms: ["ripstop", "nylon"] },
};

/**
 * Membersihkan dan menormalisasi teks kata kunci
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Mencari produk secara cerdas dengan skoring relevansi multi-tier:
 * 1. Exact Match pada nama produk (Skor tertinggi)
 * 2. Exact Match pada deskripsi, tagline, kategori, material, dan fit type
 * 3. Pemetaan Kamus Sinonim Bahasa Indonesia (Kaos, Baju, Celana, Sepatu, dll.)
 * 4. Token-by-token evaluation dengan multi-word boost
 * 5. Pengecekan varian warna (contoh: "kaos hitam", "sepatu putih")
 */
export function searchProducts<T extends ProductWithDetails>(
  products: T[],
  query: string
): T[] {
  if (!query || !query.trim()) return products;

  const rawQuery = normalizeQuery(query);
  if (!rawQuery) return products;

  const tokens = rawQuery.split(" ").filter((t) => t.length > 0);
  const directSynonym = SYNONYM_MAP[rawQuery];

  // Hitung skor relevansi untuk setiap produk
  const scoredItems = products
    .map((prod) => {
      let score = 0;
      const nameLower = (prod.name || "").toLowerCase();
      const taglineLower = (prod.tagline || "").toLowerCase();
      const descLower = (prod.description || "").toLowerCase();
      const categorySlug = prod.category?.slug || "";
      const categoryName = (prod.category?.name || "").toLowerCase();
      const materialsLower = (prod.materials || "").toLowerCase();
      const fitLower = (prod.fit_type || "").toLowerCase();
      const variantColors = (prod.product_variants || [])
        .map((v) => (v.color_name || "").toLowerCase())
        .join(" ");

      const fullSearchableText = `${nameLower} ${taglineLower} ${descLower} ${categoryName} ${materialsLower} ${fitLower} ${variantColors}`;

      // 1. EXACT FULL QUERY MATCH (Bonus Spesifik Nama Produk)
      if (nameLower === rawQuery) {
        score += 250;
      } else if (nameLower.startsWith(rawQuery)) {
        score += 180;
      } else if (nameLower.includes(rawQuery)) {
        score += 140;
      } else if (fullSearchableText.includes(rawQuery)) {
        score += 80;
      }

      // 2. DIRECT FULL-PHRASE SYNONYM MATCH
      if (directSynonym) {
        if (directSynonym.categories?.includes(categorySlug)) {
          score += 110;
        }
        for (const term of directSynonym.terms || []) {
          if (nameLower.includes(term)) {
            score += 70;
          } else if (fullSearchableText.includes(term)) {
            score += 35;
          }
        }
      }

      // 3. EVALUASI SETIAP KATA (TOKEN MATCHING)
      let matchedTokens = 0;
      for (const token of tokens) {
        let tokenMatched = false;

        // Cek langsung pada teks produk
        if (nameLower.includes(token)) {
          score += 50;
          tokenMatched = true;
        } else if (fullSearchableText.includes(token)) {
          score += 25;
          tokenMatched = true;
        }

        // Cek sinonim untuk token individu
        const tokenSyn = SYNONYM_MAP[token];
        if (tokenSyn) {
          if (tokenSyn.categories?.includes(categorySlug)) {
            score += 45;
            tokenMatched = true;
          }
          for (const term of tokenSyn.terms || []) {
            if (nameLower.includes(term)) {
              score += 40;
              tokenMatched = true;
            } else if (fullSearchableText.includes(term)) {
              score += 20;
              tokenMatched = true;
            }
          }
        }

        if (tokenMatched) matchedTokens++;
      }

      // Multi-Token Boost: Jika semua kata yang diketik pengguna cocok, beri boost besar
      if (tokens.length > 1) {
        if (matchedTokens === tokens.length) {
          score += 80;
        } else if (matchedTokens === 0) {
          score = 0;
        }
      }

      return { product: prod, score };
    })
    .filter((item) => item.score > 0);

  // Urutkan berdasarkan skor tertinggi (relevansi teratas)
  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems.map((item) => item.product);
}

export interface SearchSuggestion {
  text: string;
  type: "keyword" | "product" | "category";
  subtitle?: string;
  slug?: string;
}

/**
 * Menghasilkan rekomendasi kata kunci dan produk secara langsung (live suggestions)
 */
export function getSearchSuggestions(
  query: string,
  products: ProductWithDetails[],
  limit = 6
): SearchSuggestion[] {
  const cleanQ = normalizeQuery(query);
  if (!cleanQ) {
    // Saat input kosong, berikan rekomendasi tren populer
    return DEFAULT_TRENDING_KEYWORDS.slice(0, limit).map((kw) => ({
      text: kw,
      type: "keyword",
      subtitle: SYNONYM_MAP[kw.toLowerCase()]?.description || "Koleksi Tren Jovique",
    }));
  }

  const suggestions: SearchSuggestion[] = [];

  // 1. Rekomendasi dari Kamus Sinonim & Kategori
  for (const [key, val] of Object.entries(SYNONYM_MAP)) {
    if (key.includes(cleanQ) && val.description) {
      suggestions.push({
        text: key.charAt(0).toUpperCase() + key.slice(1),
        type: "keyword",
        subtitle: val.description,
      });
    }
  }

  // 2. Rekomendasi dari Nama Produk Spesifik yang Cocok
  const matchedProducts = searchProducts(products, cleanQ);
  for (const prod of matchedProducts) {
    if (suggestions.length >= limit) break;
    // Hindari duplikasi jika sudah ada teks yang identik
    if (!suggestions.some((s) => s.text.toLowerCase() === prod.name.toLowerCase())) {
      suggestions.push({
        text: prod.name,
        type: "product",
        subtitle: prod.category?.name || prod.tagline || "Koleksi Jovique",
        slug: prod.slug,
      });
    }
  }

  return suggestions.slice(0, limit);
}

/**
 * Menghasilkan daftar istilah untuk klausa `or` SQL pada Supabase jika dipanggil dari server
 */
export function getSearchSqlTerms(query: string): string[] {
  const clean = normalizeQuery(query);
  if (!clean) return [];

  const terms = new Set<string>();
  terms.add(clean);

  const tokens = clean.split(" ").filter(Boolean);
  tokens.forEach((t) => terms.add(t));

  // Tambahkan sinonim
  const syn = SYNONYM_MAP[clean];
  if (syn?.terms) {
    syn.terms.forEach((t) => terms.add(t));
  }

  tokens.forEach((t) => {
    const tSyn = SYNONYM_MAP[t];
    if (tSyn?.terms) {
      tSyn.terms.forEach((term) => terms.add(term));
    }
  });

  return Array.from(terms).slice(0, 8); // Batasi maks 8 term untuk efisiensi query
}
