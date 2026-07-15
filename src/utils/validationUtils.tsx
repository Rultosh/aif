import { Typography } from "@mui/material";
import * as Yup from "yup";

export const FIELD_LIMITS = {
    SHORT_TEXT: 200,
    ADDRESS: 500,
    LONG_TEXT: 1000,
};

export const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
export const htmlTagsNotAllowed = "Tags not allowed in input.";
export const freeformRegx = /^[^<>{}\[\]]*$/;

export const isResumeField = (id: string = '') => 
    ['resume', 'cv', 'experience', 'curriculum'].some(keyword => id.toLowerCase().includes(keyword));

export const wordLimit = (maxWords: number) => {
    return (value: any) => {
        if (!value) return true;
        const words = value.trim().split(/\s+/).filter(Boolean).length;
        return words <= maxWords;
    };
};

interface FieldCounterProps {
    currentCount: number;
    maxCount: number;
    type: 'characters' | 'words';
}

export const FieldCounter = ({ currentCount, maxCount, type }: FieldCounterProps) => {
    if (currentCount === 0 && type === 'characters') return null; // Keep existing behavior for chars

    return (
        <Typography variant="caption" sx={{ color: currentCount >= maxCount ? '#d32f2f' : '#64748b', mt: 0.5, display: 'block' }}>
            {currentCount}/{maxCount} {type}
        </Typography>
    );
};

export const getCharCount = (value: any, maxChars: number) => {
    const currentLength = String(value || '').length;
    return <FieldCounter currentCount={currentLength} maxCount={maxChars} type="characters" />;
};

export const getWordCount = (value: any, maxWords: number) => {
    const currentLength = String(value || '').trim().split(/\s+/).filter(Boolean).length;
    if (!value) return null; // Keep existing behavior for words
    return <FieldCounter currentCount={currentLength} maxCount={maxWords} type="words" />;
};

export const standardNumericValidation = (fieldName: string = "This field") => {
    return Yup.number()
        .transform((val, orig) => (orig === '' ? undefined : val))
        .typeError(`${fieldName} must be a number`)
        .required(`${fieldName} is required`)
        .test('no-scientific', 'Scientific notation or exponential values are not allowed', function (value, ctx) {
            if (value === null || value === undefined) return true;
            const original = String((ctx as any).originalValue);
            return !/[eE]/.test(original);
        })
        .test('is-valid-number', 'Invalid numeric format (Max 4 digits before decimal, 2 after)', function (value, ctx) {
            if (value === null || value === undefined) return true;
            const original = String((ctx as any).originalValue);
            return /^\d{1,4}(\.\d{1,2})?$/.test(original);
        })
        .max(9999.00, 'Maximum allowed value is 9999.00')
        .min(0, 'Negative values not allowed');
};

/**
 * Real-time keystroke blocker for numeric inputs.
 * - Blocks scientific notation (e, E, +, -)
 * - Limits integer part to max 4 digits
 * - Limits decimal part to max 2 digits
 * Use as: onKeyDown={blockOverflowNumericInput}
 */
export const blockOverflowNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    // Always block scientific notation and sign characters
    if (["e", "E", "+", "-"].includes(key)) {
        e.preventDefault();
        return;
    }

    // Only apply length limit to digit keypresses
    if (!/^\d$/.test(key)) return;

    const target = e.target as HTMLInputElement;
    const value = target.value;
    const selectionStart = target.selectionStart ?? value.length;
    const selectionEnd = target.selectionEnd ?? value.length;

    // If the user has text selected, allow the keypress (it will replace selection)
    if (selectionStart !== selectionEnd) return;

    const dotIndex = value.indexOf(".");

    if (dotIndex === -1) {
        // No decimal point yet: limit entire value to 4 digits
        if (value.length >= 4) {
            e.preventDefault();
        }
    } else if (selectionStart <= dotIndex) {
        // Cursor is in the integer part
        const integerPart = value.substring(0, dotIndex);
        if (integerPart.length >= 4) {
            e.preventDefault();
        }
    } else {
        // Cursor is in the decimal part
        const decimalPart = value.substring(dotIndex + 1);
        if (decimalPart.length >= 2) {
            e.preventDefault();
        }
    }
};
