import "source-map-support/register";
import { StepFunctions } from "aws-sdk";

const waitUntilTimeout = (time) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`Waited until: ${time}`);
      resolve(time);
    }, time)
  );

export const initialize: object = async (event, _context) => {
  console.log("event: ", JSON.stringify(event));
  await waitUntilTimeout(5000);
  console.log("initialize completed");
  event.INITIALIZE_STATUS = "SUCCESS";
  return event;
};

export const batchTaskExecutor: object = async (event, _context) => {
  const taskToken: string = process.env.TASK_TOKEN;
  console.log('taskToken: ', taskToken);
  try {
    console.log("event: ", JSON.stringify(event));
    for (let index = 0; index < 100; index++) {
      await waitUntilTimeout(1000);
      console.log(`Waited ${index + 1} seconds`);
    }
    console.log("Batch task completed");
    event.BATCH_STATUS = "SUCCESS";
    await sendSuccess(taskToken, JSON.stringify(event));
  } catch (error) {
    console.error("Error occurred while running the batch task", error.stack, error.message);
    await sendFailure(taskToken, error.message, error.message);
  }
};

export const notifySuccess: object = async (event, _context) => {
  console.log("event: ", JSON.stringify(event));
  await waitUntilTimeout(3000);
  console.log("NOTIFIED SUCCESS");
  return event;
};

export const notifyFailure: object = async (event, _context) => {
  console.log("event: ", JSON.stringify(event));
  await waitUntilTimeout(3000);
  console.log("NOTIFIED FAILURE");
  return event;
};

function sendSuccess(taskToken: string, output: any) {
  const stepFunc = new StepFunctions();

  return new Promise((res, rej) => {
    stepFunc.sendTaskSuccess({ taskToken, output }, (err, data) => {
      if (err) {
        console.log('sendSuccess error:', err, err.message, err.stack)
        return rej(err);
      }
      return res(data);
    });
  });
}

function sendFailure(taskToken: string, error: any, cause: string) {
  const stepFunc = new StepFunctions();

  return new Promise((res, rej) => {
    stepFunc.sendTaskFailure({ taskToken, error, cause }, (err, data) => {
      if (err) {
        return rej(err);
      }
      return res(data);
    });
  });
}
