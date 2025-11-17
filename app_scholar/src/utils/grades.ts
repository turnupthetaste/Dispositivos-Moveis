export function calcularMedia(n1: number, n2: number) {
  const safe = (n: number) => (isFinite(n) ? n : 0);
  return Number(((safe(n1) + safe(n2)) / 2).toFixed(1));
}

export function statusPorMedia(media: number): 'aprovado' | 'exame' | 'reprovado' {
  if (media >= 6) return 'aprovado';
  if (media >= 4) return 'exame';
  return 'reprovado';
}
