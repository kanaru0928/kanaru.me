import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { CreateArticleUseCase } from "./application/usecases/CreateArticleUseCase";
import { DeleteArticleUseCase } from "./application/usecases/DeleteArticleUseCase";
import { GetArticleUseCase } from "./application/usecases/GetArticleUseCase";
import { ListArticlesUseCase } from "./application/usecases/ListArticlesUseCase";
import { UpdateArticleContentUseCase } from "./application/usecases/UpdateArticleContentUseCase";
import { UpdateArticleMetadataUseCase } from "./application/usecases/UpdateArticleMetadataUseCase";
import { DynamoDBArticleRepository } from "./infrastructure/repositories/DynamoDBArticleRepository";
import { S3ArticleStorage } from "./infrastructure/storage/S3ArticleStorage";
import { createArticleRouter } from "./interface/routes/articles";

// 環境変数から設定を取得
const DYNAMODB_TABLE_NAME =
  process.env.DYNAMODB_TABLE_NAME || "kanaru-me-articles";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "kanaru-me-articles";
const AWS_REGION = process.env.AWS_REGION || "ap-northeast-1";

// Infrastructure層のインスタンス作成
const articleRepository = new DynamoDBArticleRepository(
  DYNAMODB_TABLE_NAME,
  AWS_REGION,
);
const articleStorage = new S3ArticleStorage(S3_BUCKET_NAME, AWS_REGION);

// Application層のインスタンス作成（DI）
const createArticleUseCase = new CreateArticleUseCase(
  articleRepository,
  articleStorage,
);
const getArticleUseCase = new GetArticleUseCase(
  articleRepository,
  articleStorage,
);
const listArticlesUseCase = new ListArticlesUseCase(articleRepository);
const updateArticleMetadataUseCase = new UpdateArticleMetadataUseCase(
  articleRepository,
);
const updateArticleContentUseCase = new UpdateArticleContentUseCase(
  articleRepository,
  articleStorage,
);
const deleteArticleUseCase = new DeleteArticleUseCase(
  articleRepository,
  articleStorage,
);

// ルーター作成
const articlesRouter = createArticleRouter({
  createArticleUseCase,
  getArticleUseCase,
  listArticlesUseCase,
  updateArticleMetadataUseCase,
  updateArticleContentUseCase,
  deleteArticleUseCase,
});

// Honoアプリケーション設定
const app = new OpenAPIHono();

app.get("/api", (c) => {
	return c.json({ message: "Article API" });
});

// 記事管理ルートをマウント
app.route("/", articlesRouter);

// OpenAPIドキュメント生成
app.doc("/api/openapi.json", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Article Management API",
		description: "記事管理のためのREST API",
	},
	tags: [
		{
			name: "Articles",
			description: "記事の作成、取得、更新、削除",
		},
	],
});

// Swagger UIエンドポイント
app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

export { app };
