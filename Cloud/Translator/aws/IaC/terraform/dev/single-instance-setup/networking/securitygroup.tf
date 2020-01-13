# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Create Security Groups:
# 1. For Single Instance
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

resource "aws_security_group" "sg" {
  name              = "TF-Translator-SI-SG"
  description       = "SG for EC2 Instance"
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

  ingress {
    from_port       = 8072
    to_port         = 8072
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    description     = "Allowing Access to Web Nginx Server"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    description     = "To allow access from outside to check PostgreSQL server from pgAdmin"
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

  tags = {
    Name = "TF-Translator-SI-SG"
  }

}
