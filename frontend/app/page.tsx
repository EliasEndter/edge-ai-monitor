import RecentDetections from "@/components/RecentDetections";
import SecurityEvents from "@/components/SecurityEvents";
import Analytics from "@/components/Analytics";
import TopObjects from "@/components/TopObjects";

type Stats = {
    total_detections: number;
    security_events: number;
    person_detections: number;
};

type Detection = {
    id: number;
    timestamp: string;
    label: string;
    confidence: number;
    is_security_event: boolean;
};

async function getStats(): Promise<Stats> {
    const response = await fetch("http://127.0.0.1:8000/api/stats", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to load stats");
    }

    return response.json();
}

async function getDetections(): Promise<Detection[]> {
    const response = await fetch(
        "http://127.0.0.1:8000/api/detections?limit=100",
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load detections");
    }

    return response.json();
}
async function getSecurityEvents(): Promise<Detection[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/security-events",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to load security events");
  }

  return response.json();
}

export default async function Home() {
    const [stats, detections, securityEvents,] = await Promise.all([
        getStats(),
        getDetections(),
        getSecurityEvents(),
    ]);

    return (
        <main className="min-h-screen bg-black p-10 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Edge AI Monitor</h1>
                        <p className="mt-2 text-gray-400">
                            Raspberry Pi Security System
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500"/>
                        <span className="text-gray-300">API Online</span>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-gray-800 p-6">
                        <p className="text-sm text-gray-400">Total Detections</p>
                        <p className="mt-2 text-4xl font-bold">
                            {stats.total_detections}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-800 p-6">
                        <p className="text-sm text-gray-400">Security Events</p>
                        <p className="mt-2 text-4xl font-bold">
                            {stats.security_events}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-800 p-6">
                        <p className="text-sm text-gray-400">Persons Detected</p>
                        <p className="mt-2 text-4xl font-bold">
                            {stats.person_detections}
                        </p>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {/* Camera */}
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-gray-800">
                            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
                                <div>
                                    <h2 className="text-lg font-semibold">Live Camera</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Raspberry Pi AI Camera
                                    </p>
                                </div>

                                <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">
                Mock Mode
              </span>
                            </div>

                            <div className="flex aspect-video items-center justify-center bg-gray-950">
                                <div className="text-center">
                                    <div
                                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gray-800">
                                        <span className="text-2xl">◉</span>
                                    </div>

                                    <p className="font-medium text-gray-300">
                                        Camera unavailable
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Live stream available on Raspberry Pi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="rounded-xl border border-gray-800">
                        <div className="border-b border-gray-800 px-6 py-5">
                            <h2 className="text-lg font-semibold">System Status</h2>
                        </div>

                        <div className="space-y-6 p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">API</span>
                                <span className="text-green-400">● Online</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Database</span>
                                <span className="text-green-400">● Online</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Camera</span>
                                <span className="text-gray-500">● Unavailable</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Hailo AI</span>
                                <span className="text-gray-500">● Unavailable</span>
                            </div>

                            <div className="border-t border-gray-800 pt-6">
                                <p className="text-xs uppercase tracking-wider text-gray-600">
                                    Development Environment
                                </p>
                                <p className="mt-2 text-sm text-gray-400">
                                    Mock detection mode
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <SecurityEvents events={securityEvents} />
                
                <Analytics detections={detections} />

                <TopObjects detections={detections} />

                <RecentDetections detections={detections}/>


            </div>
        </main>
    );
}