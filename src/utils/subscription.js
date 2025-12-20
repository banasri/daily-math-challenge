export function isAccessActive(userProfile) {
  const now = new Date();

  if (userProfile.subscriptionEndsAt) {
    return userProfile.subscriptionEndsAt.toDate() > now;
  }

  if (userProfile.trialEndsAt) {
    return userProfile.trialEndsAt.toDate() > now;
  }

  return false;
}
