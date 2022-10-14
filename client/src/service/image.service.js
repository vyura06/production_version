/* eslint-disable default-case */
import { initializeApp } from "firebase/app";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkzUrNMNsxbNxaSr33UgJvcgfo4lYJ7a8",
  authDomain: "itra-project-773c4.firebaseapp.com",
  projectId: "itra-project-773c4",
  storageBucket: "itra-project-773c4.appspot.com",
  messagingSenderId: "35503294283",
  appId: "1:35503294283:web:d94e01db8e4aaff773cace",
  measurementId: "G-R89MR9P3C5"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadImage = async (image, image_name, image_type) => {
  const imagesRef = ref(storage, "photos/" + image_name);

  const metadata = {
    contentType: image_type
  };

  const task = uploadBytesResumable(imagesRef, image, metadata);

  const linkPromise = new Promise((resolve, reject) => {
    task.on("state-changed", () => {}, err => reject(err), async () => {
      const link = await getDownloadURL(task.snapshot.ref);
      resolve(link);
    });
  });

  return await linkPromise;
}

export default { uploadImage };
