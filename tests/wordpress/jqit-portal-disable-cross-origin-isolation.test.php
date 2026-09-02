<?php

declare(strict_types=1);

$filters = array();

function add_filter($tag, $callback, $priority = 10, $accepted_args = 1)
{
    global $filters;

    $filters[$tag][$priority][] = array(
        'callback'      => $callback,
        'accepted_args' => $accepted_args,
    );

    return true;
}

function apply_test_filters($tag, $value, ...$extra_args)
{
    global $filters;

    if (!isset($filters[$tag])) {
        return $value;
    }

    ksort($filters[$tag]);

    foreach ($filters[$tag] as $callbacks) {
        foreach ($callbacks as $registered) {
            $args  = array_slice(array_merge(array($value), $extra_args), 0, $registered['accepted_args']);
            $value = $registered['callback'](...$args);
        }
    }

    return $value;
}

function assert_same($expected, $actual, $message)
{
    if ($expected === $actual) {
        return;
    }

    fwrite(
        STDERR,
        $message . "\nExpected: " . var_export($expected, true) . "\nActual:   " . var_export($actual, true) . "\n"
    );
    exit(1);
}

$plugin_paths = glob(dirname(__DIR__, 2) . '/wordpress/mu-plugins/*jqit-portal-disable-cross-origin-isolation.php') ?: array();

if (1 !== count($plugin_paths)) {
    fwrite(STDERR, "クロスオリジン分離を無効化する MU プラグインが必要です\n");
    exit(1);
}

require $plugin_paths[0];

// WordPress 7.1 は HTTPS 配信時に true を渡してくる。これを false に落とすことが本体。
assert_same(
    false,
    apply_test_filters('wp_client_side_media_processing_enabled', true),
    'PORTAL-CO-ISOLATION-01: HTTPS 配信（デフォルト有効）でもクロスオリジン分離を無効化する'
);

// 他のプラグインが先に true へ上書きしても、最終的に false で確定する。
add_filter(
    'wp_client_side_media_processing_enabled',
    static function () {
        return true;
    },
    PHP_INT_MAX - 1
);

assert_same(
    false,
    apply_test_filters('wp_client_side_media_processing_enabled', false),
    'PORTAL-CO-ISOLATION-02: 他プラグインの有効化より後に評価され false で確定する'
);

echo "OK\n";
