# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Create Security Groups:
# 1. For API Instance
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

resource "aws_security_group" "sg_api" {
  name              = "TF-Translator-APIServer-SG"
  description       = "SG for API EC2 Instance"
  vpc_id            = aws_vpc.translator_vpc.id

  dynamic "ingress" {
    for_each = var.sg_ports_http
    content {
      from_port     = ingress.key
      to_port       = ingress.value
      protocol      = "tcp"
      cidr_blocks   = ["0.0.0.0/0"]
      description     = "HTTP Web Traffic"
    }
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    description     = "SSC Access to EC2 Instance"
  }

  ingress {
    from_port       = 8050
    to_port         = 8050
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    description     = "Allowing Access to Directly access API Server"
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
      description     = "Allow outbound HTTP Access"
    }
  }

  egress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = [var.subnet_private_DB_cidr]
    description     = "Outbound access to DB subnet"
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
    Name = "TF-Translator-APIServer-SG"
  }
  
}
