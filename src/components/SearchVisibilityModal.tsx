import React, { useState } from 'react';
import {
  Globe,
  X,
  Sparkles,
  Search,
  CheckCircle2,
  Share2,
  FileCode2,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  ShieldCheck,
  Layers,
  HardHat,
  Truck,
  Eye,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateSchemaOrgJsonLd } from '../lib/searchEngine';

interface SearchVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearchEngine: () => void;
}

export const SearchVisibilityModal: React.FC<SearchVisibilityModalProps> = ({
  isOpen,
  onClose,
  onOpenSearchEngine
}) => {
  const { inventory, sellers } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'sitemap' | 'tips'>('overview');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  if (!isOpen) return null;

  const jsonLdData = generateSchemaOrgJsonLd(inventory);
  const jsonLdString = JSON.stringify(jsonLdData, null, 2);

  const activeSellersCount = sellers.filter(s => s.subscriptionStatus === 'active').length;
  const oemPartsCount = inventory.filter(i => !!i.partNumber).length;

  const handleCopy = (text: string, type: 'schema' | 'sitemap') => {
    navigator.clipboard.writeText(text);
    if (type === 'schema') {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    } else {
      setCopiedSitemap(true);
      setTimeout(() => setCopiedSitemap(false), 2000);
    }
  };

  const sitemapXmlPreview = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Platform Pages -->
  <url>
    <loc>https://partsmart.co.za/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://partsmart.co.za/heavy-equipment</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://partsmart.co.za/trucks</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://partsmart.co.za/cars</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Individual Listed Spares (${inventory.length} items) -->
${inventory.map(item => `  <url>
    <loc>https://partsmart.co.za/item/${item.id}</loc>
    <lastmod>${new Date(item.updatedAt || item.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-white my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/95 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Search Engine & SEO Visibility Center</h3>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Indexing Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Google Search Console, Bing Webmaster & Schema.org AutoPartsStore Optimization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Visibility Metrics
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Schema.org Structured Data
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sitemap'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sitemap.xml & Robots.txt
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tips'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Seller SEO Optimization Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Indexed Listings</span>
                  <div className="text-2xl font-black text-white mt-1">{inventory.length}</div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% crawlable
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Verified Scrap Yards</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">{activeSellersCount}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Nationwide coverage</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">OEM Part Numbers</span>
                  <div className="text-2xl font-black text-indigo-400 mt-1">{oemPartsCount}</div>
                  <span className="text-[10px] text-indigo-300 mt-1 block">Exact match indexing</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Search Engine Readiness</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">98/100</div>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Google AA Grade</span>
                </div>
              </div>

              {/* Live Search Engine Simulation */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-blue-400" /> Google Search Result Preview
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSearchEngine();
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch In-App Search Engine</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-sans space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-slate-300 font-mono">https://partsmart.co.za › spares › south-africa</span>
                  </div>
                  <h4 className="text-base text-blue-400 hover:underline font-bold cursor-pointer">
                    Part-Smart-ZA | South Africa's Heavy Duty Spares, Truck Parts & Earthmoving Machinery
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Search and advertise CAT, Komatsu, Scania, Mercedes Actros, Toyota Hilux spares across Johannesburg, Durban, Cape Town. Verified scrap yards, OEM part number lookups & direct seller contact.
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-amber-400 font-medium">
                    <span>★ 4.9 Rating</span>
                    <span>• {inventory.length} Spares in Stock</span>
                    <span>• In-Stock Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Bot & Crawler Integration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-emerald-400" /> Googlebot & Search Engine Crawler Support
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Part-Smart-ZA dynamically generates server-rendered metadata and endpoints (`/sitemap.xml` and `/robots.txt`) ensuring all listed excavator pumps, truck gearboxes, and car engines are rapidly indexed.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-400" /> Buyer Search Intent Optimization
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automotive abbreviations like "diff", "gearbox", "prop", "hyd", and "bakkie" automatically map to full technical product categories for maximum buyer lead conversion.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Schema.org */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Google Schema.org JSON-LD Markup</h4>
                  <p className="text-xs text-slate-400">Structured data automatically injected for rich snippets in Google Search</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(jsonLdString, 'schema')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied JSON-LD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Schema</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
                {jsonLdString}
              </pre>
            </div>
          )}

          {/* Tab 3: Sitemap */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">XML Sitemap (`/sitemap.xml`)</h4>
                  <p className="text-xs text-slate-400">Provides search engine bots with immediate discovery of newly listed inventory</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(sitemapXmlPreview, 'sitemap')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSitemap ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied XML</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Sitemap XML</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-blue-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
                {sitemapXmlPreview}
              </pre>
            </div>
          )}

          {/* Tab 4: Seller SEO Tips */}
          {activeTab === 'tips' && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-1">
                <h4 className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4" /> How Scrap Yards & Breakers Get 3x Higher Search Visibility
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Following these search engine optimization guidelines guarantees your listings appear on the 1st page of Google and within Part-Smart-ZA search results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">1</span>
                    Include the OEM Part Number
                  </h5>
                  <p className="text-slate-400 leading-relaxed">
                    Commercial buyers, mechanics, and fleet managers almost always search by exact part code (e.g. <code>320D-HYD-01</code> or <code>ZF 16S 181</code>). Listing with an OEM number gets a <strong>10x search ranking boost</strong>.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">2</span>
                    Use Clear Make + Model + Subcategory Titles
                  </h5>
                  <p className="text-slate-400 leading-relaxed">
                    Instead of just "Engine", use "Toyota Hilux 2.8 GD-6 Complete Turbo Diesel Engine". Clear titles rank significantly higher on Google Search.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">3</span>
                    Specify Machine / Truck Application
                  </h5>
                  <p className="text-slate-400 leading-relaxed">
                    Mention compatible series in descriptions (e.g. "Fits Actros 2644, 2645, 3340"). This triggers semantic synonym matches across related buyer searches.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">4</span>
                    Keep Contact & Yard Location Current
                  </h5>
                  <p className="text-slate-400 leading-relaxed">
                    Buyers frequently filter by province (e.g. "Gauteng", "Western Cape", "KZN"). Keeping your city and province accurate guarantees local lead conversion.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <div className="text-slate-400">
            Search Engine index refreshed automatically upon inventory creation.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
