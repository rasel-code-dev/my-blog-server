"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let s = yield cloudinaryHandler().uploader.upload(imagePath, {
                use_filename: true,
                unique_filename: false
            });
            resolve(s);
        }
        catch (ex) {
            // console.log(ex)
            reject(ex);
        }
    }));
};
exports.uploadImage = uploadImage;
exports.default = cloudinaryHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjbG91ZGluYXJ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLE1BQU0sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBR2hELE1BQU0saUJBQWlCLEdBQUcsR0FBRSxFQUFFO0lBQzVCLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDaEIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVTtRQUNsQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1FBQzVCLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7S0FDbkMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxVQUFVLENBQUE7QUFDbkIsQ0FBQyxDQUFBO0FBSU0sTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFpQixFQUFDLEVBQUU7SUFDOUMsT0FBTyxJQUFJLE9BQU8sQ0FBdUIsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFDaEUsSUFBRztZQUNELElBQUksQ0FBQyxHQUFHLE1BQU0saUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUMvQyxTQUFTLEVBQ1Q7Z0JBQ0UsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLGVBQWUsRUFBRSxLQUFLO2FBQ3ZCLENBQUMsQ0FBQTtZQUNKLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNYO1FBQUMsT0FBTyxFQUFFLEVBQUM7WUFDVixrQkFBa0I7WUFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQ1g7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUosQ0FBQyxDQUFBO0FBaEJZLFFBQUEsV0FBVyxlQWdCdkI7QUFHRCxrQkFBZSxpQkFBaUIsQ0FBQSJ9