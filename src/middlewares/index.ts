import { STATUS } from "../controller.user/index";

const request = require("request");

export interface CoordinatesTypes {
  region?: string;
  lat: number;
  lon: number;
}

export const filterUser = async (req, res, next) => {
  const { address, coordinates, regions } = req.body;

  if (coordinates == "" && address == "") {
    try {
      const url = "http://ip-api.com/json";
      const ipInfo = await new Promise<CoordinatesTypes>((resolve, reject) => {
        request(url, (err, response, body) => {
          if (err) {
            reject(err);
            console.log("Erro de conexao com servidor");
          } else {
            const { regionName, lat, lon } = JSON.parse(body);
            const coords: CoordinatesTypes = {
              // region: regionName,
              lat,
              lon,
            };
            console.log(coords);
            resolve(coords);
          }
        });
      });

      req.coordinates = [ipInfo.lat, ipInfo.lon];
      //req.regions = ipInfo.region;

      next();
    } catch (error) {
      res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: "Erro ao obter coordenadas automaticamente:", error });
    }
  }
};
