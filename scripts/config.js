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
  contractAddress: '0xBbDba5043A73e87533b9378e58dEa577A872Dc04'
};

module.exports = {
  timer,
  evmChain,
};
