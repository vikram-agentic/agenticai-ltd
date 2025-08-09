import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const resourcesDirectory = path.join(process.cwd(), 'public/resources');
const outputFilePath = path.join(process.cwd(), 'src/resources.json');

function getDirectories(source) {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function parseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descriptionMatch = content.match(/<meta name="description" content="(.*?)"/);
    const h1Match = content.match(/<h1.*?>(.*?)<\/h1>/);

    let title = titleMatch ? titleMatch[1] : '';
    if (!title && h1Match) {
        title = h1Match[1].replace(/<[^>]*>/g, '').trim();
    }
    const description = descriptionMatch ? descriptionMatch[1] : 'No description available.';
    
    return { title, description };
  } catch (error) {
    console.error(`Could not read or parse file: ${filePath}`, error);
    return { title: 'Title not found', description: 'Description not found.' };
  }
}

async function createPdf(htmlPath, pdfPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();
}

async function generateResources() {
  const resourceDirs = getDirectories(resourcesDirectory);
  const resources = [];

  for (const dir of resourceDirs) {
    const downloadHtmlPath = path.join(resourcesDirectory, dir, 'download.html');
    const pdfPath = path.join(resourcesDirectory, dir, 'download.pdf');
    const { title, description } = parseFile(downloadHtmlPath);
    
    await createPdf(downloadHtmlPath, pdfPath);

    resources.push({
      title: title,
      description: description,
      category: "Resource",
      downloadUrl: `/resources/${dir}/download.pdf`,
      type: "Guide"
    });
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(resources, null, 2));
  console.log(`Successfully generated resources.json with ${resources.length} resources and converted HTML to PDF.`);
}

generateResources();
