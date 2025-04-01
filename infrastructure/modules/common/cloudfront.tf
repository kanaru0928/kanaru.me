resource "aws_cloudfront_distribution" "app-distribution" {
  aliases     = var.env == "prod" ? ["www.kanaru.me"] : []
  enabled     = true
  comment     = "kanaru.me app distribution"
  price_class = "PriceClass_200"

  origin {
    domain_name              = replace(replace(aws_lambda_function_url.lambda-app-url.function_url, "https://", ""), "/", "")
    origin_id                = aws_lambda_function.lambda-app.id
    origin_access_control_id = aws_cloudfront_origin_access_control.app-distribution-oac.id
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods          = ["GET", "HEAD", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = aws_lambda_function.lambda-app.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.app-distribution-origin-request-policy.id
    cache_policy_id          = aws_cloudfront_cache_policy.app-distribution-cache-policy.id
    viewer_protocol_policy   = "redirect-to-https"
    compress                 = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.env == "prod" ? false : true
    acm_certificate_arn            = data.aws_acm_certificate.app-distribution-acm.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

data "aws_acm_certificate" "app-distribution-acm" {
  domain   = "kanaru.me"
  provider = aws.virginia
}

resource "aws_cloudfront_origin_access_control" "app-distribution-oac" {
  name                              = "kanaru-me-app-distribution-oac-${var.env}"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
  origin_access_control_origin_type = "lambda"
}

resource "aws_cloudfront_cache_policy" "app-distribution-cache-policy" {
  name    = "cacheing-policy-kanaru-me-app-${var.env}"
  comment = "Cache policy for kanaru.me app distribution"
  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    enable_accept_encoding_gzip = true
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
  default_ttl = 10
  max_ttl     = 60
  min_ttl     = 0
}

data "aws_cloudfront_origin_request_policy" "app-distribution-origin-request-policy" {
  name = "Managed-AllViewerExceptHostHeader"
}
