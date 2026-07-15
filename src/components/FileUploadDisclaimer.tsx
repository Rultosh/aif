import React from 'react';
import { Typography, Box } from '@mui/material';

export interface FileUploadDisclaimerProps {
  isResume?: boolean;
  maxSize?: string;
  supportedFormats?: string[];
  isBundle?: boolean;
}

export default function FileUploadDisclaimer({
  isResume = false,
  maxSize = localStorage.getItem('maxFileSizeMb') ? `${localStorage.getItem('maxFileSizeMb')}MB` : "25MB",
  supportedFormats = [],
  isBundle = false,
}: FileUploadDisclaimerProps) {
  // Determine formats dynamically if not provided
  let formats = supportedFormats;
  if (formats.length === 0) {
    if (isResume) {
      formats = ["PDF", "Word"];
    } else {
      formats = ["PDF", "Word", "Excel", "ZIP"];
    }
  }

  return (
    <Box>
      <Typography sx={{ mt: 1, fontSize: '13px', color: '#64748b' }}>
        <strong>Note:</strong> Supported document formats: <strong>{formats.join(', ')}</strong>. {isBundle ? 'Maximum file size for each file' : 'Max file size'}: <strong>{maxSize}</strong>.
      </Typography>
      {isResume && (
        <Typography sx={{ mt: 0.5, fontSize: '13px', color: '#64748b' }}>
          <strong>Note:</strong> The filename must contain at least one of the following keywords: CV, Resume, Experience, or Curriculum.
        </Typography>
      )}
    </Box>
  );
}
