/**
 * 将简历 Markdown 解析为结构化数据
 * 
 * 结构: { header: { name, contacts }, sections: [{ title, content }] }
 */
export function parseResumeMd(markdown) {
  const lines = markdown.split('\n');
  const result = {
    header: { name: '', contacts: '' },
    sections: [],
  };

  let currentSection = null;
  let buffer = [];

  const flushBuffer = () => {
    if (currentSection && buffer.length > 0) {
      currentSection.content = buffer.join('\n').trim();
      buffer = [];
    }
  };

  for (const line of lines) {
    // H1 → 姓名
    if (/^# /.test(line)) {
      result.header.name = line.replace(/^# /, '').trim();
      continue;
    }

    // 分隔线
    if (/^---\s*$/.test(line)) {
      continue;
    }

    // H2 → 新分区
    if (/^## /.test(line)) {
      flushBuffer();
      currentSection = {
        title: line.replace(/^## /, '').trim(),
        content: '',
      };
      result.sections.push(currentSection);
      continue;
    }

    // 联系方式行（在 header 区域，第一个 section 之前）
    if (!currentSection && line.trim() && !result.header.contacts) {
      result.header.contacts = line.trim();
      continue;
    }

    // 普通内容
    buffer.push(line);
  }

  flushBuffer();
  return result;
}
