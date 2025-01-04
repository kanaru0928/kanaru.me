resource "aws_dynamodb_table" "page-views" {
  name         = "kanaru-me-table-page-views-${var.env}"
  hash_key     = "path"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "path"
    type = "S"
  }
}
