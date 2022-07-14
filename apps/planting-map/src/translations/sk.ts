export default {
  title: "Výsadba drevín",
  search: "Hľadať",
  close: "Zavrieť",
  loading: "Načítavanie",
  layersLabel: "Vrstvy",
  filters: {
    title: "Filter",
    reset: "Zrušiť",
    year: {
      title: "Rok",
      placeholder: "Rok",
      multipleYears: "",
    },
    kind: {
      title: "Druh dreviny",
      placeholder: "Druh dreviny",
      multipleKinds: "Zvolených",
    },
    district: {
      title: "Mestská časť",
      placeholder: "Mestská časť",
      multipleDistricts: "Zvolených",
    },
    season: {
      title: "Obdobie",
      seasons: {
        spring: "jar",
        summer: "leto",
        autumn: "jeseň",
        winter: "zima",
      },
    },
  },
  layers: {
    esri: {
      detail: {
        title: "Detail dreviny",
        nameSk: "Slovenský názov",
        nameLat: "Latinský názov",
        cultivar: "Kultivar",
        log: "Kmeň",
        height: "Výška",
        year: "Rok výsadby",
        donor: "Donor výsadby",
        district: "Mestská časť",
        cadastralArea: "Katastrálne územie",
      },
    },
  },
  components: {
    molecules: {
      ActiveFilters: {
        activeFilters: "Aktívny filter",
        resetFilters: "Zrušiť filter",
      },
    },
  },
};
