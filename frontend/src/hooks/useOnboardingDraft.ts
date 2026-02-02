import { useEffect, useRef } from 'react';

type DraftData = {
  version: 1;
  email?: string;
  firstName?: string;
  lastName?: string;
};

type DraftConfig<T> = {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  enabled?: boolean;
  storageKey?: string;
};

const DEFAULT_STORAGE_KEY = 'onboardingDraft';

const safeRead = (storageKey: string): DraftData | null => {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftData;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore storage cleanup errors.
    }
    return null;
  }
};

const safeWrite = (storageKey: string, data: DraftData | null) => {
  try {
    if (!data) {
      sessionStorage.removeItem(storageKey);
      return;
    }
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // Ignore storage write failures (private mode, quota limits).
  }
};

export const useOnboardingDraft = <T extends { email?: string; firstName?: string; lastName?: string }>(
  config: DraftConfig<T>
) => {
  const { formData, setFormData, enabled = true, storageKey = DEFAULT_STORAGE_KEY } = config;
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!enabled || hydratedRef.current) return;
    hydratedRef.current = true;
    const draft = safeRead(storageKey);
    if (!draft) return;
    setFormData((prev) => ({
      ...prev,
      email: draft.email ?? prev.email,
      firstName: draft.firstName ?? prev.firstName,
      lastName: draft.lastName ?? prev.lastName,
    }));
  }, [enabled, setFormData, storageKey]);

  useEffect(() => {
    if (!enabled) return;
    const trimmedEmail = formData.email?.trim() || '';
    const trimmedFirstName = formData.firstName?.trim() || '';
    const trimmedLastName = formData.lastName?.trim() || '';

    if (!trimmedEmail && !trimmedFirstName && !trimmedLastName) {
      safeWrite(storageKey, null);
      return;
    }

    safeWrite(storageKey, {
      version: 1,
      email: trimmedEmail || undefined,
      firstName: trimmedFirstName || undefined,
      lastName: trimmedLastName || undefined,
    });
  }, [enabled, formData.email, formData.firstName, formData.lastName, storageKey]);
};
