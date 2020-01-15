# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Create Public EC2 instances:
# 1. WEB instance - Nginx Web Server
# 2. API Instance - Gunicorn Python Backend Server
# 3. NAT Instance - To access Private DB Instance for SSH and software updates
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

resource "aws_instance" "web_instance" {
  ami                             = "ami-04b9e92b5572fa0d1"
  instance_type                   = "t2.micro"
  key_name                        = var.key_name
  subnet_id                       = var.web_container_subnet_id
  vpc_security_group_ids          = [var.sg_web_id]
  iam_instance_profile            = "TranslatorRole"
  associate_public_ip_address     = true

  root_block_device {
    volume_type                   = "gp2"
    volume_size                   = 8
    delete_on_termination         = true
  }

  user_data_base64                 = base64encode(file("./instances/dockerInstances_userdata.sh"))

  tags = {
    Name = "TF-Translator-Web-Instance"
  }

  # provisioner "local-exec" {
  #     command = "echo Public IP of WEB Instance : ${aws_instance.web_instance.public_ip} \n Public DNS of web Instance: ${aws_instance.web_instance.public_dns} >> out.txt "
  # }
  
}

resource "aws_instance" "api_instance" {
  ami                             = "ami-04b9e92b5572fa0d1"
  instance_type                   = "t2.micro"
  key_name                        = var.key_name
  subnet_id                       = var.api_container_subnet_id
  vpc_security_group_ids          = [var.sg_api_id]
  iam_instance_profile            = "TranslatorRole"
  associate_public_ip_address     = true
  
  root_block_device {
    volume_type                   = "gp2"
    volume_size                   = 8
    delete_on_termination         = true
  }

  user_data_base64                       = base64encode(file("./instances/dockerInstances_userdata.sh"))

  tags = {
    Name = "TF-Translator-API-Instance"
  }

}

resource "aws_instance" "nat_instance" {
  ami                             = "ami-02cb555e324696ced"
  instance_type                   = "t2.micro"
  key_name                        = var.key_name
  subnet_id                       = var.web_container_subnet_id
  vpc_security_group_ids          = [var.sg_nat_id]
  iam_instance_profile            = "TranslatorRole"
  associate_public_ip_address     = true

  source_dest_check               = false

  root_block_device {
    volume_type                   = "gp2"
    volume_size                   = 8
    delete_on_termination         = true
  }

  user_data_base64                 = base64encode(file("./instances/natInstance_userdata.sh"))

  tags = {
    Name = "TF-Translator-NAT-Instance"
  }
}

resource "aws_instance" "db_instance" {
  ami                             = "ami-04b9e92b5572fa0d1"
  instance_type                   = "t2.micro"
  key_name                        = var.key_name
  subnet_id                       = var.db_container_subnet_id
  vpc_security_group_ids          = [var.sg_db_id]
  iam_instance_profile            = "TranslatorRole"
  associate_public_ip_address     = false

  root_block_device {
    volume_type                   = "gp2"
    volume_size                   = 8
    delete_on_termination         = true
  }

  user_data_base64                       = base64encode(file("./instances/dockerInstances_userdata.sh"))

  tags = {
    Name = "TF-Translator-DB-Instance"
  }

}


