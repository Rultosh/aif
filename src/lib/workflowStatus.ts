/** Maps legacy workflow status values stored before manager role removal. */
export function normalizeWorkflowStatus(status: string | undefined): string {
    const s = String(status || '').trim().toUpperCase();
    switch (s) {
        case 'REVERTED_TO_MANAGER':
            return 'REVERTED_TO_CHECKER';
        case 'CHECKER_FORWARDED_TO_MANAGER':
            return 'CHECKER_FORWARDED_TO_USERADMIN';
        case 'MANAGER_FORWARDED_TO_PF':
            return 'USERADMIN_FORWARDED_TO_PF';
        default:
            return s;
    }
}

export function hasCheckerAndUserAdmin(role: string | undefined): boolean {
    const parts = String(role || '')
        .split(',')
        .map((r) => r.trim().toUpperCase())
        .filter(Boolean);
    return parts.includes('CHECKER') && parts.includes('USERADMIN');
}

/** USERADMIN only — excludes CHECKER+USERADMIN (legacy manager combo). */
export function hasStandaloneUserAdmin(role: string | undefined): boolean {
    const parts = String(role || '')
        .split(',')
        .map((r) => r.trim().toUpperCase())
        .filter(Boolean);
    return parts.includes('USERADMIN') && !parts.includes('CHECKER');
}

export const WORKFLOW_STATUS_LABELS: Record<string, string> = {
    REVERTED_TO_CHECKER: 'Reverted to Checker',
    REVERTED_TO_MANAGER: 'Reverted to Checker',
    CHECKER_FORWARDED_TO_USERADMIN: 'Forwarded to User Admin',
    CHECKER_FORWARDED_TO_MANAGER: 'Forwarded to User Admin',
    USERADMIN_FORWARDED_TO_PF: 'Forwarded to PF',
    MANAGER_FORWARDED_TO_PF: 'Forwarded to PF',
};
