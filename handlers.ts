import 'source-map-support/register';

const waitUntilTimeout = time =>
  new Promise((resolve) => setTimeout(() => {
    console.log(`Waited until: ${time}`);
    resolve(time);
  }, time));


export const initialize: object = async (event, _context) => {
  console.log('event: ', JSON.stringify(event));
  await waitUntilTimeout(5000);
  console.log('initialize completed')
  event.INITIALIZE_STATUS = 'SUCCESS';
  return event;
}

export const batchTaskExecutor: object = async (event, _context) => {
  console.log('event: ', JSON.stringify(event));
  for (let index = 0; index < 1000; index++) {
    await waitUntilTimeout(1000);
    console.log(`Waited ${index+1} seconds`);
  }
  console.log('Batch task completed')
  event.BATCH_STATUS = 'SUCCESS';
  return {
    statusCode: 'SUCCESS',
    body: {},
  };
}

export const notifySuccess: object = async (event, _context) => {
  console.log('event: ', JSON.stringify(event));
  await waitUntilTimeout(3000);
  console.log('NOTIFIED SUCCESS')
  return event;
}

export const notifyFailure: object = async (event, _context) => {
  console.log('event: ', JSON.stringify(event));
  await waitUntilTimeout(3000);
  console.log('NOTIFIED FAILURE')
  return event;
}