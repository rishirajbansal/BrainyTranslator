output "subnet_id" {
  value = "${aws_subnet.subnet.id}"
}

output "sg_id" {
  value = "${aws_security_group.sg.id}"
}

