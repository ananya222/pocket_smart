const amountPattern = /(?:₹|\b(?:INR|Rs\.?|rupees?)\s*)\s*([0-9][0-9,]*(?:\.\d{1,2})?)/gi;
const spendPattern = /\b(?:debited|spent|purchase[ds]?|paid|payment\s+(?:of|for)|sent\s+(?:to|via)|withdrawn|withdrawal|transferred|txn|transaction|debit\s+(?:card|transaction))\b/i;
const nonExpensePattern = /\b(?:credited|refund(?:ed)?|cashback|received|failed|declined|reversed|deposited|returned)\b/i;
const verificationPattern = /\b(?:otp|one[ -]time[ -](?:password|code)|verification code)\b/i;

const categories = [
  ["Food & Drinks", /food|restaurant|cafe|coffee|swiggy|zomato|dining|bakery/i],
  ["Transport", /uber|ola|metro|fuel|petrol|diesel|bus|train|rapido/i],
  ["Shopping", /amazon|flipkart|myntra|shopping|retail/i],
  ["Entertainment", /netflix|spotify|cinema|movie|pvr|bookmyshow/i],
  ["Bills & Utilities", /electricity|water bill|gas bill|broadband|mobile recharge/i],
];

const merchantFrom = (body) => {
  const match = body.match(/\b(?:at|to|towards|merchant)\s*[:\-]?\s*([A-Z0-9][A-Z0-9 &.'@/_-]{1,40}?)(?=\s+(?:on|using|via|through|ref(?:erence)?|txn|transaction|upi|card|dated)\b|[.,;\n]|$)/i);
  return match?.[1]?.trim() || (/\bupi\b/i.test(body) ? "UPI payment" : /\bcard\b/i.test(body) ? "Card purchase" : "Bank expense");
};

export function parseExpenseSms(messages) {
  return messages.flatMap((message) => {
    const body = String(message.body || "");
    if (!spendPattern.test(body) || nonExpensePattern.test(body) || verificationPattern.test(body)) return [];
    const amountMatch = [...body.matchAll(amountPattern)][0];
    const amount = Number(amountMatch?.[1]?.replaceAll(",", ""));
    if (!Number.isFinite(amount) || amount <= 0) return [];

    const title = merchantFrom(body);
    const category = categories.find(([, pattern]) => pattern.test(`${title} ${body}`))?.[0] || "Misc";
    const date = new Date(Number(message.date));
    if (Number.isNaN(date.getTime())) return [];

    return [{
      sourceId: message.sourceId,
      title,
      category,
      amount: -amount,
      timestamp: date.getTime(),
      dateLabel: `${date.getDate()} ${date.toLocaleDateString("en-IN", { month: "short" })}`,
      monthLabel: date.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    }];
  });
}
