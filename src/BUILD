package(default_visibility=["//visibility:public"])

load("@npm_bazel_typescript//:defs.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl", "npm_package")


ts_library(
    name = "src",
    srcs = glob(
        [
            "**/*.ts",
        ],
        exclude = [
            "**/*_spec.ts",
            "**/files/**/*",
        ],
    ),
    tsconfig = ":tsconfig-build.json",
    module_name = "schematics-utils",
    deps = [
        "@npm//@types/jasmine",
        "@npm//@types/node",        
        "@npm//@angular-devkit/core",
        "@npm//@angular-devkit/schematics",
        "@npm//@schematics/angular",
        "@npm//typescript",
    ],
)

npm_package(
    name = "npm_package",
    srcs = [
        "package.json",
        "collection.json",
    ] + glob([
        "**/*.template",
        "**/schema.json",
    ]),
    deps = [
        ":src"
    ],
)