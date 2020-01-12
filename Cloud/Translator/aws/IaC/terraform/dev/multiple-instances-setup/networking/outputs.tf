output "web_container_subnet_id" {
  value = "${aws_subnet.web_container_subnet.id}"
}

output "api_container_subnet_id" {
  value = "${aws_subnet.api_container_subnet.id}"
}

output "db_container_subnet_id" {
  value = "${aws_subnet.db_container_subnet.id}"
}

output "sg_api_id" {
  value = "${aws_security_group.sg_api.id}"
}

output "sg_web_id" {
  value = "${aws_security_group.sg_web.id}"
}

output "sg_db_id" {
  value = "${aws_security_group.sg_db.id}"
}

output "sg_nat_id" {
  value = "${aws_security_group.sg_nat.id}"
}

