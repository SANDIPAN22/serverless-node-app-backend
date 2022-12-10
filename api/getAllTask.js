const AWS = require("aws-sdk")
AWS.config.update({region: "us-east-1"})

const ddb = new AWS.DynamoDB.DocumentClient()

module.exports.handle = async (event) => {
  
  try {
    var auth = event.requestContext.authorizer.claims.sub
    
  } catch (error) {
    var auth = "ghost-dev"
  }


    var params = {
      Key: {
        "task_author": auth,

      },
      TableName: process.env.DYNAMO_TABLE,
    }

    try{

      // get all the objects inside of the dynamoDB 

      var data = await ddb.get(params).promise()

      return {
        
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify({
          api_version: 5.5,
          message: data
          
        })
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



};
