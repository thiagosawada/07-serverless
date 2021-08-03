import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid: user_id } = event.pathParameters;

  var params = {
    TableName: "to_dos",
    FilterExpression: "#user_id = :user_id",
    ExpressionAttributeNames: {
        "#user_id": "user_id",
    },
    ExpressionAttributeValues: { ":user_id": user_id }
  };

  const response = await document.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      content: response,
    })
  }
};