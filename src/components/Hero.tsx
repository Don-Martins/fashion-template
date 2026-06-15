import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../constants';
import { BrandConfig } from '../types';

interface HeroProps {
  brandConfig: BrandConfig;
  onExploreClick: () => void;
}

export default function Hero({ brandConfig, onExploreClick }: HeroProps) {
  return (
    <section className="relative bg-[#FDFCFB] overflow-hidden min-h-[500px] lg:min-h-[640px] flex items-center">
      
      {/* Background Image with Ambient Light Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BANNER_IMAGE}
          alt="Aura Luxe editorial display"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-[10000ms] hover:scale-100"
          referrerPolicy="no-referrer"
          id="hero-banner-image"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCFB] via-[#FDFCFB]/85 to-transparent z-10" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#FDFCFB] to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          
          {/* Subtle Private Invitation Label */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-[10px] tracking-[0.3em] uppercase rounded-none mb-6 font-mono font-semibold"
          >
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>Summer Private Collection 2026</span>
          </motion.div>

          {/* Majestic Main Headline */}
          <motion.h2 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#1A1A1A] tracking-wide leading-tight"
            id="hero-heading"
          >
            Where Absolute <span className="italic text-[#C5A059] font-normal">Couture</span> Meets Timeless Heritage
          </motion.h2>

          {/* Fluid Brand Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-sm sm:text-base text-gray-600 font-light tracking-wide leading-relaxed max-w-xl font-sans"
          >
            {brandConfig.tagline}. Discover luxury garments meticulously tailored for those who understand that style is an inheritance, not a trend.
          </motion.p>

          {/* Interactive Calls to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4 sm:gap-6"
          >
            {/* Primary CTA */}
            <button
              onClick={onExploreClick}
              className="px-8 py-4 bg-[#1A1A1A] text-white font-medium text-xs tracking-[0.25em] uppercase hover:bg-[#C5A059] transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-md rounded-none"
              id="hero-explore-cta"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onExploreClick}
              className="px-8 py-4 border border-gray-200 text-[#1A1A1A] hover:text-[#C5A059] hover:border-[#C5A059] text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer rounded-none"
              id="hero-campaign-cta"
            >
              <span>The Atelier Film</span>
            </button>
          </motion.div>

          {/* Bottom Live Metrics Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-16 grid grid-cols-3 gap-6 sm:gap-10 border-t border-gray-200/60 pt-8"
          >
            <div>
              <p className="text-xl sm:text-2xl font-serif text-[#C5A059] font-light">100%</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">Mulberry Silk</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-[#C5A059] font-light">Lyon</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">Hand Finishes</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-[#C5A059] font-light">2026</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">Limited Editions</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
