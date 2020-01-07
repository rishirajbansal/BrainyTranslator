#!/bin/bash

# AWS environment Setup

set -x #echo on

handler=$1
awsPemKey=$2

echo "AWS handler : $handler"


if [ "$handler" = "stop-containers" ] 
then

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_API_INSTANCE_DNS} CONTAINER_NAME=${API_CONTAINER_NAME} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh cleanup

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_WEB_INSTANCE_DNS} CONTAINER_NAME=${WEB_CONTAINER_NAME} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh cleanup


# 1st approach
# Its keep giving an error "Permission denied (publickey)."
#     ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH \
#             AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$DB_CONTAINER_NAME awsPemKey=${awsPemKey}\
#             'sh -s' <<-'ENDSSH'

#             echo "$CONTAINER_NAME"
#             ssh -o StrictHostKeyChecking=no ubuntu@$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$CONTAINER_NAME 'sh -s' <<-'ENDSSH2' 

#             echo "$CONTAINER_NAME"
# ENDSSH2
# ENDSSH

# 2nd approach - 

    # ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH \
    #     AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$DB_CONTAINER_NAME 'sh -s' < docker-handler.dev-aws.sh cleanup

# 3rd approach - 
# Its keep giving an error "Permission denied (publickey)."

#     ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH \
#         AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$DB_CONTAINER_NAME \
#         'sh -s' <<-'ENDNATSSH'

#         bash docker-handler.dev-aws.sh cleanup

# ENDNATSSH   

elif [ "$handler" = "copy-project" ]
then

    # Copy Project to NAT instance which will move project to private DB Instance
    cd ${WORKSPACE}
    sudo tar -czf translator.tar.gz translator

    scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${WORKSPACE}/translator.tar.gz ec2-user@${AWS_NAT_INSTANCE_DNS}:${AWS_NAT_WORKDIR}
    scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${WORKSPACE}/translator.tar.gz ubuntu@${AWS_API_INSTANCE_DNS}:${AWS_DEFAULT_WORKDIR}
    scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${WORKSPACE}/translator.tar.gz ubuntu@${AWS_WEB_INSTANCE_DNS}:${AWS_DEFAULT_WORKDIR}

    # Copy script files to execute on DB instance manually from NAT instance
    scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${CICD_SCRIPT_LOCATION}/db2-instance.sh ec2-user@${AWS_NAT_INSTANCE_DNS}:${AWS_NAT_WORKDIR}

    # Extract project artifacts on API and WEB instances
    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_API_INSTANCE_DNS} \
        'sh -s' <<-'ENDNATSSH'

        rm -rf translator
        tar -xf translator.tar.gz
        rm translator.tar.gz

ENDNATSSH

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_WEB_INSTANCE_DNS} \
        'sh -s' <<-'ENDNATSSH'

        rm -rf translator
        tar -xf translator.tar.gz
        rm translator.tar.gz

ENDNATSSH

elif [ "$handler" = "build-images" ]
then

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_API_INSTANCE_DNS} \
        API_DOCKERFILE=${API_DOCKERFILE} POSTGRESQL_HOST=${POSTGRESQL_HOST} API_IMAGE_TAG=${API_IMAGE_TAG} BUILD_CONTEXT=${BUILD_CONTEXT} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh build-api-image

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_WEB_INSTANCE_DNS} \
        WEB_DOCKERFILE=${WEB_DOCKERFILE} WEB_IMAGE_TAG=${WEB_IMAGE_TAG} BUILD_CONTEXT=${BUILD_CONTEXT} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh build-web-image

elif [ "$handler" = "up" ]
then

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_API_INSTANCE_DNS} \
        API_CONTAINER_NAME=${API_CONTAINER_NAME} DOCKER_OVERLAY_NETWORK=${DOCKER_OVERLAY_NETWORK} \
        WORK_DIR=${WORK_DIR} API_CONTAINER_TARGET_PORT=${API_CONTAINER_TARGET_PORT} API_PUBLISHED_PORT=${API_PUBLISHED_PORT} \
        API_IMAGE_TAG=${API_IMAGE_TAG} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh api-up

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_API_INSTANCE_DNS} \
        WEB_CONTAINER_NAME=${WEB_CONTAINER_NAME} DOCKER_OVERLAY_NETWORK=${DOCKER_OVERLAY_NETWORK} \
        WEB_PUBLISHED_PORT=${WEB_PUBLISHED_PORT} WEB_CONTAINER_TARGET_PORT=${WEB_CONTAINER_TARGET_PORT} WEB_IMAGE_TAG=${WEB_IMAGE_TAG} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh web-up

elif [ "$handler" = "postdeploy" ]
then

    echo "Access Web Application : http://$AWS_WEB_IP:$AWS_WEB_PORT"
    echo "Access API Application : http://$AWS_API_IP:$AWS_API_PORT"
    
else
    echo "Invalid AWS Handler passed to script."
fi
