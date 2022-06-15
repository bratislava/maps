// this function parses data from html tables
// customize it as you need
export const fixData = (data: any) => {
  const newFeatures: any[] = [];

  data.features.forEach((feature: any) => {
    // const feature = data.features[0];
    const container = document.createElement('div');
    container.innerHTML = feature.properties.description;
    document.body.appendChild(container);
    const tdElements = document.getElementsByTagName('td');

    for (let i = 0; i < tdElements.length; i++) {
      console.log(tdElements[i].innerHTML); //second console output
    }

    const properties: any = {
      district: tdElements[3].innerHTML,
      residentZoneCode: tdElements[5].innerHTML,
      OPKId: tdElements[7].innerHTML,
      location: tdElements[9].innerHTML,
      regulationTime: tdElements[11].innerHTML,
      chargingTime: tdElements[13].innerHTML,
      basePrice: tdElements[15].innerHTML,
    };

    container.remove();

    // if (properties.parkingSectionCode.length !== 4) return;

    newFeatures.push({
      id: parseInt(feature.properties.id.split('_')[1]),
      type: feature.type,
      geometry: feature.geometry,
      properties,
    });
  });

  console.log({
    type: data.type,
    features: newFeatures,
  });
};

export default fixData;

//* UDR properties
// const properties: any = {
//   district: tdElements[3].innerHTML,
//   residentZoneCode: tdElements[5].innerHTML,
//   location: tdElements[7].innerHTML,
//   maxParkingTime: tdElements[9].innerHTML,
//   freeParkingTime: tdElements[11].innerHTML,
//   isOnlyRPKAPK: tdElements[13].innerHTML,
//   exceptionForChargingForRPKAPK: tdElements[15].innerHTML,
//   exceptionForMaxParkingTimeForRPKAPK: tdElements[17].innerHTML,
//   parkingSectionCode: tdElements[19].innerHTML,
//   reservedFor: tdElements[21].innerHTML,
// };

//* UDR properties
// const properties: any = {
//   district: tdElements[3].innerHTML,
//   residentZoneCode: tdElements[5].innerHTML,
//   OPKId: tdElements[7].innerHTML,
//   location: tdElements[9].innerHTML,
//   regulationTime: tdElements[11].innerHTML,
//   chargingTime: tdElements[13].innerHTML,
//   basePrice: tdElements[15].innerHTML,
// };
