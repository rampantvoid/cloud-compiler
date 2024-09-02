FROM public.ecr.aws/lambda/nodejs:20

RUN microdnf upgrade -y && microdnf install gcc-c++ -y && microdnf install python3 -y

COPY package.json ${LAMBDA_TASK_ROOT}

COPY index.js ${LAMBDA_TASK_ROOT}

CMD ["index.handler"]