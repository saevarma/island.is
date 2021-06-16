import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* Here we will mount our modal portal */}
          <NextScript />
        </body>
      </Html>
    )
  }
}
