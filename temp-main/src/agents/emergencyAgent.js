export function emergencyAgent(context) {
  const contacts = context.trustedContacts || []
  const guardians = context.guardians || []

  return {
    primary: contacts[0] || null,
    secondary: contacts[1] || null,
    guardians,
    status: 'Emergency flow ready',
  }
}