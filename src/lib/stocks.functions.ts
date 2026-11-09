import { createServerFn } from "@tanstack/react-start";

export interface TokenizedStock {
  contract_address: string;
  symbol: string;
  name: string;
  icon_url?: string;
  multiplier?: number;
  nav_price?: number | null;
  nav_price_updated_at?: string;
}

export const listTokenizedStocks = createServerFn({ method: "GET" }).handler(async () => {
  const base = "https://api.coinbase.com/v1/tokenized-stocks";
  const stocks: TokenizedStock[] = [];
  let token: string | undefined;
  let error: string | null = null;

  try {
    for (let page = 0; page < 20; page += 1) {
      const url = new URL(base);
      url.searchParams.set("page_size", "500");
      if (token) url.searchParams.set("page_token", token);
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`Listing request failed: ${response.status}`);
      const payload = await response.json() as { tokens?: unknown; next_page_token?: unknown };
      if (!Array.isArray(payload.tokens)) throw new Error("Unexpected listing response");

      for (const candidate of payload.tokens) {
        if (!candidate || typeof candidate !== "object") continue;
        const item = candidate as Record<string, unknown>;
        if (typeof item.contract_address !== "string" || typeof item.symbol !== "string" || typeof item.name !== "string") continue;
        stocks.push({
          contract_address: item.contract_address,
          symbol: item.symbol,
          name: item.name,
          ...(typeof item.icon_url === "string" ? { icon_url: item.icon_url } : {}),
          ...(typeof item.multiplier === "number" ? { multiplier: item.multiplier } : {}),
          ...(typeof item.nav_price === "number" ? { nav_price: item.nav_price } : {}),
          ...(typeof item.nav_price_updated_at === "string" ? { nav_price_updated_at: item.nav_price_updated_at } : {}),
        });
      }

      token = typeof payload.next_page_token === "string" && payload.next_page_token.length > 0 ? payload.next_page_token : undefined;
      if (!token) break;
    }
  } catch (cause) {
    console.error("Unable to load tokenized stocks", cause);
    error = "Stock listings are temporarily unavailable.";
  }

  return { stocks, error };
});