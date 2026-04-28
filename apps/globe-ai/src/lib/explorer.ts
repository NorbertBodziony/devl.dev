function normalizeNetworkName(network?: string) {
  return network?.toLowerCase().replace(/\s+/g, "-") ?? "solana";
}

export function walletExplorerUrl(address: string, network?: string) {
  const normalized = normalizeNetworkName(network);
  const baseUrl =
    normalized === "solana"
      ? "https://solscan.io/account/"
      : "https://etherscan.io/address/";
  return `${baseUrl}${encodeURIComponent(address)}`;
}
