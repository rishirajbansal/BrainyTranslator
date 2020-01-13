output "instances_info" {
  value = <<-EOT
    
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    Single Instance Info
    ===================
    Public IP   => ${module.instances.instance_public_ip}
    Public DNS  => ${module.instances.instance_public_dns}

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
  EOT
}
