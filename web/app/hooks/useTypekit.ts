import { useEffect } from "react";

interface TypekitConfig {
  kitId: string;
  scriptTimeout: number;
  async: boolean;
}

declare global {
  interface Window {
    Typekit?: {
      load: (config: TypekitConfig) => void;
    };
  }
}

/**
 * Adobe Typekit (Adobe Fonts) を読み込むカスタムフック
 *
 * - フォント読み込み中は `wf-loading` クラスが <html> に付与される
 * - タイムアウト時は `wf-inactive` クラスに変更される
 * - 読み込み成功時は自動的に Typekit.load() が実行される
 */
export function useTypekit(kitId = "kwj0diz") {
  useEffect(() => {
    console.log("useTypekit called with kitId:", kitId);

    const config: TypekitConfig = {
      kitId,
      scriptTimeout: 3000,
      async: true,
    };

    const htmlElement = document.documentElement;
    let isLoaded = false;

    // タイムアウト設定: フォント読み込みが時間内に完了しない場合
    const timeoutId = setTimeout(() => {
      htmlElement.className = `${htmlElement.className.replace(/\bwf-loading\b/g, "")} wf-inactive`;
    }, config.scriptTimeout);

    // スクリプト要素を作成
    const scriptElement = document.createElement("script");
    const firstScript = document.getElementsByTagName("script")[0];

    if (!firstScript || !firstScript.parentNode) {
      clearTimeout(timeoutId);
      return;
    }

    // フォント読み込み中クラスを追加
    htmlElement.className += " wf-loading";

    // Typekit スクリプトを設定
    scriptElement.src = `https://use.typekit.net/${config.kitId}.js`;
    scriptElement.async = true;

    // スクリプト読み込み完了時の処理
    scriptElement.onload = () => {
      if (isLoaded) return;

      isLoaded = true;
      clearTimeout(timeoutId);

      // Typekit を初期化
      try {
        window.Typekit?.load(config);
      } catch (error) {
        console.error("Typekit loading failed:", error);
      }
    };

    // DOMに挿入
    firstScript.parentNode.insertBefore(scriptElement, firstScript);

    // クリーンアップ関数
    return () => {
      clearTimeout(timeoutId);
    };
  }, [kitId]);
}
