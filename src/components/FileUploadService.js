import api from "../app/fileServerApi";

class FileUploadService {
  sanitizeFilename(filename) {
    if (!filename) {
      return "upload";
    }
    const trimmed = String(filename).trim();
    const lastDot = trimmed.lastIndexOf(".");
    const hasExt = lastDot > 0 && lastDot < trimmed.length - 1;
    const base = hasExt ? trimmed.slice(0, lastDot) : trimmed;
    const ext = hasExt ? trimmed.slice(lastDot + 1) : "";

    // Server rejects names with multiple dots in basename and path-like characters.
    const safeBase = base
      .replace(/[.]+/g, "_")
      .replace(/[\/\\]/g, "_")
      .replace(/\s+/g, " ")
      .replace(/[^\w\s()-]/g, "_")
      .trim()
      .replace(/\s/g, "_")
      .replace(/_+/g, "_");

    const safeExt = ext.replace(/[^\w]/g, "").toLowerCase();
    const normalizedBase = safeBase || "upload";
    return safeExt ? `${normalizedBase}.${safeExt}` : normalizedBase;
  }

  upload(bucket, file, signed, onUploadProgress) {
    let formData = new FormData();

    let url = `files/${bucket}`;

    if(signed) {
      url += "?signed=true"
    }

    const safeName = this.sanitizeFilename(file?.name);
    const fileToUpload = (file && safeName !== file.name)
      ? new File([file], safeName, { type: file.type, lastModified: file.lastModified })
      : file;

    formData.append("file", fileToUpload);
    return api({
      method: 'post',
      url: url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }).then((response) => ({
      ...response,
      data: {
        ...(response?.data || {}),
        name: safeName,
      },
    }));

  }

  list(bucket) {
    return api({
      method: 'get',
      url: `/files/${bucket}`,
    });

  }

  delete(file) {
    return api({
      method: 'delete',
      url: `/files/${file.bucket}/${file.name}`,
    });

  }
}

export default new FileUploadService();