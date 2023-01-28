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
  domains: z.string().array(),
  as: DescriptionSchema,
  isp: z.string(),
});

export type Geolocation = z.infer<typeof GeolocationSchema>;

const DEV_MODE = import.meta.env.DEV;

export const GeolocationRepository = {
  async getGeolocationByIp(ip: string): Promise<Geolocation> {
    const response = await http.get<Geolocation>(`/country,city`, {
      params: {
        ipAddress: ip,
      },
    });
    if (DEV_MODE) {
      return GeolocationSchema.parse(response.data);
    }

    const res = GeolocationSchema.safeParse(response.data);
    if (res.success) {
      return res.data;
    }
    throw new Error("Invalid Geolocation");
  },

  async getGeolocationByDomain(domain: string): Promise<Geolocation> {
    const response = await http.get<Geolocation>(`/country,city`, {
      params: {
        domain: domain,
      },
    });
    if (DEV_MODE) {
      return GeolocationSchema.parse(response.data);
    }

    const res = GeolocationSchema.safeParse(response.data);
    if (res.success) {
      return res.data;
    }
    throw new Error("Invalid Geolocation");
  },
};
