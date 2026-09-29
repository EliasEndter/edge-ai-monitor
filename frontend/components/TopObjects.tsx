type Detection = {
  id: number;
  timestamp: string;
  label: string;
  confidence: number;
  is_security_event: boolean;
};

type TopObjectsProps = {
  detections: Detection[];
};

export default function TopObjects({
  detections,
}: TopObjectsProps) {
  if (detections.length === 0) {
    return null;
  }

  const counts = detections.reduce<Record<string, number>>(
    (result, detection) => {
      result[detection.label] =
        (result[detection.label] || 0) + 1;

      return result;
    },
    {}
  );

  const topObjects = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCount = topObjects[0]?.[1] || 1;

  return (
    <div className="mt-6 rounded-xl border border-gray-800 p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Top Objects</h3>
        <p className="mt-1 text-sm text-gray-500">
          Most frequently detected objects
        </p>
      </div>

      <div className="space-y-5">
        {topObjects.map(([label, count]) => {
          const width = (count / maxCount) * 100;

          return (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm capitalize text-gray-300">
                  {label}
                </span>

                <span className="text-sm text-gray-500">
                  {count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-900">
                <div
                  className="h-full rounded-full bg-gray-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}