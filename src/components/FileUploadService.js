import api from "../app/fileServerApi";

class FileUploadService {
  upload(bucket, file, signed, onUploadProgress) {
    let formData = new FormData();

    let url = `files/${bucket}`;

    if(signed) {
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