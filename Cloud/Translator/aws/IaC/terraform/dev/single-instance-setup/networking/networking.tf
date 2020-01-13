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
    Name = "TF-Translator-SI-VPC"
  }
}

resource "aws_internet_gateway" "translator_ig" {
  vpc_id                = aws_vpc.translator_vpc.id
  tags = {
    Name = "TF-Translator-SI-IG"
  }
}

resource "aws_subnet" "subnet" {
  vpc_id                = aws_vpc.translator_vpc.id
  cidr_block            = var.subnet_public_cidr
  availability_zone     = var.availability_zone_default
  tags = {
    Name = "TF-Translator-SI-Subnet"
  }
}

resource "aws_route_table" "translator_public_subnet_rt" {
  vpc_id                = aws_vpc.translator_vpc.id
  route {
    cidr_block          = "0.0.0.0/0"
    gateway_id          = aws_internet_gateway.translator_ig.id
  }
  tags = {
    Name = "TF-Translator-SI-PublicSubnet-RT"
  }
}

resource "aws_route_table_association" "subnet_assoc" {
  subnet_id             = aws_subnet.subnet.id
  route_table_id        = aws_route_table.translator_public_subnet_rt.id
}

