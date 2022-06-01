export default {
  title: 'Zone map',
  search: 'Search',
  layersHint: 'Click on the highlighted streets for more information.',
  ruzinovRegulation: 'Starý Ružinov - východ, regulation from 23.3.2022',
  paymentOptions: 'Payment options',
  paymentOptionsUrl: 'https://paas.sk/en/payment/',
  layers: {
    residentsLayer: {
      title: 'Resident',
      description:
        'Streets on which you can use the resident or subscription card for the particular zone for parking.',
      detail: {
        title: 'Resident',
        cardValidity: 'Validity of RPK, APK',
      },
    },
    visitorsLayer: {
      title: 'Visitor',
      description:
        'Zone visitors pay an hourly rate for parking on these streets at a specified time or they can use their bonus or visitor card.',
      detail: {
        title: 'Visitor',
        location: 'Location',
        district: 'District',
        zone: 'Zone',
        code: 'Parking segment code',
        price: 'Price (€/h)',
        regulationTime: 'Time of regulation (h)',
        chargingTime: 'Time of paid parking (h)',
      },
    },
    parkomatsLayer: {
      title: 'Parking machines',
      detail: {
        title: 'Parking machine',
        location: 'Location',
        id: 'Parking machine ID',
      },
    },
    assistantsLayer: {
      title: 'Parking assistants',
      detail: {
        title: 'Parking assistant',
        residentZone: 'Resident zone',
      },
    },
    branchesLayer: {
      title: 'Contact points',
      detail: {
        title: 'Contact point',
        name: 'Name',
        address: 'Address',
        openingHours: 'Opening hours',
        place: 'Location',
        additionalInformation: 'Additional information',
      },
    },
    partnersLayer: {
      title: 'Partners',
      detail: {
        title: 'Partner',
        name: 'Name',
        address: 'Address',
      },
    },
  },
};
