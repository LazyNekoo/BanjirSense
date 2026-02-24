export type AiRisk = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  hoursAhead?: number;
  riskScore?: number; // 0..1
  summary?: string;
  tipsBM?: string[];
};

export type JpsNearbyStation = {
  id?: string | null;
  name?: string | null;
  stationName?: string | null;
  state?: string | null;
  district?: string | null;

  lat?: number | null;
  lng?: number | null;

  waterLevelM?: number | null;

  rainfall?: {
    last1hMm?: number | null;
    last3hMm?: number | null;
    todayMm?: number | null;
  };

  status?: string | null;
  updatedAt?: string | null;
  distanceKm?: number | null;
};