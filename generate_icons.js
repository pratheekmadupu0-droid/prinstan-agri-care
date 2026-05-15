import { Jimp } from 'jimp';
import pngToIco from 'png-to-ico';
import fs from 'fs';

async function processImages() {
  try {
    const image = await Jimp.read('public/logo.png');
    
    // Create 192x192
    const img192 = image.clone().resize({ w: 192, h: 192 });
    await img192.write('public/logo192.png');
    
    // Create 512x512
    const img512 = image.clone().resize({ w: 512, h: 512 });
    await img512.write('public/logo512.png');
    
    // Create 48x48 for ico
    const img48 = image.clone().resize({ w: 48, h: 48 });
    await img48.write('public/favicon-48.png');
    
    const buf = await pngToIco('public/favicon-48.png');
    fs.writeFileSync('public/favicon.ico', buf);
    
    fs.unlinkSync('public/favicon-48.png');
    console.log('Images generated successfully');
  } catch (error) {
    console.error('Error generating images:', error);
  }
}

processImages();
