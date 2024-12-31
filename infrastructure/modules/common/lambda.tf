resource "aws_lambda_function" "lambda-app" {
  function_name = "lambda-kanaru-me-app-${var.env}"
  role          = aws_iam_role.lambda-app-role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.ecr.repository_url}:latest"
  timeout       = 60
  memory_size   = 256
  architectures = ["arm64"]
}

resource "aws_lambda_function_url" "lambda-app-url" {
  function_name      = aws_lambda_function.lambda-app.function_name
  authorization_type = "NONE"
}
