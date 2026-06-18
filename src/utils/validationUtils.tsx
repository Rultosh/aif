import { Typography } from "@mui/material";

export const FIELD_LIMITS = {
    SHORT_TEXT: 200,
    ADDRESS: 500,
    LONG_TEXT: 1000,
};

export const checkScript = (value: any) => !value || !value.match(/<[^> ]*>/);
export const htmlTagsNotAllowed = "Tags not allowed in input.";
export const freeformRegx = /^[^<>{}\[\]]*$/;

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
