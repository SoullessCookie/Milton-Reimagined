# LibreTranslate (NPM)

[Original API](https://libretranslate.com/)

Simple API wrapper for LibreTranslate, an open-source alternative to Google Translate, also supports self-hosted versions

## Installation

**Node.js v17.5.0 or newer with fetch is required.**

```bash
# NPM
npm install libretranslate

# Yarn
yarn add libretranslate
```

## Usage

```js
// CommonJS
const { translate } = require('libretranslate');

// ES Modules (ESM) or Typescript
import { translate } from 'libretranslate';
```

Using `translate()` function.

```js
await translate({
  query: 'text', // Text to be translated.
  source: 'lang', // The original language. (auto by default)
  target: 'lang', // The language to translate.
  format: 'text', // The format of the translated text (HTML or Text) Optional
  apiurl: 'URL', // Custom API url, if self-hosted
  apikey: 'key', // API Key
});
```
