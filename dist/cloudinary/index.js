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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjbG91ZGluYXJ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBR2hELE1BQU0saUJBQWlCLEdBQUcsR0FBRSxFQUFFO0lBQzVCLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDaEIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVTtRQUNsQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1FBQzVCLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7S0FDbkMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxVQUFVLENBQUE7QUFDbkIsQ0FBQyxDQUFBO0FBSU0sTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFpQixFQUFDLEVBQUU7SUFDOUMsT0FBTyxJQUFJLE9BQU8sQ0FBdUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFDMUQsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUNqQyxTQUFTLEVBQ1Q7WUFDRSxZQUFZLEVBQUUsSUFBSTtZQUNsQixlQUFlLEVBQUUsS0FBSztTQUN2QixFQUNELFVBQVMsS0FBSyxFQUFFLE1BQU07WUFDdEIsSUFBRyxLQUFLLEVBQUM7Z0JBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ2Q7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ2hCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVKLENBQUMsQ0FBQTtBQWpCWSxRQUFBLFdBQVcsZUFpQnZCO0FBR0Qsa0JBQWUsaUJBQWlCLENBQUEifQ==