#어떤 이미지로부터 새로운 이미지를 생성할지를 지정
FROM node:16.12.0

#Dockerfile 을 생성/관리하는 사람
MAINTAINER CJS <choec53@gmail.com>

# /app 디렉토리 생성
RUN mkdir -p /app
# /app 디렉토리를 WORKDIR 로 설정
WORKDIR /app
# 현재 Dockerfile 있는 경로의 모든 파일을 /app 에 복사
ADD . /app
# npm install 을 실행
RUN npm install

#환경변수 NODE_ENV 의 값을 development 로 설정
#ENV NODE_ENV development

#가상 머신에 오픈할 포트
#EXPOSE 3099 3099

#컨테이너에서 실행될 명령을 지정
CMD ["node", "index.js"]


#cd C:\Users\user\dockerFolder\

#npm install --global express-generator
#express express-example
#cd express-example
#npm install
#npm start 

#docker build 명령어는 Dockerfile 이 위치한 명령어를 파라미터로 준다.
#docker build -t cjs0533/saso:1.1 C:\saso
#docker build -t cjs0533/react_server:0.3 .

#docker build -t cjs0533/naed:1.3 C:\nodejs\naemamdaero
#docker run -i -t -p 3000:3000 --name naed cjs0533/naed:1.3 /bin/bash
#docker run -d -p 3000:3000 --name naed cjs0533/naed:1.3
#docker run -d -p 8000:8000 --name react_server cjs0533/react_server:0.3