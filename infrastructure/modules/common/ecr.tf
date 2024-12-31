resource "aws_ecr_repository" "ecr" {
  name = "ecr-kanaru-me-${var.env}"
}

resource "aws_ecr_lifecycle_policy" "ecr-lifecycle" {
  repository = aws_ecr_repository.ecr.name
  policy     = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "selection": {
                "tagStatus": "untagged",
                "countType": "imageCountMoreThan",
                "countNumber": 3
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
