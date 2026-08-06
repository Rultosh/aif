import { fetchActiveNdaConfig } from '../admin/adminApi';
import FileUploadService from '../../components/FileUploadService';
import { getFileServerBaseUrl } from '../../lib/fileServerBaseUrl';

const VERSION_STORAGE_KEY = 'vcf.nda.cacheVersion';

type NdaCacheEntry = {
  fileName: string;
  bucket: string;
  blobUrl: string;
  version: string;
};

let memoryEntry: NdaCacheEntry | null = null;

function readCacheVersion(): string {
  try {
    return localStorage.getItem(VERSION_STORAGE_KEY) || '0';
  } catch {
    return '0';
  }
}

function bumpCacheVersion(): string {
  const next = String(Date.now());
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, next);
  } catch {
    // ignore quota / private mode
  }
  return next;
}

function resolveNdaFileUrl(storedUrl: string | undefined, bucket: string, fileName: string): string {
  if (storedUrl && /^https?:\/\//i.test(storedUrl)) {
    return storedUrl;
  }
  const base = getFileServerBaseUrl().replace(/\/+$/, '');
  const safeName = String(fileName).split('/').pop() || String(fileName);
  return `${base}/files/${bucket}/${encodeURIComponent(safeName).replace(/%2F/gi, '')}`;
}

/**
 * Drop in-memory NDA blob and bump a shared version so other tabs refetch.
 * Call after admin upload / replace / delete of the active NDA.
 */
export function invalidateNdaDocumentCache(): void {
  if (memoryEntry?.blobUrl) {
    try {
      URL.revokeObjectURL(memoryEntry.blobUrl);
    } catch {
      // ignore
    }
  }
  memoryEntry = null;
  bumpCacheVersion();
}

export type NdaLoadResult =
  | { ok: true; blobUrl: string; fileName: string; fromCache: boolean }
  | { ok: false; error: string };

/**
 * Returns a blob: URL for the active NDA PDF.
 * Reuses an in-memory blob when file name + cache version still match (fast path).
 * Skips the file-server list call and downloads by configured file name.
 */
export async function getCachedOrFetchNdaPdf(): Promise<NdaLoadResult> {
  const version = readCacheVersion();

  if (
    memoryEntry &&
    memoryEntry.version === version &&
    memoryEntry.blobUrl
  ) {
    return {
      ok: true,
      blobUrl: memoryEntry.blobUrl,
      fileName: memoryEntry.fileName,
      fromCache: true,
    };
  }

  const res = await fetchActiveNdaConfig();
  const cfg = res?.data;
  if (!cfg?.available || !cfg?.fileName) {
    invalidateNdaDocumentCache();
    return {
      ok: false,
      error: 'No active NDA document is available. Please contact the administrator.',
    };
  }

  const bucket = cfg.bucket || 'configNdaActive';
  const fileName = String(cfg.fileName);

  // Same document already cached under a previous version bump that didn't change the name —
  // still refetch bytes if version changed (admin replace with same file name).
  if (
    memoryEntry &&
    memoryEntry.version === version &&
    memoryEntry.fileName === fileName &&
    memoryEntry.bucket === bucket &&
    memoryEntry.blobUrl
  ) {
    return {
      ok: true,
      blobUrl: memoryEntry.blobUrl,
      fileName: memoryEntry.fileName,
      fromCache: true,
    };
  }

  const fileUrl = resolveNdaFileUrl(undefined, bucket, fileName);
  let blob: Blob;
  try {
    blob = await FileUploadService.getBlob(fileUrl);
  } catch (fetchErr: any) {
    const status = fetchErr?.response?.status;
    return {
      ok: false,
      error:
        status === 404
          ? 'NDA file could not be downloaded (not found). Re-upload the NDA in Admin → Configurations, and ensure the file server was restarted after the latest update.'
          : (fetchErr?.message || 'Failed to load the NDA document.'),
    };
  }

  if (!(blob instanceof Blob) || blob.size === 0) {
    return { ok: false, error: 'Failed to load the NDA document.' };
  }

  const pdfBlob =
    blob.type === 'application/pdf'
      ? blob
      : new Blob([blob], { type: 'application/pdf' });

  if (memoryEntry?.blobUrl) {
    try {
      URL.revokeObjectURL(memoryEntry.blobUrl);
    } catch {
      // ignore
    }
  }

  const blobUrl = URL.createObjectURL(pdfBlob);
  memoryEntry = {
    fileName,
    bucket,
    blobUrl,
    version,
  };

  return { ok: true, blobUrl, fileName, fromCache: false };
}
