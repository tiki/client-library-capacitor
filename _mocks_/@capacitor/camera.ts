import { Photo } from "@capacitor/camera";

const photo: Photo = {base64String: 'base64String', path: 'image/png', format: 'png', saved: true}
export const Camera = {
    requestPermissions(): Promise<String>{
        return new Promise((resolve) => {
            // Simulate an asynchronous operation, such as fetching data from an API
            setTimeout(() => {
                // Resolve the promise with a string value
                resolve("Permission Allowed");
            }, 2000); // Simulating a delay of 2 seconds
        });
    },
    getPhoto(): Promise<Photo>{
        return new Promise((resolve) => {
            // Simulate an asynchronous operation, such as fetching data from an API
            setTimeout(() => {
                // Resolve the promise with a string value
                resolve(photo);
            }, 2000); // Simulating a delay of 2 seconds
        });
    }
  };