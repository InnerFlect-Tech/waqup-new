import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { AboutPageContent } from './AboutPageContent';

function getChangelogMarkdown(): string {
  const paths = [
    join(process.cwd(), '..', '..', 'CHANGELOG.md'),
    join(process.cwd(), '..', 'CHANGELOG.md'),
    join(process.cwd(), 'CHANGELOG.md'),
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      try {
        return readFileSync(p, 'utf-8');
      } catch {
        // fall through
      }
    }
  }
  return '*Changelog unavailable. Check [GitHub](https://github.com/InnerFlect-Tech/waqup-new/blob/main/CHANGELOG.md) for release notes.*';
}

export default function AboutPage() {
  const changelogMarkdown = getChangelogMarkdown();
  return <AboutPageContent changelogMarkdown={changelogMarkdown} />;
}
