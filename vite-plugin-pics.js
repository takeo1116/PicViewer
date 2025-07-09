import fs from 'fs';
import path from 'path';

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

function scanPicsDirectory() {
  const picsDir = path.join(process.cwd(), 'public', 'pics');
  
  if (!fs.existsSync(picsDir)) {
    console.warn('public/pics directory not found');
    return [];
  }
  
  const files = fs.readdirSync(picsDir);
  const imageFiles = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map(file => {
      const filePath = path.join(picsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size
      };
    });
  
  console.log(`Found ${imageFiles.length} image files in public/pics:`, imageFiles);
  return imageFiles;
}

function generateImageListFile() {
  const imageFiles = scanPicsDirectory();
  const publicDir = path.join(process.cwd(), 'public');
  
  // publicディレクトリが存在しない場合は作成
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // API形式でも保存（本番環境用）
  const apiOutputPath = path.join(publicDir, 'api', 'scan-pics.json');
  const apiDir = path.dirname(apiOutputPath);
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  fs.writeFileSync(apiOutputPath, JSON.stringify({
    success: true,
    files: imageFiles
  }, null, 2));
  
  
  console.log('Generated API files with', imageFiles.length, 'files');
}

export default function picsPlugin() {
  return {
    name: 'pics-plugin',
    configureServer(server) {
      // 開発サーバー用のディレクトリスキャンAPIエンドポイント
      server.middlewares.use('/api/scan-pics', (req, res) => {
        const imageFiles = scanPicsDirectory();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({
          success: true,
          files: imageFiles
        }));
      });

      // メタデータ保存API
      server.middlewares.use('/api/save-metadata', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const metadataPath = path.join(process.cwd(), 'public', 'pics', '.picviewer-metadata.json');
              fs.writeFileSync(metadataPath, JSON.stringify(data, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method not allowed');
        }
      });

    },
    resolveId(id) {
      if (id === 'virtual:pics-list') {
        return id;
      }
    },
    load(id) {
      if (id === 'virtual:pics-list') {
        const imageFiles = scanPicsDirectory();
        return `export default ${JSON.stringify(imageFiles)};`;
      }
    },
    buildStart() {
      // ビルド開始時にpublic/picsディレクトリを監視
      const picsDir = path.join(process.cwd(), 'public', 'pics');
      if (fs.existsSync(picsDir)) {
        this.addWatchFile(picsDir);
      }
      
      // 画像リストファイルを生成
      generateImageListFile();
    },
    configResolved(config) {
      // 開発時にも画像リストファイルを生成
      if (config.command === 'serve') {
        generateImageListFile();
      }
    }
  };
}