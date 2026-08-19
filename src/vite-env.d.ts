/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** §5.5 — SHA-256 hex of the management passphrase. Injected in CI. */
  readonly VITE_MANAGEMENT_PASSPHRASE_HASH?: string;
  /** §10.3 — inside-joke hint shown above the passphrase field. */
  readonly VITE_MANAGEMENT_HINT?: string;
  /** §10.5 — digits-only WhatsApp number for the clarification deep link. */
  readonly VITE_CLARIFICATION_WHATSAPP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
