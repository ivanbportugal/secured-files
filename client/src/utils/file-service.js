
import axios from 'axios';

class FileServiceController {

  getFiles() {
    return axios.get('/api/files');
  }

  getFile(fileName) {
    return axios.get('/api/file', {
      params: {
        name: fileName
      }
    });
  }
}

export const FileService = new FileServiceController();