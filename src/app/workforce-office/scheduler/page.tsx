
import { SchedulerClient } from "@/components/scheduler-client";

export default function SchedulerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Scheduler</h1>
                <p className="text-muted-foreground">
                    Manage appointments, tasks, and team availability.
                </p>
            </div>
            <SchedulerClient />
        </div>
    );
}
