// src/utils/storage.ts
import type { FormSchema } from "./types";

const INDEX_KEY = "upliance.forms.index";
const FORM_KEY = (id: string) => `upliance.forms.byId.${id}`;
const VERSION_KEY = "upliance.version";
const CURRENT_VERSION = "1.0";

export type FormMeta = { id: string; name: string; createdAt: string };

export function migrateStorageIfNeeded() {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    if (!version || version !== CURRENT_VERSION) {
      console.log("Migrating storage to version", CURRENT_VERSION);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

      const existingIndex = loadIndex();
      if (existingIndex.length > 0) {
        console.log(`Found ${existingIndex.length} existing forms`);
      }
    }
  } catch (error) {
    console.warn("Storage migration failed:", error);
  }
}

export function safeStorageOperation<T>(operation: () => T, fallback: T): T {
  try {
    return operation();
  } catch (error) {
    console.warn("Storage operation failed:", error);
    return fallback;
  }
}

export function loadIndex(): FormMeta[] {
  return safeStorageOperation(() => {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.createdAt === "string"
    );
  }, []);
}

export function saveIndex(list: FormMeta[]) {
  safeStorageOperation(() => {
    const cleanList = list.filter(
      (item) => item && item.id && item.name && item.createdAt
    );
    localStorage.setItem(INDEX_KEY, JSON.stringify(cleanList));
    return true;
  }, false);
}

export function loadFormById(id: string): FormSchema | null {
  return safeStorageOperation(() => {
    const raw = localStorage.getItem(FORM_KEY(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || !parsed.id || !parsed.fields) {
      console.warn(`Invalid form schema for id: ${id}`);
      return null;
    }

    return parsed as FormSchema;
  }, null);
}

export function saveFormById(schema: FormSchema) {
  safeStorageOperation(() => {
    if (!schema || !schema.id || !schema.fields) {
      throw new Error("Invalid schema provided");
    }
    localStorage.setItem(FORM_KEY(schema.id), JSON.stringify(schema));
    return true;
  }, false);
}

export function deleteFormById(id: string) {
  safeStorageOperation(() => {
    localStorage.removeItem(FORM_KEY(id));
    const idx = loadIndex().filter((m) => m.id !== id);
    saveIndex(idx);
    return true;
  }, false);
}

export function getStorageStats() {
  try {
    const forms = loadIndex();
    let totalSize = 0;

    forms.forEach((form) => {
      const formData = localStorage.getItem(FORM_KEY(form.id));
      if (formData) {
        totalSize += formData.length;
      }
    });

    return {
      formCount: forms.length,
      totalSizeBytes: totalSize,
      totalSizeKB: Math.round(totalSize / 1024),
    };
  } catch {
    return { formCount: 0, totalSizeBytes: 0, totalSizeKB: 0 };
  }
}

migrateStorageIfNeeded();
