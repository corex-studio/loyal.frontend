export let LANGUAGE = '';
try {
  if (process.env.LANGUAGE) LANGUAGE = process.env.LANGUAGE;
} catch {}
