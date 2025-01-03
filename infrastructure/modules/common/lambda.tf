resource "aws_lambda_function" "lambda-app" {
  function_name = "lambda-kanaru-me-app-${var.env}"
  role          = aws_iam_role.lambda-app-role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.ecr.repository_url}:latest"
  timeout       = 60
  memory_size   = 256
  architectures = ["x86_64"]
  environment {
    variables = {
      APP_NAME        = "kanaru.me"
      ENVIRONMENT     = var.env
      GITHUB_ENDPOINT = "https://api.github.com/graphql"
      VERSION_NAME    = var.version_name
    }
  }
}

resource "aws_lambda_function_url" "lambda-app-url" {
  function_name      = aws_lambda_function.lambda-app.function_name
  authorization_type = "AWS_IAM"
}

resource "aws_lambda_permission" "lambda-app-cloudfront-permission" {
  statement_id  = "AllowExecutionFromCloudFront"
  action        = "lambda:InvokeFunctionUrl"
  function_name = aws_lambda_function.lambda-app.function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = aws_cloudfront_distribution.app-distribution.arn
}
