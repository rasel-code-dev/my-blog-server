const { v2: cloudinary} = require("cloudinary");


const cloudinaryHandler = ()=>{
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });
  
  return cloudinary
}



export const uploadImage = (imagePath: string)=>{
  return new Promise<{secure_url: string}>((resolve, reject)=>{
    cloudinaryHandler().uploader.upload(
      imagePath,
      {
        use_filename: true,
        unique_filename: false
      },
      function(error, result) {
      if(error){
        reject(error)
      } else {
        resolve(result)
      }
    });
  })
  
}


export default cloudinaryHandler