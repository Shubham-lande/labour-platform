import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  X,
  Star,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Certified Electricians',
  'Master Plumbers & Pipefitters',
  'Civil & Masonry Specialists',
  'HVAC & Ducting Techs',
  'Master Carpenters',
];

const LOCATIONS = ['All', 'Mumbai', 'Navi Mumbai', 'Thane', 'Bhiwandi'];

const SORT_OPTIONS = [
  { id: 'highest_rated', label: 'Highest Rated' },
  { id: 'most_experienced', label: 'Most Experienced' },
  { id: 'lowest_price', label: 'Lowest Daily Rate' },
  { id: 'highest_price', label: 'Highest Daily Rate' },
  { id: 'most_jobs', label: 'Most Completed Jobs' },
];

const LabourSearchFilter = ({ onFilterChange, totalCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [minExp, setMinExp] = useState('0');
  const [maxPrice, setMaxPrice] = useState('2000');
  const [availability, setAvailability] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('highest_rated');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Debounced live search
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        search: searchTerm,
        category,
        location,
        minRating,
        minExp,
        maxPrice,
        availability,
        verified: verifiedOnly,
        sort,
      });
    }, 250);

    return () => clearTimeout(handler);
  }, [searchTerm, category, location, minRating, minExp, maxPrice, availability, verifiedOnly, sort]);

  const handleReset = () => {
    setSearchTerm('');
    setCategory('All');
    setLocation('All');
    setMinRating('0');
    setMinExp('0');
    setMaxPrice('2000');
    setAvailability('All');
    setVerifiedOnly(false);
    setSort('highest_rated');
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Live Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by worker name, skill (e.g. Electrician, Wiring), or city..."
            className="w-full pl-11 pr-4 py-3 text-xs rounded-2xl glass-input placeholder:text-slate-500 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center gap-2">
          <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 text-xs font-semibold rounded-2xl glass-input bg-[#0F172A] cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Drawer Toggle */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="md:hidden px-4 py-3 rounded-2xl text-xs font-bold text-slate-200 glass-card border border-white/10 flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Filters
        </button>
      </div>

      {/* Filter Options Panel (Desktop Inline & Mobile Drawer) */}
      <div
        className={`glass-card rounded-2xl p-5 border border-white/10 space-y-4 ${
          showMobileFilter ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Refine Workforce Filters
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-cyan-400 font-mono font-bold">
              {totalCount} Workers Matched
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-semibold transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Work Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
          {/* Location */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">City / Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-[#0F172A]"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-[#0F172A]"
            >
              <option value="0">Any Rating</option>
              <option value="4.8">★ 4.8+ Top Rated</option>
              <option value="4.5">★ 4.5+ Excellent</option>
              <option value="4.0">★ 4.0+ Good</option>
            </select>
          </div>

          {/* Min Experience */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Experience</label>
            <select
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-[#0F172A]"
            >
              <option value="0">Any Experience</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years</option>
              <option value="7">7+ Years Master</option>
            </select>
          </div>

          {/* Availability Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Status</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-[#0F172A]"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Now</option>
              <option value="Busy">Busy on Site</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="verifiedOnly"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="verifiedOnly" className="text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourSearchFilter;
