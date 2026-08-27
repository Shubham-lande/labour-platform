import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <div className="h-4 w-1/3 bg-slate-800/80 rounded-md shimmer-loader" />
    <div className="h-8 w-2/3 bg-slate-800/80 rounded-lg shimmer-loader" />
    <div className="h-4 w-full bg-slate-800/80 rounded-md shimmer-loader" />
  </div>
);

export const TableSkeleton = ({ rows = 4 }) => (
  <div className="glass-card rounded-2xl p-6 space-y-3">
    <div className="h-6 w-1/4 bg-slate-800/80 rounded-md shimmer-loader mb-4" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-800/50">
        <div className="h-4 w-1/3 bg-slate-800/80 rounded shimmer-loader" />
        <div className="h-4 w-1/4 bg-slate-800/80 rounded shimmer-loader" />
        <div className="h-4 w-1/6 bg-slate-800/80 rounded shimmer-loader" />
      </div>
    ))}
  </div>
);

export const StatGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

export default CardSkeleton;
