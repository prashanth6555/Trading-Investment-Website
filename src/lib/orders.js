function makeOrder(input, price, notion) {
  return {
    id: `AX-${Math.floor(10000 + Math.random() * 90000)}`,
    side: input.side,
    symbol: input.symbol,
    qty: Number(input.qty),
    price,
    notion,
    type: input.type || "market",
    time: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export function applyOrder(desk, input) {
  const qty = Number(input.qty);
  const price = +Number(input.price).toFixed(2);
  if (!input.symbol) return { ok: false, error: "Choose a symbol." };
  if (!Number.isInteger(qty) || qty <= 0) {
    return { ok: false, error: "Enter a whole number of shares." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "Price must be greater than zero." };
  }

  const notion = +(qty * price).toFixed(2);
  const existing = desk.holdings.find((holding) => holding.symbol === input.symbol);

  if (input.side === "sell") {
    if (!existing || existing.shares < qty) {
      return { ok: false, error: "You do not hold enough shares to sell." };
    }
    const shares = existing.shares - qty;
    const holdings = shares === 0
      ? desk.holdings.filter((holding) => holding.symbol !== input.symbol)
      : desk.holdings.map((holding) => (holding.symbol === input.symbol ? { ...holding, shares } : holding));
    const order = makeOrder(input, price, notion);
    return {
      ok: true,
      order,
      desk: {
        ...desk,
        cash: +(desk.cash + notion).toFixed(2),
        holdings,
        orders: [order, ...desk.orders].slice(0, 20),
      },
    };
  }

  if (desk.cash + 1e-6 < notion) {
    return { ok: false, error: "Not enough buying power for this order." };
  }

  let holdings;
  if (existing) {
    const shares = existing.shares + qty;
    const avg = +((existing.avg * existing.shares + notion) / shares).toFixed(4);
    holdings = desk.holdings.map((holding) => (
      holding.symbol === input.symbol ? { ...holding, shares, avg } : holding
    ));
  } else {
    holdings = [...desk.holdings, { symbol: input.symbol, shares: qty, avg: price }];
  }

  const order = makeOrder(input, price, notion);
  return {
    ok: true,
    order,
    desk: {
      ...desk,
      cash: +(desk.cash - notion).toFixed(2),
      holdings,
      orders: [order, ...desk.orders].slice(0, 20),
    },
  };
}
