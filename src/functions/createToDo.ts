import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4 } from "uuid";

interface ICreateToDo{
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid: user_id } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateToDo;

  if (user_id) {
    const params = {
      TableName: "to_dos",
      Item: {
        id: uuidV4(),
        title,
        user_id,
        deadline: new Date(deadline),
        done: false,
      }
    }

    await document.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "To do created!",
        content: params.Item,
      }),
      headers: {
        "Content-type": "application/json",
      }
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: "User not found",
    })
  };
}