import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Kicker } from "@/components/ui/Kicker";

export function PartnerSection() {
  return (
    <section id="partner" className="border-b border-line bg-cream py-16 min-[720px]:py-[72px]">
      <Container>
        <FadeIn>
          <div>
            <Kicker className="mb-4">Partner</Kicker>
            <h2 className="palt text-[24px] font-bold leading-[1.45] tracking-[-0.02em] text-ink min-[720px]:text-[30px]">
              共に未来をつくる、<span className="text-brand">パートナー</span>
              を募集しています。
            </h2>
            <p className="mt-4 max-w-[560px] text-sm leading-[1.95] text-body">
              SES・受託開発・品質保証の領域で、技術力を高め合える企業様との協業を歓迎します。
            </p>
            <div className="mt-7">
              <Button href="/contact">協業について相談する</Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
