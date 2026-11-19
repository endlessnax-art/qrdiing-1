/**
 * In-memory rate limiter with IP and email tracking for login lockout protection.
 * Rule: 5 failed attempts within 15 minutes locks out for 15 minutes.
 */

interface AttemptRecord {
  count: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

const attemptsByIp: Map<string, AttemptRecord> = new Map();
const attemptsByEmail: Map<string, AttemptRecord> = new Map();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

function cleanOldRecords(map: Map<string, AttemptRecord>) {
  const now = Date.now();
  map.forEach((record, key) => {
    if (record.lockedUntil && record.lockedUntil < now) {
      map.delete(key);
    } else if (!record.lockedUntil && now - record.firstAttemptTime > WINDOW_MS) {
      map.delete(key);
    }
  });
}

export function checkLoginRateLimit(ip: string, email: string): { allowed: boolean; remainingMinutes?: number; message?: string } {
  cleanOldRecords(attemptsByIp);
  cleanOldRecords(attemptsByEmail);

  const now = Date.now();
  const normalizedEmail = email.trim().toLowerCase();

  // Check IP lockout
  const ipRecord = attemptsByIp.get(ip);
  if (ipRecord?.lockedUntil && ipRecord.lockedUntil > now) {
    const mins = Math.ceil((ipRecord.lockedUntil - now) / 60000);
    return {
      allowed: false,
      remainingMinutes: mins,
      message: `Too many failed attempts from your IP. Account access locked for ${mins} more minute(s).`,
    };
  }

  // Check Email lockout
  const emailRecord = attemptsByEmail.get(normalizedEmail);
  if (emailRecord?.lockedUntil && emailRecord.lockedUntil > now) {
    const mins = Math.ceil((emailRecord.lockedUntil - now) / 60000);
    return {
      allowed: false,
      remainingMinutes: mins,
      message: `Too many failed attempts for this account. Login locked for ${mins} more minute(s).`,
    };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string, email: string): { lockedNow: boolean; remainingAttempts: number; message?: string } {
  const now = Date.now();
  const normalizedEmail = email.trim().toLowerCase();

  // Update IP record
  let ipRecord = attemptsByIp.get(ip);
  if (!ipRecord || now - ipRecord.firstAttemptTime > WINDOW_MS) {
    ipRecord = { count: 1, firstAttemptTime: now };
  } else {
    ipRecord.count += 1;
  }
  if (ipRecord.count >= MAX_ATTEMPTS) {
    ipRecord.lockedUntil = now + LOCKOUT_MS;
  }
  attemptsByIp.set(ip, ipRecord);

  // Update Email record
  let emailRecord = attemptsByEmail.get(normalizedEmail);
  if (!emailRecord || now - emailRecord.firstAttemptTime > WINDOW_MS) {
    emailRecord = { count: 1, firstAttemptTime: now };
  } else {
    emailRecord.count += 1;
  }
  if (emailRecord.count >= MAX_ATTEMPTS) {
    emailRecord.lockedUntil = now + LOCKOUT_MS;
  }
  attemptsByEmail.set(normalizedEmail, emailRecord);

  const highestCount = Math.max(ipRecord.count, emailRecord.count);
  if (highestCount >= MAX_ATTEMPTS) {
    return {
      lockedNow: true,
      remainingAttempts: 0,
      message: "Security Lockout: 5 failed login attempts reached. Your access is locked for 15 minutes.",
    };
  }

  const remaining = MAX_ATTEMPTS - highestCount;
  return {
    lockedNow: false,
    remainingAttempts: remaining,
    message: `Invalid credentials. ${remaining} attempt(s) remaining before a 15-minute lockout.`,
  };
}

export function resetLoginAttempts(ip: string, email: string): void {
  attemptsByIp.delete(ip);
  attemptsByEmail.delete(email.trim().toLowerCase());
}
