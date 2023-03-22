export default {
  title: "Closures and restrictions map",
  tabTitle: "Closures and restrictions map in Bratislave",
  search: "Search by street",
  close: "Close",
  filters: {
    title: "Filtering",
    reset: "Reset",
    district: {
      title: "District",
      placeholder: "District",
      multipleDistricts: "Selected",
    },
    type: {
      title: "Type",
      placeholder: "Type",
      multipleTypes: "Selected",
      types: {
        Kanalizácia: "Sewerage",
        Plyn: "Gas",
        "Optické_siete": "Optics",
        "Elektrina_(VN_NN_a_pod.)": "Electricity",
        Voda: "Water",
        Horúcovod: "Hot Water",
        "Verejné_Osvetlenie": "Street lighting",
        Výstavba: "Construction",
        iné: "Other",
      },
    },
    status: {
      title: "Status",
      active: "active",
      done: "finished",
      planned: "planned",
    },
  },
  layers: {
    title: "Layers",
    digups: {
      title: "Digups",
      detail: {
        title: "Digup",
        startDate: "Start of implementation",
        endDate: "End of implementation",
        category: "Category",
        address: "Address",
        fullSize: "Total area",
        width: "Width",
        length: "Length",
        investor: "Investor",
        owner: "Owner / Administrator",
        contractor: "Contractor",
        permission: "Permission",
        showDocument: "Show document",
        problemHint:
          "Did the digup cause any problems? Were the obligations not complied with, does the risk arise in public space or on the road?",
        reportProblem: "Report problem",
        reportProblemLink: "http://inovacie.bratislava.sk/nahlasit-problem",
      },
    },
    closures: {
      title: "Closures",
      detail: {
        title: "Closure",
        startDate: "Start of implementation",
        endDate: "End of implementation",
        category: "Category",
        address: "Address",
        fullSize: "Total area",
        width: "Width",
        length: "Length",
        investor: "Investor",
        owner: "Owner / Administrator",
        contractor: "Contractor",
        permission: "Permission",
        showDocument: "Show document",
        problemHint:
          "Did the closure cause any problems? Were the obligations not complied with, does the risk arise in public space or on the road?",
        reportProblem: "Report problem",
        reportProblemLink: "http://inovacie.bratislava.sk/nahlasit-problem",
      },
    },
    disorders: {
      title: "Disorders",
      detail: {
        title: "Disorder",
        startDate: "Occurrence of a disorder",
        endDate: "Surface treatment",
        dateOfPassage: "Expected access",
        category: "Category",
        address: "Address",
        fullSize: "Total area",
        width: "Width",
        length: "Length",
        investor: "Investor",
        owner: "Owner / Administrator",
        contractor: "Contractor",
        permission: "Permission",
        showDocument: "Show document",
        photosOfPlace: "photos of place",
        problemHint:
          "Did the disorder cause any problems? Were the obligations not complied with, does the risk arise in public space or on the road?",
        reportProblem: "Report problem",
        reportProblemLink: "http://inovacie.bratislava.sk/nahlasit-problem",
      },
    },
    repairs: {
      title: "Repairs",
      detail: {
        title: "Repair",
        location: "Locality",
        date: "Date",
        length: "Length",
        address: "Address",
        description: "Description",
        fullSize: "Total area",
        problemHint:
          "Did the digup cause any problems? Were the obligations not complied with, does the risk arise in public space or on the road?",
        reportProblem: "Report problem",
        reportProblemLink: "http://inovacie.bratislava.sk/nahlasit-problem",
      },
    },
  },
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
    info: "Let us know if there is a problem due to construction work in a public area",
    descriptionPart1: "The map shows legally permitted excavations, closures and reported faults on local roads I. and II. classes.",
    descriptionPart2: "<1>More information</1> about traffic permits and the road authority that authorizes excavations and closures.",
    descriptionPart3: "<1>More information</1> about the management and maintenance of roads in the capital.",
    description2Link:
      "https://bratislava.sk/doprava-a-mapy/doprava/dopravne-povolenia",
    description3Link:
      "https://bratislava.sk/doprava-a-mapy/sprava-a-udrzba-komunikacii",
    footer: "Leave the feedback at <1>mapy.inovacie@bratislava.sk</1>",
    footerLink: "mailto:mapy.inovacie@bratislava.sk",
    reportProblem: "Report problem",
    reportProblemLink: "http://inovacie.bratislava.sk/nahlasit-problem",
    // Below keys belongs to info notification
    // moreInfo -  apear as text to more info - text to open modal/ close notification
    moreInfo: "Show more info",
    // title of notification
    infoNotificationTitle: "Winter closure",
    // optional link in notification, one link can be added to content. Usage: content text... <1>Viac informacii</1> content text...
    infoNotificationContentLink: "www.moreinfo.sk",
    // content of notification - notification message, here possible to add to text optional link - infoNotificationContentLink as above example
    infoNotificationContent: "EN There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making <1>Viac informacii</1> this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
  },
};
