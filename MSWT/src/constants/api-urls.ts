export const API_URLS = {
  FLOOR: {
    GET_ALL: `floor`,
    GET_BY_ID: (id: string) => `floor/${id}`,
    DELETE: (id: string) => `floor/${id}`,
  },
  RESTROOM: {
    GET_ALL: `restrooms`,
    GET_BY_ID: (id: string) => `restrooms/${id}`,
    CREATE: `restrooms`,
    UPDATE: (id: string) => `restrooms/${id}`,
    DELETE: (id: string) => `restrooms/${id}`,
  },
};
