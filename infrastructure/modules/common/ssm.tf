resource "aws_ssm_parameter" "github_token" {
  name  = "/kanaru.me/${var.env}/github_token"
  type  = "SecureString"
  value = "dummy"

  lifecycle {
    ignore_changes = [value]
  }
}
