export default {
  title: "Mapa služieb pre ľudí v núdzi",
  search: "Hľadať",
  close: "Zavrieť",
  loading: "Načítavanie",
  moreInformation: "Viac informácií",
  reportProblemLink:
    "mailto:sekciasocialnychveci@bratislava.sk?subject=Mapa služieb pre ľudí v núdzi - návrh na zmenu/doplnenie údajov",
  reportProblem: "sekciasocialnychveci@bratislava.sk",
  problemHint:
    "Našli ste neaktuálnu informáciu alebo niečo na mape chýba? Napíšte nám a pomôžte mapu zlepšovať.",
  noImage: "Žiaden obrázok",
  legend: {
    title: "Legenda",
    point: "Bod",
    districtBorder: "Hranica mestskej časti",
    drinkingFountain: "Pitná fontánka",
    orientationPoint: "Orientačný bod",
    fixpoint: "Fixpoint",
    syringeExchange: "Výmena striekačiek",
    fixpointAndSyringeExchange: "Fixpoint a výmena striekačiek",
  },
  terrainServices: {
    title: "Terénne služby",

    cityTerrainService: {
      title: "Mestský terénny tím",
      provider: "Magistrát hl. mesta Bratislavy",
      service: "pomoc v uliciach",
      openingHours: "",
      phone: "",
      price: "zdarma",
    },
    vagus: {
      title: "Streetwork Vagus",
      provider: "OZ Vagus",
      service:
        "sociálne poradenstvo a pomoc v uliciach - sociálne poradenstvo, základné ošetrenie, jedlo, prikrývky, odvoz do nemocnice/nocľahárne; v prípade krízového podnetu večer je možnosť ísť aj do iných mestských častí",
      openingHours:
        "denné služby: pondelok-piatok 8:30-12:00; večerné služby: pondelok-sobota 17:00-21:00",
      phone: "+421 949 655 555",
      price: "zdarma",
    },
    rozalie: {
      title: "Terénna sociálna práca bl. Rozálie Rendu",
      provider: "DEPAUL Slovensko, n.o.",
      service:
        "sociálne poradenstvo, sprevádzanie (po dohode) k lekárovi, po úradoch, asistencia pri vybavovaní dokladov, dôchodkov a dávok, základné ošetrenie v rámci poskytnutia prvej pomoci, v krízových situáciach oblečenie, potraviny a teplý nápoj",
      openingHours: "pondelok-piatok 7:30-14:00",
      phone: "+421 910 842 170",
      price: "zdarma",
    },
    stopa: {
      title: "Terénny prevenčný tím STOPA",
      provider: "STOPA Slovensko o.z.",
      service: "krízové intervencie, poradenstvo, základné ošetrenie, sociálna asistencia",
      openingHours:
        "pondelok-piatok 8:00-16:00 (počas vyhlásenej zimnej krízy 6:30-3:00 druhého dňa) ",
      phone: "+421 948 389 748",
      price: "zdarma",
    },
  },
  layersLabel: "Typy pomoci",
  otherLayersLabel: "Ďalšie služby",
  filters: {
    title: "Filter",
    reset: "Zrušiť",
    district: {
      title: "Mestská časť",
      placeholder: "Mestská časť",
      multipleDistricts: "Zvolených",
    },
  },
  detail: {
    main: {
      services: "Služby",
      address: "Adresa",
      district: "Mestská časť",
      name: "Názov",
      openingHours: "Služba poskytovaná v čase",
      phone: "Tel. číslo",
      priceAndCapacity: "Cena a kapacita",
      provider: "Poskytovateľ / zriaďovateľ",
      route: "Ako sa tam dostať?",
      web: "Web",
      email: "E-mail",
      navigate: "Navigovať",
      description: "Popis",
      openingHoursDataField: "Otváracia doba",
    },
    drinkingFountain: {
      drinkingFountain: "Pitná fontánka",
      buildSince: "Rok postavenia",
      maintainer: "Správca",
      name: "Názov",
      state: "Stav",
      type: "Typ",
    },
    terrainService: {
      provider: "Poskytovateľ",
      phone: "Tel. číslo",
      web: "Web",
      openingHours: "Otváracie hodiny",
      price: "Cena",
      areas: "Oblasti pôsobnosti",
      tag: "terénna a sociálna pomoc",
    },
    fixpointSyringeExchange: {
      name: "Názov",
      address: "Adresa",
    },
    otherService: {
      name: "Názov",
      provider: "Poskytovateľ / Zriaďovateľ",
      service: "Služba",
      phone: "Tel. číslo",
      time: "Čas",
      price: "Cena",
      how: "Ako sa tam dostať?",
      web: "Web",
      locality: "Lokalita",
      address: "Adresa",
      description: "Popis",
    },
  },

  layers: {
    counseling: "sociálne a právne poradenstvo",
    hygiene: "hygiena a ošatenie",
    overnight: "nocľah a ubytovanie",
    meals: "strava",
    medicalTreatment: "zdravotné oštrenie",
    culture: "kultúra",
    drugsAndSex: "Kontaktné centrum pre užívateľov drog a ľudí zo sexbiznisu",
    terrainServices: "terénne služby",
    kolo: "Kolo - centrum opätovného použitia",
  },

  popup: {
    terrainServices: "Terénne služby:",
  },

  helpPhoneLinks: {
    title: "Linky pomoci",
    labels: {
      showMore: "Viac informácií",
      description: "Popis",
      operation: "Prevádzka",
      operator: "Prevádzkovateľ",
      price: "Cena",
    },
    womenViolence: {
      title: "Národná linka pre ženy zažívajúce násilie",
      operator: "Ministerstvo práce,sociálnych vecí a rodiny",
      phone: "+421 800 212 212",
      description:
        "Sociálno-právne a psychologické poradenstvo pri riešení domáceho násilia, sprostredkovanie bezpečného ubytovania, aj cez email linkaprezeny@ivpr.gov.sk",
      operation: "nonstop",
      price: "zadarmo",
    },
    homelessPeople: {
      title: "SOS linka na pomoc ľuďom bez domova",
      operator: "OZ Vagus",
      phone: "+421 949 655 555",
      description:
        "Sociálne poradenstvo v teréne, základné ošetrenie, jedlo, odvoz do nocľahárne prípadne privolanie zdravotnej pomoci alebo polície a napojenie na ďalšie sociálne služby.",
      operation:
        "pondelok-sobota 9:00-12:00 a 17:00-21:00. Mimo stanovenej doby môžete zanechať odkaz so svojimi kontaktnými údajmi a informáciami, kde sa človek bez domova nachádza.",
      price: "zadarmo",
    },
    humanTrafficking: {
      title: "Linka na pomoc obetiam obchodovania s ľuďmi",
      operator: "Slovenská katolícka charita",
      phone: "+421 800 800 818",
      description:
        "Poskytovanie pomoci a informácií v prvom kontakte s osobami, ktoré sa mohli dostať do rizikovej situácie v súvislosti s obchodovaním s ľuďmi.",
      operation:
        "pondelok-piatok 8:00-20:00. Mimo prevádzkových hodín možnosť zanechať odkaz prostredníctvom záznamníka.",
      price: "zadarmo",
    },
  },

  welcomeModal: {
    title: "Vitajte na mapa služieb pre ľudí v núdzi",
    description:
      "Mapa obsahuje všetky formy pomoci pre ľudí, ktorí prišli o domov. Informácie o miestach na nocľah, stravovanie, hygienu či zdravotné ošetrenie, pôsobenie terénnych tímov alebo linky pomoci. ",
  },

  activeFilters: "Aktívny filter",
  resetFilters: "Zrušiť filter",
  informationModal: {
    title: "Mapa služieb pre ľudí v núdzi.",
    description:
      "Našli ste neaktuálnu informáciu alebo niečo na mape chýba? Napíšte nám na <1>sekciasocialnychveci@bratislava.sk</1> a pomôžte mapu zlepšovať. Viac o aktivitách v sociálnej oblasti nájdete na webe hlavného mesta, v sekcii sociálne služby a bývanie.",
    descriptionLink:
      "mailto:sekciasocialnychveci@bratislava.sk?subject=Mapa služieb pre ľudí v núdzi - návrh na zmenu/doplnenie údajov",
    footer: "Zanechajte nám spätnú väzbu na <1>mapy.inovacie@bratislava.sk</1>",
    footerLink:
      "mailto:mapy.inovacie@bratislava.sk?subject=Mapa služieb pre ľudí v núdzi - spätná väzba",
  },
};
