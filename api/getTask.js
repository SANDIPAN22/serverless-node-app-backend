const AWS = require("aws-sdk")
const _ = require("underscore")

AWS.config.update({region: "us-east-1"})

const ddb = new AWS.DynamoDB.DocumentClient()

module.exports.handle = async (event) => {
  
  var task_id = event.pathParameters.task_id
  console.log("TASKKK IDDD: ", task_id)

  if (task_id === undefined){

    return {
      statusCode: 503,
      body: JSON.stringify(
        {
        error: "path parameter is missing",
        message: "path parameter is missing or invalid"
        
      }
    )
    }
  }
  else{
    try {
      var auth = event.requestContext.authorizer.claims.sub
      
    } catch (error) {
      var auth = "ghost-dev"
    }
    var params = {
      TableName: process.env.DYNAMO_TABLE,
      Key: {
        "task_author": auth,

        "task_id": task_id
      }

    }

    try{
      //  fetch the particular object from the dynamo db 
      var data = await ddb.get(params).promise()
      if (!_.isEmpty(data)){
        return {

          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({
           
            message: data
            
          })
        }
      }
      else{
        return {

          statusCode: 503,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({
           
            error: "Key is not familiar",
            message: "no such result, prsent in the system"
            
          })
        }
      }
      

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
  }


};
