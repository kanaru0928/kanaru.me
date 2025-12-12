/**
 * DIトークンの定義
 */
export const DI_TOKENS = {
  ArticleRepository: Symbol.for("ArticleRepository"),
  ArticleStorage: Symbol.for("ArticleStorage"),
  SecretRepository: Symbol.for("SecretRepository"),
  GetArticleUseCase: Symbol.for("GetArticleUseCase"),
  ListArticlesUseCase: Symbol.for("ListArticlesUseCase"),
  UpsertArticleUseCase: Symbol.for("UpsertArticleUseCase"),
  DeleteArticleUseCase: Symbol.for("DeleteArticleUseCase"),
  GenerateOgImageUseCase: Symbol.for("GenerateOgImageUseCase"),
} as const;

export type DIToken = (typeof DI_TOKENS)[keyof typeof DI_TOKENS];
