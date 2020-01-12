#!/bin/bash -x
bash -ex <<-"RUNSCRIPT"
RUNSCRIPT
echo ">>>>>>>>>>>>>>>>>>>>>>> Updating Linux Instance >>>>>>>>>>>>>>>>>>>>>>>"
sudo yum update -y
# TODO: Commenting this for now as this is not working, its giving an error: pkg_resources.ResolutionError: Script 'scripts/cfn-signal' not found in metadata at '/opt/aws/bin/aws_cfn_bootstrap-1.4.dist-info'
#/opt/aws/bin/cfn-signal -e $? --stack ${AWS::StackName} --resource WebEC2Instance --region ${AWS::Region}