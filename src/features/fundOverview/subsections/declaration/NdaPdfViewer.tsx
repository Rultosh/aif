import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type NdaPdfViewerProps = {
  fileUrl: string | null;
  /** When true (already accepted), treat as scrolled-to-end without requiring scroll. */
  initiallyComplete?: boolean;
  onScrolledToEnd: () => void;
};

/**
 * Scrollable in-app NDA PDF viewer (no download UI). Fires onScrolledToEnd once the user reaches the bottom.
 */
export default function NdaPdfViewer({ fileUrl, initiallyComplete, onScrolledToEnd }: NdaPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = !!initiallyComplete;
    if (initiallyComplete) {
      onScrolledToEnd();
    }
  }, [initiallyComplete, onScrolledToEnd]);

  useEffect(() => {
    setNumPages(0);
    setLoadError("");
    setLoading(!!fileUrl);
    if (!initiallyComplete) {
      completedRef.current = false;
    }
  }, [fileUrl, initiallyComplete]);

  const markComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onScrolledToEnd();
  }, [onScrolledToEnd]);

  const checkScrollPosition = useCallback(() => {
    const el = containerRef.current;
    if (!el || completedRef.current) return;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (remaining <= 24) {
      markComplete();
    }
  }, [markComplete]);

  useEffect(() => {
    // Short single-page PDFs may already fit without scrolling.
    const t = window.setTimeout(() => checkScrollPosition(), 200);
    return () => window.clearTimeout(t);
  }, [numPages, fileUrl, checkScrollPosition]);

  if (!fileUrl) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No active NDA document is available. Please contact the administrator.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      onScroll={checkScrollPosition}
      sx={{
        height: 420,
        overflowY: "auto",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        position: "relative",
      }}
    >
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {loadError ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="error">
            {loadError}
          </Typography>
        </Box>
      ) : (
        <Document
          file={fileUrl}
          loading=""
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n);
            setLoading(false);
          }}
          onLoadError={() => {
            setLoading(false);
            setLoadError("Failed to load the NDA PDF. Please try again later.");
          }}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Box key={`nda-page-${i + 1}`} sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <Page
                pageNumber={i + 1}
                width={Math.min(720, (typeof window !== "undefined" ? window.innerWidth : 720) - 120)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Box>
          ))}
        </Document>
      )}
    </Box>
  );
}
