# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Create Security Groups:
# 1. For DB Instance
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

resource "aws_security_group" "sg_db" {
  name              = "TF-Translator-DBServer-SG"
  description       = "SG for DB EC2 Instance"
  vpc_id            = aws_vpc.translator_vpc.id

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    cidr_blocks     = [var.subnet_public_web_cidr]
    description     = "Allow access to SSH only from WEB Subnet so that NAT Instance can access it"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = [var.subnet_public_web_cidr]
    description     = "Allow access to PostgreSQL from WEB Subnet so that NAT Instance can access it"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = [var.subnet_public_api_cidr]
    description     = "Allow access to PostgreSQL from API Subnet"
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
      description     = "For Software installs and updates"
    }
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
    Name = "TF-Translator-DBServer-SG"
  }
}
