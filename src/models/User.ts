
import Base from"./Base";
import Joi from "joi";

interface a{
  name: string
}

class User extends Base{
  
  static tableName = "users"
  
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  avatar: string;
  
  constructor({ _id = "", first_name, last_name, email, password, created_at, updated_at, avatar }) {
    super("users")
    this._id = "",
    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.password = password
    this.created_at = created_at
    this.updated_at = updated_at
    this.avatar = avatar
  }
  
  
  // @ts-ignore
  validationBeforeSave() {
    return new Promise<any>(async (resolve, reject)=>{
      let { tableName, _id, ...otherValue } = this
      let user = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.optional(),
        email: Joi.string().email().required(),
        created_at: Joi.date().required(),
        avatar: Joi.optional(),
        updated_at: Joi.date().required(),
        password: Joi.string().required()
      })
  
      let isError = user.validate(otherValue,{abortEarly: false})
      
      if(isError.error){
        let r = {}
        for (const detail of isError.error.details) {
          r[detail.path[0]] = detail.message
        }
        resolve(r)
      } else {
        resolve(false)
      }
    })
  }
  
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default User