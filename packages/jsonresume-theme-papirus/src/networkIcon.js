export default function (network) {
  if (network === 'StackOverflow') {
    return 'stack-overflow';
  } else {
    return network.toLowerCase();
  }
}
