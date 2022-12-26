import api from "../app/fileServerApi";

class FileUploadService {
  upload(bucket, file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);
    return api({
      method: 'post',
      url: `/files/${bucket}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

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