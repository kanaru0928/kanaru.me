import type { Config } from "@react-router/dev/config";

const excludePaths = ["/"];

export default {
  ssr: true,
  async prerender({ getStaticPaths }) {
    const paths = getStaticPaths();
    return paths.filter((path) => !excludePaths.includes(path));
  },
} satisfies Config;
