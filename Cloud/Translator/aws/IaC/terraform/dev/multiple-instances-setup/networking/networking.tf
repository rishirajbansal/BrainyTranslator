# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Create Networking Resources like:
# 1. VOC
# 2. Interget Gateway
# 3. Subnets
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

resource "aws_vpc" "translator_vpc" {
  
  cidr_block            = var.vpc_cidr
  enable_dns_support    = true
  enable_dns_hostnames  = true
  tags = {
    Name = "TF-Translator-VPC"
  }
}

resource "aws_internet_gateway" "translator_ig" {
  vpc_id                = aws_vpc.translator_vpc.id
  tags = {
    Name = "TF-Translator-IG"
  }
}

resource "aws_subnet" "web_container_subnet" {
  vpc_id                = aws_vpc.translator_vpc.id
  cidr_block            = var.subnet_public_web_cidr
  availability_zone     = var.availability_zone_default
  tags = {
    Name = "TF-Translator-WebContainerSubnet"
  }
}

resource "aws_subnet" "api_container_subnet" {
  vpc_id                = aws_vpc.translator_vpc.id
  cidr_block            = var.subnet_public_api_cidr
  availability_zone     = var.availability_zone_default
  tags = {
    Name = "TF-Translator-APIContainerSubnet"
  }
}

resource "aws_subnet" "db_container_subnet" {
  vpc_id                = aws_vpc.translator_vpc.id
  cidr_block            = var.subnet_private_DB_cidr
  availability_zone     = var.availability_zone_default
  tags = {
    Name = "TF-Translator-DBContainerSubnet"
  }
}

resource "aws_route_table" "translator_public_subnet_rt" {
  vpc_id                = aws_vpc.translator_vpc.id
  route {
    cidr_block          = "0.0.0.0/0"
    gateway_id          = aws_internet_gateway.translator_ig.id
  }
  tags = {
    Name = "TF-Translator-PublicSubnet-RT"
  }
}

resource "aws_route_table_association" "subnet_assoc_web" {
  subnet_id             = aws_subnet.web_container_subnet.id
  route_table_id        = aws_route_table.translator_public_subnet_rt.id
}

resource "aws_route_table_association" "subnet_assoc_api" {
  subnet_id             = aws_subnet.api_container_subnet.id
  route_table_id        = aws_route_table.translator_public_subnet_rt.id
}

resource "aws_route_table" "translator_private_subnet_rt" {
  vpc_id                = aws_vpc.translator_vpc.id
  route {
    cidr_block          = "0.0.0.0/0"
    instance_id         = var.instance_nat_id
  }
  tags = {
    Name = "TF-Translator-PrivateSubnet-RT"
  }
}

resource "aws_route_table_association" "subnet_assoc_db" {
  subnet_id             = aws_subnet.db_container_subnet.id
  route_table_id        = aws_route_table.translator_private_subnet_rt.id
}

