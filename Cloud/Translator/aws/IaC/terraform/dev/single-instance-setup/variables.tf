variable "aws_region" {
  default       = "us-east-1"
  description   = "AWS Region to use where all the deployment stack will be deployed"
}

variable "credentials_path" {
  default       = "C:\\Users\\Rishi Raj\\.aws\\credentials"
  description   = "Path for IAM User credentails for AWS Authentication in local system used to access AWS login"
}

variable "aws_profile" {
  default       = "translatorEC2User"
  description   = "Profile name for AWS Authentication from local credentials file"
}

# This is needed to create new key pair, as key pair is already existed for Translator, therefore note required here
# variable "keypair_name" {
#   default       = "TranslatorKey"
#   description   = "Name of KeyPair to access AWS resources via SSH"
# }

# variable "keypair_public_key_path" {
#   default       = "C:\\Development\\AWS\\accounts\\rishiraj.aws2\\KeyValuePair\\Translator\\TranslatorKey.pub"
#   description   = "Path of Public key file of keypair used to access AWS resources via SSH"
# }

variable "key_name" {
  default       = "TranslatorKey"
  description   = "Name of KeyPair to access AWS resources via SSH"
}

variable "vpc_cidr" {
  default       = "10.11.0.0/16"
  description   = "CIDR for Translator VPC"
}


variable "subnet_public_cidr" {
  default       = "10.11.1.0/24"
  description   = "CIDR for Public Subnet"
}

variable "availability_zone_default" {
  default       = "us-east-1a"
  description   = "Default Availability Zone used for Translator Resources Creations"
}

variable "sg_ports_http" {
  default       = {
    "80"    = "80"
    "443"   = "443"
  }
  description   = "Security Group TCP Ports Defined for : HTTP, HTTPs"
}



