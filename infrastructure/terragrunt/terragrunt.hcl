locals {
  region = "ap-northeast-1"
  env    = basename(path_relative_to_include())
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents = templatefile("./config/provider.tf.tftpl", {
    env    = local.env,
    region = local.region
  })
}

generate "main" {
  path      = "main.tf"
  if_exists = "overwrite"
  contents = "${templatefile("./config/main.tf.tftpl", {
    env = local.env
  })}"
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
  contents = "${templatefile("./config/terraform.tfvars.tftpl", {
    env = local.env
  })}\n${file("./config/${local.env}/terraform.tfvars.tftpl")}"
}
