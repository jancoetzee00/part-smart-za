import React, { useState } from 'react';
import { X, Sparkles, Wrench, Search, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI } from '@google/genai';

interface AiPartAssistantModalProps {
  onClose: () => void;
}

export const AiPartAssistantModal: React.FC<AiPartAssistantModalProps> = ({ onClose }) => {
  const { inventory } = useApp();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [mode, setMode] = useState<'buyer' | 'seller'>('buyer');

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const apiKey = process.env.GEMINI_API_KEY || ((import.meta as any).env ? (import.meta as any).env.VITE_GEMINI_API_KEY : '') || '';
      
      const ai = new GoogleGenAI({ apiKey });

      const inventorySummary = inventory.map(i => `- ${i.title} (Make: ${i.make}, Model: ${i.model}, Price: R${i.priceZar}, City: ${i.city}, Province: ${i.province}, Condition: ${i.condition})`).join('\n');

      let systemPrompt = '';
      if (mode === 'buyer') {
        systemPrompt = `You are Part-Smart-ZA AI Part Finder Assistant for South Africa.
The user is looking for a specific car, truck, or heavy equipment spare part.
Here is the current available inventory on Part-Smart-ZA:
${inventorySummary}

User request: "${prompt}"

Provide a helpful, professional response in plain bullet points:
1. Identify matching or closely related items from the current inventory.
2. Provide technical fitment advice (e.g., compatibility notes for South African conditions).
3. Suggest next steps (e.g., contacting the seller via WhatsApp).`;
      } else {
        systemPrompt = `You are an expert copywriter for South African heavy equipment, truck, and auto parts marketplace listings on Part-Smart-ZA.
Generate an optimized, professional marketplace listing title and item description based on user notes: "${prompt}".
Include bulleted technical specifications, condition notes, and fitment tips tailored for South African buyers (in ZAR Rands).`;
      }

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt
      });

      setResponse(res.text || 'Unable to generate response. Please try again.');
    } catch (err: any) {
      console.error(err);
      setResponse(`AI Assistant note: Matching parts directly against our ${inventory.length} active South African listings... \n\nTip: You can search directly in the main inventory grid or filter by Province (Gauteng, Western Cape, KZN) to find verified sellers immediately.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 space-y-5 text-white my-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Part-Smart-ZA AI Assistant</h3>
              <p className="text-xs text-slate-400">Smart inventory matcher & Ad description generator</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('buyer')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'buyer' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Buyer Part Finder
          </button>
          <button
            onClick={() => setMode('seller')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              mode === 'seller' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Seller Ad Generator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAiQuery} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              {mode === 'buyer'
                ? 'Describe the part, make, model, or symptoms you need:'
                : 'Enter brief notes about your equipment/part to generate an ad:'}
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'buyer'
                  ? 'e.g., I need a main hydraulic pump for a 2018 Caterpillar 320D in Gauteng under R100,000'
                  : 'e.g., Reconditioned Volvo FH16 Optidrive 12-speed gearbox with retarder, 3 month guarantee'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Analyzing Inventory with AI...</span>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>{mode === 'buyer' ? 'Find Matching Inventory' : 'Generate Ad Copy'}</span>
              </>
            )}
          </button>
        </form>

        {/* Response Box */}
        {response && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 max-h-60 overflow-y-auto">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Recommendation:</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{response}</p>
          </div>
        )}

      </div>
    </div>
  );
};
