#어떤 이미지로부터 새로운 이미지를 생성할지를 지정
FROM node:16.12.0

#Dockerfile 을 생성/관리하는 사람
MAINTAINER CJS <choec53@gmail.com>

#RUN npm install -g serve

RUN npm install -g serve

#RUN npm run build 로컬에서 빌드후 도커파일 생성.

RUN mkdir ./build

COPY ./build ./build

ENTRYPOINT ["serve", "-s", "build"]


#cd C:\Users\user\dockerFolder\

#npm install --global express-generator
#express express-example
#cd express-example
#npm install
#npm start 

#docker build 명령어는 Dockerfile 이 위치한 명령어를 파라미터로 준다.
#docker build -t cjs0533/saso:1.0 C:\saso
#docker build -t cjs0533/react_client:0.5 .

#docker run -d -p 3001:3000 --name react_client cjs0533/react_client:0.5