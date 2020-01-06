#!/bin/bash

# AWS environment Setup

set -x #echo on

handler=$1

echo "AWS handler : $handler"

if [ "$handler" = "copy-project" ] 
then

    #-> Ensure that private key file is present in Linux machine and has permisstions

    # Copy Project to NAT instance which will move project to private DB Instance

   	scp -r -i ${PRIVATE_KEY_PATH} -o StrictHostKeyChecking=no ${WORKSPACE} ec2-user@${AWS_NAT_INSTANCE_DNS}:${AWS_NAT_WORKDIR}

    ssh -i ${PRIVATE_KEY_PATH} -o StrictHostKeyChecking=no ec2-user@${AWS_NAT_INSTANCE_DNS}

    scp -r ${AWS_NAT_WORKDIR} ubuntu@${AWS_DB_INSTANCE_DNS}:${AWS_DEFAULT_WORKDIR}

    exit

    # Copy Project to API instance 


    

    

else
    echo "Invalid AWS Handler passed to script."
fi
