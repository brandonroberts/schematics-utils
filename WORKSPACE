workspace(name = "schematics_utils")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Fetch rules_nodejs
# (you can check https://github.com/bazelbuild/rules_nodejs for a newer release than this)
http_archive(
    name = "build_bazel_rules_nodejs",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.18.5/rules_nodejs-0.18.5.tar.gz"],
    sha256 = "c8cd6a77433f7d3bb1f4ac87f15822aa102989f8e9eb1907ca0cad718573985b",
)

# Setup the NodeJS toolchain
load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories", "yarn_install")
node_repositories()

# This local_repository rule is needed to prevent `bazel build ...` from
# drilling down into the @rxjs workspace BUILD files in node_modules/rxjs/src.
# In the future this will no longer be needed.
local_repository(
    name = "ignore_node_modules_rxjs",
    path = "node_modules/rxjs/src",
)

# Setup Bazel managed npm dependencies with the `yarn_install` rule.
# The name of this rule should be set to `npm` so that `ts_library`
# can find your npm dependencies by default in the `@npm` workspace. You may
# also use the `npm_install` rule with a `package-lock.json` file if you prefer.
# See https://github.com/bazelbuild/rules_nodejs#dependencies for more info.
yarn_install(
  name = "npm",
  package_json = "//:package.json",
  yarn_lock = "//:yarn.lock",
)

# Install all Bazel dependencies needed for npm packages that supply Bazel rules
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")
install_bazel_dependencies()

# Setup TypeScript toolchain
load("@npm_bazel_typescript//:defs.bzl", "ts_setup_workspace")
ts_setup_workspace()