export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export interface NuclearFission {
  id: "fission-01";
  status: "Commercial Operational";
  coreTemperatureCelsius: number;
  fuelType: "Uranium-235";
  annualFuelPer1GWTons: number;
  wasteType: "High-level Radioactive Waste";
  wasteOutputPer1GWTons: number;
  globalSupplyYears: number;
}

export interface NuclearFusion {
  id: "fusion-01";
  status: "Engineering Prototype Test";
  coreTemperatureCelsius: number;
  fuelType: "Deuterium (Seawater) & Tritium (Lithium Breeding)";
  annualFuelPer1GWKg: number;
  wasteType: "Non-toxic Helium Gas";
  wasteOutputPer1GWKg: number;
  globalSupplyYears: number;
  keyTechStack: string[];
}

export interface NuclearSummaryResponse {
  baseline: {
    id: "coal-baseline";
    status: "Commercial Operational";
    fuelType: "Coal";
    annualFuelPer1GWTons: number;
    wasteType: "CO2, ash, particulate emissions";
  };
  fission: NuclearFission;
  fusion: NuclearFusion;
  notes: string[];
}

export interface NuclearCalculateRequest {
  targetGw: number;
}

export interface CalculatedFuelWeight {
  id: "coal" | "uranium" | "fusion";
  label: string;
  technology: string;
  amount: number;
  unit: "tons" | "kg";
  amountTons: number;
  perGwAmount: number;
  perGwUnit: "tons" | "kg";
  relativeToCoal: number;
}

export interface NuclearCalculateResponse {
  targetGw: number;
  calculatedWeights: CalculatedFuelWeight[];
  scaleMode: "logarithmic";
  generatedAt: string;
}

type RouteHandler<TBody, TResponse> = (body?: TBody) => ApiResult<TResponse>;

export interface NuclearRoute<TBody, TResponse> {
  method: "GET" | "POST";
  path: string;
  handler: RouteHandler<TBody, TResponse>;
}

export const COAL_TONS_PER_GW = 3_000_000;
export const URANIUM_TONS_PER_GW = 25;
export const FUSION_KG_PER_GW = 250;

const fission: NuclearFission = {
  id: "fission-01",
  status: "Commercial Operational",
  coreTemperatureCelsius: 300,
  fuelType: "Uranium-235",
  annualFuelPer1GWTons: URANIUM_TONS_PER_GW,
  wasteType: "High-level Radioactive Waste",
  wasteOutputPer1GWTons: 25,
  globalSupplyYears: 90,
};

const fusion: NuclearFusion = {
  id: "fusion-01",
  status: "Engineering Prototype Test",
  coreTemperatureCelsius: 100_000_000,
  fuelType: "Deuterium (Seawater) & Tritium (Lithium Breeding)",
  annualFuelPer1GWKg: FUSION_KG_PER_GW,
  wasteType: "Non-toxic Helium Gas",
  wasteOutputPer1GWKg: 250,
  globalSupplyYears: 200_000_000,
  keyTechStack: [
    "REBCO High-Temperature Superconducting Magnets",
    "Tritium Breeding Blanket",
    "AI Real-time Plasma Control",
  ],
};

const nuclearSummary: NuclearSummaryResponse = {
  baseline: {
    id: "coal-baseline",
    status: "Commercial Operational",
    fuelType: "Coal",
    annualFuelPer1GWTons: COAL_TONS_PER_GW,
    wasteType: "CO2, ash, particulate emissions",
  },
  fission,
  fusion,
  notes: [
    "All fuel-mass values are normalized to annual 1 GW electric output for dashboard comparison.",
    "Fusion is modeled as an engineering prototype, not as a commercial plant.",
    "Fusion fuel mass combines deuterium and bred tritium requirements for the comparison baseline.",
  ],
};

function success<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

function failure(code: string, message: string, details?: Record<string, unknown>): ApiResult<never> {
  return { ok: false, error: { code, message, details } };
}

export function getNuclearSummary(): ApiResult<NuclearSummaryResponse> {
  return success(nuclearSummary);
}

export function calculateNuclearFuel(request: NuclearCalculateRequest): ApiResult<NuclearCalculateResponse> {
  const targetGw = Number(request?.targetGw);
  if (!Number.isFinite(targetGw)) {
    return failure("INVALID_TARGET_GW", "targetGw must be a finite number.", { received: request?.targetGw });
  }
  if (targetGw <= 0) {
    return failure("INVALID_TARGET_GW", "targetGw must be greater than zero.", { received: targetGw });
  }
  if (targetGw > 10_000) {
    return failure("TARGET_GW_TOO_LARGE", "targetGw exceeds the mock-dashboard safety limit.", { maxGw: 10_000 });
  }

  const coalTons = COAL_TONS_PER_GW * targetGw;
  const uraniumTons = URANIUM_TONS_PER_GW * targetGw;
  const fusionKg = FUSION_KG_PER_GW * targetGw;
  const fusionTons = fusionKg / 1_000;

  return success({
    targetGw,
    scaleMode: "logarithmic",
    generatedAt: new Date().toISOString(),
    calculatedWeights: [
      {
        id: "coal",
        label: "Coal Baseline",
        technology: "Coal",
        amount: coalTons,
        unit: "tons",
        amountTons: coalTons,
        perGwAmount: COAL_TONS_PER_GW,
        perGwUnit: "tons",
        relativeToCoal: 1,
      },
      {
        id: "uranium",
        label: "Nuclear Fission",
        technology: "Uranium-235",
        amount: uraniumTons,
        unit: "tons",
        amountTons: uraniumTons,
        perGwAmount: URANIUM_TONS_PER_GW,
        perGwUnit: "tons",
        relativeToCoal: uraniumTons / coalTons,
      },
      {
        id: "fusion",
        label: "Nuclear Fusion",
        technology: "Deuterium + Tritium",
        amount: fusionKg,
        unit: "kg",
        amountTons: fusionTons,
        perGwAmount: FUSION_KG_PER_GW,
        perGwUnit: "kg",
        relativeToCoal: fusionTons / coalTons,
      },
    ],
  });
}

export function postNuclearCalculate(body?: NuclearCalculateRequest): ApiResult<NuclearCalculateResponse> {
  if (!body || typeof body !== "object") {
    return failure("INVALID_REQUEST_BODY", "Request body must be an object with targetGw.", { received: body });
  }
  return calculateNuclearFuel(body);
}

export const nuclearRoutes = [
  {
    method: "GET",
    path: "/api/power/nuclear/summary",
    handler: () => getNuclearSummary(),
  },
  {
    method: "POST",
    path: "/api/power/nuclear/calculate",
    handler: (body?: NuclearCalculateRequest) => postNuclearCalculate(body),
  },
] satisfies [
  NuclearRoute<undefined, NuclearSummaryResponse>,
  NuclearRoute<NuclearCalculateRequest, NuclearCalculateResponse>,
];

