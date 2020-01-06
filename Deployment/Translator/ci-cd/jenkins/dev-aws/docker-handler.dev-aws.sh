#!/bin/bash

# Docker environment cleanup Script

set -x #echo on

handler=$1
awsPemKey=$2

echo "Docker handler : $handler"

if [ "$handler" = "cleanup" ] 
then
    # Stop the containers:
    

    scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${CICD_SCRIPT_LOCATION}/aws-handler.sh ec2-user@${AWS_NAT_INSTANCE_DNS}:${AWS_NAT_WORKDIR}

    scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${awsPemKey} ec2-user@${AWS_NAT_INSTANCE_DNS}:${AWS_NAT_WORKDIR}

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH \
        AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$DB_CONTAINER_NAME awsPemKey=${awsPemKey}\
        'sh -s' <<-'ENDSSH'

        echo "$CONTAINER_NAME"
        ssh ubuntu@${AWS_DB_INSTANCE_DNS} CONTAINER_NAME=$CONTAINER_NAME 'sh -s' < aws-handler.sh stop-containers 
        exit

ENDSSH

    
    # docker container stop ${API_CONTAINER_NAME}
    # echo "${API_CONTAINER_NAME} Stopped."
    # docker container stop ${WEB_CONTAINER_NAME}
    # echo "${WEB_CONTAINER_NAME} Stopped."
        
    # # Delete preexisted containers:
    
    # docker container rm --force ${API_CONTAINER_NAME}
    # echo "${API_CONTAINER_NAME} Removed."
    # docker container rm --force ${WEB_CONTAINER_NAME}
    # echo "${WEB_CONTAINER_NAME} Removed."

    

elif [ "$handler" = "build" ]
then
    cd ${WORKSPACE}

    # Build DB Image
    docker build -f deployment/docker/${DB_DOCKERFILE} -t ${DB_IMAGE_TAG} ${BUILD_CONTEXT}

    # Build API Server Image
    # POSTGRESQL_HOST IP in the command is based on the Private IP of EC2 DB instance, which can change on EC2 instance shutdown/start-up. It will not change on Reboot.
    docker build -f deployment/docker/${API_DOCKERFILE} --build-arg POSTGRESQL_HOST="${POSTGRESQL_HOST}" -t ${API_IMAGE_TAG} ${BUILD_CONTEXT}

    #  Build Web Server Image
    docker build -f deployment/docker/${WEB_DOCKERFILE} -t ${WEB_IMAGE_TAG} ${BUILD_CONTEXT}

elif [ "$handler" = "up" ]
then
    cd ${WORKSPACE}

    # Create DB Container
  	docker run -dit --name ${DB_CONTAINER_NAME} --network ${DOCKER_OVERLAY_NETWORK} -p ${DB_PUBLISHED_PORT}:${DB_CONTAINER_TARGET_PORT} ${DB_IMAGE_TAG}

    # Create API Container
    docker run -dit --name ${API_CONTAINER_NAME} --network ${DOCKER_OVERLAY_NETWORK} -e "WORK_DIR=${WORK_DIR}" -e "HOST=0.0.0.0" -e "PORT=${API_CONTAINER_TARGET_PORT}" -p ${API_PUBLISHED_PORT}:${API_CONTAINER_TARGET_PORT} ${API_IMAGE_TAG}

    # Create WEb Container
    docker run -dit --name ${WEB_CONTAINER_NAME} --network ${DOCKER_OVERLAY_NETWORK} -p ${WEB_PUBLISHED_PORT}:${WEB_CONTAINER_TARGET_PORT} ${WEB_IMAGE_TAG}

elif [ "$handler" = "postdeploy" ]
then

    echo "Access Web Application : http://$AWS_WEB_IP:$AWS_WEB_PORT"
    echo "Access API Application : http://$AWS_API_IP:$AWS_API_PORT"

else
    echo "Invalid Docker Handler passed to script."
fi


