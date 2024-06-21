import { storage } from '@/config/firebase.config';
import { ref as firebaseRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


export default function useFirebaseUpload() {
  //Upload One File
  async function uploadSingleFile(dir = '', file) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}-${randomString}${file.name}`;
    
    const storageRef = firebaseRef(storage, `gs://ofriend-31059.appspot.com/${dir}/${fileName}`);
    let url, error;
    try {
      // Upload the main image
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded');
      // Get the download URL
      url = await getDownloadURL(snapshot.ref);
      return [url, null];
    } catch (err) {
      console.error(err);
      error = err
      return [null, error]
    }
  }

  //Upload Multiple Files
  async function uploadMultipleFiles(dir = '', files = []) {
    let urlArray = [];
    let error = null;
    try {
      await Promise.all(files.map( async (file, i) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomString}${file.name}`;
        const storageRef = firebaseRef(storage, `gs://ofriend-31059.appspot.com/${dir}/${fileName}`);

        const snapshot = await uploadBytes(storageRef, file);
        console.log(`Uploaded ${i + 1} ${ i + 1 > 1 ? 'files': 'file' }`);
        const url = await getDownloadURL(snapshot.ref);
        urlArray.push(url);
      }));
      return [urlArray, null]
    } catch (err) {
        console.error(err);
        error = err;
        return [null, error]
    }
   
    /* for (let i = 0; i < files.length; i++) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomString}${files[i].name}`;

      const storageRef = firebaseRef(storage, `gs://ofriend-31059.appspot.com/${dir}/${fileName}`);
      try {
          const snapshot = await uploadBytes(storageRef, files[i]);
          console.log(`Uploaded ${i + 1} ${ i + 1 > 1 ? 'files': 'file' }`);
          const url = await getDownloadURL(snapshot.ref);
          urlArray.push(url);
          return [urlArray, null]
      } catch (err) {
          console.error(err);
          error = err;
          return [null, error]
      }
    } */
  }

  async function deleteFiles(urlArray = []) {
    let error = null;
    for (let i = 0; i < urlArray.length; i++) {
      const storageRef = firebaseRef(storage, urlArray[i]);
      try {
          // Delete the file
          await deleteObject(storageRef);
          console.log(`Deleted ${i + 1} ${i + 1 > 1 ? 'files' : 'file'}`);
          return null;
      } catch (err) {
          console.error(err);
          error = err;
          return error
      }
    } 
  }

  return { uploadSingleFile, uploadMultipleFiles, deleteFiles };
}
