"use client";

import { Icon } from "@iconify/react";
import { Trade } from "../data/trades";

interface TradeCardProps {
  trade: Trade;
}

function TradeCard({ trade }: TradeCardProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
          <Icon icon={trade.icon} className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-title text-main-text">
          {trade.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-main-accent mb-6">
        <Icon icon="lucide:dollar-sign" className="w-4 h-4" />
        <span className="text-sm font-medium">{trade.salary}</span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="lucide:trending-up"
              className="w-4 h-4 text-main-accent"
            />
            <h4 className="font-semibold text-main-text">Overview</h4>
          </div>
          <p className="text-sm text-main-light-text leading-relaxed">
            {trade.overview}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="lucide:calendar"
              className="w-4 h-4 text-main-accent"
            />
            <h4 className="font-semibold text-main-text">Day-to-Day</h4>
          </div>
          <p className="text-sm text-main-light-text leading-relaxed">
            {trade.dayToDay}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="lucide:building-2"
              className="w-4 h-4 text-main-accent"
            />
            <h4 className="font-semibold text-main-text">Working Environment</h4>
          </div>
          <p className="text-sm text-main-light-text leading-relaxed">
            {trade.workingEnvironment}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="lucide:briefcase"
              className="w-4 h-4 text-main-accent"
            />
            <h4 className="font-semibold text-main-text">Applications</h4>
          </div>
          <p className="text-sm text-main-light-text leading-relaxed">
            {trade.applications}
          </p>
        </div>
      </div>
    </div>
  );
}

interface Trade101TabProps {
  trades: Trade[];
}

export function Trade101Tab({ trades }: Trade101TabProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-main-text mb-2">
          Explore Trade Careers
        </h2>
        <p className="text-lg text-main-light-text">
          Not sure which trade is right for you? Learn about different career
          paths and what they offer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
      </div>
    </div>
  );
}

