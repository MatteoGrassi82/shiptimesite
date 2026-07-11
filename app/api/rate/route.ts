import { type NextRequest, NextResponse } from "next/server";

// Rate calculator proxy. The browser posts shipment details here; this server
// route calls the ShipTime rate engine with carrier credentials that NEVER
// reach the client. Until SHIPTIME_RATE_* are set it returns representative
// mock rates so the calculator UI is fully testable.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RateRequest = {
  fromPostal?: string;
  toPostal?: string;
  weight?: number; // lb
  country?: string;
};

type Rate = {
  carrier: string;
  service: string;
  price: number;
  currency: string;
  transitDays: number;
};

function mockRates(input: RateRequest): Rate[] {
  const w = Math.max(1, Number(input.weight) || 5);
  const base = 8 + w * 1.35;
  return [
    { carrier: "Canada Post", service: "Expedited Parcel", price: +(base * 1.0).toFixed(2), currency: "CAD", transitDays: 4 },
    { carrier: "UPS", service: "Standard", price: +(base * 1.18).toFixed(2), currency: "CAD", transitDays: 3 },
    { carrier: "Purolator", service: "Ground", price: +(base * 1.11).toFixed(2), currency: "CAD", transitDays: 3 },
    { carrier: "FedEx", service: "Economy", price: +(base * 1.27).toFixed(2), currency: "CAD", transitDays: 2 },
  ].sort((a, b) => a.price - b.price);
}

export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => ({}))) as RateRequest;

  const endpoint = process.env.SHIPTIME_RATE_API_URL;
  const apiKey = process.env.SHIPTIME_RATE_API_KEY;

  if (!endpoint || !apiKey) {
    return NextResponse.json({ source: "mock", rates: mockRates(input) });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "rate_engine_error", status: res.status }, { status: 502 });
    }
    const data = await res.json();
    // TODO: map the engine's response shape to Rate[] once the contract is known.
    return NextResponse.json({ source: "live", rates: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
