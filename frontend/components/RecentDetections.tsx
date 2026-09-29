"use client";

import { useState } from "react";


type Detection = {
  id: number;
  timestamp: string;
  label: string;
  confidence: number;
  is_security_event: boolean;
};


type RecentDetectionsProps = {
  detections: Detection[];
};


export default function RecentDetections({
  detections,
}: RecentDetectionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-950"
      >
        <div>
          <h2 className="text-lg font-semibold">
            Recent Detections
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {detections.length} recent detections
          </p>
        </div>

        <span className="text-xl text-gray-500">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="overflow-x-auto border-t border-gray-800">
          <table className="w-full text-left">
            <thead className="text-sm text-gray-500">
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 font-medium">Object</th>
                <th className="px-6 py-4 font-medium">
                  Confidence
                </th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Type</th>
              </tr>
            </thead>

            <tbody>
              {detections.map((detection) => (
                <tr
                  key={detection.id}
                  className="border-b border-gray-900 last:border-0"
                >
                  <td className="px-6 py-4 font-medium capitalize">
                    {detection.label}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {(detection.confidence * 100).toFixed(1)}%
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {new Date(
                      detection.timestamp
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    {detection.is_security_event ? (
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                        Security
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}