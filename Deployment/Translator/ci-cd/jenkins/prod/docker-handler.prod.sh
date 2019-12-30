#!/bin/bash

# Docker environment cleanup Script

set -x #echo on

handler=$1

echo "Docker handler : $handler"

if [ "$handler" = "cleanup" ] 
then
    # Stop the containers:
    docker container stop ${DB_CONTAINER_NAME}
    echo "${DB_COTAINER_NAME} Stopped."
    docker container stop ${API_CONTAINER_NAME}
    echo "${API_CONTAINER_NAME} Stopped."
    docker container stop ${WEB_CONTAINER_NAME}
    echo "${WEB_CONTAINER_NAME} Stopped."
        
    # Delete preexisted containers:
    docker container rm --force ${DB_CONTAINER_NAME}
    echo "${DB_COTAINER_NAME} Removed."
    docker container rm --force ${API_CONTAINER_NAME}
    echo "${API_CONTAINER_NAME} Removed."
    docker container rm --force ${WEB_CONTAINER_NAME}
    echo "${WEB_CONTAINER_NAME} Removed."
        
    # Bring compose down:
    cd ${WORKSPACE}/deployment/compose
    docker-compose -f ${DOCKER_COMPOSE_FILE} --log-level ${DOCKER_LOG_LEVEL} down 

    # Remove unused images
    docker rmi $(docker images -f 'dangling=true' -q) || true

elif [ "$handler" = "build" ]
then
    cd ${WORKSPACE}/deployment/compose

   	docker-compose -f ${DOCKER_COMPOSE_FILE} -p ${DOCKER_PROJECT_NAME} build ${DB_SERVICE_NAME}
    docker-compose -f ${DOCKER_COMPOSE_FILE} -p ${DOCKER_PROJECT_NAME} build ${API_SERVICE_NAME}
    docker-compose -f ${DOCKER_COMPOSE_FILE} -p ${DOCKER_PROJECT_NAME} build ${WEB_SERVICE_NAME}

elif [ "$handler" = "up" ]
then
    cd ${WORKSPACE}/deployment/compose

  	docker-compose -f ${DOCKER_COMPOSE_FILE} --log-level ${DOCKER_LOG_LEVEL} up -d

elif [ "$handler" = "postdeploy" ]
then
    db_ip=$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${DB_CONTAINER_NAME})
    api_ip=$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${API_CONTAINER_NAME})
    web_ip=$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${WEB_CONTAINER_NAME})
    db_port=$(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{(index $conf 0).HostPort}} {{end}}' ${DB_CONTAINER_NAME})
    api_port=$(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{(index $conf 0).HostPort}} {{end}}' ${API_CONTAINER_NAME})
    
    echo "TODO: WEB service has 2 ports assigned and thats why standard command used for other service is not working, need to check upon, for now assigning hard coded port to retreive the port"
    echo "Confirm it if does not work"
    web_port=$(docker inspect --format='{{(index (index .NetworkSettings.Ports "8072/tcp") 0).HostPort}}' ${WEB_CONTAINER_NAME})

    echo "Access Web Application : http://$web_ip:$web_port"
    echo "Access API Application : http://$api_ip:$api_port"
    echo "Access Database : http://$db_ip:$db_port"

    echo "Access Application logs at: ${WORKSPACE}/backend/logs"

else
    echo "Invalid Docker Handler passed to script."
fi


