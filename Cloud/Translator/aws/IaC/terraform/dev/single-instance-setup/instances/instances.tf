# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Create Public EC2 instances:
# Single instance - Containing: 
# 1. Nginx Web Server
# 2. Gunicorn Python Backend Server
# 3. Database PostgreSQL Server
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

resource "aws_instance" "single_instance" {
  ami                             = "ami-04b9e92b5572fa0d1"
  instance_type                   = "t2.micro"
  key_name                        = var.key_name
  subnet_id                       = var.subnet_id
  vpc_security_group_ids          = [var.sg_id]
  iam_instance_profile            = "TranslatorRole"
  associate_public_ip_address     = true

  root_block_device {
    volume_type                   = "gp2"
    volume_size                   = 8
    delete_on_termination         = true
  }

  user_data_base64                 = base64encode(file("./instances/dockerInstances_userdata.sh"))

  tags = {
    Name = "TF-Translator-SI-Instance"
  }

  # provisioner "local-exec" {
  #     command = "echo Public IP of WEB Instance : ${aws_instance.web_instance.public_ip} \n Public DNS of web Instance: ${aws_instance.web_instance.public_dns} >> out.txt "
  # }
  
}

