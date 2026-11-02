function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePath(endPrice, changePct, points, seed) {
  const rand = mulberry32(seed);
  const prevClose = +(endPrice / (1 + changePct / 100)).toFixed(2);
  const start = prevClose * (changePct >= 0 ? 0.986 : 1.014);
  const spark = [];
  for (let index = 0; index < points; index += 1) {
    const progress = index / (points - 1);
    const wave = Math.sin((index + seed) * 0.75) * endPrice * 0.0035;
    const noise = (rand() - 0.5) * endPrice * 0.0025;
    spark.push(Math.max(0.01, +(start + (endPrice - start) * progress + wave + noise).toFixed(2)));
  }
  spark[0] = +start.toFixed(2);
  spark[spark.length - 1] = +endPrice.toFixed(2);
  const change = +(((endPrice - prevClose) / prevClose) * 100).toFixed(2);
  return { prevClose, spark, change, high: Math.max(...spark), low: Math.min(...spark) };
}

function curve(points, seed, drift) {
  const rand = mulberry32(seed);
  let value = 100;
  const series = [];
  for (let index = 0; index < points; index += 1) {
    value *= 1 + drift + (rand() - 0.46) * 0.018;
    series.push(+value.toFixed(2));
  }
  return series;
}

const RAW = [
  { symbol: "SPX", name: "S&P 500", kind: "index", session: "US", region: "United States", exchange: "NYSE", price: 5894.32, change: 0.62, meta: "Large-cap benchmark", seed: 101 },
  { symbol: "NDX", name: "Nasdaq 100", kind: "index", session: "US", region: "United States", exchange: "NASDAQ", price: 21048.55, change: 0.84, meta: "Growth benchmark", seed: 102 },
  { symbol: "DJI", name: "Dow Jones", kind: "index", session: "US", region: "United States", exchange: "NYSE", price: 44210.18, change: 0.28, meta: "Price-weighted 30", seed: 103 },
  { symbol: "NIFTY", name: "Nifty 50", kind: "index", session: "IN", region: "India", exchange: "NSE", price: 24518.6, change: -0.34, meta: "NSE benchmark", seed: 104 },
  { symbol: "SENSEX", name: "BSE Sensex", kind: "index", session: "IN", region: "India", exchange: "BSE", price: 80642.25, change: -0.22, meta: "BSE 30", seed: 105 },
  { symbol: "FTSE", name: "FTSE 100", kind: "index", session: "UK", region: "United Kingdom", exchange: "LSE", price: 8314.4, change: 0.18, meta: "London large cap", seed: 106 },
  { symbol: "N225", name: "Nikkei 225", kind: "index", session: "JP", region: "Japan", exchange: "TSE", price: 39880.12, change: 0.47, meta: "Tokyo benchmark", seed: 107 },
  { symbol: "GOLD", name: "Gold", kind: "commodity", session: "24H", region: "Global", exchange: "OTC", price: 2748.6, change: 0.41, meta: "USD / oz", seed: 108 },
  { symbol: "AAPL", name: "Apple Inc.", kind: "stock", sector: "Technology", exchange: "NASDAQ", price: 228.46, change: 1.24, volume: "54.2M", marketCap: "$3.42T", pe: "34.8", seed: 201, blurb: "Hardware, services, and a balance sheet the market treats as a quality compounder." },
  { symbol: "MSFT", name: "Microsoft", kind: "stock", sector: "Technology", exchange: "NASDAQ", price: 446.12, change: 0.68, volume: "22.1M", marketCap: "$3.31T", pe: "36.1", seed: 202, blurb: "Cloud, productivity, and AI infrastructure sitting at the center of enterprise spend." },
  { symbol: "NVDA", name: "NVIDIA", kind: "stock", sector: "Technology", exchange: "NASDAQ", price: 149.88, change: 2.46, volume: "198.4M", marketCap: "$3.66T", pe: "48.2", seed: 203, blurb: "Accelerated computing demand keeps this name at the front of the risk-on tape." },
  { symbol: "AMZN", name: "Amazon", kind: "stock", sector: "Consumer", exchange: "NASDAQ", price: 198.34, change: 0.92, volume: "41.6M", marketCap: "$2.08T", pe: "38.4", seed: 204, blurb: "Retail scale plus cloud margins give the story two engines on the same ticker." },
  { symbol: "GOOGL", name: "Alphabet", kind: "stock", sector: "Communication", exchange: "NASDAQ", price: 172.55, change: -0.41, volume: "28.4M", marketCap: "$2.12T", pe: "23.6", seed: 205, blurb: "Search cash flow funding a long cycle of cloud and model investment." },
  { symbol: "META", name: "Meta Platforms", kind: "stock", sector: "Communication", exchange: "NASDAQ", price: 592.18, change: 1.12, volume: "16.8M", marketCap: "$1.50T", pe: "26.4", seed: 206, blurb: "Advertising efficiency and engagement remain the core of the rerating." },
  { symbol: "TSLA", name: "Tesla", kind: "stock", sector: "Consumer", exchange: "NASDAQ", price: 255.73, change: -1.86, volume: "88.2M", marketCap: "$821B", pe: "72.5", seed: 207, blurb: "A high-beta name where delivery headlines still move the whole book." },
  { symbol: "JPM", name: "JPMorgan Chase", kind: "stock", sector: "Financials", exchange: "NYSE", price: 228.91, change: 0.54, volume: "9.4M", marketCap: "$658B", pe: "12.1", seed: 208, blurb: "Net interest income and markets revenue keep the money-center complex supported." },
  { symbol: "XOM", name: "Exxon Mobil", kind: "stock", sector: "Energy", exchange: "NYSE", price: 118.42, change: -0.36, volume: "18.7M", marketCap: "$522B", pe: "14.8", seed: 209, blurb: "Integrated oil cash returns versus a softer crude tape." },
  { symbol: "JNJ", name: "Johnson & Johnson", kind: "stock", sector: "Healthcare", exchange: "NYSE", price: 162.77, change: 0.22, volume: "7.1M", marketCap: "$392B", pe: "16.9", seed: 210, blurb: "Defensive healthcare cash flow when the tape turns selective." },
  { symbol: "V", name: "Visa", kind: "stock", sector: "Financials", exchange: "NYSE", price: 312.64, change: 0.77, volume: "6.8M", marketCap: "$608B", pe: "30.2", seed: 211, blurb: "Payments volume is the cleanest read-through on consumer spend." },
  { symbol: "AMD", name: "AMD", kind: "stock", sector: "Technology", exchange: "NASDAQ", price: 164.29, change: 1.95, volume: "52.6M", marketCap: "$266B", pe: "88.4", seed: 212, blurb: "Data-center share gains keep the semiconductor complex in motion." },
  { symbol: "NFLX", name: "Netflix", kind: "stock", sector: "Communication", exchange: "NASDAQ", price: 782.15, change: -0.58, volume: "4.2M", marketCap: "$336B", pe: "42.7", seed: 213, blurb: "Pricing power and a fuller content slate are the debate into the next print." },
  { symbol: "BA", name: "Boeing", kind: "stock", sector: "Industrials", exchange: "NYSE", price: 172.08, change: 0.33, volume: "6.4M", marketCap: "$128B", pe: "—", seed: 214, blurb: "Delivery cadence and backlog quality drive the industrial bid." },
  { symbol: "DIS", name: "Walt Disney", kind: "stock", sector: "Communication", exchange: "NYSE", price: 102.46, change: -0.72, volume: "11.3M", marketCap: "$186B", pe: "18.4", seed: 215, blurb: "Parks cash versus streaming profitability is still the split in the story." },
];

