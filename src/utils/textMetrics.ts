/**
 * 한국 채용 서류 기준 글자 수 및 바이트 계산 유틸리티
 */

export interface TextMetrics {
  charWithSpaces: number;      // 공백 포함 글자 수
  charWithoutSpaces: number;   // 공백 제외 글자 수
  bytesEucKr: number;          // EUC-KR 바이트 (한글 2byte, 영문/공백/기호 1byte) - 대다수 대기업 채용사이트 기준
  bytesUtf8: number;           // UTF-8 바이트 (한글 3byte, 영문 1byte)
  linesCount: number;          // 줄 수
  wordsCount: number;          // 단어 수
}

export function calculateTextMetrics(text: string): TextMetrics {
  if (!text) {
    return {
      charWithSpaces: 0,
      charWithoutSpaces: 0,
      bytesEucKr: 0,
      bytesUtf8: 0,
      linesCount: 0,
      wordsCount: 0
    };
  }

  const charWithSpaces = text.length;
  const charWithoutSpaces = text.replace(/\s/g, '').length;

  // EUC-KR 바이트 계산 (한글, 한자 등 전각 문자는 2바이트, ASCII는 1바이트)
  let bytesEucKr = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode > 127) {
      bytesEucKr += 2;
    } else {
      bytesEucKr += 1;
    }
  }

  // UTF-8 바이트 계산
  const bytesUtf8 = new TextEncoder().encode(text).length;

  // 줄 수
  const linesCount = text.split(/\r\n|\r|\n/).length;

  // 단어 수
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordsCount = words.length;

  return {
    charWithSpaces,
    charWithoutSpaces,
    bytesEucKr,
    bytesUtf8,
    linesCount,
    wordsCount
  };
}
