"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
function gmailTransport() {
    return nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASSWORD
        }
    });
}
function sendMail(mailOptions) {
    // let {to, from, subject, html} = mailOptions
    return new Promise((s, e) => {
        gmailTransport().sendMail(mailOptions, function (error, info) {
            if (error) {
                e(error);
            }
            else {
                s(info);
            }
        });
    });
}
exports.default = sendMail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZE1haWwuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ1dGlsaXRpZXMvc2VuZE1haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0REFBbUM7QUFHbkMsU0FBUyxjQUFjO0lBQ3JCLE9BQU8sb0JBQVUsQ0FBQyxlQUFlLENBQUM7UUFDaEMsT0FBTyxFQUFFLE9BQU87UUFDaEIsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVztZQUM3QixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO1NBQ2pDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLFdBQVc7SUFFM0IsOENBQThDO0lBRTlDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUU7UUFDekIsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFTLEtBQUssRUFBRSxJQUFJO1lBQ3ZELElBQUksS0FBSyxFQUFFO2dCQUNULENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNUO2lCQUFNO2dCQUNMLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUNSO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVOLENBQUM7QUFHRCxrQkFBZSxRQUFRLENBQUEifQ==