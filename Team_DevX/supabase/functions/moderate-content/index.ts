// Supabase Edge Function: moderate-content (enhanced, modular version)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Rate limiting ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map();

// --- Keyword and blacklist definitions ---
const CIVIC_KEYWORDS = [
  'water', 'road', 'school', 'drain', 'electricity', 'transport', 'health',
  'sanitation', 'education', 'safety', 'waste', 'traffic', 'public',
  'infrastructure', 'ministry', 'problem', 'solution', 'comment',
  'report', 'issue', 'service', 'community', 'citizen'
];

const BLACKLIST = [
  'buy', 'subscribe', 'follow', 'product', 'politics', 'vote', 'link',
  'spam', 'click', 'offer', 'discount', 'join group', 'telegram'
];

const PROFANITY = ['badword1', 'badword2']; // Extend with comprehensive slur/profanity list

// --- Utility / Heuristic Functions ---
function getTextLengthFactor(text: string) {
  return Math.min((text?.length || 0) / 100, 1);
}

function getRelevanceScore(text: string) {
  const words = (text || '').toLowerCase().split(/\W+/);
  const relevant = words.filter((w) => CIVIC_KEYWORDS.includes(w)).length;
  return words.length ? relevant / words.length : 0;
}

function isGibberish(text: string) {
  if (!text) return true;
  const vowels = (text.match(/[aeiou]/gi) || []).length;
  const letters = (text.match(/[a-z]/gi) || []).length;
  if (letters > 0 && vowels / letters < 0.25) return true;
  if (/(.)\1{4,}/i.test(text)) return true;
  if (/asdf|qwer|zxcv|hjkl/i.test(text)) return true;
  const nonAlphaRatio = text.replace(/[a-zA-Z0-9\s]/g, '').length / text.length;
  if (nonAlphaRatio > 0.4) return true;
  if (/[A-Z]{3,}/.test(text) && /[a-z]{3,}/.test(text)) return true;
  return false;
}

function containsBlacklist(text: string) {
  return BLACKLIST.some((word) => (text || '').toLowerCase().includes(word));
}

function containsProfanity(text: string) {
  return PROFANITY.some((word) => (text || '').toLowerCase().includes(word));
}

function repetitionDetector(text: string) {
  return /(\b\w+\b)(?:.*\1){2,}/i.test(text || '');
}

function emojiDensity(text: string) {
  const emojis = (text.match(/\p{Emoji}/gu) || []).length;
  return emojis / Math.max(text.length, 1);
}

function punctuationAbuse(text: string) {
  return /[!?.]{4,}/.test(text) || /(.)\1{4,}/.test(text);
}

function containsSensitiveInfo(text: string) {
  const patterns = [
    /\b\d{10,}\b/, // phone numbers
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN-like
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // email
    /\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b/, // credit cards
    /\b\d{6,}\b/, // generic IDs
  ];
  return patterns.some((regex) => regex.test(text));
}

async function getAIModeration(text: string) {
  // Replace with real AI moderation API call
  return {
    ai_confidence: Math.random(),
    reason: 'ai_simulated'
  };
}

function computeQualityScore(ai: number, len: number, rel: number, penalty: number) {
  let score = 0.6 * ai + 0.2 * len + 0.2 * rel;
  score -= penalty;
  return Math.max(0, Math.min(1, score));
}

// --- Main Handler ---
serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('host') || 'unknown';
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) entry = { count: 1, start: now };
  else entry.count++;
  rateLimitMap.set(ip, entry);
  if (entry.count > RATE_LIMIT_MAX) return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });

  const { table, row } = await req.json();
  let text = '';
  if (table === 'problems') text = `${row.title || ''} ${row.description || ''}`;
  else if (table === 'solutions' || table === 'comments') text = row.text || '';
  else if (table === 'user_profiles') text = `${row.display_name || ''} ${row.bio || ''}`;

  // --- Run heuristic & AI checks ---
  const lenFactor = getTextLengthFactor(text);
  const relScore = getRelevanceScore(text);
  const isGarbage = isGibberish(text);
  const hasBlacklist = containsBlacklist(text);
  const hasProfanity = containsProfanity(text);
  const repeated = repetitionDetector(text);
  const emojiRatio = emojiDensity(text);
  const punctuationBad = punctuationAbuse(text);
  const hasSensitive = containsSensitiveInfo(text);

  const penalty =
    (isGarbage ? 0.3 : 0) +
    (hasBlacklist ? 0.3 : 0) +
    (hasProfanity ? 0.3 : 0) +
    (repeated ? 0.2 : 0) +
    (emojiRatio > 0.1 ? 0.1 : 0) +
    (punctuationBad ? 0.1 : 0) +
    (hasSensitive ? 0.5 : 0);

  const { ai_confidence, reason: ai_reason } = await getAIModeration(text);
  const quality_score = computeQualityScore(ai_confidence, lenFactor, relScore, penalty);

  // --- Decide moderation action ---
  let action = 'keep';
  let is_flagged = false;
  let is_deleted = false;
  let moderation_reason = '';

  if (isGarbage) moderation_reason += 'Gibberish text; ';
  if (hasBlacklist) moderation_reason += 'Blacklisted words; ';
  if (hasProfanity) moderation_reason += 'Profanity; ';
  if (repeated) moderation_reason += 'Repetitive content; ';
  if (emojiRatio > 0.1) moderation_reason += 'Too many emojis; ';
  if (punctuationBad) moderation_reason += 'Punctuation abuse; ';
  if (hasSensitive) moderation_reason += 'Sensitive info detected; ';
  moderation_reason += `AI: ${ai_reason}`;

  if (quality_score < 0.4 || isGarbage || hasBlacklist || hasProfanity || repeated || hasSensitive) {
    is_flagged = true;
    action = 'flag';
  }
  if (quality_score < 0.2 || isGarbage || hasBlacklist || hasProfanity || hasSensitive) {
    action = 'review';
  }

  // --- Write to audit log ---
  const auditLog = {
    table_name: table,
    row_id: row.id,
    action,
    reason: moderation_reason,
    quality_score,
    moderated_at: new Date().toISOString()
  };

  await supabase.from('moderation_audit').insert(auditLog);

  await supabase.from(table).update({
    is_flagged,
    is_deleted,
    quality_score,
    moderation_reason,
    moderated_at: new Date().toISOString()
  }).eq('id', row.id);

  return new Response(JSON.stringify({ quality_score, action, moderation_reason }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
