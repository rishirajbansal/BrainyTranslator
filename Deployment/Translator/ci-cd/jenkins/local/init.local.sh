#!/bin/bash

# Environment Setup Script - Copying files to appropriate directory in Jenkins workspace

set -x #echo on

cd ${WORKSPACE}

# Remove previous files to flush out old files
rm -rf frontend
# Create Frontend dirs
mkdir -p frontend
mkdir -p frontend/translator
#cp -r ${WORKSPACE}/Frontend/Translator/dist/* ${WORKSPACE}/frontend/translator/
# Ensure that files starting with .* also copy to the destination, use /. while copy
cp -r ${WORKSPACE}/Frontend/Translator/. ${WORKSPACE}/frontend/translator/
ls ${WORKSPACE}
rm -r ${WORKSPACE}/Frontend
ls ${WORKSPACE}

# Remove previous files to flush out old files
rm -rf backend
# Create backend dirs
mkdir -p backend
cp -r ${WORKSPACE}/Backend/Python/. ${WORKSPACE}/backend/
rm -rf ${WORKSPACE}/Backend
ls ${WORKSPACE}

# Remove previous files to flush out old files
rm -rf deployment
# Create Deployment dirs
mkdir -p deployment
mkdir -p deployment/compose
mkdir -p deployment/ci-cd
cp -r ${WORKSPACE}/Deployment/Translator/Containerization/dev/compose/. ${WORKSPACE}/deployment/compose
cp -r ${WORKSPACE}/Deployment/Translator/ci-cd/jenkins/local/. ${WORKSPACE}/deployment/ci-cd/
rm -rf ${WORKSPACE}/Deployment
ls ${WORKSPACE}


exec $@