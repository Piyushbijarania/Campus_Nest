"use client";

export type TiffinFilterState = {
  search: string;
  rentMin: string;
  rentMax: string;
  distanceMax: string;
  ratingMin: string;
};

export function TiffinFilter({
  filters,
  setFilters,
}: {
  filters: TiffinFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TiffinFilterState>>;
}) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700">Search &amp; filters</span>
        {(filters.search || filters.rentMin || filters.rentMax || filters.distanceMax || filters.ratingMin) && (
          <button
            type="button"
            onClick={() => setFilters({ search: "", rentMin: "", rentMax: "", distanceMax: "", ratingMin: "" })}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Search</label>
        <input
          type="search"
          name="search"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="Search by title, location or description…"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[120px] flex-1 sm:min-w-[140px]">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Min monthly (₹)</label>
          <input
            type="number"
            name="rentMin"
            value={filters.rentMin}
            onChange={(e) => setFilters((f) => ({ ...f, rentMin: e.target.value }))}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            min={0}
          />
        </div>
        <div className="min-w-[120px] flex-1 sm:min-w-[140px]">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Max monthly (₹)</label>
          <input
            type="number"
            name="rentMax"
            value={filters.rentMax}
            onChange={(e) => setFilters((f) => ({ ...f, rentMax: e.target.value }))}
            placeholder="Any"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            min={0}
          />
        </div>
        <div className="min-w-[120px] flex-1 sm:min-w-[140px]">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Max distance (km)</label>
          <input
            type="number"
            name="distanceMax"
            value={filters.distanceMax}
            onChange={(e) => setFilters((f) => ({ ...f, distanceMax: e.target.value }))}
            placeholder="Any"
            step={0.5}
            min={0}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div className="min-w-[120px] flex-1 sm:min-w-[140px]">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Min rating</label>
          <input
            type="number"
            name="ratingMin"
            value={filters.ratingMin}
            onChange={(e) => setFilters((f) => ({ ...f, ratingMin: e.target.value }))}
            placeholder="0"
            step={0.1}
            min={0}
            max={5}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>
    </div>
  );
}
