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
      task_author,
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
