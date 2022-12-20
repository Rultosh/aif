import api from "../app/fileServerApi";

class FileUploadService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);
    return api({
      method: 'post',
      url: `/files`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

  }
}

export default new FileUploadService();