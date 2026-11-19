import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * ページを読み終えた位置に置く、控えめな相談導線（1行）。
 * 大きな帯や暗い面にはしない（目立ちすぎると言われた経緯がある）。1ページに1回だけ置く。
 */
export function ConsultLine({
  text = "ご相談・お見積りは、お問い合わせフォームから承ります。",
}: {
  text?: string;
}) {
  return (
    <section className="border-t border-line bg-paper py-10 min-[720px]:py-12">
      <Container className="flex flex-col items-start gap-5 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between">
        <p className="palt text-[16px] font-bold leading-[1.8] text-ink min-[720px]:text-[18px]">
          {text}
        </p>
        <Button href="/contact" variant="outline" className="shrink-0">
          お問い合わせ
        </Button>
      </Container>
    </section>
  );
}
