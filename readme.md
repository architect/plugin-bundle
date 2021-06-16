# @architect/plugin-bundle

Automatically bundle `@views` into `/public/bundles`.

```bash
npm install @architect/plugin-bundle
```

## Usage

Add to `app.arc`:

```arc
# app.arc
@app
myapp

@http
get /

@static
ignore bundles

@plugins
architect/plugin-bundle
```

Add a script tag to your HTML:

```html
<script src=/_entry/path/to/file.js type=module></script>
```

The following will happen:

- We look for the requested origin file in `@views` (in this example case `src/views/path/to/file.js`)
  - If it has already been bundled and if so return that path
  - Otherwise it will bundle it with all its deps and write to s3
- Browser is redirected to the bundled file

If you want to avoid the redirect you can call entry at runtime in your Lambda function code. Cache the bundled result outside the function handler for the best performance:

```javascript
let entry = require('@architect/plugin-bundle')
let cache = false

exports.handler = async function http (req) {

  // get the path to bundled file
  if (cache === false)
    cache = await entry('/path/to/file.js')

  // dynamic render html
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=utf8' 
    },
    body: `
      <strong>my cool html here</strong>
      <script type=module src=${cache}></script>
    `
  }
}
```
