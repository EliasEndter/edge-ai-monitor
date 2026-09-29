"use client";

import {useMemo, useState} from "react";

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
    const [selectedLabel, setSelectedLabel] = useState("all");
    const [selectedType, setSelectedType] = useState("all");

    const labels = useMemo(() => {
        return Array.from(
            new Set(detections.map((detection) => detection.label))
        ).sort();
    }, [detections]);

    const filteredDetections = useMemo(() => {
        return detections.filter((detection) => {
            const matchesLabel =
                selectedLabel === "all" ||
                detection.label === selectedLabel;

            const matchesType =
                selectedType === "all" ||
                (selectedType === "security" &&
                    detection.is_security_event) ||
                (selectedType === "normal" &&
                    !detection.is_security_event);

            return matchesLabel && matchesType;
        });
    }, [detections, selectedLabel, selectedType]);

    return (
        <div className="mt-10 overflow-hidden rounded-xl border border-gray-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-950"
            >
                <div>
                    <h2 className="text-lg font-semibold">
                        Detection History
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {detections.length} stored detections
                    </p>
                </div>

                <span className="text-xl text-gray-500">
          {isOpen ? "▲" : "▼"}
        </span>
            </button>

            {isOpen && (
                <div className="border-t border-gray-800">
                    <div className="flex flex-wrap items-center gap-4 border-b border-gray-800 px-6 py-4">
                        <select
                            value={selectedLabel}
                            onChange={(event) =>
                                setSelectedLabel(event.target.value)
                            }
                            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-sm text-gray-300"
                        >
                            <option value="all">All Objects</option>

                            {labels.map((label) => (
                                <option key={label} value={label}>
                                    {label.charAt(0).toUpperCase() + label.slice(1)}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedType}
                            onChange={(event) =>
                                setSelectedType(event.target.value)
                            }
                            className="rounded-lg border border-gray-800 bg-black px-4 py-2 text-sm text-gray-300"
                        >
                            <option value="all">All Types</option>
                            <option value="security">Security</option>
                            <option value="normal">Normal</option>
                        </select>
                        <button
                            onClick={() => {
                                setSelectedLabel("all");
                                setSelectedType("all");
                            }}
                            className="rounded-lg border border-gray-800 px-4 py-2 text-sm text-gray-400 hover:bg-gray-950 hover:text-white"
                        >
                            Reset Filters
                        </button>
                        <span className="text-sm text-gray-500">
              {filteredDetections.length} results
            </span>
                    </div>

                    <div className="max-h-[500px] overflow-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-black text-sm text-gray-500">
                            <tr className="border-b border-gray-800">
                                <th className="px-6 py-4 font-medium">
                                    Object
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Confidence
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Time
                                </th>
                                <th className="px-6 py-4 font-medium">
                                    Type
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredDetections.map((detection) => (
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
                                            <span
                                                className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
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

                        {filteredDetections.length === 0 && (
                            <div className="px-6 py-10 text-center text-sm text-gray-500">
                                No detections match the selected filters.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}