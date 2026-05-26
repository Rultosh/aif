import type { IPrelimApplicationData } from '../features/fundOverview/subsections/fundOverviewData/IPrelimApplicationData';

const EQUITY_AIF_TYPES = ['Equity Oriented AIF', 'Equity Oriented Fund'];
const DEBT_AIF_TYPES = ['Debt Oriented AIF', 'Debt Oriented Fund'];

/** Equity vs debt target-corpus bands from queue scoring methodology. */
export function isEquityOrientedAif(aifCategoryType: string | String | undefined): boolean {
    const raw = String(aifCategoryType ?? '').trim();
    if (DEBT_AIF_TYPES.includes(raw) || raw.toLowerCase().includes('debt')) return false;
    if (EQUITY_AIF_TYPES.includes(raw) || raw.toLowerCase().includes('equity')) return true;
    return true;
}

/** Initial assessment (average) score 0–10 from API-enriched field. */
export function parseInitialAssessmentScore(row: IPrelimApplicationData): number | null {
    const s = row.initialSelfRatingScore;
    if (s == null || String(s).trim() === '') return null;
    const n = parseFloat(String(s).replace(/,/g, ''));
    if (!Number.isFinite(n)) return null;
    return n;
}

/**
 * 0 = first-time IM/AMC, 10 = experienced (methodology).
 * Prefer prelim {@code fundManager} when set — it stays aligned with the fund form; self-rating-derived
 * {@code iaFundManagerExperience} can lag after edits.
 */
export function investmentExperienceScoreFromRow(row: IPrelimApplicationData): number | null {
    const fm = String(row.fundManager || '').trim();
    if (/first\s*time/i.test(fm)) return 0;
    if (/experienced/i.test(fm)) return 10;
    const exp = String(row.iaFundManagerExperience || '').trim();
    if (exp === 'Yes') return 0;
    if (exp === 'No') return 10;
    return null;
}

/** Yes / No for "Experienced IM/AMC?" (matches methodology wording; No = first-time). */
export function experiencedImAmcTableLabel(row: IPrelimApplicationData): string {
    const s = investmentExperienceScoreFromRow(row);
    if (s === 10) return 'Yes';
    if (s === 0) return 'No';
    return '—';
}

/** Target corpus in ₹ crores from prelim fund data. */
export function parseTargetCorpusCrores(row: IPrelimApplicationData): number | null {
    const v = row.sdTotalTargetCorpus as unknown;
    if (v == null || String(v).trim() === '') return null;
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
}

/** 0–10 component score from target corpus per methodology. */
export function targetCorpusComponentScore(crores: number, equityOriented: boolean): number {
    if (equityOriented) {
        if (crores <= 500) return 2;
        if (crores <= 1000) return 4;
        if (crores <= 2500) return 6;
        if (crores <= 5000) return 8;
        return 10;
    }
    if (crores <= 1000) return 2;
    if (crores <= 2500) return 4;
    if (crores <= 5000) return 6;
    if (crores <= 10000) return 8;
    return 10;
}

/**
 * Composite queue score (0–10): 70% IA + 30% target corpus.
 * Returns null if any required input is missing.
 */
export function computeCompositeQueueScore(row: IPrelimApplicationData): number | null {
    const ia = parseInitialAssessmentScore(row);
    const crores = parseTargetCorpusCrores(row);
    if (ia == null || crores == null) return null;
    const equity = isEquityOrientedAif(row.aifCategoryType);
    const target = targetCorpusComponentScore(crores, equity);
    const composite = ia * 0.7 + target * 0.3;
    return Math.round(composite * 100) / 100;
}
