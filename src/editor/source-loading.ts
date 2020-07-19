import { useState, useRef } from 'react'
import { Asset } from 'expo-asset'

function useAssetSource(required: any) {
  const [htmlSource, setHtmlSource] = useState('')
  const getMarkdown = async () => {
    let file = Asset.fromModule(required)
    await file.downloadAsync()
    return Promise.resolve(await (await fetch(file.uri)).text())
  }
  if (htmlSource.length == 0) {
    getMarkdown().then((data: string) => setHtmlSource(data))
  }
  return htmlSource
}

export function useEditorSource(initialShaderCode: string) {
  const shaderCode = useRef(initialShaderCode).current
  const indexHtml = useAssetSource(require('../../assets/html/index.html'))
  const codemirrorCss = useAssetSource(
    require('../../assets/html/codemirror.css.html')
  )
  const styleCss = useAssetSource(require('../../assets/html/style.css.html'))
  const codemirrorJS = useAssetSource(
    require('../../assets/html/codemirror.js.html')
  )
  const mainJs = useAssetSource(require('../../assets/html/main.js.html'))
  const modeJs = useAssetSource(require('../../assets/html/mode.js.html'))

  for (let x of [
    indexHtml,
    codemirrorCss,
    styleCss,
    codemirrorJS,
    mainJs,
    modeJs,
  ]) {
    if (x == '') {
      return ''
    }
  }

  const src = `
  ${indexHtml}
  ${codemirrorCss}
  ${styleCss}
  ${codemirrorJS}
  ${modeJs}
  ${mainJs}
  
  `.replace('$$SHADERCODE$$', shaderCode)

  return src
}
