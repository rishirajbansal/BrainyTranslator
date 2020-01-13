#!/bin/bash

# AWS environment Setup

set -x #echo on

handler=$1
awsPemKey=$2

echo "AWS handler : $handler"


if [ "$handler" = "stop-containers" ] 
then

    # EC2 Instance
    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_EC2_INSTANCE_DNS} WEB_CONTAINER_NAME=${WEB_CONTAINER_NAME} \
        API_CONTAINER_NAME=${API_CONTAINER_NAME} DB_CONTAINER_NAME=${DB_CONTAINER_NAME} \
        DOCKER_COMPOSE_FILE=${DOCKER_COMPOSE_FILE} DOCKER_LOG_LEVEL=${DOCKER_LOG_LEVEL} \
         BASE_PATH=${AWS_PROJECT_BASE_PATH} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh cleanup

elif [ "$handler" = "copy-project" ]
then
   
    cd ${WORKSPACE}
    tar -czf translator.tar.gz translator

    # Copy Project Artifacts to EC2 instance
    scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${WORKSPACE}/translator.tar.gz ubuntu@${AWS_EC2_INSTANCE_DNS}:${AWS_DEFAULT_WORKDIR}

    # Extract project artifacts
    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_EC2_INSTANCE_DNS} \
        'sh -s' <<-'ENDNATSSH'

        rm -rf translator
        tar -xf translator.tar.gz
        rm translator.tar.gz

ENDNATSSH

elif [ "$handler" = "build" ]
then

    # EC2 Instance
    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_EC2_INSTANCE_DNS} \
        DOCKER_COMPOSE_FILE=${DOCKER_COMPOSE_FILE} DOCKER_PROJECT_NAME=${DOCKER_PROJECT_NAME} \
        DB_SERVICE_NAME=${DB_SERVICE_NAME} API_SERVICE_NAME=${API_SERVICE_NAME} WEB_SERVICE_NAME=${WEB_SERVICE_NAME} \
        BASE_PATH=${AWS_PROJECT_BASE_PATH} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh build

elif [ "$handler" = "up" ]
then

    # EC2 Instance
    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_EC2_INSTANCE_DNS} \
        DOCKER_COMPOSE_FILE=${DOCKER_COMPOSE_FILE} DOCKER_LOG_LEVEL=${DOCKER_LOG_LEVEL} \
         BASE_PATH=${AWS_PROJECT_BASE_PATH} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh up

elif [ "$handler" = "postdeploy" ]
then

    echo "Access Web Application : http://$AWS_EC2_IP:$AWS_WEB_PORT"
    echo "Access API Application : http://$AWS_EC2_IP:$AWS_API_PORT"

else
    echo "Invalid AWS Handler passed to script."
fi
