export const getAliasMeta = (alias) => {
  const now = Date.now();

  const createdAt =
    alias.createdAt instanceof Date
      ? alias.createdAt.getTime()
      : new Date(alias.createdAt || now).getTime();

  const expiresAt =
    alias.expiresAt instanceof Date
      ? alias.expiresAt.getTime()
      : alias.expiresAt
      ? new Date(alias.expiresAt).getTime()
      : null;

  const isExpired = expiresAt ? expiresAt <= now : false;
  const timeRemaining = !expiresAt || isExpired ? 0 : expiresAt - now;
  const timeSinceCreated = now - createdAt;
  const status = isExpired ? "Expired" : "Active";

  return {
    isExpired,
    status,
    timeRemaining,
    timeSinceCreated,
  };
};


