import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    additionalData: `@import "src/scss/variables.scss"; @import "src/scss/mixins.scss";`,
  },
};

export default nextConfig;
