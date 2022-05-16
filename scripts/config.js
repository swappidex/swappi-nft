const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const timer = { SECOND, MINUTE, HOUR, DAY, MONTH, YEAR };

const evmChain = {
  chainName: 'EVM',
  nodeUrl: 'http://evmtestnet.confluxrpc.com',
  adminKey:
    '',
  adminAddress: '',
  contractAddress: '0x3792e803d12b032e4e876e5cbe016a3cadb05fce'
};

module.exports = {
  timer,
  evmChain,
};
