import assert from "node:assert/strict";
import test from "node:test";
import { cards, findCard, publishedCards, createVCard, escapeVCardText } from "../lib/cards.ts";

test("公開中の名刺だけを取得し、未知・非公開slugを除外する", () => {
  assert.equal(findCard("miyamoto")?.name, "宮本 尚寛");
  assert.equal(findCard("nobody"), undefined);
  assert.equal(findCard("toString"), undefined);
  const hidden = { ...cards[0], slug: "hidden", published: false };
  assert.equal(findCard("hidden", [hidden]), undefined);
  assert.deepEqual(publishedCards([cards[0], hidden]).map(card => card.slug), ["miyamoto"]);
});

test("vCard 3.0に日本語姓名・ふりがな・会社と連絡先を含める", () => {
  const vcard = createVCard(cards[0]);
  const unfolded = vcard.replace(/\r\n /g, "");
  for (const line of [
    "BEGIN:VCARD", "VERSION:3.0", "N:宮本;尚寛;;;", "FN:宮本 尚寛",
    "X-PHONETIC-LAST-NAME:みやもと", "X-PHONETIC-FIRST-NAME:たかひろ",
    "ORG:株式会社JQIT;AIソリューション事業 統括", "TITLE:取締役",
    "TEL;TYPE=CELL:080-4910-6040", "TEL;TYPE=WORK:03-5577-6105",
    "EMAIL:t.miyamoto@jqit.co.jp", "URL:https://www.jqit.co.jp", "END:VCARD",
  ]) assert.ok(unfolded.split("\r\n").includes(line), line);
  assert.match(unfolded, /ADR;TYPE=WORK:;;.*;101-0047;日本\r\n/);
  assert.ok(vcard.endsWith("\r\n"));
  assert.doesNotMatch(vcard.replaceAll("\r\n", ""), /[\r\n]/);
  for (const line of vcard.split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75);
});

test("全角空白の姓名分割・特殊文字・改行のエスケープとUTF-8折り返し", () => {
  assert.equal(escapeVCardText("\\,;\r\n次\r次\n次"), "\\\\\\,\\;\\n次\\n次\\n次");
  const card = { ...cards[0], name: "宮本　尚寛", title: "役員,営業;開発\\支援\n担当" };
  const vcard = createVCard(card).replace(/\r\n /g, "");
  assert.match(vcard, /N:宮本;尚寛;;;/);
  assert.ok(vcard.includes("TITLE:役員\\,営業\\;開発\\\\支援\\n担当"));
});
