/**
 * DIトークンの定義
 */
export const DI_TOKENS = {
  ArticleRepository: Symbol.for("ArticleRepository"),
  ArticleStorage: Symbol.for("ArticleStorage"),
  SecretRepository: Symbol.for("SecretRepository"),
  CreateArticleUseCase: Symbol.for("CreateArticleUseCase"),
  GetArticleUseCase: Symbol.for("GetArticleUseCase"),
  ListArticlesUseCase: Symbol.for("ListArticlesUseCase"),
  UpdateArticleMetadataUseCase: Symbol.for("UpdateArticleMetadataUseCase"),
  UpdateArticleContentUseCase: Symbol.for("UpdateArticleContentUseCase"),
  DeleteArticleUseCase: Symbol.for("DeleteArticleUseCase"),
} as const;

export type DIToken = (typeof DI_TOKENS)[keyof typeof DI_TOKENS];
