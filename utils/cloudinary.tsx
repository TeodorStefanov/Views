export const handleClickPicture = (setImageUrl: any) => {
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "daqcaszkf",
      uploadPreset: "softuni",
    },
    (error: any, result: any) => {
      if (error) {
        console.log("Error:", error);
      }
      if (result.event === "success") {
        setImageUrl(result.info.url);
      }
    }
  );
  widget.open();
};
export const handleClickVideo = (setVideoUrl: any) => {
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "daqcaszkf",
      uploadPreset: "softuni",
    },
    (error: any, result: any) => {
      if (error) {
        console.log("Error:", error);
      }
      if (result.event === "success") {
        setVideoUrl(result.info.url);
      }
    }
  );
  widget.open();
};
