import { storage } from '@/config/firebase.config';
import { ref as firebaseRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


export default function useFirebaseUpload() {
  //Upload One File
  async function uploadSingleFile(dir = '', file) {
    const storageRef = firebaseRef(storage, `gs://ofriend-31059.appspot.com/${dir}/${file.name}`);
    try {
        // Upload the main image
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Uploaded');
        // Get the download URL
        const url = await getDownloadURL(snapshot.ref);
        return url;
    } catch (error) {
        console.error(error);
    }
  }

  //Upload Multiple Files
  async function uploadMultipleFiles(dir = '', files = []) {
    const urlArray = [];
    for (let i = 0; i < files.length; i++) {
      const storageRef = firebaseRef(storage, `gs://ofriend-31059.appspot.com/${dir}/${ files[i].name }`);

      try {
          const snapshot = await uploadBytes(storageRef, files[i]);
          console.log(`Uploaded ${i + 1} ${ i + 1 > 1 ? 'files': 'file' }`);
          const url = await getDownloadURL(snapshot.ref);
          urlArray.push(url);
      } catch (error) {
          console.error(error);
      }
    }
    return urlArray;
  }

  async function deleteFiles(urlArray = []) {
    for (let i = 0; i < urlArray.length; i++) {
      const storageRef = firebaseRef(storage, urlArray[i]);
      try {
          // Delete the file
          await deleteObject(storageRef);
          console.log(`Deleted ${i + 1} ${i + 1 > 1 ? 'files' : 'file'}`);
      } catch (error) {
          console.error(error);
      }
    } 
  }

  return { uploadSingleFile, uploadMultipleFiles, deleteFiles };
}
