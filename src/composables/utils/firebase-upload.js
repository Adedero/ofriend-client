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
    try {
        const fileArray = await Promise.all(files.map(async (file, i) => {
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 8);
            const fileName = `${timestamp}-${randomString}${file.name}`;
            const storageRef = firebaseRef(storage, `gs://ofriend-31059.appspot.com/${dir}/${fileName}`);

            const snapshot = await uploadBytes(storageRef, file);
            console.log(`Uploaded ${i + 1} ${i + 1 > 1 ? 'files' : 'file'}`);
            const url = await getDownloadURL(snapshot.ref);
            return {
                url,
                type: file.type,
                extension: file.name.split('.').pop(),
                name: file.name
            };
        }));

        return [fileArray, null];
    } catch (err) {
        console.error(err);
        return [null, err];
    }
  }

  async function deleteSingleFile(url) {
    const storageRef = firebaseRef(storage, url);
    try {
      await deleteObject(storageRef);
      return null;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function deleteFiles(urlArray = []) {
    const deletePromises = urlArray.map((url, index) => {
      const storageRef = firebaseRef(storage, url);
      return deleteObject(storageRef)
        .then(() => {
          console.log(`Deleted ${index + 1} ${index + 1 > 1 ? 'files' : 'file'}`);
          return { index, error: null };
        })
        .catch((err) => {
          console.error(`Error deleting file ${index + 1}:`, err);
          return { index, error: err };
        });
    });

    // Wait for all delete operations to complete
    const results = await Promise.all(deletePromises);

    // Collect all errors
    const errors = results.filter(result => result.error !== null);

    if (errors.length > 0) {
      // Log all errors and return them
      console.error('Some files could not be deleted:', errors);
      return errors;
    }

    return null;
  }

  /* async function deleteFiles(urlArray = []) {
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
  } */

  return { uploadSingleFile, uploadMultipleFiles, deleteSingleFile, deleteFiles };
}
