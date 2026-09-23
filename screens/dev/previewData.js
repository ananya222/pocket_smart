const baseTransactions = [
  { id: "tx-lunch", title: "Lunch", category: "Food & Drinks", amount: -180, date: "28 Aug", createdAt: new Date(2026, 7, 28, 13, 10) },
  { id: "tx-metro", title: "Metro", category: "Transport", amount: -45, date: "28 Aug", createdAt: new Date(2026, 7, 28, 9, 5) },
  { id: "tx-coffee", title: "Coffee", category: "Food & Drinks", amount: -120, date: "27 Aug", createdAt: new Date(2026, 7, 27, 17, 20) },
  { id: "tx-movie", title: "Movie", category: "Entertainment", amount: -350, date: "25 Aug", createdAt: new Date(2026, 7, 25, 20, 30) },
  { id: "tx-books", title: "Books", category: "Education", amount: -600, date: "23 Aug", createdAt: new Date(2026, 7, 23, 16, 15) },
];

const baseGoals = [
  { id: "goal-headphones", name: "Sony Headphones", target: 8000, progressAmount: 2650, active: true, priority: 2 },
  { id: "goal-goa", name: "Goa Trip", target: 5000, progressAmount: 1550, active: true, priority: 3 },
];

export const PREVIEW_USER = {
  id: "preview-user",
  fullName: "Poorab",
  email: "poorab@pocketsmart.dev",
  onboardingCompleted: true,
  onboarding: {
    allowance_amount: "10,000",
    allowance_frequency: "Monthly",
    spending_ratio: "70",
    saving_ratio: "30",
    current_balance: "6,420",
    cycle_limit: "10,000",
  },
};

const userWithBudget = (allowance, balance, frequency = "Monthly", fullName = "Poorab", ratios = { spending_ratio: "70", saving_ratio: "30" }) => ({
  ...PREVIEW_USER,
  fullName,
  onboarding: {
    ...PREVIEW_USER.onboarding,
    allowance_amount: String(allowance),
    allowance_frequency: frequency,
    current_balance: String(balance),
    cycle_limit: String(allowance),
    ...ratios,
  },
});

export const PREVIEW_SCENARIOS = {
  normal: {
    label: "Normal populated",
    description: "The everyday example account with goals and recent spending.",
    user: userWithBudget("10,000", "6,420"),
    goals: baseGoals,
    transactions: baseTransactions,
  },
  empty: {
    label: "Empty / new account",
    description: "A newly set-up account with no goals or transactions yet.",
    user: userWithBudget("0", "0", "Monthly"),
    goals: [],
    transactions: [],
  },
  low: {
    label: "Low remaining budget",
    description: "Most of the monthly allowance has already been spent.",
    user: userWithBudget("10,000", "1,200"),
    goals: [baseGoals[0]],
    transactions: [
      { id: "tx-rent", title: "Dinner out", category: "Food & Drinks", amount: -1800, date: "27 Aug", createdAt: new Date(2026, 7, 27) },
      { id: "tx-shopping", title: "Shopping", category: "Shopping", amount: -4200, date: "24 Aug", createdAt: new Date(2026, 7, 24) },
      { id: "tx-trip", title: "Cab rides", category: "Transport", amount: -2800, date: "21 Aug", createdAt: new Date(2026, 7, 21) },
    ],
  },
  overspent: {
    label: "Overspent budget",
    description: "Transactions exceed the current cycle allowance.",
    user: userWithBudget("5,000", "0"),
    goals: [baseGoals[1]],
    transactions: [
      { id: "tx-overspend-1", title: "Weekend shopping", category: "Shopping", amount: -2900, date: "27 Aug", createdAt: new Date(2026, 7, 27) },
      { id: "tx-overspend-2", title: "Concert ticket", category: "Entertainment", amount: -2100, date: "25 Aug", createdAt: new Date(2026, 7, 25) },
      { id: "tx-overspend-3", title: "Late-night food", category: "Food & Drinks", amount: -1120, date: "24 Aug", createdAt: new Date(2026, 7, 24) },
    ],
    previewSpent: 6120,
    overspent: true,
  },
  multipleGoals: {
    label: "Multiple savings goals",
    description: "Several active goals plus one completed goal.",
    user: userWithBudget("18,000", "11,860"),
    goals: [
      ...baseGoals,
      { id: "goal-laptop", name: "New laptop", target: 75000, progressAmount: 18400, active: true, priority: 4 },
      { id: "goal-emergency", name: "Emergency fund", target: 25000, progressAmount: 25000, active: false, priority: 5 },
    ],
    transactions: baseTransactions,
  },
  oneGoal: {
    label: "One savings goal",
    description: "A single active goal for checking simple goal layouts.",
    user: userWithBudget("10,000", "6,420"),
    goals: [baseGoals[0]],
    transactions: baseTransactions,
  },
  longGoalName: {
    label: "Long goal names",
    description: "Long goal titles to check wrapping in tile layouts.",
    user: userWithBudget("10,000", "6,420"),
    goals: [{ id: "goal-long-name", name: "Noise cancelling travel headphones", target: 18000, progressAmount: 6250, active: true, priority: 2 }],
    transactions: baseTransactions,
  },
  longName: {
    label: "Long username",
    description: "Checks greetings, avatars, and profile layout with a long name.",
    user: userWithBudget("10,000", "6,420", "Monthly", "Poorab Raghavendra Narayanan"),
    goals: baseGoals,
    transactions: baseTransactions,
  },
  largeAmounts: {
    label: "Large monetary amounts",
    description: "Large rupee values to catch wrapping and number formatting issues.",
    user: userWithBudget("1,00,000", "64,200", "Monthly", "Poorab", { spending_ratio: "65", saving_ratio: "35" }),
    goals: [
      { id: "goal-large-home", name: "Home setup", target: 500000, progressAmount: 126500, active: true, priority: 2 },
      { id: "goal-large-trip", name: "Europe trip", target: 250000, progressAmount: 98500, active: true, priority: 3 },
    ],
    transactions: [
      { id: "tx-large-1", title: "Laptop EMI", category: "Bills & Utilities", amount: -18500, date: "26 Aug", createdAt: new Date(2026, 7, 26) },
      { id: "tx-large-2", title: "Home furniture", category: "Shopping", amount: -24800, date: "22 Aug", createdAt: new Date(2026, 7, 22) },
      { id: "tx-large-3", title: "Flight booking", category: "Transport", amount: -12400, date: "18 Aug", createdAt: new Date(2026, 7, 18) },
    ],
  },
};

export const getPreviewScenario = (key = "normal") => {
  const source = PREVIEW_SCENARIOS[key] || PREVIEW_SCENARIOS.normal;
  return {
    ...source,
    key: PREVIEW_SCENARIOS[key] ? key : "normal",
    user: { ...source.user, onboarding: { ...source.user.onboarding } },
    goals: source.goals.map((goal) => ({ ...goal })),
    transactions: source.transactions.map((transaction) => ({ ...transaction })),
  };
};
