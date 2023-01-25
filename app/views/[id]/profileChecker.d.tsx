export {};

declare global {
  interface Window {
    cloudinary: any; // 👈️ turn off type checking
  }
}
