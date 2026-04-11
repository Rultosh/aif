/** Session keys for preliminary wizard unlock state (per application id). */

export const wizardFundCompleteKey = (prelimId: string) => `vcf_wizard_${prelimId}_fundComplete`;
export const wizardDeclarationCompleteKey = (prelimId: string) => `vcf_wizard_${prelimId}_declarationComplete`;

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
