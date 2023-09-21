import { getConnection, closeConnectionMongoose } from "../lib/mongoose/dbConnect";
import { 
  getModel, 
  findOneMongoose, 
  createUserCredentialMongoose, 
  createDocumentMongoose,
  createVerificationMongoose,
  findByIdMongoose,
} from "../lib/mongoose/dbModel";
import userSchema from "../models/User";
import accountAdminSchema from "../models/AccountAdmin";

/**
* Return account data from Account Model
*/
export async function getAccountData( id ) {
  let connDb = await getConnection(process.env.DATABASE_NAME)  
  let User = getModel("Admin", userSchema, connDb)
  let Account = getModel("Account_admin", accountAdminSchema, connDb)

  let userDoc = await User.findById(id).populate("accountId")
  
  if (userDoc) {
    console.log(`Found data account with the id: '${id}'`);
    let account = JSON.parse(JSON.stringify(userDoc.accountId))
    const { _id, __v, ...rest } = account
    return rest
  }
  else{
    console.log(`No listings found with the id '${id}'`);
    return false
  } 
}