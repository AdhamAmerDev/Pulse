export function requiredSecret(name: string): string {
  const value = process.env[name];
  if (!value || value.startsWith("replace-with-")) {
    throw new Error(`${name} must be configured with a real secret`);
  }
  return value;
}

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.startsWith("replace-with-")) {
    throw new Error(`${name} must be configured`);
  }
  return value;
}
