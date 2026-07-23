/** Configured IA pass thresholds (average score) by manager × fund type. */
export type IaPassThresholds = {
  firstTimeEquity: number;
  firstTimeDebt: number;
  experiencedEquity: number;
  experiencedDebt: number;
};

export const DEFAULT_IA_PASS_THRESHOLDS: IaPassThresholds = {
  firstTimeEquity: 5,
  firstTimeDebt: 5,
  experiencedEquity: 5,
  experiencedDebt: 5,
};

export function isFirstTimeFundManagerType(managerType: string | undefined | null): boolean {
  if (managerType == null || String(managerType).trim() === '') return true;
  return String(managerType).trim().toLowerCase() === 'first time fund manager';
}

export function isDebtOrientedFund(fundType: string | undefined | null): boolean {
  if (fundType == null || String(fundType).trim() === '') return false;
  return String(fundType).trim().toLowerCase() === 'debt oriented fund';
}

export function resolveIaPassThreshold(
  thresholds: IaPassThresholds | undefined | null,
  managerType: string | undefined | null,
  fundType: string | undefined | null
): number {
  const t = thresholds || DEFAULT_IA_PASS_THRESHOLDS;
  const firstTime = isFirstTimeFundManagerType(managerType);
  const debt = isDebtOrientedFund(fundType);
  if (firstTime) return debt ? t.firstTimeDebt : t.firstTimeEquity;
  return debt ? t.experiencedDebt : t.experiencedEquity;
}

export function normalizeIaPassThresholds(raw: any): IaPassThresholds {
  const num = (v: unknown, fallback: number) => {
    const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
    if (!Number.isFinite(n)) return fallback;
    return Math.min(10, Math.max(1, n));
  };
  return {
    firstTimeEquity: num(raw?.firstTimeEquity, DEFAULT_IA_PASS_THRESHOLDS.firstTimeEquity),
    firstTimeDebt: num(raw?.firstTimeDebt, DEFAULT_IA_PASS_THRESHOLDS.firstTimeDebt),
    experiencedEquity: num(raw?.experiencedEquity, DEFAULT_IA_PASS_THRESHOLDS.experiencedEquity),
    experiencedDebt: num(raw?.experiencedDebt, DEFAULT_IA_PASS_THRESHOLDS.experiencedDebt),
  };
}
