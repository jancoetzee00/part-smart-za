import { InventoryItem, CategoryType, PartCondition, SAProvince } from '../types';

// Automotive & Heavy Duty Synonyms & Slang Expander for South African market
export const AUTOMOTIVE_SYNONYMS: Record<string, string[]> = {
  diff: ['differential', 'rear diff', 'front diff', 'axle', 'ratio'],
  differential: ['diff', 'rear axle', 'front axle', 'crown wheel', 'pinion'],
  gearbox: ['transmission', 'manual', 'automatic', 'zf', 'eaton', 'allison', 'retarder'],
  transmission: ['gearbox', 'powershift', 'torque converter', 'zf', 'allison'],
  eng: ['engine', 'motor', 'diesel', 'block', 'cylinder head'],
  engine: ['motor', 'diesel engine', 'block', 'long block', 'short block', 'v8', 'straight 6', 'gd-6', 'cummins', 'deutz', 'perkins'],
  hyd: ['hydraulic', 'pump', 'cylinder', 'valve', 'main pump', 'rexroth'],
  hydraulic: ['hyd', 'hydraulic pump', 'hydraulic cylinder', 'ram', 'valve block', 'rexroth', 'kawasaki', 'parker'],
  pump: ['hydraulic pump', 'fuel pump', 'diesel pump', 'water pump', 'high pressure pump'],
  prop: ['propshaft', 'drive shaft', 'universal joint', 'center bearing'],
  propshaft: ['prop', 'drive shaft', 'cardan shaft', 'centre bearing'],
  bakkie: ['hilux', 'ranger', 'isuzu', 'd-max', 'navara', 'hardbody', 'amarok', 'land cruiser'],
  tipper: ['dump truck', 'tipping body', 'drop side', 'side tipper', 'bell b30', 'adt'],
  adt: ['articulated dump truck', 'bell', 'volvo', 'cat 740', 'tipper'],
  bucket: ['excavator bucket', 'loader bucket', 'trenching bucket', 'rock bucket', 'gp bucket'],
  turbo: ['turbocharger', 'garrett', 'holset', 'boost', 'intercooler'],
  injector: ['common rail', 'fuel injector', 'bosch injector', 'denso', 'delphi'],
  injectors: ['fuel injectors', 'common rail injectors', 'diesel injectors'],
  stripping: ['stripping for spares', 'scrap', 'dismantling', 'breakers', 'parts vehicle'],
  cat: ['caterpillar', 'cat excavator', 'cat loader', 'cat dozer', '320d', '330d', '950h', '966h', 'd6r'],
  caterpillar: ['cat', 'excavator', 'wheel loader', 'bulldozer', 'grader'],
  merc: ['mercedes-benz', 'mercedes', 'actros', 'axor', 'atego', 'powerliner'],
  mercedes: ['merc', 'actros', 'axor', 'atego', 'om501', 'om502'],
  actros: ['mercedes', '2644', '2645', '2648', '3340', 'v6', 'v8', 'g211', 'g240'],
  scania: ['r460', 'r500', 'r560', 'g460', 'v8', 'dc13', 'dc16', 'opticruise', 'retarder'],
  volvo: ['fh', 'fm', 'fmx', 'ec210', 'ec380', 'd13', 'i-shift'],
  komatsu: ['pc200', 'pc300', 'pc400', 'wa380', 'wa470', 'd65', 'd155'],
  isuzu: ['npr', 'nqr', 'ftr', 'fvz', 'giga', 'd-max', 'kb250', 'kb300', '4hk1', '6hk1'],
  toyota: ['hilux', 'land cruiser', 'quantum', 'hiace', 'prado', '1gd', '2gd', '1kd', '2kd', '1hz', '1vd'],
  bell: ['b20d', 'b25d', 'b30d', 'b40d', 'b50d', 'logger', 'haulage'],
  jcb: ['3cx', '4cx', 'js200', 'js220', 'telehandler', 'backhoe'],
  deutz: ['f6l912', 'bf6m1013', 'bf4m2012', 'air cooled', 'diesel generator', 'mining'],
  cummins: ['isx', 'qsb', '6bt', '4bt', 'nt855', 'qsx15', 'm11', 'n14'],
  hino: ['300', '500', '700', 'mega', 'j08e', 'j05e'],
  man: ['tga', 'tgx', 'tgs', 'cla', 'd20', 'd26', 'tipmatic']
};

