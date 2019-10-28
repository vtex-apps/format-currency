# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2019-10-28
### Chore
- Enable lazy evaluation of format-currency entrypoints.

## [0.1.1] - 2019-07-16

### Fixed

- Use `currency` instead of not existing property `currencyCode` from runtime.

## [0.1.0] - 2019-07-15

### Removed

- `customCurrencyCode` option. The symbol is rendered correctly based on the locale, so if the sales policy locale is `es-CO`, Intl will render `$` instead of `COP`.

### Added

- Initial release
