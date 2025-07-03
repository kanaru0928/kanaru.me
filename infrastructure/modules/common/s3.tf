resource "aws_s3_bucket" "static-site-bucket" {
  bucket = "760485329571-kanaru-me-static-site-${var.env}"

  tags = {
    Environment = var.env
  }
}

resource "aws_s3_bucket_policy" "static-site-bucket-policy" {
  bucket = aws_s3_bucket.static-site-bucket.id
  policy = <<EOF
{
  "Version": "2008-10-17",
  "Id": "PolicyForCloudFrontPrivateContent",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "${aws_s3_bucket.static-site-bucket.arn}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "${aws_cloudfront_distribution.app-distribution.arn}"
        }
      }
    }
  ]
}
EOF
  
}
