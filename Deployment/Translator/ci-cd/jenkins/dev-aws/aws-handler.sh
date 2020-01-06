#!/bin/bash

# AWS environment Setup

set -x #echo on

handler=$1
awsPemKey=$2

echo "AWS handler : $handler"


if [ "$handler" = "stop-containers" ] 
then

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_API_INSTANCE_DNS} AWS_API_INSTANCE_DNS=${AWS_API_INSTANCE_DNS} CONTAINER_NAME=${API_CONTAINER_NAME} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh cleanup

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_WEB_INSTANCE_DNS} AWS_API_INSTANCE_DNS=${AWS_WEB_INSTANCE_DNS} CONTAINER_NAME=${WEB_CONTAINER_NAME} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh cleanup

    #scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${CICD_SCRIPT_LOCATION}/aws-handler.sh ec2-user@${AWS_NAT_INSTANCE_DNS}:${AWS_NAT_WORKDIR}

# 1st approach

#     ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH \
#         AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$DB_CONTAINER_NAME awsPemKey=${awsPemKey}\
#         'sh -s' <<-'ENDSSH'

#         echo "$CONTAINER_NAME"
#         ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_DB_INSTANCE_DNS} CONTAINER_NAME=$CONTAINER_NAME 'sh -s' < aws-handler.sh stop-containers 
#         exit

# ENDSSH

# 2nd approach - 

    # ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH \
    #     AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$DB_CONTAINER_NAME 'sh -s' < docker-handler.dev-aws.sh cleanup

# 3rd approach - 

#     ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} PRIVATE_KEY_PATH=$PRIVATE_KEY_PATH \
#         AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS CONTAINER_NAME=$DB_CONTAINER_NAME \
#         'sh -s' <<-'ENDNATSSH'

#         bash docker-handler.dev-aws.sh cleanup

# ENDNATSSH   

elif [ "$handler" = "copy-project" ]
then

    # Copy Project to NAT instance which will move project to private DB Instance

   	scp -r -i ${awsPemKey} -o StrictHostKeyChecking=no ${WORKSPACE}/translator ec2-user@${AWS_NAT_INSTANCE_DNS}:${AWS_NAT_WORKDIR}

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} AWS_DB_INSTANCE_DNS=$AWS_DB_INSTANCE_DNS \
        AWS_NAT_WORKDIR=$AWS_NAT_WORKDIR AWS_DEFAULT_WORKDIR=$AWS_DEFAULT_WORKDIR  \
        'sh -s' <<-'ENDNATSSH'
        
        echo 'Testeteeetette'
        scp -r $AWS_NAT_WORKDIR/translator ubuntu@$AWS_DB_INSTANCE_DNS:$AWS_DEFAULT_WORKDIR
        
ENDNATSSH

else
    echo "Invalid AWS Handler passed to script."
fi
