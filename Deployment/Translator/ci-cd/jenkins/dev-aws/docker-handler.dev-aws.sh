#!/bin/bash

# Docker environment cleanup Script

set -x #echo on

handler=$1

echo "Docker handler : $handler"

if [ "$handler" = "cleanup" ] 
then
    # Stop containers:
    
    docker container stop ${CONTAINER_NAME}
    echo "${CONTAINER_NAME} Stopped."
    docker container rm --force ${CONTAINER_NAME}
    echo "${CONTAINER_NAME} Removed."

    # Remove unused images
    docker rmi $(docker images -f 'dangling=true' -q) || true
    # Remove unused volumes
    docker volume rm $(docker volume ls -q --filter "dangling=true") || true

elif [ "$handler" = "build-db-image" ]
then

    # Build DB Image
    cd translator
    docker build -f deployment/docker/${DB_DOCKERFILE} -t ${DB_IMAGE_TAG} ${BUILD_CONTEXT}

elif [ "$handler" = "build-api-image" ]
then

    # Build API Server Image
    cd translator
    # POSTGRESQL_HOST IP in the command is based on the Private IP of EC2 DB instance, which can change on EC2 instance shutdown/start-up. It will not change on Reboot.
    docker build -f deployment/docker/${API_DOCKERFILE} --build-arg POSTGRESQL_HOST="${POSTGRESQL_HOST}" -t ${API_IMAGE_TAG} ${BUILD_CONTEXT}

elif [ "$handler" = "build-web-image" ]
then
    #  Build Web Server Image
    cd translator
    docker build -f deployment/docker/${WEB_DOCKERFILE} -t ${WEB_IMAGE_TAG} ${BUILD_CONTEXT}

elif [ "$handler" = "db-up" ]
then

    # Create DB Container
  	docker run -dit --name ${DB_CONTAINER_NAME} --network ${DOCKER_OVERLAY_NETWORK} -p ${DB_PUBLISHED_PORT}:${DB_CONTAINER_TARGET_PORT} ${DB_IMAGE_TAG}

elif [ "$handler" = "api-up" ]
then

    # Create API Container
    docker run -dit --name ${API_CONTAINER_NAME} --network ${DOCKER_OVERLAY_NETWORK} -e "WORK_DIR=${WORK_DIR}" -e "HOST=0.0.0.0" -e "PORT=${API_CONTAINER_TARGET_PORT}" -p ${API_PUBLISHED_PORT}:${API_CONTAINER_TARGET_PORT} ${API_IMAGE_TAG}

elif [ "$handler" = "web-up" ]
then

    # Create WEb Container
    docker run -dit --name ${WEB_CONTAINER_NAME} --network ${DOCKER_OVERLAY_NETWORK} -p ${WEB_PUBLISHED_PORT}:${WEB_CONTAINER_TARGET_PORT} ${WEB_IMAGE_TAG}

else
    echo "Invalid Docker Handler passed to script."
fi

