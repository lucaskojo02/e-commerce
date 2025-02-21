export function formatCurrency(priceCents) {
    let priceDollars = (Math.round(priceCents) / 100).toFixed(2);
    return priceDollars >= 1000 ? Number(priceDollars).toLocaleString("en-US", { minimumFractionDigits: 2 }) : priceDollars;
}