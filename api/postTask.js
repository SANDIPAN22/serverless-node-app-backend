const AWS = require("aws-sdk")
const uuid = require("uuid")
const moment = require("moment")

AWS.config.update({region: "us-east-1"})

const ddb = new AWS.DynamoDB.DocumentClient()

module.exports.handle = async (event) => {
  
  const {task_author, task_name, task_description, ...task_other_info} = JSON.parse(event.body)
  if (task_author === undefined || task_name === undefined){

    return {
      statusCode: 503,
      body: JSON.stringify(
        {
        error: "The payload is not appropiate.",
        message: "The json payload is not well constructed or some attributes are missing..."
        
      }
    )
    }
  }
  else{
    var data = {
      task_id : uuid.v4(),
      task_author: event.requestContext.authorizer.claims.sub == undefined ? "ghost-dev": event.requestContext.authorizer.claims.sub,
      task_name,
      task_description,
      task_other_info : task_other_info,
      task_created_at: moment().unix()
    }

    
    var params = {
      TableName: process.env.DYNAMO_TABLE,
      Item: data

    }

    try{

      // insert stuff inside the dynamodb
      await ddb.put(params).promise()
    }
    catch(err){
      return {

        statusCode: err.statusCode ? err.statusCode: 500,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify({
          error: err.name ? err.name : "Excetion Occured",
          message: err.message? err.message : "Unknown error occured. Check it now..."

        })
      }

    }
    return {

      statusCode: 200,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({
       
        message: "New Task has been added..."

      })
    }
  }


};

// "requestContext": {
//   "resourceId": "dcchxw",
//   "authorizer": {
//       "claims": {
//           "at_hash": "qFvNUyo26SlMokL9N_oOoQ",
//           "sub": "fe446562-7e1e-45be-95a3-8b4264728a7b",
//           "email_verified": "true",
//           "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_EKDKvEztJ",
//           "cognito:username": "fe446562-7e1e-45be-95a3-8b4264728a7b",
//           "aud": "525f77r61i371bsuvhipsfds3v",
//           "event_id": "70f668e9-7d05-4464-b77d-bb85bcc4bd49",
//           "token_use": "id",
//           "auth_time": "1670597527",
//           "nickname": "sandi",
//           "exp": "Fri Dec 09 15:02:07 UTC 2022",
//           "iat": "Fri Dec 09 14:52:07 UTC 2022",
//           "jti": "4a3e1edf-6512-4249-a293-4f84b302c6cb",
//           "email": "chak.sandipan22@gmail.com"
//       }
//   },


// var token = new URL("http://localhost:3000/_oauth/google#access_token=ya29.5HxuYol1Io8JLeGePDznbfkkwu_PC4uodKwG8_1clFYAn9AgdOV1WGpOTNQP3s76HAsn7Y4zWw&token_type=Bearer&expires_in=3600").hash.split('&').filter(function(el) { if(el.match('access_token') !== null) return true; })[0].split('=')[1];

// alert(token);