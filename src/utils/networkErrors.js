export function getNetworkErrorMessage(error, serviceName) {
  if (error instanceof TypeError || error?.message === 'Failed to fetch') {
    return `Unable to reach ${serviceName}. Check your network connection and the configured service endpoint.`;
  }

  return error?.text || error?.message || `Unexpected ${serviceName} error.`;
}
