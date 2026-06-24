export function emergencyAgent(context: { riskLevel: string; trustedContacts: string[] | number }) {
  return {
    status: context.riskLevel === 'High' ? 'Prepared' : 'Standby',
    contactsAlerted: context.riskLevel === 'High',
    policeNotified: false,
  }
}
