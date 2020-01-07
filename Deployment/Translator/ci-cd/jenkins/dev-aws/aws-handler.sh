#!/bin/bash

# AWS environment Setup

set -x #echo on

handler=$1
awsPemKey=$2

echo "AWS handler : $handler"


if [ "$handler" = "stop-containers" ] 
then

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS} 'sh -s' < db2-instance.sh

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_API_INSTANCE_DNS} AWS_API_INSTANCE_DNS=${AWS_API_INSTANCE_DNS} CONTAINER_NAME=${API_CONTAINER_NAME} \
        'sh -s' < ${CICD_SCRIPT_LOCATION}/docker-handler.dev-aws.sh cleanup

    ssh -i ${awsPemKey} -o StrictHostKeyChecking=no ubuntu@${AWS_WEB_INSTANCE_DNS} AWS_API_INSTANCE_DNS=${AWS_WEB_INSTANCE_DNS} CONTAINER_NAME=${WEB_CONTAINER_NAME} \
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

    echo ""

    # Execute db-instance.sh in NAT instance from SSH here


else
    echo "Invalid AWS Handler passed to script."
fi
