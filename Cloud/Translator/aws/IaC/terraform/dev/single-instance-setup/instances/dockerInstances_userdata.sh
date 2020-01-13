#!/bin/bash -x
bash -ex <<-"RUNSCRIPT"
    sudo apt-get update
    # Install CloudFormation Helper Scripts
    echo ">>>>>>>>>>>>>>>>>>>>>>> Installing CloudFormation Helper Scripts >>>>>>>>>>>>>>>>>>>>>>>"
    sudo apt-get install python-pip -y
    mkdir -p /opt/aws/bin
    wget https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-latest.tar.gz
    pip install --target /opt/aws/bin aws-cfn-bootstrap-latest.tar.gz
    cd /opt/aws/bin
    sudo python easy_install.py --script-dir /opt/aws/bin /aws-cfn-bootstrap-latest.tar.gz
    ln -s /root/aws-cfn-bootstrap-latest/init/ubuntu/cfn-hup /etc/init.d/cfn-hup
    # Install Docker
    echo ">>>>>>>>>>>>>>>>>>>>>>> Installing Docker and its depenendcies >>>>>>>>>>>>>>>>>>>>>>>"
    cd /home/ubuntu
    sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common -y
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli -y
    mkdir $HOME/.docker
    echo "{}" >  $HOME/.docker/config.json
    getent group docker || sudo groupadd docker
    sudo usermod -aG docker ubuntu
    echo ">>>>>>>>>>>>>>>>>>>>>>> Installing Docker Compse (VesionL 1.24.0) and its depenendcies >>>>>>>>>>>>>>>>>>>>>>>"
    sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
RUNSCRIPT
# TODO: Commenting this for now as this is not working, its giving an error: pkg_resources.ResolutionError: Script 'scripts/cfn-signal' not found in metadata at '/opt/aws/bin/aws_cfn_bootstrap-1.4.dist-info'
#/opt/aws/bin/cfn-signal -e $? --stack ${AWS::StackName} --resource WebEC2Instance --region ${AWS::Region}