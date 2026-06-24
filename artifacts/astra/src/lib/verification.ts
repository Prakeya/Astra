interface JoinRequestInput {
  verified: boolean
  trustedContacts: number
  deviceKnown: boolean
  hostApproved: boolean
  recentJoins: number
  profileComplete: boolean
  locationMatch: boolean
  repeatedAttempts: number
}

export type VerificationStatus = 'trusted' | 'review' | 'blocked' | 'suspicious' | 'pending'

export interface VerificationResult {
  score: number
  status: VerificationStatus
  reasons: string[]
}

export function scoreJoinRequest(input: JoinRequestInput): VerificationResult {
  let score = 0
  const reasons: string[] = []

  if (input.verified) { score += 30; reasons.push('Phone/account verified') }
  if (input.profileComplete) { score += 10; reasons.push('Profile complete') }
  if (input.deviceKnown) { score += 15; reasons.push('Known device') }
  if (input.hostApproved) { score += 20; reasons.push('Host approved') }
  if (input.trustedContacts >= 1) { score += 10; reasons.push('Has trusted contacts') }
  if (input.locationMatch) { score += 10; reasons.push('Location consistent') }
  if (input.recentJoins <= 3) { score += 5; reasons.push('Low recent join activity') }

  if (!input.verified) { score -= 20; reasons.push('Unverified account') }
  if (!input.profileComplete) { score -= 10; reasons.push('Incomplete profile') }
  if (!input.deviceKnown) { score -= 10; reasons.push('Unknown device') }
  if (!input.locationMatch) { score -= 15; reasons.push('Location mismatch') }
  if (input.repeatedAttempts >= 3) { score -= 20; reasons.push('Repeated attempts') }

  score = Math.max(0, Math.min(100, score))

  let status: VerificationStatus = 'pending'
  if (score >= 70) status = 'trusted'
  else if (score >= 40) status = 'review'
  else status = 'blocked'

  if (input.repeatedAttempts >= 3 || (!input.verified && !input.deviceKnown && !input.locationMatch)) {
    status = 'suspicious'
  }

  return { score, status, reasons }
}
