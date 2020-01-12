output "instances_info" {
  value = <<-EOT
    
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    Web Instance Info
    ===================
    Public IP   => ${module.instances.instance_web_public_ip}
    Public DNS  => ${module.instances.instance_web_public_dns}

    API Instance Info
    ====================
    Public IP   => ${module.instances.instance_api_public_ip}
    Public DNS  => ${module.instances.instance_api_public_dns}

    NAT Instance Info
    ==================
    Public IP   => ${module.instances.instance_nat_public_ip}
    Public DNS  => ${module.instances.instance_nat_public_dns}

    DB Instance Info
   ===================
    Private IP   => ${module.instances.instance_db_private_ip}
    Private DNS  => ${module.instances.instance_db_private_dns}

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
  EOT
}
