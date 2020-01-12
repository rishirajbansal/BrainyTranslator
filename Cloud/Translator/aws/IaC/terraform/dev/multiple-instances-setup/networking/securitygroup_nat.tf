# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Create Security Groups:
# 1. For NAT Instance
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

resource "aws_security_group" "sg_nat" {
  name              = "TF-Translator-NAT-SG"
  description       = "SG for NAT EC2 Instance"
  vpc_id            = aws_vpc.translator_vpc.id

  dynamic "ingress" {
    for_each = var.sg_ports_http
    content {
      from_port     = ingress.key
      to_port       = ingress.value
      protocol      = "tcp"
      cidr_blocks   = [var.subnet_private_DB_cidr]
      description     = "Allow inbound HTTP traffic from servers in the private subnet"
    }
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    description     = "Allow inbound SSH access to the NAT instance from home network (over the Internet gateway)"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    description     = "To allow access from outside to check PostgreSQL server from pgAdmin"
  }

  dynamic "ingress" {
    for_each = var.sg_ports_docker_tcp
    content {
      from_port     = ingress.key
      to_port       = ingress.value
      protocol      = "tcp"
      cidr_blocks   = [var.vpc_cidr]
      description     = "Docker Port for Overlay Network"
    }
  }

  dynamic "ingress" {
    for_each = var.sg_ports_docker_udp
    content {
      from_port     = ingress.key
      to_port       = ingress.value
      protocol      = "udp"
      cidr_blocks   = [var.vpc_cidr]
      description     = "Docker Port for Overlay Network"
    }
  }

  dynamic "egress" {
    for_each = var.sg_ports_http
    content {
      from_port     = egress.key
      to_port       = egress.value
      protocol      = "tcp"
      cidr_blocks   = ["0.0.0.0/0"]
      description     = "Allow outbound HTTP access to the Internet"
    }
  }

  egress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    cidr_blocks     = [var.subnet_private_DB_cidr]
    description     = "Allow outbound SSH access to DB Subnet"
  }

  egress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = [var.subnet_private_DB_cidr]
    description     = "To allow access from outside to check PostgreSQL server from pgAdmin"
  }

  dynamic "egress" {
    for_each = var.sg_ports_docker_tcp
    content {
      from_port     = egress.key
      to_port       = egress.value
      protocol      = "tcp"
      cidr_blocks   = [var.vpc_cidr]
      description     = "Docker Port for Overlay Network"
    }
  }

  dynamic "egress" {
    for_each = var.sg_ports_docker_udp
    content {
      from_port     = egress.key
      to_port       = egress.value
      protocol      = "udp"
      cidr_blocks   = [var.vpc_cidr]
      description     = "Docker Port for Overlay Network"
    }
  }

  tags = {
    Name = "TF-Translator-NAT-SG"
  }
}
