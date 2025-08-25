const fs = require('fs')
const path = require('path')
const JavaScriptObfuscator = require('javascript-obfuscator')

const distDir = path.resolve(__dirname, '..', 'dist')

function walk(dir, cb) {
  const items = fs.readdirSync(dir, { withFileTypes: true })
  items.forEach(item => {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) walk(full, cb)
    else cb(full)
  })
}

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run `vite build` first.')
  process.exit(1)
}

console.log('Starting JS obfuscation in', distDir)

walk(distDir, (file) => {
  if (!file.endsWith('.js')) return
  try {
    const code = fs.readFileSync(file, 'utf8')
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'mangled',
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      stringArray: true,
      stringArrayEncoding: ['rc4'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayThreshold: 0.75,
    }).getObfuscatedCode()
    fs.writeFileSync(file, obfuscated, 'utf8')
    console.log('Obfuscated', path.relative(distDir, file))
  } catch (e) {
    console.error('Failed to obfuscate', file, e.message)
  }
})

console.log('Obfuscation complete')
