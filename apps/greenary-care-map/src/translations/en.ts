export default {
  title: "Greenery care",
  tabTitle: "Greenery care map",
  search: "Search",
  close: "Close",
  loading: "Loading",
  layersLabel: "Layers",
  filters: {
    title: "Filtering",
    active: "Active filters",
    reset: "Reset",
    year: {
      title: "Year",
      placeholder: "Year",
      multipleYears: "Selected",
    },
    district: {
      title: "District",
      placeholder: "District",
      multipleDistricts: "Selected",
    },
    season: {
      title: "Season",
      seasons: {
        spring: "spring",
        summer: "summer",
        autumn: "autumn",
        winter: "winter",
      },
    },
  },
  layers: {
    esri: {
      detail: {
        title: "Detail",
        slovakName: "Slovak name",
        latinName: "Latin name",
        street: "Street",
        operation: "Operation",
        description: "Operation description",
        date: "Date",
        district: "District",
        document: "Document",
        showDocument: "Show document",
        noDocuments: "No documents",
      },
    },
  },
  categories: {
    felling: "Felling",
    fellingByPermit: "Felling by permit",
    emergencyFelling: "Emergency Felling",
    invasivePlantsFelling: "Invasive Plants Felling",
    trimming: "Trimming",
    invasivePlants: "Invasive Plants",
    injectionOfInvasivePlants: "Injection of invasive plants",
    others: "Others",
    stumpRemoval: "Stump Removal",
    dendrologicalAssessment: "Dendrological Assessment",
    fallenTreeRemoval: "Fallen Tree Removal",
    mistletoeManagement: "Mistletoe Management",
  },
  districtBorder: "Border of the city district",
  // react-maps-ui
  activeFilters: "Active filters",
  resetFilters: "Reset filters",
  errors: {
    generic: "Error",
    notLocatedInBratislava: "You are not located in Bratislava",
    noGeolocationSupport: "Your device or browser does not support geolocation",
  },
  tooltips: {
    darkLightMode: "Light/Dark Base",
    satelliteMode: "Aerial",
    scrollZoomBlockerCtrlMessage: "Use ctrl + scroll to zoom the map",
    scrollZoomBlockerCmdMessage: "Use ⌘ + scroll to zoom the map",
    touchPanBlockerMessage: "Use two fingers to move the map",
  },
  informationModal: {
    title: "Map information",
    description:
      "Greenary care map in the administration of the City of Bratislava. You can find more information about the care of trees on the <1>maintenance and creation of greenery</1>, for which the Department of Urban Greenery is responsible.",
    descriptionLink:
      "https://bratislava.sk/zivotne-prostredie-a-vystavba/zelen/udrzba-a-tvorba-zelene",
    footer: "Leave the feedback at <1>mapy.inovacie@bratislava.sk</1>",
    footerLink: "mailto:mapy.inovacie@bratislava.sk",
  },
};
