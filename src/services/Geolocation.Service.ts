import { GeolocationRepository } from "../repositories/Geolocation.repository";

const isIP = (str: string) => {
  const regexExp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  return regexExp.test(str);
};

export const GeolocationService = {
  async getGeolocation(ipOrDomain: string) {
    const isIp = isIP(ipOrDomain);
    if (isIp) {
      return await GeolocationRepository.getGeolocationByIp(ipOrDomain);
    }
    return await GeolocationRepository.getGeolocationByDomain(ipOrDomain);
  },
};
