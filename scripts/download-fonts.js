const https = require('https')
const fs = require('fs')
const path = require('path')

const fontsDir = path.join(process.cwd(), 'public', 'fonts')

// Ensure fonts directory exists
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true })
}

// Font files to download from Google Fonts
const fonts = [
  {
    name: 'DMSans-Regular.woff2',
    url: 'https://fonts.gstatic.com/s/dmsans/v14/rP2Hp2ywxg089UriCZOIHQ.woff2',
    weight: 400,
  },
  {
    name: 'DMSans-Medium.woff2',
    url: 'https://fonts.gstatic.com/s/dmsans/v14/rP2Cp2ywxg089UriAWCrOB8.woff2',
    weight: 500,
  },
  {
    name: 'Baloo2-Regular.woff2',
    url: 'https://fonts.gstatic.com/s/baloo2/v16/wXKrE3kTposypRydz1uW1s.woff2',
    weight: 400,
  },
  {
    name: 'Baloo2-SemiBold.woff2',
    url: 'https://fonts.gstatic.com/s/baloo2/v16/wXKpE3kTposypRyd76v_FeJ.woff2',
    weight: 600,
  },
  {
    name: 'Baloo2-Bold.woff2',
    url: 'https://fonts.gstatic.com/s/baloo2/v16/wXKpE3kTposypRyd76v_FeJ.woff2',
    weight: 700,
  },
]

function downloadFont(font) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(fontsDir, font.name)
    const file = fs.createWriteStream(filePath)

    https.get(font.url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✓ Downloaded ${font.name}`)
          resolve()
        })
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file)
          file.on('finish', () => {
            file.close()
            console.log(`✓ Downloaded ${font.name}`)
            resolve()
          })
        }).on('error', reject)
      } else {
        reject(new Error(`Failed to download ${font.name}: ${response.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}) // Delete file on error
      reject(err)
    })
  })
}

async function downloadAllFonts() {
  console.log('Downloading fonts from Google Fonts...\n')
  
  try {
    for (const font of fonts) {
      await downloadFont(font)
    }
    console.log('\n✓ All fonts downloaded successfully!')
  } catch (error) {
    console.error('\n✗ Error downloading fonts:', error.message)
    console.log('\nAlternative: Download fonts manually from:')
    console.log('1. https://fonts.google.com/specimen/DM+Sans')
    console.log('2. https://fonts.google.com/specimen/Baloo+2')
    console.log('3. Extract WOFF2 files to public/fonts/')
    process.exit(1)
  }
}

downloadAllFonts()
