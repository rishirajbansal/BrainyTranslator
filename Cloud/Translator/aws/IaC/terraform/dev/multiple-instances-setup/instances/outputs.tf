output "instance_nat_id" {
  value = "${aws_instance.nat_instance.id}"
}

output "instance_web_public_ip" {
  value = "${aws_instance.web_instance.public_ip}"
}

output "instance_web_public_dns" {
  value = "${aws_instance.web_instance.public_dns}"
}

output "instance_api_public_ip" {
  value = "${aws_instance.api_instance.public_ip}"
}

output "instance_api_public_dns" {
  value = "${aws_instance.api_instance.public_dns}"
}

output "instance_db_private_ip" {
  value = "${aws_instance.db_instance.private_ip}"
}

output "instance_db_private_dns" {
  value = "${aws_instance.db_instance.private_dns}"
}

output "instance_nat_public_ip" {
  value = "${aws_instance.nat_instance.public_ip}"
}

output "instance_nat_public_dns" {
  value = "${aws_instance.nat_instance.public_dns}"
}


