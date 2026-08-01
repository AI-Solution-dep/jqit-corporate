import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContactDraft,
  clearContactDraft,
  parseContactDraft,
} from "../lib/contact-draft.ts";

test("F11-06: buildContactDraft は privacy と website を保存対象外にする", () => {
  assert.deepEqual(
    buildContactDraft([
      ["name", "山田 太郎"],
      ["message", "相談内容"],
      ["privacy", "on"],
      ["website", "https://bot.example"],
    ]),
    { name: "山田 太郎", message: "相談内容" },
  );
});

test("F11-07: parseContactDraft は不正値と秘密フィールドを復元しない", () => {
  assert.deepEqual(parseContactDraft("not-json"), {});
  assert.deepEqual(
    parseContactDraft(
      '{"name":"山田 太郎","privacy":"on","website":"bot","count":1}',
    ),
    { name: "山田 太郎" },
  );
});

test("F11-08: clearContactDraft はセッション下書きを削除する", () => {
  const removedKeys: string[] = [];
  clearContactDraft({
    removeItem(key: string) {
      removedKeys.push(key);
    },
  });

  assert.deepEqual(removedKeys, ["jqit:contact-draft:v1"]);
});
