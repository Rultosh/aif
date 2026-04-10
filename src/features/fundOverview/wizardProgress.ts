/** Session keys for preliminary wizard unlock state (per application id). */

export const wizardFundCompleteKey = (prelimId: string) => `vcf_wizard_${prelimId}_fundComplete`;
export const wizardDeclarationCompleteKey = (prelimId: string) => `vcf_wizard_${prelimId}_declarationComplete`;
export const wizardAccordionMaxKey = (prelimId: string) => `vcf_wizard_${prelimId}_accordionMax`;

export function markFundStepComplete(prelimId: string | undefined) {
    const pid = String(prelimId ?? '');
    if (!pid || pid.toUpperCase() === 'NEW' || !Number(pid)) return;
    sessionStorage.setItem(wizardFundCompleteKey(pid), '1');
}

export function markDeclarationStepComplete(prelimId: string | undefined) {
    const pid = String(prelimId ?? '');
    if (!pid || pid.toUpperCase() === 'NEW' || !Number(pid)) return;
    sessionStorage.setItem(wizardDeclarationCompleteKey(pid), '1');
}

export function readAccordionMaxPanel(prelimId: string | undefined, unlockedAll: boolean): number {
    if (unlockedAll) return 7;
    const pid = String(prelimId ?? '');
    if (!Number(pid)) return 1;
    const v = sessionStorage.getItem(wizardAccordionMaxKey(pid));
    const n = v ? parseInt(v, 10) : 1;
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.min(7, n);
}

export function writeAccordionMaxPanel(prelimId: string | undefined, max: number) {
    const pid = String(prelimId ?? '');
    if (!Number(pid)) return;
    const clamped = Math.min(7, Math.max(1, max));
    sessionStorage.setItem(wizardAccordionMaxKey(pid), String(clamped));
}
