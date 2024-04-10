exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    
  const options = { folder }
  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = quality
  }
  
  //to detect the type of the image: 
  options.resource_type = "auto"
  // console.log("OPTIONS", options)
  return await cloudinary.uploader.upload(file.tempFilePath, options)
}