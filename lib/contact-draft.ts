export type ContactDraft = Record<string, string>;

const STORAGE_KEY = "jqit:contact-draft:v1";
const EXCLUDED_FIELDS = new Set(["privacy", "website"]);

export function buildContactDraft(
  entries: Iterable<readonly [string, unknown]>,
): ContactDraft {
  const draft: ContactDraft = {};
  for (const [name, value] of entries) {
    if (!EXCLUDED_FIELDS.has(name) && typeof value === "string") {
      draft[name] = value;
    }
  }
  return draft;
}

export function parseContactDraft(raw: string | null): ContactDraft {
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return buildContactDraft(Object.entries(parsed));
  } catch {
    return {};
  }
}

function getStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function saveContactDraft(form: HTMLFormElement): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    const draft = buildContactDraft(new FormData(form).entries());
    storage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // 保存できない環境でもフォームの利用は継続する。
  }
}

function restoreContactDraft(form: HTMLFormElement): void {
  const storage = getStorage();
  if (!storage) return;

  let draft: ContactDraft;
  try {
    draft = parseContactDraft(storage.getItem(STORAGE_KEY));
  } catch {
    return;
  }

  for (const element of Array.from(form.elements)) {
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
      ) ||
      !element.name ||
      EXCLUDED_FIELDS.has(element.name)
    ) {
      continue;
    }

    if (
      element instanceof HTMLInputElement &&
      ["checkbox", "radio", "file"].includes(element.type)
    ) {
      continue;
    }

    if (Object.hasOwn(draft, element.name)) {
      element.value = draft[element.name];
    }
  }
}

export function connectContactDraft(form: HTMLFormElement): () => void {
  restoreContactDraft(form);
  const save = () => saveContactDraft(form);
  form.addEventListener("input", save);
  form.addEventListener("change", save);

  return () => {
    form.removeEventListener("input", save);
    form.removeEventListener("change", save);
  };
}

export function clearContactDraft(
  storage: Pick<Storage, "removeItem"> | null = getStorage(),
): void {
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // 削除できない環境でも送信完了表示は継続する。
  }
}
