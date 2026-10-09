# Changelog

All notable changes to `simply-translate` are listed here.

## 1.0.0 (unreleased)

### Upgrading from 0.x

1. Replace the `defaultLang` option and property with `lang`.
2. Replace `$less: true` with `placeholder: 'single'`.
3. Import only from `simply-translate` (or `simply-translate/commonjs`); deep imports such as `simply-translate/es/...` no longer resolve.
4. Make sure CommonJS consumers run on Node 14 or newer.

### Added

-   [CLDR plural categories](README.md#cldr-plural-categories): plural rules named `zero`, `one`, `two`, `few`, `many` and `other` use `Intl.PluralRules` for the dictionary's language.

### Fixed

-   Node can load the package with both `require` and `import`. Previously `simply-translate` failed with `ERR_UNSUPPORTED_DIR_IMPORT` outside bundlers.

### Breaking

-   Removed the `defaultLang` option and property (deprecated since 0.20.0). Use `lang`.
-   Removed the `$less` option and property (deprecated since 0.20.0). Use `placeholder: 'single'`.
-   The package declares `exports`. Bundlers get the ES module build, Node gets the CommonJS build, and deep imports of internal files are no longer allowed.
-   The CommonJS build targets ES2020 (was ES2016), so it needs Node 14 or newer.

### Changed

-   Type declarations are built with TypeScript 6. They still type-check with TypeScript 3.8 and newer.

## 0.20.0

### Added

-   [Middleware pipeline](README.md#pipeline-and-middleware).
-   Remainder operator `%`, ends-with/starts-with operators `...`, and truthy/falsy operators `!!`/`!`.
-   [Cases](README.md#cases).
-   `{{...}}` placeholders (`placeholder: 'double'`).
-   CommonJS build (`simply-translate/commonjs`).

### Deprecated

-   `defaultLang` in favor of `lang`.
-   `$less` in favor of `placeholder: 'single'`.

### Breaking

-   A missing placeholder value renders as an empty string instead of the property name.
-   Removed the dynamic cache.

## 0.10.0

### Breaking

-   `$T{...}` replaced with `$&{...}`.
-   `{$}` and `$T{$}` removed from pluralization; use `$#` instead.