export const INSTRUMENTS = RAW.map((item) => {
  const path = makePath(item.price, item.change, 22, item.seed);
  return { ...item, ...path, price: item.price, baseChange: item.change };
});

export const QUOTE_BOOK = Object.fromEntries(INSTRUMENTS.map((item) => [item.symbol, item]));

export const SESSIONS = [
  { id: "US", label: "New York", tz: "America/New_York", open: 9 * 60 + 30, close: 16 * 60 },
  { id: "IN", label: "Mumbai", tz: "Asia/Kolkata", open: 9 * 60 + 15, close: 15 * 60 + 30 },
  { id: "UK", label: "London", tz: "Europe/London", open: 8 * 60, close: 16 * 60 + 30 },
  { id: "JP", label: "Tokyo", tz: "Asia/Tokyo", open: 9 * 60, close: 15 * 60 },
];

export const SECTOR_COLORS = {
  Technology: "#7ec8ff",
  Consumer: "#e4b15a",
  Communication: "#c4b5fd",
  Financials: "#3ddc97",
  Energy: "#fb7185",
  Healthcare: "#67e8f9",
  Industrials: "#fdba74",
  Cash: "#94a3b8",
  Other: "#94a3b8",
};

export const PERFORMANCE = {
  "1D": curve(28, 11, 0.0016),
  "1W": curve(20, 21, 0.004),
  "1M": curve(30, 31, 0.0032),
  "1Y": curve(24, 41, 0.011),
};

export const BENCHMARK = {
  "1D": curve(28, 12, 0.0005),
  "1W": curve(20, 22, 0.0022),
  "1M": curve(30, 32, 0.0016),
  "1Y": curve(24, 42, 0.0065),
};

export const RANGE_LABELS = {
  "1D": ["9:30", "11:00", "12:30", "2:00", "4:00"],
  "1W": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "1M": ["Week 1", "Week 2", "Week 3", "Week 4"],
  "1Y": ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
};

export const INITIAL_CASH = 18420.55;

export const INITIAL_HOLDINGS = [
  { symbol: "AAPL", shares: 24, avg: 176.4 },
  { symbol: "MSFT", shares: 12, avg: 392.15 },
  { symbol: "NVDA", shares: 20, avg: 104.8 },
  { symbol: "AMZN", shares: 15, avg: 168.2 },
  { symbol: "JPM", shares: 18, avg: 198.5 },
  { symbol: "V", shares: 8, avg: 274.3 },
];

export const INITIAL_ORDERS = [
  { id: "AX-10482", side: "buy", symbol: "NVDA", qty: 4, price: 146.2, notion: 584.8, type: "market", time: "Nov 2, 9:42 AM" },
  { id: "AX-10471", side: "sell", symbol: "DIS", qty: 6, price: 101.15, notion: 606.9, type: "limit", time: "Nov 2, 9:16 AM" },
];

export const DEFAULT_WATCHLIST = ["NVDA", "TSLA", "META", "AMD", "NFLX"];

export const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/markets", label: "Markets" },
  { to: "/stocks", label: "Stocks" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/about", label: "About" },
];
