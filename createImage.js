const waitUntilTimeout = time =>
  new Promise((resolve) => setTimeout(() => {
    console.log(`Waited until: ${time}`);
    resolve(time);
  }, time));


(async function (){

  await waitUntilTimeout(100);
  console.log()
})();

const serviceDir = 'batch-processor';

async function createImage() {
  const imageContent = `
  FROM public.ecr.aws/lambda/nodejs:12 AS builder
  COPY ${batch-processor}.zip /tmp

  RUN cd /tmp && unzip -q ${batch-processor}.zip && rm ${batch-processor}.zip

  FROM public.ecr.aws/lambda/nodejs:12
  COPY --from=builder /tmp /var/task/${this.serverless.service.service}/
  
  RUN rm -rf /tmp/*
  COPY app.js package.json /var/task/

  RUN npm install

  CMD [ "app.handler" ]
  
  
  `
}