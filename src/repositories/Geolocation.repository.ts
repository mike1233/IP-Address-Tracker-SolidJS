import { AxiosResponse } from "axios";
import { z } from "zod";
import { http } from "../config/axios";

const LocationSchema = z.object({
  country: z.string(),
  region: z.string(),
  timezone: z.string(),
  city: z.string(),
  lat: z.number(),
  lng: z.number(),
  postalCode: z.string(),
  geonameId: z.number(),
});

const DescriptionSchema = z.object({
  asn: z.number(),
  name: z.string(),
  route: z.string(),
  domain: z.string(),
  type: z.string(),
});

export const GeolocationSchema = z.object({
  ip: z.string(),
  location: LocationSchema,
  domains: z.string().array().optional(),
  as: DescriptionSchema,
  isp: z.string(),
});

export type Geolocation = z.infer<typeof GeolocationSchema>;

const DEV_MODE = import.meta.env.DEV;

const parser = <T>(value: AxiosResponse<T>) => {
  if (DEV_MODE) {
    return GeolocationSchema.parse(value.data);
  }

  const res = GeolocationSchema.safeParse(value.data);
  if (res.success) {
    return res.data;
  }

  alert(res.error);
  throw new Error(res.error.toString());
};

export const GeolocationRepository = {
  async getUserGeolocation(): Promise<Geolocation> {
    const response = await http.get<Geolocation>(`/country,city`, {});
    return parser(response);
  },

  async getGeolocationByIp(ip: string): Promise<Geolocation> {
    const response = await http.get<Geolocation>(`/country,city`, {
      params: {
        ipAddress: ip,
      },
    });
    return parser(response);
  },

  async getGeolocationByDomain(domain: string): Promise<Geolocation> {
    const response = await http.get<Geolocation>(`/country,city`, {
      params: {
        domain: domain,
      },
    });
    return parser(response);
  },
};
