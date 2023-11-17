import { UserAddress } from '../types/user.types';

const formatAddress = (address: UserAddress) => {
  return Object.values(address).join(' ').split(' ').join('+');
};

export default formatAddress;