// Popular Search Terms in South African Spares Market
export const POPULAR_SEARCH_TERMS = [
  'CAT 320D Hydraulic Pump',
  'Scania R500 V8 Retarder',
  'Toyota Hilux 2.8 GD-6 Engine',
  'Komatsu PC200 Final Drive',
  'Mercedes Actros 2645 Diff',
  'Isuzu NPR 400 Gearbox',
  'CAT 950 Loader Bucket',
  'Bell B30D Articulated Dump Truck',
  'Cummins ISX15 Turbocharger',
  'Volvo FH13 I-Shift Transmission',
  'Deutz BF6M1013 Diesel Motor',
  'Toyota Quantum 2KD Stripping'
];

export const POPULAR_MAKES = [
  'CAT',
  'Komatsu',
  'Scania',
  'Mercedes-Benz',
  'Toyota',
  'Isuzu',
  'Volvo',
  'Bell',
  'JCB',
  'Cummins',
  'Hino',
  'MAN',
  'Deutz',
  'Nissan / UD'
];

/**
 * Normalizes text for robust search matching
 * - strips special punctuation, lowercases, handles spacing
 */
export function normalizeSearchTerm(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Normalizes an OEM part number (stripping dashes, slashes, spaces)
 * e.g. "320D-HYD-01" -> "320dhyd01"
 */
export function normalizePartNumber(partNo?: string): string {
  if (!partNo) return '';
  return partNo.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Levenshtein distance for typo tolerance
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if query token loosely matches target token with typo tolerance
 */
export function fuzzyTokenMatch(queryToken: string, targetToken: string): boolean {
  if (targetToken.includes(queryToken)) return true;
  if (queryToken.length >= 4 && targetToken.length >= 4) {
    const maxDistance = queryToken.length > 6 ? 2 : 1;
    return levenshteinDistance(queryToken, targetToken) <= maxDistance;
  }
  return false;
}

export interface SearchResultItem {
  item: InventoryItem;
  score: number;
  matchedFields: string[];
  highlightSnippet: string;
}

export interface SearchOptions {
  query: string;
  category?: CategoryType | 'all';
  subcategory?: string;
  condition?: PartCondition | 'all';
  province?: SAProvince | 'all';
  minPrice?: number;
  maxPrice?: number;
  make?: string;
  onlyVerifiedSellers?: boolean;
  onlyWithPartNumber?: boolean;
  sortBy?: 'relevance' | 'newest' | 'price_low' | 'price_high' | 'views';
  expandSynonyms?: boolean;
}

/**
 * Supercharged Smart Search Engine with Multi-term Weighted Scoring & Synonym Expansion
 */
export function executeSearchEngine(
  inventory: InventoryItem[],
  options: SearchOptions
): SearchResultItem[] {
  const {
    query = '',
    category = 'all',
    subcategory = 'All',
    condition = 'all',
    province = 'all',
    minPrice,
    maxPrice,
    make = '',
    onlyWithPartNumber = false,
    sortBy = 'relevance',
    expandSynonyms = true
  } = options;

  const rawQuery = query.trim();
  const normalizedQuery = normalizeSearchTerm(rawQuery);
  const normalizedPartQuery = normalizePartNumber(rawQuery);
  const queryTokens = normalizedQuery.split(' ').filter(t => t.length > 0);

  // Expand query tokens with synonyms
  const expandedTokens = new Set<string>(queryTokens);
  if (expandSynonyms && queryTokens.length > 0) {
    queryTokens.forEach(token => {
      if (AUTOMOTIVE_SYNONYMS[token]) {
        AUTOMOTIVE_SYNONYMS[token].forEach(syn => {
          normalizeSearchTerm(syn).split(' ').forEach(st => {
            if (st.length > 1) expandedTokens.add(st);
          });
        });
      }
    });
  }
  const allTokens = Array.from(expandedTokens);

  const results: SearchResultItem[] = [];

  for (const item of inventory) {
    // Basic category filter
    if (category !== 'all' && item.category !== category) continue;

    // Subcategory filter
    if (subcategory !== 'All' && !item.subcategory.toLowerCase().includes(subcategory.toLowerCase())) continue;

    // Condition filter
    if (condition !== 'all' && item.condition !== condition) continue;

    // Province filter
    if (province !== 'all' && item.province !== province) continue;

    // Make filter
    if (make && item.make.toLowerCase() !== make.toLowerCase()) continue;

    // Price range filters
    if (minPrice !== undefined && item.priceZar < minPrice) continue;
    if (maxPrice !== undefined && item.priceZar > maxPrice) continue;

    // Part number only filter
    if (onlyWithPartNumber && !item.partNumber) continue;

    let score = 0;
    const matchedFields: string[] = [];

    const normTitle = normalizeSearchTerm(item.title);
    const normMake = normalizeSearchTerm(item.make);
    const normModel = normalizeSearchTerm(item.model);
    const normSubcat = normalizeSearchTerm(item.subcategory);
    const normPartNo = normalizePartNumber(item.partNumber);
    const normDesc = normalizeSearchTerm(item.description);
    const normSeller = normalizeSearchTerm(item.sellerName);
    const normCity = normalizeSearchTerm(item.city);
    const normProv = normalizeSearchTerm(item.province);

    // If query is blank, give base score
    if (queryTokens.length === 0) {
      score = item.isFeatured ? 150 : 100;
      if (item.views > 0) score += Math.min(item.views, 50);
      results.push({
        item,
        score,
        matchedFields: ['All Inventory'],
        highlightSnippet: item.description.slice(0, 120) + (item.description.length > 120 ? '...' : '')
      });
      continue;
    }

    // 1. Exact Part Number match (Highest Weight)
    if (normPartNo && normalizedPartQuery && normPartNo === normalizedPartQuery) {
      score += 1000;
      matchedFields.push('Exact OEM Part #');
    } else if (normPartNo && normalizedPartQuery && normPartNo.includes(normalizedPartQuery)) {
      score += 400;
      matchedFields.push('Part Number Match');
    }

    // 2. Full exact phrase match in Title
    if (normTitle.includes(normalizedQuery)) {
      score += 300;
      matchedFields.push('Exact Title Match');
    }

    // 3. Make & Model match
    const makeModelCombined = `${normMake} ${normModel}`;
    if (makeModelCombined.includes(normalizedQuery) || normalizedQuery.includes(normMake)) {
      score += 200;
      matchedFields.push('Make/Model');
    }

    // 4. Token-by-token scoring
    let tokensMatched = 0;

    for (const token of allTokens) {
      let tokenHit = false;

      // Title check
      if (normTitle.includes(token)) {
        score += 50;
        tokenHit = true;
        if (!matchedFields.includes('Title')) matchedFields.push('Title');
      } else {
        // Fuzzy title check
        const titleTokens = normTitle.split(' ');
        if (titleTokens.some(tt => fuzzyTokenMatch(token, tt))) {
          score += 30;
          tokenHit = true;
          if (!matchedFields.includes('Title (Fuzzy)')) matchedFields.push('Title (Fuzzy)');
        }
      }

      // Make / Model check
      if (normMake.includes(token) || normModel.includes(token)) {
        score += 40;
        tokenHit = true;
        if (!matchedFields.includes('Make / Model')) matchedFields.push('Make / Model');
      }

      // Subcategory check
      if (normSubcat.includes(token)) {
        score += 35;
        tokenHit = true;
        if (!matchedFields.includes('Subcategory')) matchedFields.push('Subcategory');
      }

      // Part number token check
      if (normPartNo && (normPartNo.includes(token) || normalizeSearchTerm(item.partNumber || '').includes(token))) {
        score += 60;
        tokenHit = true;
        if (!matchedFields.includes('Part #')) matchedFields.push('Part #');
      }

      // Description check
      if (normDesc.includes(token)) {
        score += 15;
        tokenHit = true;
        if (!matchedFields.includes('Description')) matchedFields.push('Description');
      }

      // Seller / Location check
      if (normSeller.includes(token) || normCity.includes(token) || normProv.includes(token)) {
        score += 20;
        tokenHit = true;
        if (!matchedFields.includes('Location / Yard')) matchedFields.push('Location / Yard');
      }

      if (tokenHit) {
        tokensMatched++;
      }
    }

    // Must match at least 1 original token (or synonym) to be included
    if (tokensMatched === 0 && score === 0) {
      continue;
    }

    // Multiplier for matching all search tokens
    if (tokensMatched >= queryTokens.length) {
      score += 100;
    }

    // Featured / Active Seller Boost
    if (item.isFeatured) {
      score += 30;
    }

    // Popularity views slight booster
    score += Math.min(item.views * 0.5, 25);

    // Create snippet
    let snippet = item.description;
    if (snippet.length > 130) {
      snippet = snippet.slice(0, 130) + '...';
    }

    results.push({
      item,
      score,
      matchedFields,
      highlightSnippet: snippet
    });
  }

  // Sort Results
  return results.sort((a, b) => {
    if (sortBy === 'price_low') {
      return a.item.priceZar - b.item.priceZar;
    }
    if (sortBy === 'price_high') {
      return b.item.priceZar - a.item.priceZar;
    }
    if (sortBy === 'newest') {
      return new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime();
    }
    if (sortBy === 'views') {
      return b.item.views - a.item.views;
    }
    // Default relevance score
    return b.score - a.score;
  });
}

/**
 * Generates Live Autocomplete Suggestions as user types
 */
export function getLiveSearchSuggestions(
  inventory: InventoryItem[],
  query: string
): {
  parts: { id: string; title: string; partNumber?: string; category: string; price: number }[];
  makes: string[];
  subcategories: string[];
  oemPartNumbers: string[];
} {
  const norm = normalizeSearchTerm(query);
  if (!norm || norm.length < 2) {
    return {
      parts: [],
      makes: POPULAR_MAKES.slice(0, 6),
      subcategories: ['Hydraulics & Pumps', 'Engines & Transmissions', 'Gearboxes', 'Buckets & Attachments'],
      oemPartNumbers: []
    };
  }

  const matchingParts: { id: string; title: string; partNumber?: string; category: string; price: number }[] = [];
  const matchingMakes = new Set<string>();
  const matchingSubcategories = new Set<string>();
  const matchingOem = new Set<string>();

  for (const item of inventory) {
    const itemTitleNorm = normalizeSearchTerm(item.title);
    const itemMakeNorm = normalizeSearchTerm(item.make);
    const itemSubNorm = normalizeSearchTerm(item.subcategory);
    const itemPartNorm = normalizePartNumber(item.partNumber);
    const queryPartNorm = normalizePartNumber(query);

    if (itemTitleNorm.includes(norm) || itemMakeNorm.includes(norm)) {
      if (matchingParts.length < 5) {
        matchingParts.push({
          id: item.id,
          title: item.title,
          partNumber: item.partNumber,
          category: item.category,
          price: item.priceZar
        });
      }
    }

    if (itemMakeNorm.includes(norm) || norm.includes(itemMakeNorm)) {
      matchingMakes.add(item.make);
    }

    if (itemSubNorm.includes(norm)) {
      matchingSubcategories.add(item.subcategory);
    }

    if (item.partNumber && itemPartNorm.includes(queryPartNorm)) {
      matchingOem.add(item.partNumber);
    }
  }

  return {
    parts: matchingParts,
    makes: Array.from(matchingMakes).slice(0, 5),
    subcategories: Array.from(matchingSubcategories).slice(0, 5),
    oemPartNumbers: Array.from(matchingOem).slice(0, 4)
  };
}

/**
 * Generates Schema.org JSON-LD Structured Data for high Google/Bing Search Engine visibility
 */
export function generateSchemaOrgJsonLd(inventory: InventoryItem[]): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://partsmart.co.za/#website",
        "url": "https://partsmart.co.za",
        "name": "Part-Smart-ZA",
        "description": "South Africa's Heavy Duty Spares, Truck Parts & Earthmoving Marketplace",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://partsmart.co.za/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "AutoPartsStore",
        "@id": "https://partsmart.co.za/#store",
        "name": "Part-Smart-ZA Heavy Spares Directory",
        "url": "https://partsmart.co.za",
        "areaServed": "South Africa",
        "currenciesAccepted": "ZAR",
        "paymentAccepted": "EFT, Cash on Collection, Card",
        "priceRange": "R100 - R1,000,000"
      },
      ...inventory.slice(0, 20).map(item => ({
        "@type": "Product",
        "@id": `https://partsmart.co.za/item/${item.id}`,
        "name": item.title,
        "description": item.description,
        "category": item.category,
        "sku": item.partNumber || item.id,
        "mpn": item.partNumber || item.id,
        "brand": {
          "@type": "Brand",
          "name": item.make
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "ZAR",
          "price": item.priceZar,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": item.sellerName
          }
        }
      }))
    ]
  };
}
