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

const SCROLL_END_TOLERANCE_PX = 16;

/**
 * Scrollable in-app NDA PDF viewer (no download UI).
 * Enables acceptance only after the user reaches the bottom (or content fits after full render).
 */
export default function NdaPdfViewer({ fileUrl, initiallyComplete, onScrolledToEnd }: NdaPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pagesRendered, setPagesRendered] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const completedRef = useRef(false);
  const allPagesReady = numPages > 0 && pagesRendered >= numPages;

  useEffect(() => {
    completedRef.current = !!initiallyComplete;
    if (initiallyComplete) {
      onScrolledToEnd();
    }
  }, [initiallyComplete, onScrolledToEnd]);

  useEffect(() => {
    setNumPages(0);
    setPagesRendered(0);
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
    if (!el || completedRef.current || !allPagesReady) return;

    const overflow = el.scrollHeight - el.clientHeight;
    // Content fits in the viewport — no scroll possible; allow acceptance.
    if (overflow <= SCROLL_END_TOLERANCE_PX) {
      markComplete();
      return;
    }
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (remaining <= SCROLL_END_TOLERANCE_PX) {
      markComplete();
    }
  }, [allPagesReady, markComplete]);

  // Only evaluate after every page has rendered (avoids false "already at bottom" while height is still growing).
  useEffect(() => {
    if (!allPagesReady || initiallyComplete) return;
    const t = window.setTimeout(() => checkScrollPosition(), 100);
    return () => window.clearTimeout(t);
  }, [allPagesReady, initiallyComplete, checkScrollPosition]);

  const onPageRenderSuccess = useCallback(() => {
    setPagesRendered((n) => n + 1);
  }, []);

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
            setPagesRendered(0);
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
                onRenderSuccess={onPageRenderSuccess}
              />
            </Box>
          ))}
        </Document>
      )}
    </Box>
  );
}
