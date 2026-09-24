/**
 * 문서 내보내기 (Markdown, Plain Text, Word .doc, Print/PDF) 유틸리티
 */

export interface ExportData {
  company: string;
  role: string;
  question: string;
  charLimit: number;
  draftText: string;
  charCount: number;
}

export function exportAsMarkdown(data: ExportData): void {
  const content = `# [${data.company}] ${data.role} 지원서

- **문항**: ${data.question}
- **글자 수**: ${data.charCount} / ${data.charLimit}자
- **작성 일시**: ${new Date().toLocaleDateString('ko-KR')}

---

## 자기소개서 본문

${data.draftText}

---
*Created with FitCoach - AI 자기소개서 코칭 솔루션*
`;

  downloadBlob(content, `${data.company}_${data.role}_자기소개서.md`, 'text/markdown;charset=utf-8');
}

export function exportAsWordDoc(data: ExportData): void {
  // Microsoft Word에서 바로 열 수 있는 규격화된 HTML 기반 doc
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.company} ${data.role} 자기소개서</title>
  <style>
    body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; line-height: 1.7; padding: 40px; color: #1e293b; }
    h1 { font-size: 20pt; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 16px; }
    .meta-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 10pt; }
    .content-box { font-size: 11pt; line-height: 1.8; white-space: pre-wrap; }
    .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 9pt; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <h1>${data.company} - ${data.role}</h1>
  <div class="meta-box">
    <p><strong>[문항]</strong> ${data.question}</p>
    <p><strong>[글자 수]</strong> ${data.charCount}자 / ${data.charLimit}자</p>
    <p><strong>[작성일]</strong> ${new Date().toLocaleDateString('ko-KR')}</p>
  </div>
  <div class="content-box">
${data.draftText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </div>
  <div class="footer">
    본 자기소개서는 FitCoach의 본인 경험 중심 AI 코칭을 거쳐 작성되었습니다.
  </div>
</body>
</html>
`;

  downloadBlob(htmlContent, `${data.company}_${data.role}_자기소개서.doc`, 'application/msword;charset=utf-8');
}

export function printOrSavePdf(): void {
  window.print();
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
