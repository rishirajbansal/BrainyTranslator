
terraform {
  required_providers {
    aws = "~> 2.8"
  }
}

provider "aws" {
  region                    = var.aws_region
  shared_credentials_file   = file(var.credentials_path)
  profile                   = var.aws_profile
}

# This is needed to create new key pair, as key pair is already existed for Translator, therefore note required here
# resource "aws_key_pair" "auth" {
#   key_name          = var.keypair_name
#   public_key        = file(var.keypair_public_key_path)
# }

module "networking" {
  source        = "./networking"

  vpc_cidr                      = var.vpc_cidr
  availability_zone_default     = var.availability_zone_default
  subnet_public_cidr            = var.subnet_public_cidr
  sg_ports_http                 = var.sg_ports_http
}

module "instances" {
  source                        = "./instances"

  key_name                      = var.key_name
  subnet_id                     = module.networking.subnet_id
  sg_id                         = module.networking.sg_id

}

