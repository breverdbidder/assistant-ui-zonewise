// ZoneWise Split-Screen Component
// Based on assistant-ui with-artifacts example
// Chat left, map/artifacts right
// House brand: Navy #1E3A5F, Orange #F59E0B, BG #020617

"use client";

import { Thread } from "@/components/assistant-ui/thread";
import {
  AssistantRuntimeProvider,
  makeAssistantTool,
  useAuiState,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import type { ToolCallMessagePart } from "@assistant-ui/react";
import { MapPin, FileText, Search } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// Tool: Zoning Lookup renders as a card in the artifact panel
const ZoningLookupTool = makeAssistantTool({
  toolName: "zoning_lookup",
  description: "Look up zoning for a Florida address",
  parameters: z.object({
    address: z.string(),
    city: z.string(),
    zone_code: z.string().optional(),
    zone_description: z.string().optional(),
    permitted_uses: z.array(z.string()).optional(),
  }),
  execute: async () => ({}),
  render: ({ args }) => (
    <div className="my-2 inline-flex items-center gap-2 rounded-full border border-[#F59E0B] bg-[#1E3A5F] px-4 py-2 text-white">
      <MapPin className="size-4 text-[#F59E0B]" />
      Zoning: {args.zone_code || "Looking up..."} — {args.address}
    </div>
  ),
});

// Tool: Report generation
const ReportTool = makeAssistantTool({
  toolName: "zoning_report",
  description: "Generate a PDF zoning report",
  parameters: z.object({
    address: z.string(),
    report_url: z.string().optional(),
  }),
  execute: async () => ({}),
  render: ({ args }) => (
    <div className="my-2 inline-flex items-center gap-2 rounded-full border border-[#F59E0B] bg-[#1E3A5F] px-4 py-2 text-white">
      <FileText className="size-4 text-[#F59E0B]" />
      Report: {args.address}
    </div>
  ),
});

// Artifact panel — shows zoning data, maps, reports
function ArtifactPanel() {
  const [tab, setTab] = useState<"zoning" | "map" | "report">("zoning");

  const lastToolCall = useAuiState((s) => {
    const messages = s.thread.messages;
    return messages
      .flatMap((m) =>
        m.content.filter(
          (c): c is ToolCallMessagePart =>
            c.type === "tool-call" &&
            ["zoning_lookup", "zoning_report"].includes(c.toolName),
        ),
      )
      .at(-1);
  });

  if (!lastToolCall) {
    return (
      <div className="flex flex-grow basis-full items-center justify-center p-6 text-[#64748B]">
        <div className="text-center">
          <Search className="mx-auto mb-3 size-12 text-[#F59E0B] opacity-50" />
          <p className="text-lg font-medium text-white">Ask about any address</p>
          <p className="mt-1 text-sm">Zoning data, development standards, and reports will appear here</p>
        </div>
      </div>
    );
  }

  const args = lastToolCall.args as Record<string, unknown>;

  return (
    <div className="flex flex-grow basis-full flex-col p-3">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#1E3A5F]/30">
        {/* Tab bar */}
        <div className="flex border-b border-[#1E3A5F]/30 bg-[#020617]">
          {(["zoning", "map", "report"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={\`flex-1 px-4 py-2.5 text-sm font-medium transition-colors \${
                tab === t
                  ? "bg-[#1E3A5F] text-[#F59E0B]"
                  : "text-[#64748B] hover:text-white"
              }\`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto bg-[#020617] p-4">
          {tab === "zoning" && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">
                {(args.address as string) || "Property"}
              </h3>
              {args.zone_code && (
                <div className="rounded-lg bg-[#1E3A5F]/20 p-3">
                  <span className="text-[#F59E0B] font-mono text-xl font-bold">
                    {args.zone_code as string}
                  </span>
                  <p className="mt-1 text-sm text-[#94A3B8]">
                    {args.zone_description as string || "Zoning district"}
                  </p>
                </div>
              )}
            </div>
          )}
          {tab === "map" && (
            <div className="flex h-full items-center justify-center text-[#64748B]">
              Mapbox integration — Sprint 3
            </div>
          )}
          {tab === "report" && (
            <div className="flex h-full items-center justify-center text-[#64748B]">
              PDF report generation — Sprint 5
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main split-screen layout
export default function ZoneWiseSplitScreen() {
  const runtime = useChatRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <main className="flex h-dvh bg-[#020617]">
        {/* Chat panel — left */}
        <div className="flex-grow basis-full border-r border-[#1E3A5F]/30">
          <Thread />
        </div>

        {/* Tools (invisible, register with runtime) */}
        <ZoningLookupTool />
        <ReportTool />

        {/* Artifact panel — right */}
        <ArtifactPanel />
      </main>
    </AssistantRuntimeProvider>
  );
}
