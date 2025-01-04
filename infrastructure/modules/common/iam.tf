resource "aws_iam_role" "lambda-app-role" {
  name               = "lambda-kanaru-me-app-${var.env}-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda-app-role-basic-policy" {
  role       = aws_iam_role.lambda-app-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda-app-ssm-policy" {
  name   = "lambda-kanaru-me-app-${var.env}-ssm-policy"
  role   = aws_iam_role.lambda-app-role.name
  policy = <<EOF
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"kms:Decrypt"
			],
			"Resource": [
				"arn:aws:kms:ap-northeast-1:760485329571:key/*"
			]
		},
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter"
      ],
      "Resource": [
				"arn:aws:ssm:ap-northeast-1:760485329571:parameter/kanaru.me/*"
      ]
    },
    {
      "Effect": "Allow",
			"Action": [
				"dynamodb:GetItem",
				"dynamodb:UpdateItem"
			],
			"Resource": [
				"arn:aws:dynamodb:ap-northeast-1:760485329571:table/kanaru-me-table-page-views-*"
			]
    }
	]
}
EOF
}
