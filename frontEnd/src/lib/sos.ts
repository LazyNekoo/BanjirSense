// src/lib/sos.ts
import { apiFetch } from "./api";

export type SosActivateReq = {
  lat: number;
  lng: number;
  peopleCount?: number;
  specialNeeds?: string[];
  note?: string;
  photoDataUrl?: string | null; // from canvas.toDataURL(...)
};

export type SosVision = {
  verified: boolean;
  summary?: string;
  hazards?: string[];
  waterDepthEstimateM?: number | null;
  confidence?: number | null;
};

export type SosActivateResp = {
  ok: boolean;
  reportId: string;
  status: "ACTIVE";
  guidanceEN: string; // or guidanceBM if you return BM
  vision?: SosVision | null;
};

export async function activateSOS(payload: SosActivateReq) {
  return apiFetch<SosActivateResp>("/sos/activate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}