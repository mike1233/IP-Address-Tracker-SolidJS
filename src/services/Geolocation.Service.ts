import { z } from "zod";
import { http } from "../config/axios";

const LocationSchema = z.object({
  country: z.string(),
  region: z.string(),
  timezone: z.string(),
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

export const GeolocationService = {
  async getGeolocation(ip: string): Promise<Geolocation> {
    const response = await http.get<Geolocation>(`/json?ipAddress=${ip}`);
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
