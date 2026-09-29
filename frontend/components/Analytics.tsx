type Detection = {
    id: number;
    timestamp: string;
    label: string;
    confidence: number;
    is_security_event: boolean;
};

type AnalyticsProps = {
    detections: Detection[];
};

export default function Analytics({
                                      detections,
                                  }: AnalyticsProps) {
    if (detections.length === 0) {
        return null;
    }

    const labelCounts = detections.reduce<Record<string, number>>(
        (counts, detection) => {
            counts[detection.label] =
                (counts[detection.label] || 0) + 1;

            return counts;
        },
        {}
    );

    const uniqueObjectTypes = Object.keys(labelCounts).length;


    const averageConfidence =
        detections.reduce(
            (sum, detection) => sum + detection.confidence,
            0
        ) / detections.length;

    const securityEvents = detections.filter(
        (detection) => detection.is_security_event
    ).length;

    const securityEventRate =
        (securityEvents / detections.length) * 100;

    return (
        <div className="mt-10">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    Analytics
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Detection overview based on stored events
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-gray-800 p-5">
                    <p className="text-sm text-gray-500">
                        Unique Object Types
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {uniqueObjectTypes}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                        different detected classes
                    </p>
                </div>

                <div className="rounded-xl border border-gray-800 p-5">
                    <p className="text-sm text-gray-500">
                        Average Confidence
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {(averageConfidence * 100).toFixed(1)}%
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                        across stored detections
                    </p>
                </div>

                <div className="rounded-xl border border-gray-800 p-5">
                    <p className="text-sm text-gray-500">
                        Security Event Rate
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {securityEventRate.toFixed(1)}%
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                        {securityEvents} security events
                    </p>
                </div>

                <div className="rounded-xl border border-gray-800 p-5">
                    <p className="text-sm text-gray-500">
                        Stored Detections
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {detections.length}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                        loaded from database
                    </p>
                </div>
            </div>
        </div>
    )
        ;
}
