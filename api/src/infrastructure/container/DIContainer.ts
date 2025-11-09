import type { DIToken } from "./types";

type Factory<T> = () => T;

/**
 * シンプルなDIコンテナ実装
 */
export class DIContainer {
  private factories = new Map<DIToken, Factory<unknown>>();
  private singletons = new Map<DIToken, unknown>();

  /**
   * シングルトンインスタンスを登録
   */
  registerSingleton<T>(token: DIToken, factory: Factory<T>): void {
    this.factories.set(token, factory);
  }

  /**
   * トランジェントインスタンスを登録（毎回新規作成）
   */
  registerTransient<T>(token: DIToken, factory: Factory<T>): void {
    this.factories.set(token, factory);
  }

  /**
   * インスタンスを取得
   */
  resolve<T>(token: DIToken): T {
    // シングルトンキャッシュから取得
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }

    // ファクトリから生成
    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`No factory registered for token: ${String(token)}`);
    }

    const instance = factory();

    // シングルトンとしてキャッシュ
    this.singletons.set(token, instance);

    return instance as T;
  }

  /**
   * 全てのシングルトンキャッシュをクリア
   */
  clear(): void {
    this.singletons.clear();
  }
}
