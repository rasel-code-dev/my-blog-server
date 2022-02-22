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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const database_1 = require("../database");
class Base {
    constructor(tableName) {
        // when call with new keyword extend classes...
        this.tableName = tableName;
    }
    save() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let client;
            try {
                let _a = this, { tableName, databaseSaveFields, _id } = _a, other = __rest(_a, ["tableName", "databaseSaveFields", "_id"]);
                let { c: Collection, client: cc } = yield (0, database_1.mongoConnect)(tableName);
                client = cc;
                // let err = await this.validationBeforeSave()
                // if (err) {
                //   return reject({type: "VALIDATION_ERROR", errors: err})
                // }
                if (this.validationBeforeSave) {
                    let err = yield this.validationBeforeSave();
                    if (err) {
                        return reject({ type: "VALIDATION_ERROR", errors: err });
                    }
                    let newInserted = yield Collection.insertOne(other);
                    // @ts-ignore
                    other._id = newInserted.insertedId;
                    resolve(other);
                }
                else {
                    let newInserted = yield Collection.insertOne(other);
                    // @ts-ignore
                    other._id = newInserted.insertedId;
                    resolve(other);
                }
            }
            catch (ex) {
                (0, errorConsole_1.default)(ex);
                reject(ex);
            }
            finally {
                client === null || client === void 0 ? void 0 : client.close();
            }
        }));
    }
    static getCollection() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let tableName = this.tableName;
                let { c, client } = yield (0, database_1.mongoConnect)(tableName);
                resolve({ Collection: c, client });
            }
            catch (ex) {
                reject(ex);
                (0, errorConsole_1.default)(ex);
            }
        }));
    }
    // static getCollection(collectionName){
    //   return new Promise(async (resolve, reject)=>{
    //   try {
    //
    //     // let {c, client} = await dbConnect(collectionName ? collectionName : Base.collectionName)
    //     // resolve({collection: c, client: client})
    //
    //     } catch (ex){
    //       reject({collection: undefined, client: undefined})
    //     }
    //   })
    // }
    // static async dbConnect(collectionName){
    //   return new Promise(async (resolve, reject)=>{
    //     try {
    //       let { c, client} = await dbConnect(collectionName)
    //       resolve({collection: c, client: client})
    //     } catch (ex){
    //       reject(ex)
    //     }
    //   })
    // }
    //   static insertInto(values){
    //   return new Promise<mongoDB.InsertOneResult>(async (resolve, reject)=>{
    //     let client;
    //     try {
    //
    //       let {collection, client: cc} = await this.dbConnect(this.collectionName)
    //       client = cc
    //       if(values) {
    //         let {_id, ...other} = values
    //         let cursor = await collection?.insertOne({
    //           ...other,
    //           created_at: new Date(),
    //           updated_at: new Date()
    //         })
    //
    //         resolve(cursor)
    //       }
    //       // console.log(cursor, other)
    //       client?.close()
    //
    //     } catch (ex){
    //       client?.close()
    //       reject(new Error(ex.message))
    //     } finally {
    //       client?.close()
    //     }
    //   })
    // }
    static update(find, query) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let client;
            try {
                let tableName = this.tableName;
                let { c: collection, client: cc } = yield (0, database_1.mongoConnect)(tableName);
                client = cc;
                let cursor = yield (collection === null || collection === void 0 ? void 0 : collection.updateOne(find, query));
                if (cursor.modifiedCount > 0) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
            catch (ex) {
                resolve(false);
            }
            finally {
                client === null || client === void 0 ? void 0 : client.close();
            }
        }));
    }
    // static deleteById(id: string){
    //
    //   return new Promise<mongoDB.DeleteResult>(async (resolve, reject)=> {
    //     if(id){
    //       let client;
    //       try {
    //         let {collection, client: cc} = await Base.dbConnect(this.collectionName)
    //         client = cc
    //         let doc = await collection.deleteOne({_id: new ObjectId(id)})
    //         resolve(doc)
    //       } catch (ex) {
    //         reject(new Error(ex.message))
    //       } finally {
    //         client?.close()
    //       }
    //     } else {
    //       reject(new Error("please provide id"))
    //     }
    //   })
    //
    // }
    static findOne(match = {}, selectFields) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let client;
            try {
                let tableName = this.tableName;
                let { c: collection, client: cc } = yield (0, database_1.mongoConnect)(tableName);
                client = cc;
                let user = yield collection.findOne(match);
                if (user) {
                    resolve(user);
                }
                else {
                    resolve(null);
                }
            }
            catch (ex) {
                reject(ex);
                (0, errorConsole_1.default)(ex);
            }
            finally {
                client === null || client === void 0 ? void 0 : client.close();
            }
        }));
    }
    static removeOne(match = {}) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let client;
            try {
                let { c: Collection, client: cc } = yield (0, database_1.mongoConnect)(this.tableName);
                client = cc;
                let doc = yield Collection.deleteOne(match);
                if (doc.deletedCount) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
            catch (ex) {
                (0, errorConsole_1.default)(ex);
                reject(ex);
            }
            finally {
                client === null || client === void 0 ? void 0 : client.close();
            }
        }));
    }
    static find(match = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let client;
                try {
                    let { c: User, client: cc } = yield (0, database_1.mongoConnect)(Base.tableName);
                    client = cc;
                    let cursor = User.find(match);
                    let users = [];
                    yield cursor.forEach(usr => {
                        users.push(usr);
                    });
                    resolve(users);
                }
                catch (ex) {
                    (0, errorConsole_1.default)(ex);
                    reject(ex);
                }
                finally {
                    client === null || client === void 0 ? void 0 : client.close();
                }
            }));
        });
    }
    static aggregate(pipeline) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let client;
            try {
                let { c: collection, client: cc } = yield (0, database_1.mongoConnect)(this.tableName);
                client = cc;
                let cursor = collection === null || collection === void 0 ? void 0 : collection.aggregate(pipeline);
                let products = [];
                yield cursor.forEach(p => {
                    products.push(p);
                });
                resolve(products);
                client === null || client === void 0 ? void 0 : client.close();
            }
            catch (ex) {
                reject(new Error(ex));
            }
            finally {
                client === null || client === void 0 ? void 0 : client.close();
            }
        }));
    }
}
exports.default = Base;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbIm1vZGVscy9CYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwRUFBa0Q7QUFDbEQsMENBQXlDO0FBR3pDLE1BQU0sSUFBSTtJQVFSLFlBQVksU0FBaUI7UUFDM0IsK0NBQStDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0lBQzVCLENBQUM7SUFFRCxJQUFJO1FBQ0YsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtZQUMxQyxJQUFJLE1BQU0sQ0FBQztZQUVYLElBQUc7Z0JBQ0QsSUFBSSxLQUFrRCxJQUFJLEVBQXRELEVBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUFFLEdBQUcsT0FBa0IsRUFBYixLQUFLLGNBQTlDLDBDQUErQyxDQUFPLENBQUE7Z0JBQzFELElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFHLE1BQU0sRUFBRSxFQUFFLEVBQUMsR0FBRyxNQUFNLElBQUEsdUJBQVksRUFBQyxTQUFTLENBQUMsQ0FBQTtnQkFDakUsTUFBTSxHQUFHLEVBQUUsQ0FBQTtnQkFFWCw4Q0FBOEM7Z0JBQzlDLGFBQWE7Z0JBQ2IsMkRBQTJEO2dCQUMzRCxJQUFJO2dCQUVKLElBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFDO29CQUMzQixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO29CQUUzQyxJQUFJLEdBQUcsRUFBQzt3QkFDTixPQUFPLE1BQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQTtxQkFDdkQ7b0JBRUQsSUFBSSxXQUFXLEdBQUcsTUFBTSxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUNuRCxhQUFhO29CQUNiLEtBQUssQ0FBQyxH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