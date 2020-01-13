#!/bin/bash

# Docker environment cleanup Script

set -x #echo on

handler=$1

echo "Docker handler : $handler"

if [ "$handler" = "cleanup" ] 
then
    # Stop the containers:
    docker container stop ${WEB_CONTAINER_NAME}
    echo "${WEB_CONTAINER_NAME} Stopped."
    docker container stop ${API_CONTAINER_NAME}
    echo "${API_CONTAINER_NAME} Stopped."
    docker container stop ${DB_CONTAINER_NAME}
    echo "${DB_CONTAINER_NAME} Stopped."
    
        
    # Delete preexisted containers:
    docker container rm --force ${DB_CONTAINER_NAME}
    echo "${DB_CONTAINER_NAME} Removed."
    docker container rm --force ${API_CONTAINER_NAME}
    echo "${API_CONTAINER_NAME} Removed."
    docker container rm --force ${WEB_CONTAINER_NAME}
    echo "${WEB_CONTAINER_NAME} Removed."
        
    # Bring compose down (check if it is being run first time):
    export BASE_PATH=${BASE_PATH}
    if [ -d "translator" ]
    then
        cd translator/deployment/compose
        docker-compose -f ${DOCKER_COMPOSE_FILE} --log-level ${DOCKER_LOG_LEVEL} down 
    fi

    # Remove unused images
    docker rmi $(docker images -f 'dangling=true' -q) || true
    # Remove unused volumes
    docker volume rm $(docker volume ls -q --filter "dangling=true") || true

elif [ "$handler" = "build" ]
then

    export BASE_PATH=${BASE_PATH}
    cd translator/deployment/compose
    docker-compose -f ${DOCKER_COMPOSE_FILE} -p ${DOCKER_PROJECT_NAME} build ${DB_SERVICE_NAME}
    docker-compose -f ${DOCKER_COMPOSE_FILE} -p ${DOCKER_PROJECT_NAME} build ${API_SERVICE_NAME}
    docker-compose -f ${DOCKER_COMPOSE_FILE} -p ${DOCKER_PROJECT_NAME} build ${WEB_SERVICE_NAME}

elif [ "$handler" = "up" ]
then

    export BASE_PATH=${BASE_PATH}
    cd translator/deployment/compose
  	docker-compose -f ${DOCKER_COMPOSE_FILE} --log-level ${DOCKER_LOG_LEVEL} up -d

else
    echo "Invalid Docker Handler passed to script."
fi

