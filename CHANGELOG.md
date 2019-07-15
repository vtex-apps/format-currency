# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- `customCurrencyCode` option. The symbol is rendered correctly based on the locale, so if the sales policy locale is `es-CO`, Intl will render `$` instead of `COP`.

### Added

- Initial release