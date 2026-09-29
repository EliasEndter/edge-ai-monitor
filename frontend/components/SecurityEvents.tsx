"use client";

import { useState } from "react";

type Detection = {
  id: number;
  timestamp: string;
  label: string;
  confidence: number;
  is_security_event: boolean;
};

type SecurityEventsProps = {
  events: Detection[];
};

export default function SecurityEvents({
  events,
}: SecurityEventsProps) {
  const [showAll, setShowAll] = useState(false);

  if (events.length === 0) {
    return (
      <div className="mt-10 overflow-hidden rounded-xl border border-red-900/50">
        <div className="px-6 py-5">
          <h2 className="text-lg font-semibold">Security Events</h2>
          <p className="mt-1 text-sm text-gray-500">
            No security events detected
          </p>
        </div>
      </div>
    );
  }

  const visibleEvents = showAll ? events : events.slice(0, 1);

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-red-900/50">
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold">Security Events</h2>
          <p className="mt-1 text-sm text-gray-500">
            Detected security-relevant activity
          </p>
        </div>

        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
          {events.length} Events
        </span>
      </div>

      <div className="divide-y divide-gray-900">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between px-6 py-4"
          >
            <div>
              <p className="font-medium capitalize">
                {event.label} detected
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium text-red-400">
                {(event.confidence * 100).toFixed(1)}%
              </p>

              <p className="mt-1 text-xs text-gray-600">
                confidence
              </p>
            </div>
          </div>
        ))}
      </div>

      {events.length > 1 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full border-t border-gray-800 px-6 py-3 text-sm text-gray-400 hover:bg-gray-950 hover:text-white"
        >
          {showAll
            ? "Hide older security events"
            : `Show all security events (${events.length})`}
        </button>
      )}
    </div>
  );
}