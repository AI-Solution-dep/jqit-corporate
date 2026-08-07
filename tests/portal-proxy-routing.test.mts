import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const nextConfigSource = readFileSync("next.config.ts", "utf8");

const staticAdminRoutes = ["css", "images", "js"] as const;

for (const directory of staticAdminRoutes) {
  test(`PORTAL-PROXY-${directory}: wp-admin/${directory} はPHPラッパーを通さず配信する`, () => {
    const source = `source: "/portal/wp-admin/${directory}/:path*"`;
    const destination =
      `destination: "https://portal.jqit.co.jp/wp-admin/${directory}/:path*"`;
    const staticRouteIndex = nextConfigSource.indexOf(source);
    const phpWrapperIndex = nextConfigSource.indexOf(
      'source: "/portal/wp-admin/:jqit_admin_path*"',
    );

    assert.notEqual(staticRouteIndex, -1, `${source} が必要です`);
    assert.match(nextConfigSource, new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.ok(
      staticRouteIndex < phpWrapperIndex,
      `${directory} の直結ルートはPHPラッパーより前に定義する必要があります`,
    );
  });
}

test("PORTAL-PROXY-PHP: wp-adminのPHPリクエストは既存ラッパーに残す", () => {
  assert.match(
    nextConfigSource,
    /source: "\/portal\/wp-admin\/:jqit_admin_path\*"[\s\S]*?jqit-portal-admin-proxy\.php\?jqit_admin_path=:jqit_admin_path\*/,
  );
});

test("PORTAL-PROXY-FALLBACK: portal全体のフォールバックは最後に残す", () => {
  const adminWrapperIndex = nextConfigSource.indexOf(
    'source: "/portal/wp-admin/:jqit_admin_path*"',
  );
  const portalFallbackIndex = nextConfigSource.indexOf(
    'source: "/portal/:path*"',
  );

  assert.ok(adminWrapperIndex !== -1);
  assert.ok(portalFallbackIndex > adminWrapperIndex);
  assert.match(
    nextConfigSource,
    /source: "\/portal\/:path\*"[\s\S]*?destination: "https:\/\/portal\.jqit\.co\.jp\/:path\*"/,
  );
});
