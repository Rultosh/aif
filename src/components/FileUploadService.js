import api from "../app/fileServerApi";

class FileUploadService {
  validateFilename(filename) {
    if (!filename) return "upload";
    // Fix for Null Byte Extension
    if (filename.includes('\0') || filename.includes('%00') || filename.includes('\\x00')) {
      throw new Error("Invalid filename: Null bytes are not allowed.");
    }
    // Fix for Double Extension
    const dotCount = (filename.match(/\./g) || []).length;
    if (dotCount > 1) {
      throw new Error("Invalid filename: Double extensions are not allowed.");
    }
    return filename;
  }

  upload(bucket, file, signed, onUploadProgress) {
    try {
      this.validateFilename(file?.name);
    } catch (error) {
      return Promise.reject({ message: error.message });
    }
    let formData = new FormData();
    let url = `files/${bucket}`;
    if (signed) {
      url += "?signed=true"
    }
    formData.append("file", file);
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
        name: file.name,
      },
    }));
  }

  list(bucket) {
    return api({
      method: 'get',
      url: `/files/${bucket}`,
    });
  }

  getConfig() {
    return api({
      method: 'get',
      url: '/files/config'
    }).then(res => res.data);
  }

  delete(file) {
    return api({
      method: 'delete',
      url: `/files/${file.bucket}/${file.name}`,
    });

  }
}

export default new FileUploadService();