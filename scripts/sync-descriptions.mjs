import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const PROJECTS_FILE = path.join(ROOT_DIR, 'src/data/projects.ts');

// 프로젝트 ID와 외부 DESCRIPTION.md 경로 매핑
const projectPaths = {
  'threads-autoposter': 'D:/development/threads-autoposter/DESCRIPTION.md',
  'agent-diary': 'D:/development/agent-diary/DESCRIPTION.md',
  'minions-bid': 'D:/development/league-auction/DESCRIPTION.md',
  'investment-platform': 'D:/development/investment-platform/DESCRIPTION.md',
  'persona-style': 'D:/development/persona-style/DESCRIPTION.md',
  'sumpyo-flutter-app': 'D:/development/sumpyo-flutter-app/DESCRIPTION.md',
  'quote-builder': 'D:/development/quote-builder/DESCRIPTION.md',
  'Synapso.dev': 'D:/development/auto-blog/DESCRIPTION.md',
  'cafe-book': 'D:/development/cafe-book/DESCRIPTION.md',
};

async function syncDescriptions() {
  console.log('🔄 프로젝트 상세 설명 동기화 시작...');

  try {
    let projectsContent = fs.readFileSync(PROJECTS_FILE, 'utf8');

    for (const [id, filePath] of Object.entries(projectPaths)) {
      if (fs.existsSync(filePath)) {
        let description = fs.readFileSync(filePath, 'utf8');
        
        // 중요: 마크다운 내의 백틱(`) 문자가 템플릿 리터럴을 깨뜨리지 않도록 이스케이프(\`) 처리합니다.
        description = description.replace(/`/g, '\\`');
        
        const escapedId = id.replace('.', '\\.');
        const regex = new RegExp(`(id:\\s*"${escapedId}",[\\s\\S]*?description:\\s*\`)([\\s\\S]*?)(\`,)`, 'g');
        
        if (regex.test(projectsContent)) {
          projectsContent = projectsContent.replace(regex, `$1${description}$3`);
          console.log(`✅ [${id}] 동기화 완료`);
        } else {
          console.warn(`⚠️ [${id}] projects.ts에서 찾을 수 없습니다.`);
        }
      } else {
        console.log(`ℹ️ [${id}] 경로를 찾을 수 없어 동기화를 건너뜁니다. (로컬 환경이 아닐 수 있음)`);
      }
    }

    fs.writeFileSync(PROJECTS_FILE, projectsContent, 'utf8');
    console.log('✨ 모든 동기화 작업이 완료되었습니다.');
  } catch (error) {
    console.error('💥 동기화 중 오류 발생:', error);
    process.exit(1);
  }
}

syncDescriptions();
