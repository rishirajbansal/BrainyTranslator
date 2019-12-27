# Environment Setup Script

#!/bin/bash

set -x #echo on

cd ${WORKSPACE}/Frontend/Translator

# Build Frontend layer of React
npm run build_docker_dev

cd ${WORKSPACE}

# Create Frontend dirs
mkdir -p frontend
mkdir -p frontend/translator
mv ${WORKSPACE}/Frontend/Translator/dist/* ${WORKSPACE}/frontend/translator/
#rm -r ${WORKSPACE}/Frontend

# Create backend dirs
mkdir -p backend
mv ${WORKSPACE}/backend/Python/* ${WORKSPACE}/backend/
#rm -rf ${WORKSPACE}/backend/Python

# Create Deployment dirs
mkdir -p deployment
mkdir -p deployment/compose
mv ${WORKSPACE}/Deployment/Translator/Containerization/dev/compose/* ${WORKSPACE}/deployment/compose/

exec $@