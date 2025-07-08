import { defineStore } from "pinia";

export const useObservatory = defineStore("observatory", {
  state: () => ({
    currentCollection: "tools",
    uniqueCollection: null,
    selectedCollection: null,
    collections: [
      {
        id: "RIS3CAT VEIS",
        title: "VEIS",
        subtitle: "Value of the EGA for Industry and Society",
        description:
          "The RIS3CAT VEIS project will create an open ecosystem of technologies that covers and adapts to the needs of analysis and interpretation of omic and clinical data in research and application environments in biomedicine, through the database EGA.",
        homepage: "https://veis.bsc.es/",
        image: "Logo_VEIS_Corto.png",
      },
      {
        id: "ELIXIR-ES",
        title: "ELIXIR-ES",
        subtitle: "ELIXIR Spain - INB",
        description:
          "The Spanish National Bioinformatics Institute (‘Instituto Nacional de Bioinformática’ in Spanish, INB) is composed of 19 computational biology groups that comprise a virtual institute. It started operating in 2003 and its more than 40 employees are funded by the National Health Institute Carlos III (ISCIII).",
        homepage: "https://elixir-europe.org/about-us/who-we-are/nodes/spain",
        image: "Logo_ELIXIR_ES.png",
      },
      {
        id: "IMPaCT-Data",
        title: "IMPaCT-Data",
        subtitle:
          "Integrated Multi-scale Platform for Computational Toxicology Data",
        description:
          "The Spanish Precision Medicine Infrastructure associated with Science and Technology (IMPaCT), aims to impulse precision medicine within the Spanish National Health System. IMPaCT-Data, the Data Science pillar of this infrastructure, has been tasked to design, deploy and extend a Biomedical Cloud taking as reference similar efforts across Europe.",
        homepage: "https://impact-data.bsc.es/",
        image: "Logo_IMPaCT-Data-Vertical.png",
      },
      {
        id: "PerMedCoE",
        title: "PerMedCoE",
        subtitle:
          "HPC/Exascale Centre of Excellence for Personalised Medicine in Europe",
        description:
          "The goal of PerMedCoE is to provide an efficient and sustainable entry point to the HPC/Exascale-upgraded methodology to translate omics analyses into actionable models of cellular functions of medical relevance.",
        homepage: "https://www.permedcoe.eu/",
        image: "Logo_PerMedCoE.jpeg",
      },
      {
        id: "BioExcel",
        title: "BioExcel",
        subtitle:
          "Centre of Excellence for Computational Biomolecular Research",
        description:
          "BioExcel is a Centre of Excellence for Computational Biomolecular Research set up to support academia and industry in the use of high-end computing in biomolecular research.",
        homepage: "https://bioexcel.eu/",
        image: "Logo_bioexcel.png",
      },
      {
        id: "3D-BioInfo",
        title: "3D-BioInfo",
        subtitle: "ELIXIR 3D-Bioinfo Community",
        description:
          "Structural bioinformatics provides methods and tools to analyse, predict, archive and validate the three-dimensional (3D) structure data of biomacromolecules such as proteins, RNA or DNA.",
        homepage: "https://elixir-europe.org/communities/3d-bioinfo",
        image: "Logo_3D-Bioinfo.png",
      },
      {
        id: "EUCAIM",
        title: "EUCAIM",
        subtitle: "EUropean Federation for CAncer IMages",
        description:
          "The EUCAIM project will not build a new infrastructure from scratch, but will deliver an integrated architecture carefully designed by the AI4HI Network, and major European Research Infrastructures (Euro-BioImaging, BBMRI, EATRIS and ELIXIR) on real-world achievements. The main concept of EUCAIM is of a central hub that federates distributed nodes (repositories, Research Infrastructures, and hospitals) to build up a hybrid distributed and centralised infrastructure of cancer images, including all types of cancer.",
        homepage: "https://www.eibir.org/projects/eucaim/",
        image: "Logo_EUCAIM.png",
      },
    ],
  }),

  getters: {
    getCollections: (state) => state.collections,
    getCurrentCollection: (state) => state.currentCollection,
    getUniqueCollection: (state) => state.uniqueCollection,
  },

  actions: {

    changeCurrentCollection(collectionId) {
      this.currentCollection = collectionId || "tools";
    },

    selectCollection(index) {
      if (index === null) {
        this.selectedCollection = null;
      } else {
        this.selectedCollection = index;
      }
    },

    changeUniqueCollection(collectionId) {
      const uniqueCollectionObject = this.collections.find(
        (element) => element.id === collectionId,
      );

      if (uniqueCollectionObject) {
        this.uniqueCollection = uniqueCollectionObject;
        this.currentCollection = collectionId;
      }
    },
  },
});
