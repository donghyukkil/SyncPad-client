const ImageUploader = ({ onUpload }) => {
  const handleImageChange = async event => {
    const file = event.target.files[0];

    if (file) {
      const base64String = await convertToBase64(file);
      URL.createObjectURL(file);
      onUpload(base64String);
    }
  };

  const convertToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <>
      <input type="file" onChange={handleImageChange} />
    </>
  );
};

export default ImageUploader;
