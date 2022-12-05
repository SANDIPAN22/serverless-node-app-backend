const AWS = require("aws-sdk")
AWS.config.update({region: "us-east-1"})

const ddb = new AWS.DynamoDB.DocumentClient()

module.exports.handle = async (event) => {
  



    var params = {
      TableName: process.env.DYNAMO_TABLE,
    }

    try{

      // get all the objects inside of the dynamoDB 

      var data = await ddb.scan(params).promise()

      return {
        
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify({
          api_version: 3.0,
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
