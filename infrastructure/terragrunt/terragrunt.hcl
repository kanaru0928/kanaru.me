locals {
  region = "ap-northeast-1"
  env    = basename(path_relative_to_include())
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = file("./config/provider.tf.tftpl")
}

generate "main" {
  path      = "main.tf"
  if_exists = "overwrite"
  contents  = "${file("./config/main.tf.tftpl")}"
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }

  config = {
    bucket  = "760485329571-kanarume-terraform-state"
    key     = "${local.env}/terraform.tfstate"
    region  = "${local.region}"
    encrypt = true
  }
}

generate "variables" {
  path      = "variables.tf"
  if_exists = "overwrite"
  contents  = "${file("./config/variables.tf.tftpl")}\n${file("./config/${local.env}/variables.tf.tftpl")}"
}

generate "tfvars" {
  path      = "terraform.tfvars"
  if_exists = "overwrite"
  contents  = "${file("./config/terraform.tfvars.tftpl")}\n${file("./config/${local.env}/terraform.tfvars.tftpl")}"
}
