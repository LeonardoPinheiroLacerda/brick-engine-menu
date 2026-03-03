import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { createRequire } from "module";
import fs from "fs";
import dotenv from "dotenv";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env = {}, argv) => {
  const isProduction = argv.mode === "production";
  const bundleMode = env.bundle || "bundle"; // 'standalone' or 'bundle'

  // Load .env files, .env.local takes precedence.
  const envFileLocal = path.resolve(__dirname, ".env.local");
  const envFile = path.resolve(__dirname, ".env");

  let envConfig = {};
  if (fs.existsSync(envFile)) {
    Object.assign(envConfig, dotenv.config({ path: envFile }).parsed || {});
  }
  if (fs.existsSync(envFileLocal)) {
    Object.assign(
      envConfig,
      dotenv.config({ path: envFileLocal }).parsed || {},
    );
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || envConfig.SUPABASE_URL || "";
  const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY || envConfig.SUPABASE_ANON_KEY || "";

  // Dynamically find the engine root using require.resolve
  const engineRoot = path.dirname(
    require.resolve("brick-engine-js/package.json"),
  );

  const config = {
    mode: isProduction ? "production" : "development",
    entry: {
      app: path.resolve(__dirname, "src/bootstrap.ts"),
    },
    output: {
      filename: "game.bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      // Target older environments to ensure maximum compatibility in Android WebViews
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        forOf: false,
        module: false,
      },
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 5,
            keep_classnames: true,
            keep_fnames: true,
            mangle: false, // Prevent vconsole/Svelte from crashing Android WebViews
          },
        }),
      ],
    },
    devtool: isProduction ? false : "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules\/(?!brick-engine-js)/,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      symlinks: true,
      alias: {
        "brick-engine-js": path.resolve(engineRoot, "dist/game.bundle.js"),
      },
    },
    externals: {
      p5: "p5",
      "brick-engine-js": "BrickEngine",
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.APP_MODE": JSON.stringify("client"),
        "process.env.SUPABASE_URL": JSON.stringify(SUPABASE_URL),
        "process.env.SUPABASE_ANON_KEY": JSON.stringify(SUPABASE_ANON_KEY),
      }),
      new MiniCssExtractPlugin({
        filename: "style.css",
      }),
    ],
    devServer: {
      static: path.resolve(__dirname, "dist"),
      port: 8080,
      open: true,
      hot: true,
    },
  };

  if (bundleMode === "standalone") {
    // Only inline the BrickEngine menu logic.
    // p5 remains external because index.html loads it globally before our bundle executes.
    delete config.externals["brick-engine-js"];

    config.plugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(engineRoot, "dist/index.html"),
        favicon: path.resolve(engineRoot, "dist/favicon.ico"),
        inject: false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(engineRoot, "dist/vendor/p5.min.js"),
            to: "vendor/p5.min.js",
          },
          { from: path.resolve(engineRoot, "dist/css"), to: "css" },
          { from: path.resolve(engineRoot, "dist/images"), to: "images" },
          { from: path.resolve(engineRoot, "dist/sounds"), to: "sounds" },
          { from: path.resolve(engineRoot, "dist/fonts"), to: "fonts" },
          { from: path.resolve(engineRoot, "dist/docs"), to: "docs" },
          {
            from: path.resolve(__dirname, "public/manifest.json"),
            to: "manifest.json",
            toType: "file",
          },
          {
            from: path.resolve(__dirname, "public/192xicon.png"),
            to: "192xicon.png",
            toType: "file",
          },
          {
            from: path.resolve(__dirname, "public/512xicon.png"),
            to: "512xicon.png",
            toType: "file",
          },
        ],
      }),
    );
  }

  return config;
};
