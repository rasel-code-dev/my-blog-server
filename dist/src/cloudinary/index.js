"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const { v2: cloudinary } = require("cloudinary");
const cloudinaryHandler = () => {
    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    });
    return cloudinary;
};
const uploadImage = (imagePath) => {
    return new Promise((resolve, reject) => {
        cloudinaryHandler().uploader.upload(imagePath, {
            use_filename: true,
            unique_filename: false
        }, function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.uploadImage = uploadImage;
exports.default = cloudinaryHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY2xvdWRpbmFyeS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUdoRCxNQUFNLGlCQUFpQixHQUFHLEdBQUUsRUFBRTtJQUM1QixVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2hCLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7UUFDbEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTztRQUM1QixVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVO0tBQ25DLENBQUMsQ0FBQztJQUVILE9BQU8sVUFBVSxDQUFBO0FBQ25CLENBQUMsQ0FBQTtBQUlNLE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBaUIsRUFBQyxFQUFFO0lBQzlDLE9BQU8sSUFBSSxPQUFPLENBQXVCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBQzFELGlCQUFpQixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDakMsU0FBUyxFQUNUO1lBQ0UsWUFBWSxFQUFFLElBQUk7WUFDbEIsZUFBZSxFQUFFLEtBQUs7U0FDdkIsRUFDRCxVQUFTLEtBQUssRUFBRSxNQUFNO1lBQ3RCLElBQUcsS0FBSyxFQUFDO2dCQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNkO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNoQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUE7QUFFSixDQUFDLENBQUE7QUFqQlksUUFBQSxXQUFXLGVBaUJ2QjtBQUdELGtCQUFlLGlCQUFpQixDQUFBIn0=