import React from "react";
import reports from "../deta/Solved.json";
import SolvedCard from "../components/ui/SolvedCard";

export default function AllissuePage() {
  return (
    <>
        <div className="p-6 gap-4 flex flex-col">
            <div className="space-y-6">
                {reports.length === 0 ? (
                    <p className="text-center text-gray-500">
                    No reports found.
                    </p>
                ) : (
                    reports.map((report) => (
                    <SolvedCard key={report.id} post={report} />
                    ))
                )}
            </div>
        </div>
    </>
  );
}
