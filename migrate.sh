#!/bin/bash
set -e

echo "=== Creating target folders ==="
mkdir -p components/styles components/_tests_

echo "=== Moving styles ==="
if [ -d src/components/styles ]; then
  mv src/components/styles/* components/styles/ 2>/dev/null || true
fi

echo "=== Moving tests ==="
if [ -d src/components/_tests_ ]; then
  mv src/components/_tests_/* components/_tests_/ 2>/dev/null || true
fi

echo "=== Updating imports to alias paths ==="
# hooks
grep -rl "../hooks" components contexts features services utils app 2>/dev/null | xargs sed -i '' 's|\.\./hooks|@/hooks|g'
# features
grep -rl "../features" components contexts features services utils app 2>/dev/null | xargs sed -i '' 's|\.\./features|@/features|g'
# contexts
grep -rl "../contexts" components contexts features services utils app 2>/dev/null | xargs sed -i '' 's|\.\./contexts|@/contexts|g'
# services
grep -rl "../services" components contexts features services utils app 2>/dev/null | xargs sed -i '' 's|\.\./services|@/services|g'
# utils
grep -rl "../utils" components contexts features services utils app 2>/dev/null | xargs sed -i '' 's|\.\./utils|@/utils|g'
# types
grep -rl "../types" components contexts features services utils app 2>/dev/null | xargs sed -i '' 's|\.\./types|@/types|g'

echo "=== Searching for <img> tags to replace with next/image ==="
grep -rn "<img" components app || true
echo "Manually replace these with next/image and set width/height."

echo "=== Searching for <a href> tags to replace with Link from i18n/routing ==="
grep -rn "<a href" components app || true
echo "Manually replace these with Link from '@/i18n/routing'."

echo "=== Adding 'use client' where needed ==="
CLIENT_FILES=(
  components/Card.tsx
  components/Search.tsx
  components/Flyout.tsx
  components/ThemeToggle.tsx
  components/LazyDetailsWrapper.tsx
  components/ErrorBoundary.tsx
  components/ErrorMessage.tsx
  components/Loading.tsx
  contexts/ThemeProvider.tsx
  contexts/ThemeContext.ts
  hooks/useLocalStorage.ts
  hooks/useSavedSearchQuery.ts
  utils/TestProviders.tsx
)
for file in "${CLIENT_FILES[@]}"; do
  if [ -f "$file" ]; then
    if ! grep -q '^"use client";' "$file"; then
      echo '"use client";' | cat - "$file" > temp && mv temp "$file"
      echo "Added 'use client' to $file"
    fi
  fi
done

echo "=== Removing old Vite src/ folder ==="
rm -rf src

echo "=== Migration complete ==="

