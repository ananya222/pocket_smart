const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const getCycleDays = (frequency = "Monthly", date = new Date()) => {
  if (String(frequency).toLowerCase() === "weekly") return 7;
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getRemainingDays = (frequency = "Monthly", date = new Date()) => {
  if (String(frequency).toLowerCase() === "weekly") {
    // Keep the existing product convention: Sunday starts a fresh 7-day view.
    return Math.max(1, 7 - date.getDay());
  }
  return Math.max(1, getCycleDays(frequency, date) - date.getDate() + 1);
};

export const calculateSafeToSpend = ({ balance = 0, remainingDays = 0 }) => {
  const cleanBalance = Math.max(0, Number(balance) || 0);
  const cleanDays = Number(remainingDays) || 0;
  if (cleanDays <= 0) return cleanBalance;
  return Math.max(0, Math.floor(cleanBalance / cleanDays));
};

export const calculateBudgetSummary = ({ allowance = 0, balance = 0 }) => {
  const cleanAllowance = Math.max(0, Number(allowance) || 0);
  const cleanBalance = Math.max(0, Number(balance) || 0);
  const spent = Math.max(0, cleanAllowance - cleanBalance);
  return {
    allowance: cleanAllowance,
    balance: cleanBalance,
    spent,
    usedPercent: cleanAllowance > 0 ? clamp(Math.round((spent / cleanAllowance) * 100), 0, 100) : 0,
  };
};
