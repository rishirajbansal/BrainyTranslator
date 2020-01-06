#!/bin/bash

#-> This script is executed from NAT instance
#-> Command: ./db2-instance.sh   

# Set the env variables

export AWS_DB_INSTANCE_DNS=ip-10-11-3-45.ec2.internal
export CONTAINER_NAME=translator-db
export DB_DOCKERFILE=Dockerfile.db
export DB_IMAGE_TAG=translator-db:1.0
export BUILD_CONTEXT=.
export DB_CONTAINER_NAME=translator-db
export DOCKER_OVERLAY_NETWORK=translator-net
export DB_PUBLISHED_PORT=5432
export DB_CONTAINER_TARGET_PORT=5432


scp -r translator.tar.gz ubuntu@$AWS_DB_INSTANCE_DNS:/home/ubuntu

ssh ubuntu@AWS_DB_INSTANCE_DNS

tar -xf translator.tar.gz

rm translator.tar.gz

# Stop and remove containers #
docker container stop $CONTAINER_NAME
echo "$CONTAINER_NAME Stopped."
docker container rm --force $CONTAINER_NAME
echo "$CONTAINER_NAME Removed."

# Remove unused images
docker rmi $(docker images -f 'dangling=true' -q) || true
# Remove unused volumes
docker volume rm $(docker volume ls -q --filter "dangling=true") || true

# Build Image # 
docker build -f deployment/docker/$DB_DOCKERFILE -t $DB_IMAGE_TAG $BUILD_CONTEXT

# Create Container #
docker run -dit --name $DB_CONTAINER_NAME --network $DOCKER_OVERLAY_NETWORK -p $DB_PUBLISHED_PORT:$DB_CONTAINER_TARGET_PORT $DB_IMAGE_TAG

