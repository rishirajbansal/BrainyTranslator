
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
  subnet_public_web_cidr        = var.subnet_public_web_cidr
  subnet_public_api_cidr        = var.subnet_public_api_cidr
  subnet_private_DB_cidr        = var.subnet_private_DB_cidr
  sg_ports_http                 = var.sg_ports_http
  sg_ports_docker_tcp           = var.sg_ports_docker_tcp
  sg_ports_docker_udp           = var.sg_ports_docker_udp
  instance_nat_id               = module.instances.instance_nat_id
}

module "instances" {
  source                        = "./instances"

  key_name                      = var.key_name
  web_container_subnet_id       = module.networking.web_container_subnet_id
  api_container_subnet_id       = module.networking.api_container_subnet_id
  db_container_subnet_id        = module.networking.db_container_subnet_id
  sg_api_id                     = module.networking.sg_api_id
  sg_web_id                     = module.networking.sg_web_id
  sg_db_id                      = module.networking.sg_db_id
  sg_nat_id                     = module.networking.sg_nat_id
}

