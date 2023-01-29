import { GeolocationRepository } from "../repositories/Geolocation.repository";

const isIP = (str: string) => {
  const regexExp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  return regexExp.test(str);
};

const isDomain = (str: string) => {
  const regexExp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/gi;

  return regexExp.test(str);
};

export const GeolocationService = {
  async getGeolocation(ipOrDomain?: string) {
    if (!ipOrDomain) {
      return await GeolocationRepository.getUserGeolocation();
    }

    const isIp = isIP(ipOrDomain);
    const isD = isDomain(ipOrDomain);

    if (!isIp && !isD) {
      alert("Invalid IP or Domain");
      throw new Error("Invalid IP or Domain");
    }

    if (isIp) {
      return await GeolocationRepository.getGeolocationByIp(ipOrDomain);
    }
    return await GeolocationRepository.getGeolocationByDomain(ipOrDomain);
  },
};
